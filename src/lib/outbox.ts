import prisma from "./prisma.js";
import { broker } from "./broker.js";

export function startOutboxDispatcher(intervalMs = 10000): NodeJS.Timeout {
  const dispatcher = broker.createDispatcher(
    async (max = 100) => {
      const events = await prisma.eventOutbox.findMany({
        where: { status: "pending" },
        orderBy: { created_at: "asc" },
        take: max,
      });
      return events.map((event) => ({
        event_id: event.event_id,
        event_type: event.event_type,
        payload: event.payload,
      }));
    },
    async (eventId) => {
      await prisma.eventOutbox.update({
        where: { event_id: eventId },
        data: { status: "sent", sent_at: new Date() },
      });
    }
  );

  return broker.startDispatcher(() => dispatcher.flush(), intervalMs);
}
