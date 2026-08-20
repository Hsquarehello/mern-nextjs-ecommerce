"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext"; // သင့်ရဲ့ AuthContext Path ကို ထည့်ပေးပါ
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  Search,
  Store,
  Package,
  LayoutDashboard,
  LogOut,
  Menu,
  User as UserIcon,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Navbar() {
  const { totalItems } = useCart();
  const { user, logout } = useAuth(); // Auth context မှ user နှင့် logout ကို ယူသုံးခြင်း

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/95 shadow-[0_4px_24px_-18px_rgba(15,23,42,0.45)] backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-8 md:h-19 md:py-0">
        {/* Logo Section */}
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2.5 text-foreground transition-opacity hover:opacity-80">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform group-hover:-rotate-3 sm:size-11">
            <Store className="size-5 sm:size-6" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Everyday goods
            </span>
            <span className="mt-1 whitespace-nowrap text-lg font-black tracking-tight sm:text-xl">
              MERN Store
            </span>
          </span>
        </Link>

        {/* Navigation & Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Customer Search */}
          <Button
            render={<Link href="/search" />}
            variant="ghost"
            size="icon"
            aria-label="Search products"
            title="Search products">
            <Search className="h-4 w-4" />
          </Button>

          {/* Admin Dashboard Link (Admin ဖြစ်မှသာ ပြမည်) */}
          {user && user.role === "admin" && (
            <Button
              render={<Link href="/dashboard/products" />}
              variant="ghost"
              size="sm"
              className="hidden gap-2 rounded-full px-3 md:inline-flex">
              <LayoutDashboard className="size-4" />
              Dashboard
            </Button>
          )}

          {user && (
            <Button
              render={<Link href="/orders" />}
              variant="ghost"
              size="sm"
              className="hidden gap-2 rounded-full px-3 md:inline-flex">
              <Package className="size-4" />
              My Orders
            </Button>
          )}

          {/* Cart Button */}
          <Button
            render={<Link href="/checkout" />}
            variant="outline"
            size="sm"
            className="relative h-10 gap-2 rounded-full border-border px-3 font-semibold shadow-sm hover:border-primary/40 sm:px-4">
            <ShoppingCart className="size-4" />
            <span className="hidden sm:inline">Cart</span>
            {totalItems > 0 && (
              <Badge className="ml-0.5 flex size-5 items-center justify-center rounded-full p-0 text-[0.65rem] font-bold">
                {totalItems}
              </Badge>
            )}
          </Button>

          {/* User Auth State Actions */}
          <div className="hidden items-center gap-2 border-l border-border pl-3 md:flex">
            {user ? (
              <>
                {/* User Greeting */}
                <div className="flex max-w-32 items-center gap-2 text-sm font-semibold">
                  <span className="flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <UserIcon className="size-4" />
                  </span>
                  <span className="truncate">{user.name}</span>
                </div>

                {/* Logout Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="gap-1.5 rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive">
                  <LogOut className="size-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  render={<Link href="/login" />}
                  variant="ghost"
                  size="sm"
                  className="rounded-full">
                  Login
                </Button>
                <Button
                  render={<Link href="/register" />}
                  size="sm"
                  className="rounded-full px-4">
                  Register
                </Button>
              </>
            )}
          </div>

          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full md:hidden"
                  aria-label="Open navigation menu"
                  title="Open navigation menu"
                />
              }>
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(21rem,88vw)]">
              <SheetHeader className="border-b px-5 pb-5 text-left">
                <SheetTitle className="flex items-center gap-2">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Store className="size-5" />
                  </span>
                  <span className="text-lg font-black">MERN Store</span>
                </SheetTitle>
              </SheetHeader>
              <nav
                className="flex flex-col gap-2 px-4"
                aria-label="Mobile navigation">
                <Button
                  render={<Link href="/search" />}
                  variant="secondary"
                  className="justify-start gap-3 rounded-xl">
                  <Search className="size-4" />
                  Search products
                </Button>
                {user && user.role === "admin" && (
                  <Button
                    render={<Link href="/dashboard/products" />}
                    variant="ghost"
                    className="justify-start gap-3 rounded-xl">
                    <LayoutDashboard className="size-4" />
                    Dashboard
                  </Button>
                )}
                {user && (
                  <Button
                    render={<Link href="/orders" />}
                    variant="ghost"
                    className="justify-start gap-3 rounded-xl">
                    <Package className="size-4" />
                    My Orders
                  </Button>
                )}
                {user ? (
                  <>
                    <div className="mt-2 flex items-center gap-3 border-y px-2 py-4 text-sm font-semibold">
                      <span className="flex size-9 items-center justify-center rounded-full bg-muted text-muted-foreground">
                        <UserIcon className="size-4" />
                      </span>
                      <span className="truncate">{user.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={logout}
                      className="justify-start gap-3 rounded-xl text-destructive hover:bg-destructive/10">
                      <LogOut className="size-4" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      render={<Link href="/login" />}
                      variant="ghost"
                      className="justify-start rounded-xl">
                      Login
                    </Button>
                    <Button
                      render={<Link href="/register" />}
                      className="justify-start rounded-xl">
                      Register
                    </Button>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl px-4 pb-3 sm:px-8 md:hidden">
        <Link
          href="/search"
          className="flex h-10 w-full items-center gap-3 rounded-full border border-border bg-muted/40 px-4 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:bg-muted"
          aria-label="Search products">
          <Search className="size-4" />
          <span>Search products</span>
        </Link>
      </div>
    </header>
  );
}
