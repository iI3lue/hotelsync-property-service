import { Request, Response, NextFunction } from "express";
import { physicalRoomService } from "../services/physical-room.service.js";

export class PhysicalRoomController {
  async listByHotel(req: Request, res: Response, next: NextFunction) {
    try {
      const rooms = await physicalRoomService.listByHotel(
        req.params.hotelId as string
      );
      res.json(rooms);
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const room = await physicalRoomService.create(
        req.params.hotelId as string,
        req.body
      );
      res.status(201).json(room);
    } catch (err) {
      next(err);
    }
  }
}

export const physicalRoomController = new PhysicalRoomController();
