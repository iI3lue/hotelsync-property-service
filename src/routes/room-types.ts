import { Router } from "express";
import { roomTypeController } from "../controllers/room-type.controller.js";
import { validate } from "../middleware/validate.js";
import { createRoomTypeSchema, roomTypeIdParamSchema } from "../validators/room-type.js";

const router = Router();

router.post("/", validate(createRoomTypeSchema), roomTypeController.create.bind(roomTypeController));
router.put("/:id", validate(roomTypeIdParamSchema, "params"), roomTypeController.update.bind(roomTypeController));

export default router;
