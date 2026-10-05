import prisma from "../lib/prisma.js";
import { AppError } from "../middleware/error-handler.js";
import type { AuthClaims } from "../lib/auth.js";
import { CreateHotelInput } from "../validators/hotel.js";

export class HotelService {
  async findAll() {
    return prisma.hotel.findMany({
      include: {
        roomTypes: true,
        cancellationPolicies: true,
      },
    });
  }

  async findById(id: string) {
    const hotel = await prisma.hotel.findUnique({
      where: { hotel_id: id },
      include: {
        roomTypes: true,
        cancellationPolicies: true,
      },
    });

    if (!hotel) {
      throw new AppError(404, `Hotel with id ${id} not found`, "Not Found");
    }

    return hotel;
  }

  /** Crear hoteles es global: solo SUPER_ADMIN. */
  async create(data: CreateHotelInput, actor: AuthClaims) {
    if (actor.role !== "SUPER_ADMIN") {
      throw new AppError(403, "Only SUPER_ADMIN can create hotels", "Forbidden");
    }
    return prisma.hotel.create({
      data: {
        name: data.name,
        city: data.city,
        country: data.country,
        timezone: data.timezone,
      },
    });
  }

  async getRoomTypes(hotelId: string) {
    await this.findById(hotelId);
    return prisma.roomType.findMany({
      where: { hotel_id: hotelId },
    });
  }

  async getCancellationPolicy(hotelId: string) {
    await this.findById(hotelId);
    const policy = await prisma.cancellationPolicy.findFirst({
      where: { hotel_id: hotelId },
    });

    if (!policy) {
      throw new AppError(
        404,
        `No cancellation policy found for hotel ${hotelId}`,
        "Not Found"
      );
    }

    return policy;
  }
}

export const hotelService = new HotelService();
