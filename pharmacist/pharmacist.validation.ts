import { z } from "zod";

export const addStockSchema = z.object({
  drugId: z.number(),
  quantity: z.number().min(0),
});

export const updateStockSchema = z.object({
  quantity: z.number().min(0),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(["ACCEPTED", "REJECTED", "COMPLETED"]),
});
