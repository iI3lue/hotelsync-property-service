import { randomUUID } from "node:crypto";
import prisma from "../lib/prisma.js";
import { AppError } from "../middleware/error-handler.js";
import { CreatePhysicalRoomInput } from "../validators/physical-room.js";

const EVENT_TYPE = "physical-room.created";

function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  );
}

export class PhysicalRoomService {
  async listByHotel(hotelId: string) {
    const hotel = await prisma.hotel.findUnique({
      where: { hotel_id: hotelId },
      select: { hotel_id: true },
    });

    if (!hotel) {
      throw new AppError(404, `Hotel with id ${hotelId} not found`, "Not Found");
    }

    return prisma.physicalRoom.findMany({
      where: { hotel_id: hotelId },
      include: {
        roomType: { select: { room_type_id: true, name: true } },
      },
      orderBy: { room_number: "asc" },
    });
  }

  async create(hotelId: string, data: CreatePhysicalRoomInput) {
    const roomType = await prisma.roomType.findFirst({
      where: { room_type_id: data.room_type_id, hotel_id: hotelId },
      select: { room_type_id: true },
    });

    if (!roomType) {
      throw new AppError(
        404,
        "Room type not found for this hotel",
        "Not Found"
      );
    }

    const eventId = randomUUID();

    try {
      return await prisma.$transaction(async (tx) => {
        const room = await tx.physicalRoom.create({
          data: {
            hotel_id: hotelId,
            room_type_id: data.room_type_id,
            room_number: data.room_number,
            available_from: new Date(`${data.available_from}T00:00:00.000Z`),
            is_active: true,
          },
        });

        await tx.eventOutbox.create({
          data: {
            event_id: eventId,
            event_type: EVENT_TYPE,
            payload: {
              event_id: eventId,
              physical_room_id: room.physical_room_id,
              hotel_id: room.hotel_id,
              room_type_id: room.room_type_id,
              available_from: room.available_from.toISOString().slice(0, 10),
            },
          },
        });

        return room;
      });
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw new AppError(
          409,
          `Room ${data.room_number} already exists for this hotel`,
          "Conflict"
        );
      }
      throw error;
    }
  }
}

export const physicalRoomService = new PhysicalRoomService();
