"use client";

import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "@/components/ui/dropdown";
import { useBadhon } from "@/context/badhon-context";
import { cn } from "@/lib/utils";
import {
  Building2,
  ChevronDown,
  ClipboardList,
  Droplet,
  GraduationCap,
  MapPin,
  Phone,
  RotateCcw,
  ShieldCheck,
  User,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function UserInfo() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentVolunteer, resetToSampleData } = useBadhon();

  const initials = currentVolunteer.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

  return (
    <Dropdown isOpen={isOpen} setIsOpen={setIsOpen}>
      <DropdownTrigger className="rounded-full align-middle outline-none ring-rose-500 ring-offset-2 focus-visible:ring-1 dark:ring-offset-gray-dark">
        <span className="sr-only">My Account</span>

        <figure className="flex items-center gap-2.5">
          <div
            className="flex size-9.5 items-center justify-center rounded-full text-xs font-black text-white shadow-sm ring-2 ring-white dark:ring-dark-3"
            style={{ backgroundColor: currentVolunteer.avatarBg }}
          >
            {initials}
          </div>

          <figcaption className="flex flex-col text-left max-[1024px]:sr-only">
            <span className="text-xs font-bold text-dark dark:text-white flex items-center gap-1">
              {currentVolunteer.name}
              <ChevronDown
                aria-hidden
                className={cn(
                  "size-3.5 transition-transform text-gray-5",
                  isOpen && "rotate-180",
                )}
              />
            </span>
            <span className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">
              {currentVolunteer.role} • {currentVolunteer.hallUnit.split(" ")[0]} Hall
            </span>
          </figcaption>
        </figure>
      </DropdownTrigger>

      <DropdownContent
        className="border border-stroke bg-white shadow-2xl dark:border-dark-3 dark:bg-gray-dark w-80 rounded-2xl p-0 overflow-hidden"
        align="end"
      >
        {/* User Card Header: Shows ONLY current user's profile info */}
        <div className="bg-gradient-to-br from-rose-50 via-white to-gray-1 dark:from-dark-3 dark:via-dark-2 dark:to-dark-2 p-4 border-b border-stroke dark:border-dark-3">
          <div className="flex items-start gap-3">
            <div
              className="flex size-12 shrink-0 items-center justify-center rounded-2xl text-sm font-black text-white shadow-md"
              style={{ backgroundColor: currentVolunteer.avatarBg }}
            >
              {initials}
            </div>

            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center justify-between gap-1">
                <h3 className="text-sm font-black text-dark dark:text-white truncate">
                  {currentVolunteer.name}
                </h3>
                {currentVolunteer.bloodGroup && (
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-black px-1.5 py-0.5 rounded-md bg-rose-600 text-white shrink-0">
                    <Droplet className="size-2.5 fill-white" />
                    <span>{currentVolunteer.bloodGroup}</span>
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <span className="inline-block text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300 px-2 py-0.2 rounded-full border border-rose-300 dark:border-rose-900">
                  {currentVolunteer.role}
                </span>
                <span className="text-[10px] text-dark-5 dark:text-dark-6 font-medium">
                  {currentVolunteer.studentId}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Personal Info Grid */}
        <div className="p-3.5 space-y-2 text-xs border-b border-stroke dark:border-dark-3 bg-white dark:bg-dark-2">
          <div className="flex items-center gap-2 text-dark dark:text-white">
            <Building2 className="size-3.5 text-rose-600 shrink-0" />
            <span className="text-dark-5 dark:text-dark-6 text-[11px] shrink-0">Unit:</span>
            <span className="font-bold truncate text-[11px]">{currentVolunteer.hallUnit}</span>
          </div>

          {currentVolunteer.department && (
            <div className="flex items-center gap-2 text-dark dark:text-white">
              <GraduationCap className="size-3.5 text-rose-600 shrink-0" />
              <span className="text-dark-5 dark:text-dark-6 text-[11px] shrink-0">Dept:</span>
              <span className="font-medium truncate text-[11px]">
                {currentVolunteer.department} {currentVolunteer.session ? `(${currentVolunteer.session})` : ""}
              </span>
            </div>
          )}

          <div className="flex items-center gap-2 text-dark dark:text-white">
            <Phone className="size-3.5 text-rose-600 shrink-0" />
            <span className="text-dark-5 dark:text-dark-6 text-[11px] shrink-0">Phone:</span>
            <span className="font-bold text-[11px] text-rose-600 dark:text-rose-400">
              {currentVolunteer.phone}
            </span>
          </div>

          {currentVolunteer.roomNo && (
            <div className="flex items-center gap-2 text-dark dark:text-white">
              <MapPin className="size-3.5 text-rose-600 shrink-0" />
              <span className="text-dark-5 dark:text-dark-6 text-[11px] shrink-0">Room:</span>
              <span className="font-medium text-[11px] text-dark-5 dark:text-dark-6">
                {currentVolunteer.roomNo}
              </span>
            </div>
          )}
        </div>

        {/* Navigation Action Links */}
        <div className="p-2 text-xs space-y-1">
          <Link
            href="/profile"
            onClick={() => setIsOpen(false)}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-dark dark:text-white hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 dark:hover:text-rose-400 font-bold transition"
          >
            <User className="size-4 text-rose-600" />
            <span>My Complete Profile</span>
          </Link>

          <Link
            href="/hall-units"
            onClick={() => setIsOpen(false)}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-dark-5 dark:text-dark-6 hover:bg-gray-1 dark:hover:bg-dark-3 hover:text-dark dark:hover:text-white font-medium transition"
          >
            <Building2 className="size-4 text-gray-5" />
            <span>Unit Details & Executives Directory</span>
          </Link>

          <Link
            href="/donations"
            onClick={() => setIsOpen(false)}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-dark-5 dark:text-dark-6 hover:bg-gray-1 dark:hover:bg-dark-3 hover:text-dark dark:hover:text-white font-medium transition"
          >
            <ClipboardList className="size-4 text-gray-5" />
            <span>My Donation & Management Records</span>
          </Link>
        </div>

        {/* Footer with discreet reset */}
        <div className="p-2 border-t border-stroke dark:border-dark-3 bg-gray-1/60 dark:bg-dark-3/60 flex items-center justify-between text-[11px]">
          <span className="text-dark-5 dark:text-dark-6">
            Signed in as <strong>{currentVolunteer.name.split(" ")[0]}</strong>
          </span>

          <button
            onClick={() => {
              if (confirm("Reset demo data to initial Badhon state?")) {
                resetToSampleData();
                setIsOpen(false);
              }
            }}
            className="text-[10px] text-dark-5 hover:text-rose-600 dark:text-dark-6 dark:hover:text-rose-400 inline-flex items-center gap-1 transition"
          >
            <RotateCcw className="size-3" />
            <span>Reset Demo</span>
          </button>
        </div>
      </DropdownContent>
    </Dropdown>
  );
}
