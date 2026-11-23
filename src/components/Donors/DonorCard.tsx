"use client";

import { useBadhon, isLockActive } from "@/context/badhon-context";
import { Donor } from "@/types/badhon";
import {
  Clock,
  Droplet,
  GraduationCap,
  Lock,
  MessageSquare,
  Phone,
  PhoneCall,
  ShieldCheck,
} from "lucide-react";
import React from "react";

interface DonorCardProps {
  donor: Donor;
  onCall: (donor: Donor) => void;
  onQuickAssign?: (donor: Donor) => void;
  activeRequestId?: string;
}

export function DonorCard({ donor, onCall, onQuickAssign, activeRequestId }: DonorCardProps) {
  const { currentVolunteer } = useBadhon();

  const isLocked = isLockActive(donor.currentLock);
  const isLockedByMe = isLocked && donor.currentLock?.lockedByVolunteerId === currentVolunteer.id;
  const lockedByName = donor.currentLock?.lockedByVolunteerName;
  const lockedByHall = donor.currentLock?.lockedByVolunteerHall?.split(" ")[0];

  // Calculate days since last donation with defensive checks
  let eligibilityText = "First-time donor (Ready)";
  let isEligible = true;

  if (donor.lastDonationDate) {
    const lastDate = new Date(donor.lastDonationDate);
    const lastTime = lastDate.getTime();
    if (!isNaN(lastTime)) {
      const diffTime = Math.max(0, Date.now() - lastTime);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays >= 90) {
        eligibilityText = `Eligible (${diffDays}d since last donation)`;
        isEligible = true;
      } else {
        eligibilityText = `Cooldown: ${90 - diffDays}d left (${diffDays}d ago)`;
        isEligible = false;
      }
    }
  }

  const latestCall = donor.callHistory[0];

  return (
    <div
      className={`relative flex flex-col justify-between rounded-2xl p-5 border transition-all duration-200 shadow-xs hover:shadow-md ${
        isLocked
          ? isLockedByMe
            ? "bg-rose-50/70 dark:bg-rose-950/20 border-rose-400 dark:border-rose-800"
            : "bg-amber-50/60 dark:bg-amber-950/20 border-amber-300 dark:border-amber-900/40"
          : "bg-white dark:bg-dark-2 border-stroke dark:border-dark-3"
      }`}
    >
      {/* Top Bar: Blood Group & Lock Indicator */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-rose-600 to-rose-700 text-white font-black text-lg shadow-sm">
            {donor.bloodGroup}
          </span>
          <div>
            <h3 className="font-bold text-base text-dark dark:text-white leading-tight">
              {donor.name}
            </h3>
            <p className="text-xs text-dark-5 dark:text-dark-6 mt-0.5">
              {donor.hallUnit}
            </p>
          </div>
        </div>

        {/* Lock Pill */}
        {isLocked ? (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
              isLockedByMe
                ? "bg-rose-600 text-white animate-pulse"
                : "bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
            }`}
          >
            <Lock className="size-3" />
            <span>{isLockedByMe ? "You are calling" : `${lockedByName} calling`}</span>
          </span>
        ) : (
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
              isEligible
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
                : "bg-gray-2 text-dark-5 dark:bg-dark-3 dark:text-dark-6"
            }`}
          >
            {isEligible ? (
              <>
                <ShieldCheck className="size-3 text-emerald-600" />
                <span>Ready to Donate</span>
              </>
            ) : (
              <>
                <Clock className="size-3 text-amber-600" />
                <span>Cooldown</span>
              </>
            )}
          </span>
        )}
      </div>

      {/* Details Box */}
      <div className="space-y-2.5 text-xs py-2.5 border-y border-stroke dark:border-dark-3">
        <div className="grid grid-cols-2 gap-2 text-dark-5 dark:text-dark-6">
          <div className="flex items-start gap-1.5">
            <GraduationCap className="size-3.5 mt-0.5 text-gray-4 shrink-0" />
            <div>
              <span className="block text-[10px] text-gray-5">Department</span>
              <span className="font-semibold text-dark dark:text-white truncate block">
                {donor.department}
              </span>
            </div>
          </div>
          <div>
            <span className="block text-[10px] text-gray-5">Session / Batch</span>
            <span className="font-semibold text-dark dark:text-white">
              {donor.session}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center text-[11px] pt-1">
          <span className="inline-flex items-center gap-1 text-dark-5 dark:text-dark-6">
            <Droplet className="size-3 text-rose-500" />
            <span>Total Donations:</span>
          </span>
          <span className="font-bold text-rose-600 dark:text-rose-400">
            {donor.totalDonations} times
          </span>
        </div>

        <div className="flex items-center justify-between text-[11px]">
          <span className="text-dark-5 dark:text-dark-6">Status:</span>
          <span className={isEligible ? "text-emerald-600 font-semibold" : "text-amber-600 font-semibold"}>
            {eligibilityText}
          </span>
        </div>

        {/* Latest Call Feedback / Comment */}
        {latestCall && (
          <div className="p-2.5 bg-gray-1 dark:bg-dark-3 rounded-xl text-[11px] space-y-1">
            <div className="flex justify-between items-center text-[10px] text-gray-5">
              <span className="font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                <MessageSquare className="size-2.5" />
                <span>{latestCall.volunteerName}</span>
              </span>
              <span>{new Date(latestCall.timestamp).toLocaleDateString()}</span>
            </div>
            <p className="text-dark dark:text-white line-clamp-2 italic">
              &ldquo;{latestCall.comment}&rdquo;
            </p>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-1 flex items-center gap-2">
        {isLocked ? (
          isLockedByMe ? (
            <button
              onClick={() => onCall(donor)}
              className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition active:scale-95"
            >
              <PhoneCall className="size-3.5" />
              <span>Resume Call & Log Feedback</span>
            </button>
          ) : (
            <button
              disabled
              title={`Locked by ${lockedByName} (${lockedByHall} Hall)`}
              className="w-full py-2.5 px-3 rounded-xl bg-amber-200/80 dark:bg-amber-950/40 text-amber-900 dark:text-amber-400 font-bold text-xs cursor-not-allowed border border-amber-300 dark:border-amber-800/50 flex items-center justify-center gap-1.5"
            >
              <Lock className="size-3.5 text-amber-800 dark:text-amber-300" />
              <span>In-Call with {lockedByName}</span>
            </button>
          )
        ) : (
          <div className="w-full flex items-center gap-2">
            <button
              onClick={() => onCall(donor)}
              className="flex-1 py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm transition active:scale-95 flex items-center justify-center gap-1.5"
            >
              <Phone className="size-3.5" />
              <span>Call Donor</span>
            </button>

            {onQuickAssign && activeRequestId && isEligible && (
              <button
                onClick={() => onQuickAssign(donor)}
                className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition"
              >
                Assign
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
