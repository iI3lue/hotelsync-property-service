import { z } from "zod";

export const createHotelSchema = z.object({
  name: z.string().min(1).max(255),
  address: z.string().max(255).optional(),
  city: z.string().min(1).max(100),
  country: z.string().min(1).max(100),
  timezone: z.string().min(1).max(50),
});

export const hotelIdParamSchema = z.object({
  id: z.string().uuid(),
});

export type CreateHotelInput = z.infer<typeof createHotelSchema>;
