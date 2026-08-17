import { z } from "zod";

export const registerFormSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters long"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    role: z.enum(["user", "admin"]).optional(),
    adminSecretKey: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // Error message ပြသမည့် input field
  });

export type RegisterFormValues = z.infer<typeof registerFormSchema>;
