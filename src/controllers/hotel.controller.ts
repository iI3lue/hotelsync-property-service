import { Request, Response, NextFunction } from "express";
import { hotelService } from "../services/hotel.service.js";
import { AuthRequest } from "../lib/auth.js";

export class HotelController {
  async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const hotels = await hotelService.findAll();
      res.json(hotels);
    } catch (err) {
      next(err);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const hotel = await hotelService.findById(id);
      res.json(hotel);
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const auth = (req as AuthRequest).auth;
      const hotel = await hotelService.create(
        req.body,
        auth ?? { sub: "", email: "", role: "", hotel_id: null, scope: "global", iss: "", aud: "", email_verified: false, iat: 0, exp: 0 }
      );
      res.status(201).json(hotel);
    } catch (err) {
      next(err);
    }
  }

  async getRoomTypes(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const roomTypes = await hotelService.getRoomTypes(id);
      res.json(roomTypes);
    } catch (err) {
      next(err);
    }
  }

  async getCancellationPolicy(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const policy = await hotelService.getCancellationPolicy(id);
      res.json(policy);
    } catch (err) {
      next(err);
    }
  }
}

export const hotelController = new HotelController();
