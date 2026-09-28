import { z } from "zod";

export const createCancellationPolicySchema = z.object({
  hotel_id: z.string().uuid(),
  name: z.string().min(1).max(255),
  description: z.string().min(1),
});

export type CreateCancellationPolicyInput = z.infer<typeof createCancellationPolicySchema>;
