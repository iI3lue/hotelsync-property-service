import prisma from "../lib/prisma.js";
import { AppError } from "../middleware/error-handler.js";
import { CreateCancellationPolicyInput } from "../validators/cancellation-policy.js";

export class CancellationPolicyService {
  async create(data: CreateCancellationPolicyInput) {
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

    return prisma.cancellationPolicy.create({
      data: {
        hotel_id: data.hotel_id,
        name: data.name,
        description: data.description,
      },
    });
  }

  async findByHotelId(hotelId: string) {
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

export const cancellationPolicyService = new CancellationPolicyService();
