"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Product } from "@/types";
import ProductCard from "@/components/ProductCard";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Backend Express API မှ ဒေတာများ ယူဆောင်ခြင်း
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Express Backend API Endpoint သို့ တောင်းဆိုခြင်း
        const response = await axios.get<Product[]>(
          "http://localhost:5000/api/products",
        );
        setProducts(response.data);
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

    fetchProducts();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Explore Products
          </h1>
          <p className="text-gray-600 mt-2">
            Fetching real-time data from MongoDB via Express API
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600 font-medium">
              Loading products from database...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl max-w-lg mx-auto text-center">
            <p className="font-semibold">Error Loading Products</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        {/* Product Grid Display */}
        {!loading && !error && (
          <>
            {products.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
                <p className="text-gray-500 text-lg">
                  No products found in the database.
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Please run `npm run seed` in your backend.
                </p>
              </div>
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
