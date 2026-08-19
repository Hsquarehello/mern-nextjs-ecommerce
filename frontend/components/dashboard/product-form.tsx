"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { Loader2 } from "lucide-react";

import { productFormSchema } from "@/lib/validations/product";

// Shadcn UI Base Components (Update သစ်တွင် Form မလိုတော့ပါ)
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ProductFormProps {
  initialData?: {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    stock: number;
    imageUrl: string;
    isFeatured: boolean;
  } | null;
}

type ProductFormInput = z.input<typeof productFormSchema>;
type ProductFormOutput = z.output<typeof productFormSchema>;

export function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isEditMode = Boolean(initialData);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormInput, any, ProductFormOutput>({
    resolver: zodResolver(productFormSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          description: initialData.description,
          price: initialData.price,
          category: initialData.category,
          stock: initialData.stock,
          imageUrl: initialData.imageUrl,
          isFeatured: initialData.isFeatured,
        }
      : {
          name: "",
          description: "",
          price: 0,
          category: "",
          stock: 0,
          imageUrl: "",
          isFeatured: false,
        },
  });

  const isFeaturedValue = watch("isFeatured");

  const onSubmit = async (data: ProductFormOutput) => {
    try {
      setLoading(true);
      setErrorMessage("");

      if (isEditMode && initialData) {
        await axios.put(
          `http://localhost:5000/api/products/${initialData._id}`,
          data,
          { withCredentials: true },
        );
      } else {
        await axios.post("http://localhost:5000/api/products", data, {
          withCredentials: true,
        });
      }

      router.push("/dashboard/products");
      router.refresh();
    } catch (error: any) {
      console.error("[PRODUCT_FORM_ERROR]", error);
      setErrorMessage(
        error.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          {isEditMode ? "Edit Product" : "Create Product"}
        </CardTitle>
        <CardDescription>
          {isEditMode
            ? "Update existing product details"
            : "Add a new product to your inventory"}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {errorMessage && (
          <div className="mb-6 p-3 bg-destructive/15 border border-destructive/30 text-destructive text-sm rounded-md">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Product Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              placeholder="e.g. Wireless Headphones"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Category & Price Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                placeholder="e.g. Electronics"
                {...register("category")}
              />
              {errors.category && (
                <p className="text-xs text-destructive">
                  {errors.category.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="99.99"
                {...register("price")}
              />
              {errors.price && (
                <p className="text-xs text-destructive">
                  {errors.price.message}
                </p>
              )}
            </div>
          </div>

          {/* Stock Quantity */}
          <div className="space-y-2">
            <Label htmlFor="stock">Stock Quantity</Label>
            <Input
              id="stock"
              type="number"
              placeholder="100"
              {...register("stock")}
            />
            {errors.stock && (
              <p className="text-xs text-destructive">{errors.stock.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={4}
              placeholder="Detailed description of the product..."
              {...register("description")}
            />
            {errors.description && (
              <p className="text-xs text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Image URLs */}
          <div className="space-y-2">
            <Label htmlFor="images">Image URLs</Label>
            <Input
              id="imageUrl"
              placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
              {...register("imageUrl")}
            />
            <p className="text-xs text-muted-foreground">
              Separate multiple image URLs with commas.
            </p>
            {errors.imageUrl && (
              <p className="text-xs text-destructive">
                {errors.imageUrl.message}
              </p>
            )}
          </div>

          {/* Is Featured Checkbox */}
          <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <Checkbox
              id="isFeatured"
              checked={isFeaturedValue}
              onCheckedChange={(checked) =>
                setValue("isFeatured", checked as boolean)
              }
            />
            <div className="space-y-1 leading-none">
              <Label htmlFor="isFeatured" className="cursor-pointer">
                Featured Product
              </Label>
              <p className="text-xs text-muted-foreground">
                This product will appear on the home page showcase.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <Button type="submit" disabled={loading} className="w-full">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading
              ? "Saving..."
              : isEditMode
                ? "Update Product"
                : "Create Product"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
