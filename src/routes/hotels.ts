import { Router } from "express";
import { hotelController } from "../controllers/hotel.controller.js";
import { requireAuth } from "../lib/auth.js";
import { validate } from "../middleware/validate.js";
import { createHotelSchema, hotelIdParamSchema } from "../validators/hotel.js";

const router = Router();

router.get("/", hotelController.getAll.bind(hotelController));
router.post("/", requireAuth, validate(createHotelSchema), hotelController.create.bind(hotelController));
router.get("/:id", validate(hotelIdParamSchema, "params"), hotelController.getById.bind(hotelController));
router.get("/:id/room-types", validate(hotelIdParamSchema, "params"), hotelController.getRoomTypes.bind(hotelController));
router.get("/:id/cancellation-policy", validate(hotelIdParamSchema, "params"), hotelController.getCancellationPolicy.bind(hotelController));

export default router;
