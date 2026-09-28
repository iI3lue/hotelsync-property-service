import { Request, Response, NextFunction } from "express";
import { roomTypeService } from "../services/room-type.service.js";

export class RoomTypeController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const roomType = await roomTypeService.create(req.body);
      res.status(201).json(roomType);
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const roomType = await roomTypeService.update(id, req.body);
      res.json(roomType);
    } catch (err) {
      next(err);
    }
  }
}

export const roomTypeController = new RoomTypeController();
