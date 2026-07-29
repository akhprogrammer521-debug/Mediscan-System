import { z } from "zod";

export const createDrugSchema = z.object({
  name: z.string().min(1),
  strength: z.string().min(1),
  description: z.string().optional(),

  composition: z.string().min(1),
  indications: z.string().min(1),
  contraindications: z.string().min(1),
  dosage: z.string().min(1),
  warnings: z.string().min(1),
  sideEffects: z.string().min(1),
  interactions: z.string().min(1),
  overdose: z.string().min(1),
});
