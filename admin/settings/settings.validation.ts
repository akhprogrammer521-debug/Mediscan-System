import { z } from "zod";

export const updateEmailSchema = z.object({
  email: z.string().email("Invalid email format"),
});

export const updatePasswordSchema = z.object({
  oldPassword: z.string().min(6, "Old password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});
