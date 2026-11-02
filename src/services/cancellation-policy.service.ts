import prisma from "../lib/prisma.js";
import { AppError } from "../middleware/error-handler.js";
import type { AuthClaims } from "../lib/auth.js";
import { CreateCancellationPolicyInput } from "../validators/cancellation-policy.js";

/** SUPER_ADMIN en cualquier hotel; MANAGER solo en el suyo. */
function requirePolicyScope(actor: AuthClaims, hotelId: string): void {
  if (actor.role === "SUPER_ADMIN") return;
  if (actor.role !== "MANAGER" || actor.hotel_id !== hotelId) {
    throw new AppError(403, "Manager of this hotel required", "Forbidden");
  }
}

export class CancellationPolicyService {
  async create(actor: AuthClaims, data: CreateCancellationPolicyInput) {
    requirePolicyScope(actor, data.hotel_id);

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
