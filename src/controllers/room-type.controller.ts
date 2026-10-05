import { Request, Response, NextFunction } from "express";
import { roomTypeService } from "../services/room-type.service.js";
import { AuthRequest } from "../lib/auth.js";

const ANONYMOUS = {
  sub: "",
  email: "",
  email_verified: false,
  role: "",
  hotel_id: null,
  scope: "global",
  iss: "",
  aud: "",
  iat: 0,
  exp: 0,
} as const;

export class RoomTypeController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const auth = (req as AuthRequest).auth;
      const roomType = await roomTypeService.create(
        req.body,
        auth ?? { ...ANONYMOUS }
      );
      res.status(201).json(roomType);
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const auth = (req as AuthRequest).auth;
      const roomType = await roomTypeService.update(id, req.body, auth ?? { ...ANONYMOUS });
      res.json(roomType);
    } catch (err) {
      next(err);
    }
  }
}

export const roomTypeController = new RoomTypeController();
