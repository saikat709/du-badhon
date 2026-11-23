"use client";

import Image from "next/image";
import Link from "next/link";
import { useSidebarContext } from "../sidebar/sidebar-context";
import { MenuIcon } from "./icons";
import { ThemeToggleSwitch } from "./theme-toggle";
import { UserInfo } from "./user-info";

export function Header() {
  const { toggleSidebar, isMobile } = useSidebarContext();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-stroke bg-white px-4 py-2.5 shadow-sm dark:border-stroke-dark dark:bg-gray-dark md:px-6 2xl:px-10">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="rounded-lg border px-2 py-1.5 text-dark dark:border-stroke-dark dark:bg-[#020D1A] dark:text-white hover:bg-gray-2 dark:hover:bg-dark-3 lg:hidden"
        >
          <MenuIcon />
          <span className="sr-only">Toggle Sidebar</span>
        </button>

        {isMobile && (
          <Link href={"/dashboard"} className="flex items-center gap-2">
            <Image
              src={"/images/logo/logo-icon.svg"}
              width={28}
              height={30}
              alt="Badhon Logo"
              priority
            />
            <span className="font-black text-rose-600 text-lg tracking-wider">BADHON</span>
          </Link>
        )}

        <div className="max-md:hidden">
          <div className="flex items-center gap-2">
            <h1 className="text-heading-6 font-bold text-dark dark:text-white leading-tight">
              DU Badhon Management
            </h1>
            <span className="rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider">
              DU Unit
            </span>
          </div>
          <p className="text-xs text-dark-5 dark:text-dark-6">
            Voluntary Blood Donors&apos; Coordination Platform
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 sm:gap-4">
        <Link
          href="/blood-requests?new=true"
          className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-rose-700 transition"
        >
          <span className="text-sm">+</span>
          <span>Record Request</span>
        </Link>

        <ThemeToggleSwitch />

        <div className="shrink-0">
          <UserInfo />
        </div>
      </div>
    </header>
  );
}
