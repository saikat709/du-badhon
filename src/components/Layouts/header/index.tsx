"use client";

import {
  Menu,
  PhoneCall,
  Plus,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSidebarContext } from "../sidebar/sidebar-context";
import { ThemeToggleSwitch } from "./theme-toggle";
import { UserInfo } from "./user-info";
import { SmartAppButton } from "@/components/PWA/PWAInstaller";
import { useBadhon, isLockActive } from "@/context/badhon-context";

export function Header() {
  const { toggleSidebar, isMobile } = useSidebarContext();
  const { currentVolunteer, donors, setActiveCallingModalDonor } = useBadhon();

  const myCallingDonor = donors.find(
    (d) =>
      d.currentLock?.lockedByVolunteerId === currentVolunteer.id &&
      isLockActive(d.currentLock),
  );

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-stroke bg-white/90 backdrop-blur-md px-3 py-2 sm:px-4 sm:py-2.5 shadow-xs dark:border-stroke-dark dark:bg-gray-dark/90 md:px-6 2xl:px-10">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          onClick={toggleSidebar}
          className="rounded-xl border border-stroke p-2 text-dark dark:border-stroke-dark dark:bg-[#020D1A] dark:text-white hover:bg-gray-2 dark:hover:bg-dark-3 lg:hidden transition shrink-0"
        >
          <Menu className="size-5" />
          <span className="sr-only">Toggle Sidebar</span>
        </button>

        {isMobile && (
          <Link href={"/dashboard"} className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <Image
              src={"/images/logo/logo-icon.svg"}
              width={26}
              height={26}
              alt="Badhon Logo"
              style={{ width: "auto", height: "auto" }}
              priority
            />
            <span className="font-black text-rose-600 text-base sm:text-lg tracking-wider">BADHON</span>
          </Link>
        )}

        <div className="max-md:hidden">
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold text-dark dark:text-white leading-tight">
              DU Badhon
            </h1>
            <span className="rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 px-2.5 py-0.5 text-[10px] font-black tracking-wider truncate max-w-[200px]">
              {currentVolunteer.hallUnit}
            </span>
          </div>
          <p className="text-[11px] text-dark-5 dark:text-dark-6">
            Voluntary Blood Donors&apos; Coordination Platform
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {myCallingDonor && (
          <button
            onClick={() => setActiveCallingModalDonor(myCallingDonor)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition animate-pulse cursor-pointer"
            title="Click to resume calling or record feedback"
          >
            <PhoneCall className="size-3.5" />
            <span className="hidden sm:inline">Calling {myCallingDonor.name}</span>
            <span className="sm:hidden">On Call</span>
          </button>
        )}

        <SmartAppButton />

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
