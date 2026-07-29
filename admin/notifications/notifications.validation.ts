import { z } from "zod";

export const createSystemNotificationSchema = z.object({
  title: z.string().min(1),
  message: z.string().min(1),
  userId: z.number().optional(),
});
