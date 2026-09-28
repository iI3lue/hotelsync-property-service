import prisma from "../lib/prisma.js";
import { AppError } from "../middleware/error-handler.js";
import { CreateRoomTypeInput, UpdateRoomTypeInput } from "../validators/room-type.js";

export class RoomTypeService {
  async create(data: CreateRoomTypeInput) {
    const hotel = await prisma.hotel.findUnique({
      where: { hotel_id: data.hotel_id },
    });

    if (!hotel) {
      throw new AppError(
        404,
        `Hotel with id ${data.hotel_id} not found`,
        "Not Found"
      );
    }

    return prisma.roomType.create({
      data: {
        hotel_id: data.hotel_id,
        name: data.name,
        capacity: data.capacity,
        base_rate: data.base_rate,
        amenities: data.amenities,
      },
    });
  }

  async findById(id: string) {
    const roomType = await prisma.roomType.findUnique({
      where: { room_type_id: id },
    });

    if (!roomType) {
      throw new AppError(
        404,
        `Room type with id ${id} not found`,
        "Not Found"
      );
    }

    return roomType;
  }

  async update(id: string, data: UpdateRoomTypeInput) {
    await this.findById(id);

    return prisma.roomType.update({
      where: { room_type_id: id },
      data,
    });
  }
}

export const roomTypeService = new RoomTypeService();
