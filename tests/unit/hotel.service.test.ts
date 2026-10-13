import { hotelService } from "../../src/services/hotel.service.js";
import { AppError } from "../../src/middleware/error-handler.js";

// Mock Prisma
jest.mock("../../src/lib/prisma.js", () => ({
  __esModule: true,
  default: {
    hotel: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    roomType: {
      findMany: jest.fn(),
    },
    cancellationPolicy: {
      findFirst: jest.fn(),
    },
  },
}));

import prisma from "../../src/lib/prisma.js";

const mockPrisma = prisma as any;

describe("HotelService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("findAll", () => {
    it("should return all hotels", async () => {
      const hotels = [
        { hotel_id: "1", name: "Hotel A", city: "BA", country: "AR", timezone: "America/Argentina/Buenos_Aires" },
      ];
      mockPrisma.hotel.findMany.mockResolvedValue(hotels);

      const result = await hotelService.findAll();

      expect(result).toEqual(hotels);
      expect(mockPrisma.hotel.findMany).toHaveBeenCalledWith({
        include: { roomTypes: true, cancellationPolicies: true },
      });
    });
  });

  describe("findById", () => {
    it("should return hotel when found", async () => {
      const hotel = { hotel_id: "123", name: "Hotel A" };
      mockPrisma.hotel.findUnique.mockResolvedValue(hotel);

      const result = await hotelService.findById("123");

      expect(result).toEqual(hotel);
    });

    it("should throw AppError when hotel not found", async () => {
      mockPrisma.hotel.findUnique.mockResolvedValue(null);

      await expect(hotelService.findById("nonexistent")).rejects.toThrow(AppError);
    });
  });

  describe("create", () => {
    const superAdmin = {
      sub: "admin",
      email: "admin@hotelsync.local",
      email_verified: true,
      role: "SUPER_ADMIN",
      hotel_id: null,
      scope: "global" as const,
      iss: "hotelsync",
      aud: "hotelsync-api",
      iat: 0,
      exp: 9999999999,
    };

    it("should create a hotel as SUPER_ADMIN", async () => {
      const data = { name: "New Hotel", city: "BA", country: "AR", timezone: "America/Argentina/Buenos_Aires" };
      const created = { hotel_id: "new-id", ...data };
      mockPrisma.hotel.create.mockResolvedValue(created);

      const result = await hotelService.create(data, superAdmin);

      expect(result).toEqual(created);
      expect(mockPrisma.hotel.create).toHaveBeenCalledWith({ data });
    });

    it("should reject hotel creation for non-admin roles", async () => {
      const data = { name: "New Hotel", city: "BA", country: "AR", timezone: "America/Argentina/Buenos_Aires" };

      await expect(
        hotelService.create(data, { ...superAdmin, role: "MANAGER", hotel_id: "h1" })
      ).rejects.toThrow(AppError);
      expect(mockPrisma.hotel.create).not.toHaveBeenCalled();
    });
  });

  describe("update", () => {
    const superAdmin = {
      sub: "admin",
      email: "admin@hotelsync.local",
      email_verified: true,
      role: "SUPER_ADMIN",
      hotel_id: null,
      scope: "global" as const,
      iss: "hotelsync",
      aud: "hotelsync-api",
      iat: 0,
      exp: 9999999999,
    };
    const managerH1 = { ...superAdmin, role: "MANAGER", hotel_id: "h1" };

    it("should update image_url as SUPER_ADMIN", async () => {
      mockPrisma.hotel.findUnique.mockResolvedValue({ hotel_id: "h1", name: "H" });
      mockPrisma.hotel.update.mockResolvedValue({ hotel_id: "h1", image_url: "https://x/img.jpg" });

      const result = await hotelService.update(
        "h1",
        { image_url: "https://x/img.jpg" },
        superAdmin
      );

      expect(result.image_url).toBe("https://x/img.jpg");
      expect(mockPrisma.hotel.update).toHaveBeenCalledWith({
        where: { hotel_id: "h1" },
        data: { image_url: "https://x/img.jpg" },
      });
    });

    it("should allow MANAGER on own hotel", async () => {
      mockPrisma.hotel.findUnique.mockResolvedValue({ hotel_id: "h1", name: "H" });
      mockPrisma.hotel.update.mockResolvedValue({ hotel_id: "h1", name: "H2" });

      await hotelService.update("h1", { name: "H2" }, managerH1);

      expect(mockPrisma.hotel.update).toHaveBeenCalled();
    });

    it("should reject MANAGER on another hotel with 403", async () => {
      mockPrisma.hotel.findUnique.mockResolvedValue({ hotel_id: "h2", name: "Other" });

      await expect(
        hotelService.update("h2", { name: "X" }, managerH1)
      ).rejects.toMatchObject({ statusCode: 403 });
      expect(mockPrisma.hotel.update).not.toHaveBeenCalled();
    });

    it("should throw 404 when hotel not found", async () => {
      mockPrisma.hotel.findUnique.mockResolvedValue(null);

      await expect(
        hotelService.update("missing", { name: "X" }, superAdmin)
      ).rejects.toThrow(AppError);
    });
  });

  describe("getRoomTypes", () => {
    it("should return room types for a hotel", async () => {
      mockPrisma.hotel.findUnique.mockResolvedValue({ hotel_id: "1" });
      const roomTypes = [{ room_type_id: "rt1", name: "Standard" }];
      mockPrisma.roomType.findMany.mockResolvedValue(roomTypes);

      const result = await hotelService.getRoomTypes("1");

      expect(result).toEqual(roomTypes);
    });

    it("should throw if hotel not found", async () => {
      mockPrisma.hotel.findUnique.mockResolvedValue(null);

      await expect(hotelService.getRoomTypes("nonexistent")).rejects.toThrow(AppError);
    });
  });

  describe("getCancellationPolicy", () => {
    it("should return cancellation policy", async () => {
      mockPrisma.hotel.findUnique.mockResolvedValue({ hotel_id: "1" });
      const policy = { policy_id: "p1", name: "Flexible" };
      mockPrisma.cancellationPolicy.findFirst.mockResolvedValue(policy);

      const result = await hotelService.getCancellationPolicy("1");

      expect(result).toEqual(policy);
    });

    it("should throw if policy not found", async () => {
      mockPrisma.hotel.findUnique.mockResolvedValue({ hotel_id: "1" });
      mockPrisma.cancellationPolicy.findFirst.mockResolvedValue(null);

      await expect(hotelService.getCancellationPolicy("1")).rejects.toThrow(AppError);
    });
  });
});
