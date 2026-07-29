import { z } from "zod";

export const pharmacyIdParamSchema = z.object({
  id: z.string().regex(/^\d+$/, "Invalid pharmacy id"),
});
