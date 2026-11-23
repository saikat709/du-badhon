"use client";

import { Menu, Plus, Smartphone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSidebarContext } from "../sidebar/sidebar-context";
import { ThemeToggleSwitch } from "./theme-toggle";
import { UserInfo } from "./user-info";
import { HeaderInstallButton } from "@/components/PWA/PWAInstaller";

export function Header() {
  const { toggleSidebar, isMobile } = useSidebarContext();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-stroke bg-white/90 backdrop-blur-md px-4 py-2.5 shadow-xs dark:border-stroke-dark dark:bg-gray-dark/90 md:px-6 2xl:px-10">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="rounded-xl border border-stroke p-2 text-dark dark:border-stroke-dark dark:bg-[#020D1A] dark:text-white hover:bg-gray-2 dark:hover:bg-dark-3 lg:hidden transition"
        >
          <Menu className="size-5" />
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
            <h1 className="text-sm font-bold text-dark dark:text-white leading-tight">
              DU Badhon Management
            </h1>
            <span className="rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider">
              DU Unit
            </span>
          </div>
          <p className="text-[11px] text-dark-5 dark:text-dark-6">
            Voluntary Blood Donors&apos; Coordination Platform
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 sm:gap-3">
        <Link
          href="/download-app"
          title="Download DU Badhon Android App (APK & PWA)"
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 text-xs font-bold border border-rose-200 dark:border-rose-900/50 transition active:scale-95 shadow-2xs"
        >
          <Smartphone className="size-3.5" />
          <span className="hidden xs:inline">Get App</span>
        </Link>

        <HeaderInstallButton />

        <Link
          href="/blood-requests?new=true"
          className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition active:scale-95"
        >
          <Plus className="size-3.5" />
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
