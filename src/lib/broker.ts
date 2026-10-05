import amqplib, { ChannelModel, ConfirmChannel } from "amqplib";

const EXCHANGE = "hotelsync.events";
const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost:5672";
const RETRY_BASE_MS = 1000;
const RETRY_MAX_MS = 15000;

let connection: ChannelModel | null = null;
let confirmChannel: ConfirmChannel | null = null;
let connecting: Promise<ConfirmChannel> | null = null;

export async function connect(): Promise<ConfirmChannel> {
  if (confirmChannel) return confirmChannel;

  connecting ??= (async () => {
    let attempt = 0;
    for (;;) {
      try {
        const conn = await amqplib.connect(RABBITMQ_URL);
        connection = conn;
        conn.on("error", () => {});
        conn.on("close", async () => {
          connection = null;
          confirmChannel = null;
          connecting = null;
          await sleep(RETRY_BASE_MS);
          void connect();
        });

        const channel = await conn.createConfirmChannel();
        await channel.assertExchange(EXCHANGE, "topic", { durable: true });
        confirmChannel = channel;
        return channel;
      } catch (err) {
        attempt += 1;
        const delay = Math.min(RETRY_BASE_MS * 2 ** (attempt - 1), RETRY_MAX_MS);
        console.warn(
          `[broker] no se pudo conectar a RabbitMQ (intento ${attempt}), reintento en ${delay}ms`,
          err
        );
        await sleep(delay);
      }
    }
  })();

  return connecting;
}

export type PendingEvent = {
  event_id: string;
  event_type: string;
  payload: unknown;
};

export function createDispatcher(
  getPending: (max?: number) => Promise<PendingEvent[]>,
  markSent: (eventId: string) => Promise<void>
) {
  return {
    async flush(max = 100): Promise<number> {
      const rows = await getPending(max);
      let delivered = 0;

      for (const row of rows) {
        try {
          const channel = await connect();
          await new Promise<void>((resolve, reject) => {
            channel.publish(
              EXCHANGE,
              row.event_type,
              Buffer.from(JSON.stringify(row.payload)),
              { persistent: true },
              (error) => (error ? reject(error) : resolve())
            );
          });
          await markSent(row.event_id);
          delivered += 1;
        } catch (error) {
          console.error(`[dispatcher] error publicando ${row.event_type}`, error);
          break;
        }
      }

      if (rows.length > 0) {
        console.debug(`[dispatcher] outbox flush: ${delivered}/${rows.length} entregados`);
      }
      return delivered;
    },
  };
}

export function startDispatcher(
  flush: () => Promise<unknown>,
  intervalMs = 10000
): NodeJS.Timeout {
  const timer = setInterval(() => {
    flush().catch((error) => console.error("[dispatcher] flush falló", error));
  }, intervalMs);
  timer.unref?.();
  return timer;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const broker = { connect, createDispatcher, startDispatcher };
