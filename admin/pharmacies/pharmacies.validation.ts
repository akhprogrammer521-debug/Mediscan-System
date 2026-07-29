import { z } from "zod";

export const createPharmacySchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  phone: z.string().min(1),

  licenseNumber: z.string().min(1),
  licenseIssuedAt: z.string().datetime(),
  licenseExpiresAt: z.string().datetime(),

  username: z.string().min(4),
  email: z.string().email(),
  password: z.string().min(6),
});

export const pharmacyIdParamSchema = z.object({
  id: z.string().regex(/^\d+$/, "Invalid pharmacy id"),
});

export const updatePharmacySchema = z.object({
  name: z.string().min(1).optional(),
  address: z.string().min(1).optional(),

  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),

  phone: z.string().min(1).optional(),
  licenseNumber: z.string().optional(),
  licenseIssuedAt: z.string().datetime().optional(),
  licenseExpiresAt: z.string().datetime().optional(),
});


export const toggleStatusSchema = z.object({
  isActive: z.boolean(),
});