"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";

import {
  productFormSchema,
  ProductFormValues,
} from "@/lib/validations/product";

interface ProductFormProps {
  initialData?: {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    stock: number;
    images: string[];
    isFeatured: boolean;
  } | null;
}

export function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isEditMode = Boolean(initialData);

  // Input type နဲ့ Output type ကို Zod မှ ခွဲထုတ်ယူခြင်း
  type ProductFormInput = z.input<typeof productFormSchema>;
  type ProductFormOutput = z.output<typeof productFormSchema>;

  const {
    register,
    handleSubmit,
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
          images: initialData.images.join(", "),
          isFeatured: initialData.isFeatured,
        }
      : {
          name: "",
          description: "",
          price: 0,
          category: "",
          stock: 0,
          images: "",
          isFeatured: false,
        },
  });

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setLoading(true);
      setErrorMessage("");

      // Convert comma-separated images string back into an array
      const payload = {
        ...data,
        images: data.images.split(",").map((url) => url.trim()),
      };

      if (isEditMode && initialData) {
        await axios.put(
          `http://localhost:5000/api/products/${initialData._id}`,
          payload,
          { withCredentials: true },
        );
      } else {
        await axios.post("http://localhost:5000/api/products", payload, {
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
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md border">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {isEditMode ? "Edit Product" : "Create Product"}
        </h2>
        <p className="text-sm text-gray-500">
          {isEditMode
            ? "Update existing product details"
            : "Add a new product to your inventory"}
        </p>
      </div>

      {errorMessage && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 text-sm rounded">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Product Name
          </label>
          <input
            {...register("name")}
            type="text"
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm focus:border-black focus:outline-none"
            placeholder="e.g. Wireless Headphones"
          />
          {errors.name && (
            <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Category & Price Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <input
              {...register("category")}
              type="text"
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm focus:border-black focus:outline-none"
              placeholder="e.g. Electronics"
            />
            {errors.category && (
              <p className="text-xs text-red-500 mt-1">
                {errors.category.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Price ($)
            </label>
            <input
              {...register("price")}
              type="number"
              step="0.01"
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm focus:border-black focus:outline-none"
              placeholder="99.99"
            />
            {errors.price && (
              <p className="text-xs text-red-500 mt-1">
                {errors.price.message}
              </p>
            )}
          </div>
        </div>

        {/* Stock */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Stock Quantity
          </label>
          <input
            {...register("stock")}
            type="number"
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm focus:border-black focus:outline-none"
            placeholder="100"
          />
          {errors.stock && (
            <p className="text-xs text-red-500 mt-1">{errors.stock.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            {...register("description")}
            rows={4}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm focus:border-black focus:outline-none"
            placeholder="Detailed description of the product..."
          />
          {errors.description && (
            <p className="text-xs text-red-500 mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Images (Comma Separated URLs) */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Image URLs (Comma separated)
          </label>
          <input
            {...register("images")}
            type="text"
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm focus:border-black focus:outline-none"
            placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
          />
          {errors.images && (
            <p className="text-xs text-red-500 mt-1">{errors.images.message}</p>
          )}
        </div>

        {/* Is Featured Checkbox */}
        <div className="flex items-center space-x-2 pt-2">
          <input
            {...register("isFeatured")}
            type="checkbox"
            id="isFeatured"
            className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
          />
          <label
            htmlFor="isFeatured"
            className="text-sm font-medium text-gray-700">
            Featured Product (Displays on Homepage)
          </label>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50">
            {loading
              ? "Saving..."
              : isEditMode
                ? "Update Product"
                : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
