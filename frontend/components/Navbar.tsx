"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Store } from "lucide-react";

export default function Navbar() {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
        {/* Logo Section */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl tracking-tight text-primary transition-opacity hover:opacity-90">
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
            <Store className="h-5 w-5" />
          </div>
          <span>MERN Store</span>
        </Link>

        {/* Navigation & Cart Actions */}
        <div className="flex items-center gap-4">
          <Button
            render={<Link href="/checkout" />}
            variant="outline"
            size="sm"
            className="relative gap-2 font-medium">
            <ShoppingCart className="h-4 w-4" />
            <span>Cart</span>

            {totalItems > 0 && (
              <Badge
                variant="default"
                className="ml-1 h-5 min-w-5 px-1.5 rounded-full flex items-center justify-center text-xs font-bold">
                {totalItems}
              </Badge>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
