import parsePhoneNumberFromString from "libphonenumber-js";
import { z } from "zod";

export const RegisterZodSchema = z
  .object({
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),

    email: z.string().min(1, "Email is required").email("Invalid email"),

    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm_password: z.string().min(8, "Password must be at least 8 characters"),

    phone: z
      .string()
      .min(1, "Phone number is required")
      .refine((val) => {
        const number = parsePhoneNumberFromString("+" + val);
        return number?.isValid();
      }, "Invalid phone number"),

    license_number: z.string().optional(),
    issuing_state: z.string().optional(),
    expiration_date: z.string().optional(),
    brokerage_name: z.string().optional(),

    preferred_contact_method: z
      .string({
        required_error: "Please select a contact method",
      })
      .refine((val) => ["email", "phone", "both"].includes(val), {
        message: "Invalid contact method",
      }),

    property_interest: z.string().optional(),

    agree: z
      .boolean()
      .refine((val) => val === true, {
        message: "You must agree to the terms and privacy policy",
      }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });


export const LoginZodSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});