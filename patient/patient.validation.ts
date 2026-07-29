import { z } from "zod";

export const updateProfileSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phone: z.string().min(1).optional(),
  email: z.string().email().optional(),
});

export const upsertMedicalInfoSchema = z.object({
  gender: z.enum(["MALE", "FEMALE"]).optional(),
  birthDate: z.string().min(1).optional(), 
  height: z.number().optional(),
  weight: z.number().optional(),

  currentMedications: z.string().optional(),
  chronicMedications: z.string().optional(),
  chronicDiseases: z.string().optional(),
  allergies: z.string().optional(),
});
