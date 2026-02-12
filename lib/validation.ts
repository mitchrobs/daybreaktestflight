import { z } from "zod";

export const referralCodeSchema = z
  .string()
  .trim()
  .min(6)
  .max(24)
  .regex(/^[A-Z0-9]+$/i)
  .transform((value) => value.toUpperCase());

export const signupSchema = z.object({
  firstName: z
    .string({ required_error: "First name is required" })
    .trim()
    .min(1, "First name is required")
    .max(80, "First name is too long"),
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .email("Enter a valid email")
    .max(200, "Email is too long"),
  referralCode: referralCodeSchema.optional()
});

export const confirmSchema = z.object({
  token: z.string().trim().min(12)
});

export const statusSchema = z.object({
  code: referralCodeSchema
});

export type SignupInput = z.infer<typeof signupSchema>;
export type ConfirmInput = z.infer<typeof confirmSchema>;
