"use client";

import { NewRequestModal } from "@/components/BloodRequests/NewRequestModal";
import { RequestCard } from "@/components/BloodRequests/RequestCard";
import { RequestDetailsModal } from "@/components/BloodRequests/RequestDetailsModal";
import { useBadhon } from "@/context/badhon-context";
import { BloodGroup, BloodRequest } from "@/types/badhon";
import {
  Droplet,
  HeartHandshake,
  Plus,
  Search,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useMemo, useState } from "react";

const BLOOD_GROUPS: BloodGroup[] = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

function BloodRequestsContent() {
  const searchParams = useSearchParams();
  const {
    bloodRequests,
    addBloodRequest,
    unassignDonorFromBag,
    markRequestCompleted,
    markRequestCancelled,
  } = useBadhon();

  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<BloodRequest | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [groupFilter, setGroupFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Auto-open modal if ?new=true query parameter is present
  useEffect(() => {
    if (searchParams.get("new") === "true") {
      setIsNewModalOpen(true);
    }
  }, [searchParams]);

  // Derived filtered requests
  const filteredRequests = useMemo(() => {
    return bloodRequests.filter((req) => {
      // Status filter
      if (statusFilter === "active" && req.status !== "active" && req.status !== "partially_managed") {
        return false;
      }
      if (statusFilter === "managed" && req.status !== "managed") return false;
      if (statusFilter === "completed" && req.status !== "completed") return false;
      if (statusFilter === "cancelled" && req.status !== "cancelled") return false;

      // Group filter
      if (groupFilter !== "all" && req.bloodGroup !== groupFilter) return false;

      // Text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesHospital = req.hospital.toLowerCase().includes(q);
        const matchesPatient = req.patientName.toLowerCase().includes(q);
        const matchesReason = req.reason.toLowerCase().includes(q);
        const matchesPhone = req.contactPhone.includes(q);
        const matchesId = req.id.toLowerCase().includes(q);
        if (!matchesHospital && !matchesPatient && !matchesReason && !matchesPhone && !matchesId) {
          return false;
        }
      }

      return true;
    });
  }, [bloodRequests, statusFilter, groupFilter, searchQuery]);

  // Stats calculation
  const stats = useMemo(() => {
    const total = bloodRequests.length;
    const active = bloodRequests.filter(
      (r) => r.status === "active" || r.status === "partially_managed",
    ).length;
    const managed = bloodRequests.filter((r) => r.status === "managed").length;
    const completed = bloodRequests.filter((r) => r.status === "completed").length;
    const totalBagsNeeded = bloodRequests
      .filter((r) => r.status === "active" || r.status === "partially_managed")
      .reduce((sum, r) => sum + (r.totalBags - r.managedBags), 0);
    return { total, active, managed, completed, totalBagsNeeded };
  }, [bloodRequests]);

  return (
    <div className="space-y-6">
      {/* Page Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-dark dark:text-white flex items-center gap-2">
            <HeartHandshake className="size-7 text-rose-600" />
            <span>Blood & Plasma Requests</span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400">
              DU Badhon Unit
            </span>
          </h1>
          <p className="text-xs text-dark-5 dark:text-dark-6 mt-1">
            Track active emergency blood requirements across hospitals and coordinate donor assignments.
          </p>
        </div>

        <button
          onClick={() => setIsNewModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm transition active:scale-95"
        >
          <Plus className="size-4" />
          <span>Record New Blood Request</span>
        </button>
      </div>

      {/* Metrics Header */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-dark-2 p-4 rounded-xl border border-stroke dark:border-dark-3 shadow-xs">
          <p className="text-xs text-dark-5 dark:text-dark-6 font-medium">Active Requests</p>
          <p className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">
            {stats.active}
          </p>
          <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold mt-0.5">
            {stats.totalBagsNeeded} bags currently needed
          </p>
        </div>

        <div className="bg-white dark:bg-dark-2 p-4 rounded-xl border border-stroke dark:border-dark-3 shadow-xs">
          <p className="text-xs text-dark-5 dark:text-dark-6 font-medium">Ready / Managed</p>
          <p className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">
            {stats.managed}
          </p>
          <p className="text-[11px] text-dark-5 dark:text-dark-6 mt-0.5">Donors locked & confirmed</p>
        </div>

        <div className="bg-white dark:bg-dark-2 p-4 rounded-xl border border-stroke dark:border-dark-3 shadow-xs">
          <p className="text-xs text-dark-5 dark:text-dark-6 font-medium">Successfully Donated</p>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {stats.completed}
          </p>
          <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold mt-0.5">
            Completed donations
          </p>
        </div>

        <div className="bg-white dark:bg-dark-2 p-4 rounded-xl border border-stroke dark:border-dark-3 shadow-xs">
          <p className="text-xs text-dark-5 dark:text-dark-6 font-medium">Total Recorded</p>
          <p className="text-2xl font-black text-dark dark:text-white mt-1">{stats.total}</p>
          <p className="text-[11px] text-dark-5 dark:text-dark-6 mt-0.5">All time records</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-dark-2 p-4 rounded-2xl border border-stroke dark:border-dark-3 space-y-3 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {[
              { id: "all", label: "All Requests" },
              { id: "active", label: `Active (${stats.active})` },
              { id: "managed", label: `Managed (${stats.managed})` },
              { id: "completed", label: `Completed (${stats.completed})` },
              { id: "cancelled", label: "Cancelled" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  statusFilter === tab.id
                    ? "bg-rose-600 text-white shadow-xs"
                    : "text-dark-5 dark:text-dark-6 hover:bg-gray-2 dark:hover:bg-dark-3"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="w-full md:w-72 relative">
            <input
              type="text"
              placeholder="Search hospital, patient, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-stroke bg-gray-1 dark:bg-dark-3 pl-9 pr-3.5 py-2 text-xs text-dark dark:text-white outline-none focus:border-rose-600"
            />
            <Search className="size-3.5 text-gray-4 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Blood Group Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-stroke dark:border-dark-3">
          <span className="text-[11px] font-bold text-dark-5 dark:text-dark-6 mr-1 inline-flex items-center gap-1">
            <Droplet className="size-3 text-rose-500" />
            <span>Group:</span>
          </span>
          <button
            onClick={() => setGroupFilter("all")}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition ${
              groupFilter === "all"
                ? "bg-dark text-white dark:bg-white dark:text-dark"
                : "bg-gray-2 text-dark-5 dark:bg-dark-3 dark:text-dark-6 hover:bg-gray-3"
            }`}
          >
            All
          </button>
          {BLOOD_GROUPS.map((bg) => (
            <button
              key={bg}
              onClick={() => setGroupFilter(bg)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-black transition ${
                groupFilter === bg
                  ? "bg-rose-600 text-white shadow-xs"
                  : "bg-gray-2 text-dark-5 dark:bg-dark-3 dark:text-dark-6 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"
              }`}
            >
              {bg}
            </button>
          ))}
        </div>
      </div>

      {/* Requests Grid */}
      {filteredRequests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRequests.map((request) => (
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
        <div className="bg-white dark:bg-dark-2 p-12 rounded-2xl border border-stroke dark:border-dark-3 text-center space-y-3">
          <Search className="size-10 text-gray-4 mx-auto" />
          <h3 className="text-base font-bold text-dark dark:text-white">
            No blood requests match your current filters
          </h3>
          <p className="text-xs text-dark-5 dark:text-dark-6 max-w-sm mx-auto">
            Try resetting your status or blood group filters, or record a new blood request.
          </p>
          <button
            onClick={() => {
              setStatusFilter("all");
              setGroupFilter("all");
              setSearchQuery("");
            }}
            className="text-xs font-bold text-rose-600 hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* New Request Modal */}
      <NewRequestModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onSubmit={(data) => {
          addBloodRequest(data);
        }}
      />

      {/* Details & Bag Management Modal */}
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

export default function BloodRequestsPage() {
  return (
    <Suspense>
      <BloodRequestsContent />
    </Suspense>
  );
}
