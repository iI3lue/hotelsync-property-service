import { Router } from "express";
import { cancellationPolicyController } from "../controllers/cancellation-policy.controller.js";
import { validate } from "../middleware/validate.js";
import { hotelIdParamSchema } from "../validators/hotel.js";
import { createCancellationPolicySchema } from "../validators/cancellation-policy.js";

const router = Router();

router.get(
  "/:id",
  validate(hotelIdParamSchema, "params"),
  cancellationPolicyController.getByHotelId.bind(cancellationPolicyController)
);

router.post(
  "/",
  validate(createCancellationPolicySchema),
  cancellationPolicyController.create.bind(cancellationPolicyController)
);

export default router;
