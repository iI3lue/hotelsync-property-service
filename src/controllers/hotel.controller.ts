import { Request, Response, NextFunction } from "express";
import { hotelService } from "../services/hotel.service.js";

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
      const hotel = await hotelService.create(req.body);
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
