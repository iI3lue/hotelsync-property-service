import { Request, Response, NextFunction } from "express";
import { cancellationPolicyService } from "../services/cancellation-policy.service.js";
import { AuthRequest } from "../lib/auth.js";
import { AppError } from "../middleware/error-handler.js";

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
      const auth = (req as AuthRequest).auth;
      if (!auth) throw new AppError(401, "Missing bearer token", "Unauthorized");
      const policy = await cancellationPolicyService.create(auth, req.body);
      res.status(201).json(policy);
    } catch (err) {
      next(err);
    }
  }
}

export const cancellationPolicyController = new CancellationPolicyController();
