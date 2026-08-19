import { z } from "zod";

export const productFormSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters long"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long"),
  price: z.coerce.number().positive("Price must be a positive number"),
  category: z.string().min(1, "Category is required"),
  stock: z.coerce.number().int().nonnegative("Stock cannot be negative"),
  imageUrl: z.string().url("Please enter a valid Image URL"),
  isFeatured: z.boolean().default(false),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
