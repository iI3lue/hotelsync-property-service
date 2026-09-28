import { roomTypeService } from "../../src/services/room-type.service.js";
import { AppError } from "../../src/middleware/error-handler.js";

jest.mock("../../src/lib/prisma.js", () => ({
  __esModule: true,
  default: {
    hotel: {
      findUnique: jest.fn(),
    },
    roomType: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

import prisma from "../../src/lib/prisma.js";

const mockPrisma = prisma as any;

describe("RoomTypeService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should create a room type when hotel exists", async () => {
      mockPrisma.hotel.findUnique.mockResolvedValue({ hotel_id: "h1" });
      const roomType = { room_type_id: "rt1", hotel_id: "h1", name: "Standard", capacity: 2, base_rate: 100 };
      mockPrisma.roomType.create.mockResolvedValue(roomType);

      const result = await roomTypeService.create({
        hotel_id: "h1",
        name: "Standard",
        capacity: 2,
        base_rate: 100,
        amenities: [],
      });

      expect(result).toEqual(roomType);
    });

    it("should throw if hotel not found", async () => {
      mockPrisma.hotel.findUnique.mockResolvedValue(null);

      await expect(
        roomTypeService.create({
          hotel_id: "nonexistent",
          name: "Standard",
          capacity: 2,
          base_rate: 100,
          amenities: [],
        })
      ).rejects.toThrow(AppError);
    });
  });

  describe("update", () => {
    it("should update a room type", async () => {
      mockPrisma.roomType.findUnique.mockResolvedValue({ room_type_id: "rt1" });
      mockPrisma.roomType.update.mockResolvedValue({ room_type_id: "rt1", name: "Updated" });

      const result = await roomTypeService.update("rt1", { name: "Updated" });

      expect(result.name).toBe("Updated");
    });

    it("should throw if room type not found", async () => {
      mockPrisma.roomType.findUnique.mockResolvedValue(null);

      await expect(roomTypeService.update("nonexistent", { name: "X" })).rejects.toThrow(AppError);
    });
  });
});
