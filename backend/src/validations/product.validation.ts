import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters long"),
  description: z.string().min(10, "Description must be at least 10 characters long"),
  price: z.number().positive("Price must be a positive number"),
  category: z.string().min(1, "Category is required"),
  stock: z.number().int().nonnegative("Stock cannot be negative").default(0),
  images: z.array(z.string().url("Invalid image URL format")).min(1, "At least one image URL is required"),
  isFeatured: z.boolean().optional().default(false),
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;