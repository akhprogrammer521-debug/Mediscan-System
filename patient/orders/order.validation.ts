import { z } from "zod";

export const createOrderSchema = z.object({
  drugName: z.string().min(1),
  quantity: z.number().min(1),
  pharmacistId: z.number(),
  prescriptionImage: z.string().optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(["ACCEPTED", "REJECTED", "COMPLETED"]),
});
