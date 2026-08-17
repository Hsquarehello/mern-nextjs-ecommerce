"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext"; // သင့်ရဲ့ AuthContext Path ကို ထည့်ပေးပါ
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  Store,
  LayoutDashboard,
  LogOut,
  User as UserIcon,
} from "lucide-react";

export default function Navbar() {
  const { totalItems } = useCart();
  const { user, logout } = useAuth(); // Auth context မှ user နှင့် logout ကို ယူသုံးခြင်း

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
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

        {/* Navigation & Actions */}
        <div className="flex items-center gap-3">
          {/* Admin Dashboard Link (Admin ဖြစ်မှသာ ပြမည်) */}
          {user && user.role === "admin" && (
            <Button
              render={<Link href="/dashboard/products" />}
              variant="ghost"
              size="sm"
              className="gap-2">
              <LayoutDashboard className="h-4 w-4 text-primary" />
              <span className="hidden sm:inline">Dashboard</span>
            </Button>
          )}

          {/* Cart Button */}
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

          {/* User Auth State Actions */}
          {user ? (
            <div className="flex items-center gap-2 border-l pl-3 ml-1">
              {/* User Greeting */}
              <div className="hidden md:flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                <UserIcon className="h-4 w-4" />
                <span>{user.name}</span>
              </div>

              {/* Logout Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="gap-1.5 text-red-500 hover:text-red-600 hover:bg-red-50">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 border-l pl-3 ml-1">
              <Button render={<Link href="/login" />} variant="ghost" size="sm">
                Login
              </Button>
              <Button render={<Link href="/register" />} size="sm">
                Register
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
