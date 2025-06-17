import { z } from "zod";

export const RegisterZodSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().min(1, "Email is required").email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirm_password: z.string().min(6, 'Password must be at least 6 characters'),
  license_number: z.string().optional()
});

export const LoginZodSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});