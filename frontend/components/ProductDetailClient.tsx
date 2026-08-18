"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { ApiResponse, Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

function getProductEndpoint(productId: string) {
  const base = (
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
  ).replace(/\/+$/, "");

  if (base.endsWith("/products")) {
    return `${base}/${productId}`;
  }

  return `${base}/products/${productId}`;
}

export default function ProductDetailClient({
  productId,
}: {
  productId: string;
}) {
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get<ApiResponse<Product>>(
        getProductEndpoint(productId),
      );

      setProduct(response.data.data || null);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load product details.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-2">
          <Skeleton className="h-120 w-full rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-16">
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-center">
          <h1 className="text-2xl font-bold text-destructive">
            Product not found
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {error || "This item is unavailable."}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button render={<Link href="/" />} variant="outline">
              Back to Home
            </Button>
            <Button onClick={fetchProduct}>Retry</Button>
          </div>
        </div>
      </main>
    );
  }

  const imageUrl =
    product.imageUrl || "https://placehold.co/1200x900?text=Product+Image";

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6">
        <Button render={<Link href="/" />} variant="ghost" size="sm">
          ← Continue Shopping
        </Button>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          <img
            src={imageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <Badge
              variant="outline"
              className="text-xs uppercase tracking-wide">
              {product.category || "General"}
            </Badge>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {product.name}
            </h1>

            <div className="text-3xl font-bold text-primary">
              ${product.price.toFixed(2)}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button size="lg" onClick={() => addToCart(product)}>
              Add to Cart
            </Button>

            <Button
              render={<Link href="/checkout" />}
              variant="outline"
              size="lg">
              Go to Checkout
            </Button>
          </div>

          <div className="rounded-xl border bg-muted/30 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Availability</span>
              <span className="font-medium">
                {product.stock > 0
                  ? `${product.stock} in stock`
                  : "Out of stock"}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Description</h2>
            <p className="leading-7 text-muted-foreground">
              {product.description ||
                "No description available for this product."}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
