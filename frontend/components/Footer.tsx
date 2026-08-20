"use client";

import Link from "next/link";
import { ArrowUpRight, Store } from "lucide-react";
import { useAuth } from "@/context/AuthContext"; // Navbar ထဲကအတိုင်း AuthContext ကို Import လုပ်ပါ

const shopLinks = [
  { href: "/", label: "Shop all" },
  { href: "/search", label: "Search products" },
  { href: "/checkout", label: "Your cart" },
];

export default function Footer() {
  const { user, logout } = useAuth(); // Auth State ရယူခြင်း

  // User status ပေါ်မူတည်ပြီး Account Links များကို ခွဲခြားခြင်း
  const accountLinks = user
    ? [
        { href: "/orders", label: "Order history" },
        ...(user.role === "admin"
          ? [{ href: "/dashboard/products", label: "Dashboard" }]
          : []),
        { href: "#", label: "Sign out", onClick: logout },
      ]
    : [
        { href: "/login", label: "Sign in" },
        { href: "/register", label: "Create account" },
        { href: "/orders", label: "Order history" },
      ];

  return (
    <footer className="border-t border-[#19251f]/15 bg-[#19251f] text-[#f4f0e9]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-8 sm:py-14">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr] md:gap-16">
          {/* Brand Info */}
          <div className="max-w-sm">
            <Link
              href="/"
              className="group inline-flex items-center gap-3"
              aria-label="MERN Store home">
              <span className="flex size-10 items-center justify-center rounded-xl bg-[#e4774b] text-[#19251f] transition-transform group-hover:-rotate-3">
                <Store className="size-5" />
              </span>
              <span>
                <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-[#f4f0e9]/55">
                  Everyday goods
                </span>
                <span className="mt-1 block text-xl font-black tracking-tight">
                  MERN Store
                </span>
              </span>
            </Link>
            <p className="mt-6 text-sm leading-6 text-[#f4f0e9]/65">
              Useful pieces for the way you live now, thoughtfully gathered in
              one everyday edit.
            </p>
          </div>

          {/* Link Groups */}
          <FooterLinkGroup title="Shop" links={shopLinks} />
          <FooterLinkGroup title="Account" links={accountLinks} />
        </div>

        {/* Bottom Section */}
        <div className="mt-12 flex flex-col gap-3 border-t border-[#f4f0e9]/15 pt-5 text-xs text-[#f4f0e9]/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} MERN Store. All rights reserved.</p>
          <Link
            href="/search"
            className="inline-flex items-center gap-1 font-semibold text-[#f4f0e9]/75 transition-colors hover:text-[#e4774b]">
            Find your next everyday favorite
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </footer>
  );
}

// Sub-component အတွက် Type interface
interface FooterLink {
  href: string;
  label: string;
  onClick?: () => void;
}

function FooterLinkGroup({
  title,
  links,
}: {
  title: string;
  links: FooterLink[];
}) {
  return (
    <div>
      <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-[#e4774b]">
        {title}
      </h2>
      <nav
        className="mt-4 flex flex-col items-start gap-3"
        aria-label={`${title} links`}>
        {links.map((link) =>
          link.onClick ? (
            // Logout Functionality အတွက် button အဖြစ် render လုပ်ခြင်း
            <button
              key={link.label}
              onClick={link.onClick}
              className="text-sm text-[#f4f0e9]/70 transition-colors hover:text-[#e4774b]">
              {link.label}
            </button>
          ) : (
            // ပုံမှန် Navigation Link များ
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-[#f4f0e9]/70 transition-colors hover:text-[#f4f0e9]">
              {link.label}
            </Link>
          ),
        )}
      </nav>
    </div>
  );
}
