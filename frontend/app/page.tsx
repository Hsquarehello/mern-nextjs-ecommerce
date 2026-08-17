"use client";

import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { ApiResponse, Product } from "@/types";
import ProductCard from "@/components/ProductCard";

// Shadcn UI & Base UI Components
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PackageSearch, AlertCircle, Sparkles, RefreshCw } from "lucide-react";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get<ApiResponse<Product[]>>(
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/products",
      );
      setProducts(response.data.data || []);
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch products",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <main className="min-h-screen bg-background py-10 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header / Hero Section */}
        <div className="flex flex-col items-center sm:items-start space-y-3 border-b pb-6">
          <Badge variant="outline" className="gap-1 px-3 py-1 text-xs">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>MongoDB & Express Powered</span>
          </Badge>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Explore Our Products
          </h1>

          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl">
            Discover real-time items fetched directly from our API. High quality
            products curated just for you.
          </p>
        </div>

        {/* Loading State (Skeleton Grid) */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="space-y-3">
                <Skeleton className="h-48 w-full rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="flex items-center gap-3 p-4 rounded-xl border border-destructive/20 bg-destructive/10 text-destructive max-w-lg w-full">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <div className="flex-1 text-sm">
                <p className="font-semibold">Error Loading Products</p>
                <p className="text-xs opacity-90">{error}</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={fetchProducts}
                className="gap-1">
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Retry</span>
              </Button>
            </div>
          </div>
        )}

        {/* Product Grid / Empty State */}
        {!loading && !error && (
          <>
            {products.length === 0 ? (
              <Card className="text-center py-16 max-w-lg mx-auto shadow-sm">
                <CardContent className="space-y-4">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <PackageSearch className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">No Products Found</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      There are no items currently in the database. Please run{" "}
                      <code className="bg-muted px-1.5 py-0.5 rounded text-foreground font-mono">
                        npm run seed
                      </code>{" "}
                      in your backend repository.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={fetchProducts}
                    className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    <span>Refresh Data</span>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
