import { z } from "zod";

// 1. User Registration Schema
export const RegisterSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
  role: z.enum(["user", "admin"]).default("user"), // Default role ဖြင့် "user" သတ်မှတ်ထားမည်
  adminSecretKey: z.string().optional(),
});

// 2. User Login Schema
export const LoginSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  password: z.string().min(1, { message: "Password is required" }),
});

// TypeScript Types များကို Schema မှ ထုတ်ယူခြင်း
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
