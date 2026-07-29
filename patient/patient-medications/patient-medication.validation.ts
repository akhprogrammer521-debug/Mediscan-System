import { z } from "zod";

export const createMedicationSchema = z.object({
  name: z.string().min(1),
  dosage: z.string().min(1),
  reason: z.string().optional(),
  notes: z.string().optional(),
});

export const updateMedicationSchema = createMedicationSchema.partial();

export const updateStatusSchema = z.object({
  status: z.enum(["ACTIVE", "PAUSED", "STOPPED"]),
});

export const addScheduleSchema = z.object({
  time: z.string().min(1), 
});
