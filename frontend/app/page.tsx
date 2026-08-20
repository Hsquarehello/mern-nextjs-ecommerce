"use client";

import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { ApiResponse, Product } from "@/types";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

// Shadcn UI & Base UI Components
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  AlertCircle,
  Boxes,
  PackageSearch,
  RefreshCw,
  Search,
  Sparkles,
} from "lucide-react";

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

  const categories = Array.from(
    new Set(products.map((product) => product.category).filter(Boolean)),
  ).slice(0, 4);
  const inStockCount = products.filter((product) => product.stock > 0).length;

  return (
    <main className="min-h-screen bg-[#f4f0e9] text-[#19251f]">
      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-8">
        <section className="relative overflow-hidden border-x border-[#19251f]/10 bg-[#dce8dc] px-6 pb-10 pt-12 sm:px-12 sm:pb-14 sm:pt-16 lg:px-20">
          <div className="absolute -right-16 -top-24 size-72 rounded-full border-36 border-[#e4774b]/35" />
          <div className="absolute bottom-0 right-24 hidden h-24 w-24 rounded-t-full bg-[#e4774b] lg:block" />
          <div className="relative max-w-3xl">
            <div className="mb-6 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#e4774b]">
              <Sparkles className="size-4" />
              The everyday edit
            </div>
            <h1 className="max-w-2xl text-5xl font-black leading-[0.95] tracking-[-0.055em] sm:text-7xl">
              Good things, thoughtfully gathered.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-[#19251f]/70 sm:text-lg">
              Useful pieces for the way you live now. Browse the latest finds,
              picked for quality, character, and daily use.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                render={<Link href="#catalog" />}
                className="h-11 rounded-full bg-[#19251f] px-6 text-[#f4f0e9] hover:bg-[#19251f]/85">
                Shop the collection
                <ArrowUpRight className="size-4" />
              </Button>
              <Button
                render={<Link href="/search" />}
                variant="outline"
                className="h-11 rounded-full border-[#19251f]/20 bg-transparent px-6 text-[#19251f] hover:bg-white/50">
                <Search className="size-4" />
                Search all
              </Button>
            </div>
          </div>
        </section>

        <section className="grid border-x border-b border-[#19251f]/10 bg-[#f8f5ef] sm:grid-cols-3">
          <div className="border-b border-[#19251f]/10 p-5 sm:border-b-0 sm:border-r">
            <p className="text-3xl font-black tracking-tight">
              {products.length}
            </p>
            <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-[#19251f]/55">
              Pieces in the edit
            </p>
          </div>
          <div className="border-b border-[#19251f]/10 p-5 sm:border-b-0 sm:border-r">
            <p className="text-3xl font-black tracking-tight">{inStockCount}</p>
            <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-[#19251f]/55">
              Ready to ship
            </p>
          </div>
          <div className="p-5">
            <p className="flex items-center gap-2 text-sm font-bold">
              <Boxes className="size-4 text-[#e4774b]" />
              Freshly updated
            </p>
            <p className="mt-1 text-xs text-[#19251f]/55">
              New finds added regularly
            </p>
          </div>
        </section>

        {/* Loading State (Skeleton Grid) */}
        {loading && (
          <div className="grid grid-cols-1 gap-6 pt-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
              <Card className="mx-auto mt-10 max-w-lg border-[#19251f]/10 bg-[#f8f5ef] py-16 text-center shadow-sm">
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
              <section id="catalog" className="pt-12">
                <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                  <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#e4774b]">
                      In the shop
                    </p>
                    <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                      Find your next favorite.
                    </h2>
                  </div>
                  {categories.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <Button
                          key={category}
                          render={
                            <Link
                              href={`/search?q=${encodeURIComponent(category)}`}
                            />
                          }
                          variant="outline"
                          size="sm"
                          className="rounded-full border-[#19251f]/15 bg-transparent text-[#19251f]/70 hover:bg-white">
                          {category}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}
