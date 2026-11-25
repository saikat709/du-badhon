"use client";

import {
  Clock,
  HeartHandshake,
  LayoutDashboard,
  Search,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Requests",
    href: "/blood-requests",
    icon: HeartHandshake,
  },
  {
    label: "Search",
    href: "/search-blood",
    icon: Search,
  },
  {
    label: "Pending",
    href: "/pending-donations",
    icon: Clock,
  },
  {
    label: "Profile",
    href: "/profile",
    icon: User,
  },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Mobile Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#081024]/95 backdrop-blur-md border-t border-stroke dark:border-dark-3 px-2 py-1.5 shadow-lg pb-[max(0.5rem,env(safe-area-inset-bottom))]"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all relative ${
                isActive
                  ? "text-rose-600 dark:text-rose-400 font-bold"
                  : "text-dark-5 dark:text-dark-6 hover:text-dark dark:hover:text-white font-medium"
              }`}
            >
              <div className="relative">
                <Icon className={`size-5 ${isActive ? "stroke-[2.5]" : "stroke-[1.75]"}`} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 size-1 rounded-full bg-rose-600 dark:bg-rose-400" />
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-0.5 leading-none">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
