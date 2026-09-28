import { Request, Response, NextFunction } from "express";
import { cancellationPolicyService } from "../services/cancellation-policy.service.js";

export class CancellationPolicyController {
  async getByHotelId(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const policy = await cancellationPolicyService.findByHotelId(id);
      res.json(policy);
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const policy = await cancellationPolicyService.create(req.body);
      res.status(201).json(policy);
    } catch (err) {
      next(err);
    }
  }
}

export const cancellationPolicyController = new CancellationPolicyController();
