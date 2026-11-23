"use client";

import { ChevronUpIcon } from "@/assets/icons";
import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "@/components/ui/dropdown";
import { useBadhon } from "@/context/badhon-context";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import { LogOutIcon, SettingsIcon, UserIcon } from "./icons";

export function UserInfo() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentVolunteer, volunteers, switchVolunteer, resetToSampleData } = useBadhon();

  const initials = currentVolunteer.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

  return (
    <Dropdown isOpen={isOpen} setIsOpen={setIsOpen}>
      <DropdownTrigger className="rounded-full align-middle outline-none ring-primary ring-offset-2 focus-visible:ring-1 dark:ring-offset-gray-dark">
        <span className="sr-only">My Account</span>

        <figure className="flex items-center gap-2.5">
          <div
            className="flex size-10 items-center justify-center rounded-full text-sm font-bold text-white shadow-sm ring-2 ring-white dark:ring-dark-3"
            style={{ backgroundColor: currentVolunteer.avatarBg }}
          >
            {initials}
          </div>

          <figcaption className="flex flex-col text-left max-[1024px]:sr-only">
            <span className="text-sm font-bold text-dark dark:text-white flex items-center gap-1">
              {currentVolunteer.name}
              <ChevronUpIcon
                aria-hidden
                className={cn(
                  "size-3.5 rotate-180 transition-transform text-gray-5",
                  isOpen && "rotate-0",
                )}
                strokeWidth={2}
              />
            </span>
            <span className="text-xs text-primary font-medium">
              {currentVolunteer.role} • {currentVolunteer.hallUnit.split(" ")[0]} Hall
            </span>
          </figcaption>
        </figure>
      </DropdownTrigger>

      <DropdownContent
        className="border border-stroke bg-white shadow-lg dark:border-dark-3 dark:bg-gray-dark min-w-[19rem] rounded-xl p-0 overflow-hidden"
        align="end"
      >
        <div className="bg-gray-1 dark:bg-dark-2 px-4 py-3 border-b border-stroke dark:border-dark-3">
          <div className="flex items-center gap-3">
            <div
              className="flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
              style={{ backgroundColor: currentVolunteer.avatarBg }}
            >
              {initials}
            </div>
            <div>
              <p className="text-sm font-bold text-dark dark:text-white">{currentVolunteer.name}</p>
              <p className="text-xs text-dark-5 dark:text-dark-6">{currentVolunteer.hallUnit}</p>
              <span className="inline-block mt-1 text-[11px] font-semibold bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-900/50">
                {currentVolunteer.role}
              </span>
            </div>
          </div>
        </div>

        {/* Member Switcher (for testing multi-caller locking) */}
        <div className="p-3 border-b border-stroke dark:border-dark-3">
          <p className="text-[11px] font-bold text-gray-5 uppercase tracking-wider mb-2">
            Switch Active Volunteer (Test Locking):
          </p>
          <div className="space-y-1">
            {volunteers.map((vol) => (
              <button
                key={vol.id}
                onClick={() => {
                  switchVolunteer(vol.id);
                  setIsOpen(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition",
                  vol.id === currentVolunteer.id
                    ? "bg-primary/10 text-primary font-bold dark:bg-primary/20"
                    : "text-dark-5 hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3",
                )}
              >
                <span className="flex items-center gap-2">
                  <span
                    className="size-2 rounded-full inline-block"
                    style={{ backgroundColor: vol.avatarBg }}
                  />
                  {vol.name}
                </span>
                <span className="text-[10px] text-gray-5">{vol.hallUnit.split(" ")[0]}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-2 text-sm text-[#4B5563] dark:text-dark-6">
          <Link
            href="/profile"
            onClick={() => setIsOpen(false)}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white font-medium"
          >
            <UserIcon />
            <span>Volunteer Profile</span>
          </Link>

          <button
            onClick={() => {
              if (confirm("Reset demo data to initial Badhon state?")) {
                resetToSampleData();
                setIsOpen(false);
              }
            }}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 hover:bg-rose-50 text-rose-600 dark:hover:bg-rose-950/30 dark:text-rose-400 font-medium"
          >
            <SettingsIcon />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </DropdownContent>
    </Dropdown>
  );
}
