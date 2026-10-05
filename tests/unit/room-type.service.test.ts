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

const managerH1 = {
  sub: "manager",
  email: "manager@example.com",
  email_verified: true,
  role: "MANAGER",
  hotel_id: "h1",
  scope: "hotel" as const,
  iss: "hotelsync",
  aud: "hotelsync-api",
  iat: 0,
  exp: 9999999999,
};

describe("RoomTypeService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should create a room type when hotel exists", async () => {
      mockPrisma.hotel.findUnique.mockResolvedValue({ hotel_id: "h1" });
      const roomType = { room_type_id: "rt1", hotel_id: "h1", name: "Standard", capacity: 2, base_rate: 100 };
      mockPrisma.roomType.create.mockResolvedValue(roomType);

      const result = await roomTypeService.create(
        {
          hotel_id: "h1",
          name: "Standard",
          capacity: 2,
          base_rate: 100,
          amenities: [],
        },
        managerH1
      );

      expect(result).toEqual(roomType);
    });

    it("should reject a manager of another hotel", async () => {
      await expect(
        roomTypeService.create(
          {
            hotel_id: "h1",
            name: "Standard",
            capacity: 2,
            base_rate: 100,
            amenities: [],
          },
          { ...managerH1, hotel_id: "h2" }
        )
      ).rejects.toThrow(AppError);
      expect(mockPrisma.roomType.create).not.toHaveBeenCalled();
    });

    it("should throw if hotel not found", async () => {
      mockPrisma.hotel.findUnique.mockResolvedValue(null);

      await expect(
        roomTypeService.create(
          {
            hotel_id: "nonexistent",
            name: "Standard",
            capacity: 2,
            base_rate: 100,
            amenities: [],
          },
          superAdmin
        )
      ).rejects.toThrow(AppError);
    });
  });

  describe("update", () => {
    it("should update a room type", async () => {
      mockPrisma.roomType.findUnique.mockResolvedValue({ room_type_id: "rt1", hotel_id: "h1" });
      mockPrisma.roomType.update.mockResolvedValue({ room_type_id: "rt1", name: "Updated" });

      const result = await roomTypeService.update("rt1", { name: "Updated" }, managerH1);

      expect(result.name).toBe("Updated");
    });

    it("should throw if room type not found", async () => {
      mockPrisma.roomType.findUnique.mockResolvedValue(null);

      await expect(roomTypeService.update("nonexistent", { name: "X" }, superAdmin)).rejects.toThrow(AppError);
    });
  });
});
