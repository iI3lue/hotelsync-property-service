import { z } from "zod";

export const createRoomTypeSchema = z.object({
  hotel_id: z.string().uuid(),
  name: z.string().min(1).max(255),
  capacity: z.number().int().min(1),
  base_rate: z.number().min(0),
  amenities: z.array(z.string().max(100)).optional().default([]),
});

export const updateRoomTypeSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  capacity: z.number().int().min(1).optional(),
  base_rate: z.number().min(0).optional(),
  amenities: z.array(z.string().max(100)).optional(),
});

export const roomTypeIdParamSchema = z.object({
  id: z.string().uuid(),
});

export type CreateRoomTypeInput = z.infer<typeof createRoomTypeSchema>;
export type UpdateRoomTypeInput = z.infer<typeof updateRoomTypeSchema>;
