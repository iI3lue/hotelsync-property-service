import { Router } from "express";
import { roomTypeController } from "../controllers/room-type.controller.js";
import { requireAuth } from "../lib/auth.js";
import { validate } from "../middleware/validate.js";
import { createRoomTypeSchema, roomTypeIdParamSchema } from "../validators/room-type.js";

const router = Router();

router.get("/:id", validate(roomTypeIdParamSchema, "params"), roomTypeController.getById.bind(roomTypeController));
router.post("/", requireAuth, validate(createRoomTypeSchema), roomTypeController.create.bind(roomTypeController));
router.put("/:id", requireAuth, validate(roomTypeIdParamSchema, "params"), roomTypeController.update.bind(roomTypeController));

export default router;
