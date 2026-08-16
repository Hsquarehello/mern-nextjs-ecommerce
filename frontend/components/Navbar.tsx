"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { totalItems } = useCart();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-extrabold text-blue-600">
          MERN Store
        </Link>

        <Link
          href="/checkout"
          className="relative flex items-center bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
          <span>🛒 Cart</span>
          {totalItems > 0 && (
            <span className="ml-2 bg-blue-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
