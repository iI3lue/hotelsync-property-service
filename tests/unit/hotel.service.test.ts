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
    it("should create a hotel", async () => {
      const data = { name: "New Hotel", city: "BA", country: "AR", timezone: "America/Argentina/Buenos_Aires" };
      const created = { hotel_id: "new-id", ...data };
      mockPrisma.hotel.create.mockResolvedValue(created);

      const result = await hotelService.create(data);

      expect(result).toEqual(created);
      expect(mockPrisma.hotel.create).toHaveBeenCalledWith({ data });
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
