import { Router } from "express";
import { physicalRoomController } from "../controllers/physical-room.controller.js";
import { requireAuth, requireHotelManager } from "../lib/auth.js";
import { validate } from "../middleware/validate.js";
import {
  createPhysicalRoomSchema,
  hotelIdParamSchema,
} from "../validators/physical-room.js";

const router = Router();

router.get(
  "/:hotelId/rooms",
  validate(hotelIdParamSchema, "params"),
  physicalRoomController.listByHotel.bind(physicalRoomController)
);
// El alta suma inventario en R&A: solo MANAGER del hotel o SUPER_ADMIN.
router.post(
  "/:hotelId/rooms",
  validate(hotelIdParamSchema, "params"),
  requireAuth,
  requireHotelManager,
  validate(createPhysicalRoomSchema),
  physicalRoomController.create.bind(physicalRoomController)
);

export default router;
