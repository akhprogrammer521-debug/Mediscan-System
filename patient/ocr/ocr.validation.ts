import { z } from "zod";

export const scanSchema = z.object({
  imageUrl: z.string().url("Valid imageUrl is required"),
});

