"use client";

import { RequestCard } from "@/components/BloodRequests/RequestCard";
import { RequestDetailsModal } from "@/components/BloodRequests/RequestDetailsModal";
import { useBadhon } from "@/context/badhon-context";
import { BloodGroup, BloodRequest } from "@/types/badhon";
import {
  Activity,
  AlertOctagon,
  ArrowRight,
  CheckCircle2,
  Droplet,
  HeartHandshake,
  Lock,
  PartyPopper,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useMemo, useState } from "react";

const BLOOD_GROUPS: BloodGroup[] = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

function DashboardContent() {
  const searchParams = useSearchParams();
  const unitFilter = searchParams.get("unit");

  const {
    currentVolunteer,
    bloodRequests,
    donors,
    unassignDonorFromBag,
    markRequestCompleted,
    markRequestCancelled,
  } = useBadhon();

  const [selectedRequest, setSelectedRequest] = useState<BloodRequest | null>(null);

  // Active requests needing fulfillment
  const activeRequests = useMemo(() => {
    return bloodRequests.filter(
      (r) => r.status === "active" || r.status === "partially_managed",
    );
  }, [bloodRequests]);

  // Donors filtered by unit if specified
  const filteredDonors = useMemo(() => {
    if (!unitFilter) return donors;
    return donors.filter((d) => d.hallUnit.toLowerCase().includes(unitFilter.toLowerCase()));
  }, [donors, unitFilter]);

  // Blood group availability map
  const groupStats = useMemo(() => {
    const stats: Record<string, { ready: number; needed: number }> = {};
    BLOOD_GROUPS.forEach((bg) => {
      const ready = filteredDonors.filter((d) => {
        if (d.bloodGroup !== bg) return false;
        if (!d.lastDonationDate) return true;
        const diffDays = Math.ceil(
          Math.abs(Date.now() - new Date(d.lastDonationDate).getTime()) /
            (1000 * 60 * 60 * 24),
        );
        return diffDays >= 90;
      }).length;

      const needed = activeRequests
        .filter((r) => r.bloodGroup === bg)
        .reduce((sum, r) => sum + (r.totalBags - r.managedBags), 0);

      stats[bg] = { ready, needed };
    });
    return stats;
  }, [filteredDonors, activeRequests]);

  // Overall metrics
  const totalBagsNeeded = activeRequests.reduce(
    (sum, r) => sum + (r.totalBags - r.managedBags),
    0,
  );
  const totalBagsManaged = activeRequests.reduce((sum, r) => sum + r.managedBags, 0);
  const activeInCallDonors = donors.filter((d) => d.currentLock != null);

  const readyDonorsCount = useMemo(() => {
    return filteredDonors.filter((d) => {
      if (!d.lastDonationDate) return true;
      const diffDays = Math.ceil(
        Math.abs(Date.now() - new Date(d.lastDonationDate).getTime()) /
          (1000 * 60 * 60 * 24),
      );
      return diffDays >= 90;
    }).length;
  }, [filteredDonors]);

  return (
    <div className="space-y-7">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-700 via-rose-800 to-red-950 p-6 md:p-8 text-white shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3.5 py-1 text-xs font-bold backdrop-blur-xs">
              <span className="flex size-2 rounded-full bg-emerald-400 animate-ping" />
              <span>DU Badhon Operations Live</span>
              {unitFilter && <span>• {unitFilter}</span>}
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
              Welcome back, {currentVolunteer.name}!
            </h1>
            <p className="text-xs md:text-sm text-rose-100 font-medium leading-relaxed">
              You are on duty representing <strong>{currentVolunteer.hallUnit}</strong>. There are{" "}
              <strong className="text-amber-300 underline underline-offset-2">
                {activeRequests.length} active emergency blood requests
              </strong>{" "}
              requiring {totalBagsNeeded} blood bags today.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
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
              Ready Donors (90d+)
            </span>
            <span className="size-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-black">
              <ShieldCheck className="size-4.5" />
            </span>
          </div>
          <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-2">
            {readyDonorsCount}
          </p>
          <p className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold mt-1">
            Available across halls
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
          <p className="text-xs text-amber-700 dark:text-amber-400 font-semibold mt-1">
            Members investigating
          </p>
        </div>
      </div>

      {/* Blood Group Supply & Demand Grid */}
      <div className="bg-white dark:bg-dark-2 p-5 rounded-2xl border border-stroke dark:border-dark-3 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-dark dark:text-white flex items-center gap-1.5">
              <Droplet className="size-4 text-rose-600" />
              <span>Blood Group Availability & Immediate Demand</span>
            </h2>
            <p className="text-xs text-dark-5 dark:text-dark-6">
              Instant snapshot of ready donors vs. immediate bags required across Dhaka
            </p>
          </div>
          <Link
            href="/search-blood"
            className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline inline-flex items-center gap-1"
          >
            <span>Open Full Search</span>
            <ArrowRight className="size-3" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 pt-2">
          {BLOOD_GROUPS.map((bg) => {
            const data = groupStats[bg];
            const hasUrgentDemand = data.needed > 0;
            return (
              <Link
                key={bg}
                href={`/search-blood?group=${encodeURIComponent(bg)}`}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center transition group hover:scale-102 ${
                  hasUrgentDemand
                    ? "bg-rose-50/80 dark:bg-rose-950/20 border-rose-300 dark:border-rose-900 shadow-xs"
                    : "bg-gray-1 dark:bg-dark-3 border-stroke dark:border-dark-4 hover:border-rose-400"
                }`}
              >
                <span className="text-base font-black text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform">
                  {bg}
                </span>
                <span className="text-xs font-bold text-dark dark:text-white mt-1">
                  {data.ready} Ready
                </span>
                {hasUrgentDemand ? (
                  <span className="text-[10px] font-bold text-rose-700 dark:text-rose-400 bg-rose-200/80 dark:bg-rose-900/60 px-1.5 py-0.2 rounded-md mt-1 animate-pulse">
                    Need {data.needed}
                  </span>
                ) : (
                  <span className="text-[10px] text-gray-5 mt-1">In Supply</span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Active Blood Requests Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-dark dark:text-white flex items-center gap-2">
              <HeartHandshake className="size-5 text-rose-600" />
              <span>Active Blood Requests</span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400">
                {activeRequests.length} Requiring Attention
              </span>
            </h2>
            <p className="text-xs text-dark-5 dark:text-dark-6">
              Click &quot;Start Search&quot; to coordinate calls and assign donors directly to open bag slots
            </p>
          </div>

          <Link
            href="/blood-requests"
            className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline inline-flex items-center gap-1"
          >
            <span>View All Requests ({bloodRequests.length})</span>
            <ArrowRight className="size-3" />
          </Link>
        </div>

        {activeRequests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {activeRequests.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                onOpenDetails={(req) => setSelectedRequest(req)}
                onMarkCompleted={(id) => markRequestCompleted(id)}
                onCancelRequest={(id) => {
                  const reason = prompt("Enter cancellation reason:");
                  if (reason) markRequestCancelled(id, reason);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-dark-2 p-10 rounded-2xl border border-stroke dark:border-dark-3 text-center space-y-2">
            <PartyPopper className="size-8 text-rose-500 mx-auto" />
            <p className="text-sm font-bold text-dark dark:text-white">
              All blood requests are currently managed or completed!
            </p>
            <p className="text-xs text-dark-5 dark:text-dark-6">
              Great job Badhon volunteers. New incoming requests will appear here.
            </p>
          </div>
        )}
      </div>

      {/* Active In-Call Locking Ticker */}
      {activeInCallDonors.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-2xl border border-amber-300 dark:border-amber-900/50 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-300">
            <span className="size-2 rounded-full bg-amber-500 animate-ping" />
            <Lock className="size-3.5" />
            <span>Currently Active Volunteer Calls ({activeInCallDonors.length} Donors Locked):</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {activeInCallDonors.map((d) => (
              <div
                key={d.id}
                className="bg-white dark:bg-dark-2 px-3 py-1.5 rounded-xl border border-amber-200 dark:border-amber-900 text-xs flex items-center gap-2 shadow-xs"
              >
                <span className="font-bold text-rose-600 dark:text-rose-400">{d.bloodGroup}</span>
                <span className="font-semibold text-dark dark:text-white">{d.name}</span>
                <span className="text-[10px] text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-1.5 py-0.5 rounded-md font-medium inline-flex items-center gap-1">
                  <Lock className="size-2.5" />
                  <span>{d.currentLock?.lockedByVolunteerName} is calling</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Request Details Modal */}
      <RequestDetailsModal
        request={selectedRequest}
        onClose={() => setSelectedRequest(null)}
        onUnassignBag={(reqId, bagNum) => {
          unassignDonorFromBag(reqId, bagNum);
          setSelectedRequest((prev) =>
            prev && prev.id === reqId
              ? {
                  ...prev,
                  managedBags: Math.max(0, prev.managedBags - 1),
                  assignedBags: prev.assignedBags.map((b) =>
                    b.bagNumber === bagNum
                      ? { bagNumber: bagNum, status: "pending" as const }
                      : b,
                  ),
                }
              : prev,
          );
        }}
        onMarkCompleted={(reqId, note) => {
          markRequestCompleted(reqId, note);
        }}
        onCancelRequest={(reqId, reason) => {
          markRequestCancelled(reqId, reason);
        }}
      />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense>
      <DashboardContent />
    </Suspense>
  );
}
