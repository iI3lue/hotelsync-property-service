import { physicalRoomService } from "../../src/services/physical-room.service.js";
import { AppError } from "../../src/middleware/error-handler.js";

jest.mock("../../src/lib/prisma.js", () => ({
  __esModule: true,
  default: {
    hotel: { findUnique: jest.fn() },
    roomType: { findFirst: jest.fn() },
    physicalRoom: { findMany: jest.fn() },
    $transaction: jest.fn(),
  },
}));

import prisma from "../../src/lib/prisma.js";

const mockPrisma = prisma as any;
const transaction = {
  physicalRoom: { create: jest.fn() },
  eventOutbox: { create: jest.fn() },
};

const HOTEL_ID = "c1b2c3d4-e5f6-4890-abcd-ef1234567890";
const ROOM_TYPE_ID = "d1b2c3d4-e5f6-4890-abcd-ef1234567890";

describe("PhysicalRoomService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPrisma.$transaction.mockImplementation((callback: (tx: unknown) => unknown) =>
      callback(transaction)
    );
  });

  describe("listByHotel", () => {
    it("returns physical rooms with their room type", async () => {
      const rooms = [{ physical_room_id: "room-1", roomType: { name: "Standard" } }];
      mockPrisma.hotel.findUnique.mockResolvedValue({ hotel_id: HOTEL_ID });
      mockPrisma.physicalRoom.findMany.mockResolvedValue(rooms);

      await expect(physicalRoomService.listByHotel(HOTEL_ID)).resolves.toEqual(rooms);
      expect(mockPrisma.physicalRoom.findMany).toHaveBeenCalledWith({
        where: { hotel_id: HOTEL_ID },
        include: { roomType: { select: { room_type_id: true, name: true } } },
        orderBy: { room_number: "asc" },
      });
    });

    it("rejects an unknown hotel", async () => {
      mockPrisma.hotel.findUnique.mockResolvedValue(null);

      await expect(physicalRoomService.listByHotel(HOTEL_ID)).rejects.toThrow(AppError);
      expect(mockPrisma.physicalRoom.findMany).not.toHaveBeenCalled();
    });
  });

  describe("create", () => {
    it("creates the room and its inventory event in one transaction", async () => {
      mockPrisma.roomType.findFirst.mockResolvedValue({ room_type_id: ROOM_TYPE_ID });
      const room = {
        physical_room_id: "e1b2c3d4-e5f6-4890-abcd-ef1234567890",
        hotel_id: HOTEL_ID,
        room_type_id: ROOM_TYPE_ID,
        room_number: "101",
        available_from: new Date("2026-10-02T00:00:00.000Z"),
      };
      transaction.physicalRoom.create.mockResolvedValue(room);
      transaction.eventOutbox.create.mockResolvedValue({});

      await expect(
        physicalRoomService.create(HOTEL_ID, {
          room_type_id: ROOM_TYPE_ID,
          room_number: "101",
          available_from: "2026-10-02",
        })
      ).resolves.toEqual(room);

      expect(transaction.physicalRoom.create).toHaveBeenCalledWith({
        data: {
          hotel_id: HOTEL_ID,
          room_type_id: ROOM_TYPE_ID,
          room_number: "101",
          available_from: new Date("2026-10-02T00:00:00.000Z"),
          is_active: true,
        },
      });

      const event = transaction.eventOutbox.create.mock.calls[0][0].data;
      expect(event.event_type).toBe("physical-room.created");
      expect(event.event_id).toBe(event.payload.event_id);
      expect(event.payload).toMatchObject({
        physical_room_id: room.physical_room_id,
        hotel_id: HOTEL_ID,
        room_type_id: ROOM_TYPE_ID,
        available_from: "2026-10-02",
      });
    });

    it("rejects a room type belonging to another hotel", async () => {
      mockPrisma.roomType.findFirst.mockResolvedValue(null);

      await expect(
        physicalRoomService.create(HOTEL_ID, {
          room_type_id: ROOM_TYPE_ID,
          room_number: "101",
          available_from: "2026-10-02",
        })
      ).rejects.toThrow(AppError);
      expect(mockPrisma.$transaction).not.toHaveBeenCalled();
    });

    it("returns a conflict when the hotel already has that room number", async () => {
      mockPrisma.roomType.findFirst.mockResolvedValue({ room_type_id: ROOM_TYPE_ID });
      mockPrisma.$transaction.mockRejectedValue({ code: "P2002" });

      await expect(
        physicalRoomService.create(HOTEL_ID, {
          room_type_id: ROOM_TYPE_ID,
          room_number: "101",
          available_from: "2026-10-02",
        })
      ).rejects.toThrow(AppError);
    });
  });
});
