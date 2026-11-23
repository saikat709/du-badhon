"use client";

import { RequestCard } from "@/components/BloodRequests/RequestCard";
import { RequestDetailsModal } from "@/components/BloodRequests/RequestDetailsModal";
import { useBadhon, isDonorEligible, isLockActive } from "@/context/badhon-context";
import { BloodGroup, BloodRequest, isRequestVisibleToUnit } from "@/types/badhon";
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

const BLOOD_GROUPS: BloodGroup[] = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

function DashboardContent() {
  const {
    currentVolunteer,
    bloodRequests,
    donors,
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
    <div className="space-y-7">
      {/* Welcome Banner with Badhon Logo */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-700 via-rose-800 to-red-950 p-6 md:p-8 text-white shadow-xl border border-rose-500/30">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            {/* Badhon Logo Badge */}
            <div className="w-16 h-16 rounded-2xl bg-slate-900/90 border border-white/20 p-2.5 flex items-center justify-center shadow-2xl shrink-0">
              <Image
                src="/images/logo/logo-icon.svg"
                width={44}
                height={44}
                alt="Badhon Logo"
                style={{ width: "auto", height: "auto" }}
                priority
              />
            </div>

            <div className="space-y-1.5 max-w-xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-xs">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{currentVolunteer.hallUnit} Unit</span>
                </span>
                <span className="text-xs text-rose-200">
                  Duty Executive: <strong>{currentVolunteer.name} ({currentVolunteer.role})</strong>
                </span>
              </div>

              <h1 className="text-2xl md:text-3xl font-black tracking-tight">
                {currentVolunteer.hallUnit} Dashboard
              </h1>

              <p className="text-xs md:text-sm text-rose-100 font-medium leading-relaxed">
                Managing voluntary blood donors for <strong>{currentVolunteer.hallUnit}</strong>. There are{" "}
                <strong className="text-amber-300 underline underline-offset-2">
                  {activeRequests.length} active emergency requests
                </strong>{" "}
                requiring {totalBagsNeeded} blood bags across DU today.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/blood-requests?new=true"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-rose-800 hover:bg-rose-50 text-xs font-black shadow-md transition active:scale-95"
            >
              <Plus className="size-4 text-rose-800" />
              <span>Record Blood Request</span>
            </Link>
            <Link
              href="/search-blood"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-rose-950/80 hover:bg-rose-950 text-white text-xs font-bold border border-rose-500/40 transition"
            >
              <Search className="size-4" />
              <span>Search Donors</span>
            </Link>
          </div>
        </div>

        {/* Scope Selector Bar */}
        <div className="relative z-10 mt-6 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-3 text-xs">
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
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 dark:bg-amber-950/30 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="size-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="font-bold text-amber-800 dark:text-amber-300">
              Live Calling in Progress:
            </span>
            <span className="text-dark-5 dark:text-dark-6">
              {activeInCallDonors.map((d) => (
                <span
                  key={d.id}
                  className="inline-block mr-2 px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200 font-medium"
                >
                  🔒 {d.currentLock?.lockedByVolunteerName} calling {d.name} ({d.bloodGroup})
                </span>
              ))}
            </span>
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
