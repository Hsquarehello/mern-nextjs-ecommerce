"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import axios from "axios";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  PackageSearch,
  Search,
} from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { Product, ProductListResponse } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

interface SearchResultsProps {
  initialQuery: string;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const pageSize = 8;
const searchDebounceMs = 400;

export default function SearchResults({ initialQuery }: SearchResultsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const activeQuery = searchParams.get("q")?.trim() ?? initialQuery.trim();

  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  useEffect(() => {
    setQuery(activeQuery);
    setPage(1);
  }, [activeQuery]);

  useEffect(() => {
    const nextQuery = query.trim();

    if (nextQuery === activeQuery) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setPage(1);
      router.replace(
        nextQuery ? `${pathname}?q=${encodeURIComponent(nextQuery)}` : pathname,
      );
    }, searchDebounceMs);

    return () => window.clearTimeout(timeoutId);
  }, [activeQuery, pathname, query, router]);

  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async () => {
      if (!activeQuery) {
        setProducts([]);
        setTotal(0);
        setTotalPages(0);
        setLoading(false);
        setError(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await axios.get<ProductListResponse>(
          `${apiUrl}/products`,
          { params: { search: activeQuery, page, limit: pageSize } },
        );

        if (!cancelled) {
          setProducts(response.data.data ?? []);
          setTotal(response.data.total ?? 0);
          setTotalPages(response.data.totalPages ?? 0);
        }
      } catch (requestError: any) {
        if (!cancelled) {
          setError(
            requestError.response?.data?.message ||
              "Unable to search products right now.",
          );
          setProducts([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, [activeQuery, page]);

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextQuery = query.trim();
    router.push(
      nextQuery ? `${pathname}?q=${encodeURIComponent(nextQuery)}` : pathname,
    );
  };

  const goToPage = (nextPage: number) => {
    setPage(Math.min(Math.max(nextPage, 1), totalPages));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-background px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="space-y-5 border-b pb-8">
          <Badge variant="outline" className="gap-1 px-3 py-1 text-xs">
            <Search className="h-3.5 w-3.5 text-primary" />
            Product search
          </Badge>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
              Find something good.
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
              Search the catalog by product name.
            </p>
          </div>

          <form onSubmit={submitSearch} className="flex max-w-2xl gap-2">
            <Input
              ref={searchInputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products..."
              aria-label="Search products"
              autoFocus
              className="h-10"
            />
            <Button type="submit" size="lg" className="gap-2">
              <Search className="h-4 w-4" />
              Search
            </Button>
          </form>
        </section>

        {loading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: pageSize }).map((_, index) => (
              <div key={index} className="space-y-3">
                <Skeleton className="h-48 w-full rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="flex items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-destructive">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && !activeQuery && (
          <Card className="mx-auto max-w-lg text-center shadow-sm">
            <CardContent className="space-y-4 py-16">
              <PackageSearch className="mx-auto h-10 w-10 text-muted-foreground" />
              <div>
                <h2 className="text-lg font-bold">Search the catalog</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Enter a product name to see matching results.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {!loading && !error && activeQuery && (
          <>
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                {total} {total === 1 ? "result" : "results"} for{" "}
                <span className="font-semibold text-foreground">
                  {activeQuery}
                </span>
              </p>
            </div>

            {products.length === 0 ? (
              <Card className="mx-auto max-w-lg text-center shadow-sm">
                <CardContent className="space-y-3 py-16">
                  <PackageSearch className="mx-auto h-10 w-10 text-muted-foreground" />
                  <h2 className="text-lg font-bold">No products found</h2>
                  <p className="text-sm text-muted-foreground">
                    Try a different product name.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 pt-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => goToPage(page - 1)}
                  disabled={page === 1}
                  aria-label="Previous page">
                  <ChevronLeft />
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => goToPage(page + 1)}
                  disabled={page === totalPages}
                  aria-label="Next page">
                  <ChevronRight />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
