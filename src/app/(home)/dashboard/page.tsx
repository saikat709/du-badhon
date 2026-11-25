"use client";

import { RequestCard } from "@/components/BloodRequests/RequestCard";
import { RequestDetailsModal } from "@/components/BloodRequests/RequestDetailsModal";
import { useBadhon, isDonorEligible, isLockActive } from "@/context/badhon-context";
import { ALL_BLOOD_GROUPS, ALL_HALL_UNITS, BloodGroup, BloodRequest, isRequestVisibleToUnit } from "@/types/badhon";
import {
  Activity,
  AlertOctagon,
  ArrowRight,
  Building2,
  CheckCircle2,
  Droplet,
  HeartHandshake,
  Lock,
  Plus,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { Suspense, useMemo, useState } from "react";

const BLOOD_GROUPS = ALL_BLOOD_GROUPS;

function DashboardContent() {
  const {
    currentVolunteer,
    bloodRequests,
    donors,
    setActiveCallingModalDonor,
    unassignDonorFromBag,
    markRequestCompleted,
    markRequestCancelled,
  } = useBadhon();

  const [selectedRequest, setSelectedRequest] = useState<BloodRequest | null>(null);
  // Default to volunteer's assigned hall unit
  const [viewScope, setViewScope] = useState<"hall" | "campus">("hall");

  // Active requests needing fulfillment (filtered by hall visibility when in hall scope)
  const activeRequests = useMemo(() => {
    return bloodRequests.filter((r) => {
      if (r.status !== "active" && r.status !== "partially_managed") return false;
      if (viewScope === "hall") {
        return isRequestVisibleToUnit(r, currentVolunteer.hallUnit);
      }
      return true;
    });
  }, [bloodRequests, viewScope, currentVolunteer.hallUnit]);

  // Donors in user's hall unit vs campus
  const hallDonors = useMemo(() => {
    return donors.filter((d) => d.hallUnit === currentVolunteer.hallUnit);
  }, [donors, currentVolunteer.hallUnit]);

  const activeDonorsList = viewScope === "hall" ? hallDonors : donors;

  // Blood group availability map
  const groupStats = useMemo(() => {
    const stats: Record<string, { ready: number; needed: number; hallReady: number }> = {};
    BLOOD_GROUPS.forEach((bg) => {
      const ready = donors.filter(
        (d) => d.bloodGroup === bg && isDonorEligible(d.lastDonationDate),
      ).length;

      const hallReady = hallDonors.filter(
        (d) => d.bloodGroup === bg && isDonorEligible(d.lastDonationDate),
      ).length;

      const needed = activeRequests
        .filter((r) => r.bloodGroup === bg)
        .reduce((sum, r) => sum + (r.totalBags - r.managedBags), 0);

      stats[bg] = { ready, needed, hallReady };
    });
    return stats;
  }, [donors, hallDonors, activeRequests]);

  // Overall metrics
  const totalBagsNeeded = activeRequests.reduce(
    (sum, r) => sum + (r.totalBags - r.managedBags),
    0,
  );
  const totalBagsManaged = activeRequests.reduce((sum, r) => sum + r.managedBags, 0);
  const activeInCallDonors = donors.filter((d) => isLockActive(d.currentLock));

  const readyDonorsCount = useMemo(() => {
    return activeDonorsList.filter((d) => isDonorEligible(d.lastDonationDate)).length;
  }, [activeDonorsList]);

  return (
    <div className="space-y-5">
      {/* Compact Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-rose-700 via-rose-800 to-red-950 p-4 sm:p-5 text-white shadow-lg border border-rose-500/30">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Badhon Logo Badge */}
            <div className="size-11 sm:size-12 rounded-xl bg-slate-900/90 border border-white/20 p-2 flex items-center justify-center shadow-md shrink-0">
              <Image
                src="/images/logo/logo-icon.svg"
                width={36}
                height={36}
                alt="Badhon Logo"
                style={{ width: "auto", height: "auto" }}
                priority
              />
            </div>

            <div className="space-y-0.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold backdrop-blur-xs">
                  <Building2 className="w-3 h-3" />
                  <span>{currentVolunteer.hallUnit}</span>
                </span>
                <span className="text-[11px] text-rose-200">
                  Duty: <strong>{currentVolunteer.name} ({currentVolunteer.role})</strong>
                </span>
              </div>

              <h1 className="text-lg sm:text-xl font-black tracking-tight">
                {currentVolunteer.hallUnit} Unit Coordination
              </h1>

              <p className="text-xs text-rose-100 font-medium line-clamp-1">
                <strong className="text-amber-300">
                  {activeRequests.length} active emergency requests
                </strong>{" "}
                ({totalBagsNeeded} bags needed) across DU today.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
            <Link
              href="/blood-requests?new=true"
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-rose-800 hover:bg-rose-50 text-xs font-black shadow-sm transition active:scale-95"
            >
              <Plus className="size-3.5 text-rose-800" />
              <span>New Request</span>
            </Link>
            <Link
              href="/search-blood"
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-950/80 hover:bg-rose-950 text-white text-xs font-bold border border-rose-500/40 transition"
            >
              <Search className="size-3.5" />
              <span>Search</span>
            </Link>
          </div>
        </div>

        {/* Scope Selector Bar */}
        <div className="relative z-10 mt-3 pt-2.5 border-t border-white/15 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-rose-200 font-medium">Viewing Metrics:</span>
            <div className="inline-flex p-1 rounded-xl bg-black/30 backdrop-blur-md border border-white/10">
              <button
                onClick={() => setViewScope("hall")}
                className={`px-3 py-1 rounded-lg font-bold transition ${
                  viewScope === "hall"
                    ? "bg-rose-600 text-white shadow-xs"
                    : "text-rose-200 hover:text-white"
                }`}
              >
                My Hall ({currentVolunteer.hallUnit.split(" ")[0]})
              </button>
              <button
                onClick={() => setViewScope("campus")}
                className={`px-3 py-1 rounded-lg font-bold transition ${
                  viewScope === "campus"
                    ? "bg-rose-600 text-white shadow-xs"
                    : "text-rose-200 hover:text-white"
                }`}
              >
                All 16 DU Halls
              </button>
            </div>
          </div>

          <Link
            href="/hall-units"
            className="inline-flex items-center gap-1.5 text-rose-200 hover:text-white font-bold transition"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Contact Other Hall Executives →</span>
          </Link>
        </div>

        {/* Decorative background glows */}
        <div className="absolute -right-10 -bottom-10 size-60 rounded-full bg-rose-500/10 pointer-events-none" />
        <div className="absolute right-40 -top-10 size-40 rounded-full bg-rose-400/10 pointer-events-none" />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-dark-2 p-5 rounded-2xl border border-stroke dark:border-dark-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-dark-5 dark:text-dark-6 font-bold uppercase tracking-wider">
              Emergency Requests
            </span>
            <span className="size-9 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center font-black">
              <AlertOctagon className="size-4.5" />
            </span>
          </div>
          <p className="text-3xl font-black text-rose-600 dark:text-rose-400 mt-2">
            {activeRequests.length}
          </p>
          <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold mt-1">
            {totalBagsNeeded} bags currently needed
          </p>
        </div>

        <div className="bg-white dark:bg-dark-2 p-5 rounded-2xl border border-stroke dark:border-dark-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-dark-5 dark:text-dark-6 font-bold uppercase tracking-wider">
              Bags Managed Today
            </span>
            <span className="size-9 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center font-black">
              <Droplet className="size-4.5" />
            </span>
          </div>
          <p className="text-3xl font-black text-blue-600 dark:text-blue-400 mt-2">
            {totalBagsManaged}
          </p>
          <p className="text-xs text-dark-5 dark:text-dark-6 mt-1">Donors assigned to bag slots</p>
        </div>

        <div className="bg-white dark:bg-dark-2 p-5 rounded-2xl border border-stroke dark:border-dark-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-dark-5 dark:text-dark-6 font-bold uppercase tracking-wider">
              {viewScope === "hall" ? "Ready in My Hall" : "Ready Donors (90d+)"}
            </span>
            <span className="size-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-black">
              <ShieldCheck className="size-4.5" />
            </span>
          </div>
          <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-2">
            {readyDonorsCount}
          </p>
          <p className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold mt-1">
            {viewScope === "hall" ? `Of ${hallDonors.length} registered donors` : "Available across DU halls"}
          </p>
        </div>

        <div className="bg-white dark:bg-dark-2 p-5 rounded-2xl border border-stroke dark:border-dark-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-dark-5 dark:text-dark-6 font-bold uppercase tracking-wider">
              Active Call Locks
            </span>
            <span className="size-9 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center font-black">
              <Lock className="size-4.5" />
            </span>
          </div>
          <p className="text-3xl font-black text-amber-600 dark:text-amber-400 mt-2">
            {activeInCallDonors.length}
          </p>
          <p className="text-xs text-dark-5 dark:text-dark-6 mt-1">Volunteers currently on call</p>
        </div>
      </div>

      {/* Live Caller Lock Alert Banner */}
      {activeInCallDonors.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 dark:bg-amber-950/30 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="size-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="font-bold text-amber-800 dark:text-amber-300">
              Live Calling in Progress:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {activeInCallDonors.map((d) => {
                const isMe = d.currentLock?.lockedByVolunteerId === currentVolunteer.id;
                const remSecs = d.currentLock?.expiresAt
                  ? Math.max(
                      0,
                      Math.floor(
                        (new Date(d.currentLock.expiresAt).getTime() - Date.now()) / 1000,
                      ),
                    )
                  : null;
                const remStr =
                  remSecs != null
                    ? ` (${Math.floor(remSecs / 60)}:${(remSecs % 60).toString().padStart(2, "0")})`
                    : "";

                return (
                  <button
                    key={d.id}
                    onClick={() => setActiveCallingModalDonor(d)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      isMe
                        ? "bg-amber-500 text-white hover:bg-amber-600 shadow-xs"
                        : "bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200 hover:bg-amber-200 dark:hover:bg-amber-900/60"
                    }`}
                  >
                    <Lock className="size-3" />
                    <span>
                      {isMe ? "You are calling" : `${d.currentLock?.lockedByVolunteerName} calling`}{" "}
                      <strong>{d.name}</strong> ({d.bloodGroup}){remStr}
                    </span>
                    <span className="underline ml-1">
                      {isMe ? "Resume Console →" : "View →"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          <Link
            href="/donors"
            className="text-amber-700 dark:text-amber-400 font-bold hover:underline shrink-0"
          >
            View Directory →
          </Link>
        </div>
      )}

      {/* Blood Group Availability & Demand Matrix */}
      <div className="bg-white dark:bg-dark-2 p-6 rounded-3xl border border-stroke dark:border-dark-3 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div>
            <h2 className="text-lg font-bold text-dark dark:text-white flex items-center gap-2">
              <Activity className="size-5 text-rose-600" />
              <span>Blood Group Supply vs Emergency Demand</span>
            </h2>
            <p className="text-xs text-dark-5 dark:text-dark-6 mt-0.5">
              Available donors ready to donate (90 days elapsed since last donation) vs active bags required.
            </p>
          </div>

          <Link
            href="/search-blood"
            className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400"
          >
            <span>Open Donor Matcher</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {BLOOD_GROUPS.map((bg) => {
            const stat = groupStats[bg] || { ready: 0, needed: 0, hallReady: 0 };
            const isHighDemand = stat.needed > stat.ready;
            const displayReady = viewScope === "hall" ? stat.hallReady : stat.ready;

            return (
              <Link
                key={bg}
                href={`/search-blood?group=${encodeURIComponent(bg)}`}
                className={`p-3.5 rounded-2xl border text-center transition hover:scale-105 ${
                  isHighDemand
                    ? "bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-900"
                    : "bg-gray-1 dark:bg-dark-3/60 border-stroke dark:border-dark-3"
                }`}
              >
                <div className="inline-block px-2 py-0.5 rounded-lg bg-rose-600 text-white font-black text-xs shadow-xs mb-2">
                  {bg}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                    <span>{displayReady} ready</span>
                  </div>
                  {stat.needed > 0 ? (
                    <div className="flex items-center justify-center gap-1 text-[11px] font-black text-rose-600 dark:text-rose-400">
                      <span className="size-1.5 rounded-full bg-rose-500 animate-ping" />
                      <span>{stat.needed} needed</span>
                    </div>
                  ) : (
                    <div className="text-[10px] text-dark-5 dark:text-dark-6">No request</div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Urgent Blood Requests Waiting for Donors */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HeartHandshake className="size-5 text-rose-600" />
            <h2 className="text-lg font-bold text-dark dark:text-white">
              Critical Blood Requests Waiting for Donors
            </h2>
          </div>
          <Link
            href="/blood-requests"
            className="text-xs font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400 flex items-center gap-1"
          >
            <span>View All ({bloodRequests.length})</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        {activeRequests.length === 0 ? (
          <div className="bg-white dark:bg-dark-2 p-10 rounded-3xl border border-stroke dark:border-dark-3 text-center space-y-3">
            <div className="size-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="size-6" />
            </div>
            <h3 className="font-bold text-dark dark:text-white">All Emergency Requests Managed!</h3>
            <p className="text-xs text-dark-5 dark:text-dark-6 max-w-md mx-auto">
              There are currently no unfilled emergency requests on the board. Excellent work!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {activeRequests.slice(0, 6).map((req) => (
              <RequestCard
                key={req.id}
                request={req}
                onOpenDetails={(r: BloodRequest) => setSelectedRequest(r)}
                onMarkCompleted={(reqId: string) => markRequestCompleted(reqId)}
                onCancelRequest={(reqId: string) => markRequestCancelled(reqId, "Cancelled from dashboard")}
              />
            ))}
          </div>
        )}
      </div>

      {/* Request Details & Fulfillment Modal */}
      {selectedRequest && (
        <RequestDetailsModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onUnassignBag={(reqId: string, bagNumber: number) => {
            unassignDonorFromBag(reqId, bagNumber);
            setSelectedRequest((prev) =>
              prev
                ? {
                    ...prev,
                    managedBags: Math.max(0, prev.managedBags - 1),
                    assignedBags: prev.assignedBags.map((b) =>
                      b.bagNumber === bagNumber
                        ? { bagNumber, status: "pending" as const }
                        : b,
                    ),
                  }
                : null,
            );
          }}
          onMarkCompleted={(reqId: string) => {
            markRequestCompleted(reqId);
            setSelectedRequest(null);
          }}
          onCancelRequest={(reqId: string, reason: string) => {
            markRequestCancelled(reqId, reason);
            setSelectedRequest(null);
          }}
        />
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-xs">Loading Dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
