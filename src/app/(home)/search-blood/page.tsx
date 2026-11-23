"use client";

import { CallDonorModal } from "@/components/Donors/CallDonorModal";
import { DonorCard } from "@/components/Donors/DonorCard";
import { useBadhon } from "@/context/badhon-context";
import { BloodGroup, Donor, HallUnit } from "@/types/badhon";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useMemo, useState } from "react";

const BLOOD_GROUPS: BloodGroup[] = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const HALL_UNITS: HallUnit[] = [
  "Fazlul Huq Muslim Hall",
  "Shahidullah Hall",
  "Amar Ekushey Hall",
  "Jagannath Hall",
  "Bangabandhu Sheikh Mujibur Rahman Hall",
  "Kabi Jasimuddin Hall",
  "Bijoy Ekattor Hall",
  "Ziaur Rahman Hall",
  "Surja Sen Hall",
  "Haji Muhammad Mohsin Hall",
  "Salimullah Muslim Hall",
  "Ruqayyah Hall",
  "Shamsun Nahar Hall",
  "Kabi Sufia Kamal Hall",
  "Bangladesh-Kuwait Maitree Hall",
  "Fazilatunnesa Mujib Hall",
];

function SearchBloodContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { donors, bloodRequests, startCallingDonor, assignDonorToBag } = useBadhon();

  const requestIdParam = searchParams.get("requestId");
  const groupParam = searchParams.get("group");
  const bagNumberParam = searchParams.get("bagNumber");

  const [selectedGroup, setSelectedGroup] = useState<string>(groupParam || "all");
  const [selectedHall, setSelectedHall] = useState<string>("all");
  const [eligibilityFilter, setEligibilityFilter] = useState<string>("ready");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCallDonor, setActiveCallDonor] = useState<Donor | null>(null);

  // Active target blood request if linked
  const targetRequest = useMemo(() => {
    if (!requestIdParam) return null;
    return bloodRequests.find((r) => r.id === requestIdParam) || null;
  }, [requestIdParam, bloodRequests]);

  const targetBagNumber = bagNumberParam ? parseInt(bagNumberParam) : 1;

  // Filtered donors
  const filteredDonors = useMemo(() => {
    return donors.filter((donor) => {
      // Blood Group
      if (selectedGroup !== "all" && donor.bloodGroup !== selectedGroup) {
        return false;
      }

      // Hall Unit
      if (selectedHall !== "all" && donor.hallUnit !== selectedHall) {
        return false;
      }

      // Eligibility
      if (eligibilityFilter === "ready") {
        if (!donor.lastDonationDate) return true;
        const diffDays = Math.ceil(
          Math.abs(Date.now() - new Date(donor.lastDonationDate).getTime()) /
            (1000 * 60 * 60 * 24),
        );
        if (diffDays < 90) return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = donor.name.toLowerCase().includes(q);
        const matchesDept = donor.department.toLowerCase().includes(q);
        const matchesSession = donor.session.toLowerCase().includes(q);
        const matchesPhone = donor.phone.includes(q);
        if (!matchesName && !matchesDept && !matchesSession && !matchesPhone) {
          return false;
        }
      }

      return true;
    });
  }, [donors, selectedGroup, selectedHall, eligibilityFilter, searchQuery]);

  const handleStartCall = (donor: Donor) => {
    const res = startCallingDonor(donor.id);
    if (!res.success) {
      alert(res.message);
      return;
    }
    setActiveCallDonor(donor);
  };

  const handleQuickAssign = (donor: Donor) => {
    if (!targetRequest) return;
    const res = assignDonorToBag(targetRequest.id, targetBagNumber, donor.id);
    if (res.success) {
      alert(
        `Assigned ${donor.name} to ${targetRequest.hospital} (Bag #${targetBagNumber}) successfully!`,
      );
      router.push("/blood-requests");
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Target Request Banner (if searching for a specific request) */}
      {targetRequest && (
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 rounded-2xl p-5 text-white shadow-md border border-blue-600 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
                Active Search Target: {targetRequest.id}
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-600">
                {targetRequest.bloodGroup} {targetRequest.isPlasma ? "Plasma" : "Blood"}
              </span>
            </div>
            <h2 className="text-lg font-black">{targetRequest.hospital}</h2>
            <p className="text-xs text-blue-100 mt-0.5">
              Patient: <strong>{targetRequest.patientName}</strong> ({targetRequest.reason}) • Fulfilling Bag #{targetBagNumber}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/blood-requests"
              className="px-3.5 py-2 rounded-xl bg-white/20 text-white hover:bg-white/30 text-xs font-bold transition"
            >
              Back to Requests
            </Link>
          </div>
        </div>
      )}

      {/* Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-dark dark:text-white flex items-center gap-2">
            <span>🔍 Search Blood Donors</span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400">
              DU Hall Registry
            </span>
          </h1>
          <p className="text-xs text-dark-5 dark:text-dark-6 mt-1">
            Find eligible Dhaka University student donors, initiate locked phone calls, and log feedback comments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/donors"
            className="px-4 py-2 rounded-xl bg-white dark:bg-dark-2 border border-stroke dark:border-dark-3 text-xs font-bold text-dark dark:text-white hover:bg-gray-1 dark:hover:bg-dark-3 transition"
          >
            All Donors Directory
          </Link>
          <Link
            href="/blood-requests?new=true"
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm transition"
          >
            + Record Request
          </Link>
        </div>
      </div>

      {/* Advanced Filter Box */}
      <div className="bg-white dark:bg-dark-2 p-5 rounded-2xl border border-stroke dark:border-dark-3 shadow-xs space-y-4">
        {/* Blood Group Select Pills */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-dark dark:text-white">
              Filter by Blood Group:
            </label>
            {selectedGroup !== "all" && (
              <button
                onClick={() => setSelectedGroup("all")}
                className="text-xs text-rose-600 dark:text-rose-400 font-bold hover:underline"
              >
                Reset to All Groups
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedGroup("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedGroup === "all"
                  ? "bg-dark text-white dark:bg-white dark:text-dark shadow-xs"
                  : "bg-gray-2 text-dark-5 dark:bg-dark-3 dark:text-dark-6 hover:bg-gray-3"
              }`}
            >
              All Groups
            </button>
            {BLOOD_GROUPS.map((bg) => (
              <button
                key={bg}
                onClick={() => setSelectedGroup(bg)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition ${
                  selectedGroup === bg
                    ? "bg-rose-600 text-white shadow-sm ring-2 ring-rose-400/50"
                    : "bg-gray-2 text-dark-5 dark:bg-dark-3 dark:text-dark-6 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"
                }`}
              >
                {bg}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-stroke dark:border-dark-3">
          <div>
            <label className="block text-[11px] font-bold text-dark-5 dark:text-dark-6 mb-1">
              Dhaka University Hall Unit:
            </label>
            <select
              value={selectedHall}
              onChange={(e) => setSelectedHall(e.target.value)}
              className="w-full rounded-xl border border-stroke bg-gray-1 dark:bg-dark-3 px-3 py-2 text-xs text-dark dark:text-white outline-none focus:border-rose-600"
            >
              <option value="all">All Hall Units (16 Halls)</option>
              {HALL_UNITS.map((hall) => (
                <option key={hall} value={hall}>
                  {hall}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-dark-5 dark:text-dark-6 mb-1">
              Donation Eligibility Status:
            </label>
            <select
              value={eligibilityFilter}
              onChange={(e) => setEligibilityFilter(e.target.value)}
              className="w-full rounded-xl border border-stroke bg-gray-1 dark:bg-dark-3 px-3 py-2 text-xs text-dark dark:text-white outline-none focus:border-rose-600"
            >
              <option value="ready">Ready to Donate (90+ Days Cooldown)</option>
              <option value="all">All Donors (Including Cooldown)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-dark-5 dark:text-dark-6 mb-1">
              Search by Keyword:
            </label>
            <input
              type="text"
              placeholder="Search donor name, dept, session..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-stroke bg-gray-1 dark:bg-dark-3 px-3 py-2 text-xs text-dark dark:text-white outline-none focus:border-rose-600"
            />
          </div>
        </div>
      </div>

      {/* Results Count & Call Lock Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2 px-1">
        <p className="text-dark-5 dark:text-dark-6 font-medium">
          Found <strong>{filteredDonors.length}</strong> donors matching criteria
        </p>

        <div className="flex items-center gap-3 text-[11px] text-dark-5 dark:text-dark-6">
          <span className="flex items-center gap-1">
            <span className="size-2 rounded-full bg-emerald-500 inline-block" />
            <span>Ready to Donate</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="size-2 rounded-full bg-amber-500 inline-block" />
            <span>Locked / In Call with Volunteer</span>
          </span>
        </div>
      </div>

      {/* Donors Grid */}
      {filteredDonors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDonors.map((donor) => (
            <DonorCard
              key={donor.id}
              donor={donor}
              onCall={handleStartCall}
              onQuickAssign={targetRequest ? handleQuickAssign : undefined}
              activeRequestId={targetRequest?.id}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-dark-2 p-12 rounded-2xl border border-stroke dark:border-dark-3 text-center space-y-3">
          <span className="text-4xl block">🩸</span>
          <h3 className="text-base font-bold text-dark dark:text-white">
            No donors found matching the selected filters
          </h3>
          <p className="text-xs text-dark-5 dark:text-dark-6 max-w-sm mx-auto">
            Try switching to &quot;All Hall Units&quot; or expanding eligibility to include donors in recent cooldown.
          </p>
          <button
            onClick={() => {
              setSelectedGroup("all");
              setSelectedHall("all");
              setEligibilityFilter("all");
              setSearchQuery("");
            }}
            className="text-xs font-bold text-rose-600 hover:underline"
          >
            Reset all filters
          </button>
        </div>
      )}

      {/* Call & Lock Modal */}
      <CallDonorModal
        donor={activeCallDonor}
        activeRequestId={targetRequest?.id}
        activeBagNumber={targetBagNumber}
        onClose={() => setActiveCallDonor(null)}
      />
    </div>
  );
}

export default function SearchBloodPage() {
  return (
    <Suspense>
      <SearchBloodContent />
    </Suspense>
  );
}
