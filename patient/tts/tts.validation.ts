import { z } from "zod";

export const ttsSpeakSchema = z.object({
  text: z.string().min(1, "text is required").max(5000, "text is too long"),
  lang: z.string().optional().default("ar"),
});
