import { z } from "zod";

const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD format")
  .refine((value) => {
    const date = new Date(`${value}T00:00:00.000Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
  }, "Date must be a valid calendar date");

export const hotelIdParamSchema = z.object({
  hotelId: z.string().uuid(),
});

export const createPhysicalRoomSchema = z.object({
  room_type_id: z.string().uuid(),
  room_number: z.string().trim().min(1).max(20),
  available_from: dateSchema,
});

export type CreatePhysicalRoomInput = z.infer<typeof createPhysicalRoomSchema>;
