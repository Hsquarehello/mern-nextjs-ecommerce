"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Settings,
  LogOut,
  Menu,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// Sidebar တွင်ပြသချင်သော Menu List များ
const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Orders",
    href: "/dashboard/orders",
    icon: Package,
  },
  {
    title: "Products",
    href: "/dashboard/products",
    icon: ShoppingBag,
  },
  {
    title: "Customers",
    href: "/dashboard/customers",
    icon: Users,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  const NavContent = () => (
    <div className="flex flex-col h-full justify-between py-4">
      <div className="px-3 py-2 space-y-4">
        <div className="px-3 py-2">
          <h2 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
            <span className="p-1.5 bg-primary text-primary-foreground rounded-lg">
              <Package className="w-5 h-5" />
            </span>
            Admin Panel
          </h2>
        </div>
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            // Active link ဖြစ်မဖြစ် စစ်ဆေးခြင်း
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Button
                key={item.href}
                render={<Link href={item.href} />}
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 px-3",
                  isActive && "font-semibold text-primary bg-secondary",
                )}>
                <Icon className="w-4 h-4" />
                {item.title}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Logout သို့မဟုတ် အောက်ခြေ Section */}
      <div className="px-3 py-2 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive">
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Screen အတွက် Drawer Sidebar */}
      <div className="md:hidden flex items-center justify-between p-4 border-b bg-background">
        <div className="flex items-center gap-2 font-bold">
          <Package className="w-5 h-5" /> Admin Panel
        </div>
        <Sheet>
          <SheetTrigger>
              <Menu className="w-5 h-5" />
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <SheetHeader className="p-4 border-b text-left">
              <SheetTitle>Navigation</SheetTitle>
            </SheetHeader>
            <NavContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Screen အတွက် Fixed Left Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r bg-card min-h-screen">
        <NavContent />
      </aside>
    </>
  );
}
