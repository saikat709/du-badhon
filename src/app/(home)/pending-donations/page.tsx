"use client";

import { useBadhon } from "@/context/badhon-context";
import { ALL_BLOOD_GROUPS, ALL_HALL_UNITS, BloodGroup, HallUnit } from "@/types/badhon";
import { getSafeTelUri } from "@/utils/security";
import {
  AlertTriangle,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Droplet,
  Filter,
  HeartHandshake,
  PhoneCall,
  Search,
  Sparkles,
  User,
  Users,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import React, { useMemo, useState } from "react";

export default function PendingDonationsPage() {
  const {
    bloodRequests,
    donors,
    currentVolunteer,
    confirmBagDonation,
    unassignDonorFromBag,
    setActiveCallingModalDonor,
  } = useBadhon();

  const [selectedGroup, setSelectedGroup] = useState<string>("all");
  const [selectedHall, setSelectedHall] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Extract all pending donation bag assignments across all active/partially_managed requests
  const pendingItems = useMemo(() => {
    const list: Array<{
      requestId: string;
      patientName: string;
      hospital: string;
      urgency: string;
      dateNeeded: string;
      reason: string;
      isPlasma: boolean;
      totalBags: number;
      bagNumber: number;
      assignedAt: string | null;
      donorId: string;
      donorName: string;
      donorPhone: string;
      donorHall: string;
      donorBloodGroup: string;
    }> = [];

    bloodRequests.forEach((req) => {
      if (req.status === "completed" || req.status === "cancelled") return;

      req.assignedBags.forEach((bag) => {
        // Pending donation bag has a donor assigned and status is pending (not donated yet)
        if (bag.donorId && bag.status === "pending") {
          const donorObj = donors.find((d) => d.id === bag.donorId);
          list.push({
            requestId: req.id,
            patientName: req.patientName,
            hospital: req.hospital,
            urgency: req.urgency,
            dateNeeded: req.dateNeeded,
            reason: req.reason,
            isPlasma: req.isPlasma,
            totalBags: req.totalBags,
            bagNumber: bag.bagNumber,
            assignedAt: bag.assignedAt || null,
            donorId: bag.donorId,
            donorName: bag.donorName || donorObj?.name || "Assigned Donor",
            donorPhone: bag.donorPhone || donorObj?.phone || "",
            donorHall: bag.donorHall || donorObj?.hallUnit || "",
            donorBloodGroup: donorObj?.bloodGroup || req.bloodGroup,
          });
        }
      });
    });

    return list;
  }, [bloodRequests, donors]);

  // Apply filters
  const filteredItems = useMemo(() => {
    return pendingItems.filter((item) => {
      if (selectedGroup !== "all" && item.donorBloodGroup !== selectedGroup) {
        return false;
      }
      if (selectedHall !== "all" && item.donorHall !== selectedHall) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.donorName.toLowerCase().includes(q);
        const matchesPhone = item.donorPhone.includes(q);
        const matchesPatient = item.patientName.toLowerCase().includes(q);
        const matchesHospital = item.hospital.toLowerCase().includes(q);
        return matchesName || matchesPhone || matchesPatient || matchesHospital;
      }
      return true;
    });
  }, [pendingItems, selectedGroup, selectedHall, searchQuery]);

  const handleConfirmDonation = (requestId: string, bagNumber: number, donorName: string) => {
    if (confirm(`Confirm that ${donorName} has successfully completed their blood donation for Bag #${bagNumber}? This will increment their donation history.`)) {
      confirmBagDonation(requestId, bagNumber);
      setSuccessNotice(`Donation for Bag #${bagNumber} marked as verified & completed!`);
      setTimeout(() => setSuccessNotice(null), 4000);
    }
  };

  const handleUnassign = (requestId: string, bagNumber: number, donorName: string) => {
    if (confirm(`Unassign donor ${donorName} from Bag #${bagNumber}? The slot will become vacant for another donor.`)) {
      unassignDonorFromBag(requestId, bagNumber);
    }
  };

  const handleCallDonor = (donorId: string) => {
    const donor = donors.find((d) => d.id === donorId);
    if (donor) {
      setActiveCallingModalDonor(donor);
    }
  };

  const myHallPendingCount = pendingItems.filter(
    (i) => i.donorHall === currentVolunteer.hallUnit,
  ).length;

  const emergencyPendingCount = pendingItems.filter((i) =>
    i.urgency.toLowerCase().includes("emergency"),
  ).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
              <Clock className="size-6" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-dark dark:text-white">
              Pending Donations
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-dark-5 dark:text-dark-6 mt-1">
            Track donors currently assigned to blood bags and verify completion once donated.
          </p>
        </div>

        <Link
          href="/blood-requests"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-md hover:bg-primary/90 transition"
        >
          <HeartHandshake className="size-4" />
          <span>View All Requests</span>
        </Link>
      </div>

      {/* Success Notification */}
      {successNotice && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4.5 text-emerald-600 shrink-0" />
            <span>{successNotice}</span>
          </div>
          <button
            onClick={() => setSuccessNotice(null)}
            className="text-emerald-700 hover:text-emerald-900 dark:text-emerald-400 font-black"
          >
            ✕
          </button>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-dark-2 border border-stroke dark:border-dark-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-dark-5 dark:text-dark-6 uppercase tracking-wider">
              Total Awaiting Verification
            </span>
            <span className="size-8 rounded-xl bg-amber-100 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center font-bold">
              <Clock className="size-4" />
            </span>
          </div>
          <p className="text-3xl font-black text-dark dark:text-white mt-2">
            {pendingItems.length}
          </p>
          <p className="text-xs text-dark-5 dark:text-dark-6 mt-1">
            Bags matched with willing donors
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-dark-2 border border-stroke dark:border-dark-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-dark-5 dark:text-dark-6 uppercase tracking-wider">
              Emergency Urgency
            </span>
            <span className="size-8 rounded-xl bg-rose-100 dark:bg-rose-950/50 text-rose-600 flex items-center justify-center font-bold">
              <AlertTriangle className="size-4" />
            </span>
          </div>
          <p className="text-3xl font-black text-rose-600 dark:text-rose-400 mt-2">
            {emergencyPendingCount}
          </p>
          <p className="text-xs text-dark-5 dark:text-dark-6 mt-1">
            Critical bags requiring immediate follow-up
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-dark-2 border border-stroke dark:border-dark-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-dark-5 dark:text-dark-6 uppercase tracking-wider">
              From My Hall Unit
            </span>
            <span className="size-8 rounded-xl bg-blue-100 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center font-bold">
              <Users className="size-4" />
            </span>
          </div>
          <p className="text-3xl font-black text-blue-600 dark:text-blue-400 mt-2">
            {myHallPendingCount}
          </p>
          <p className="text-xs text-dark-5 dark:text-dark-6 mt-1 truncate">
            {currentVolunteer.hallUnit.split(" ")[0]} Hall donors
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-dark-2 border border-stroke dark:border-dark-3 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-dark-5 dark:text-dark-6" />
            <input
              type="text"
              placeholder="Search donor, patient, or hospital..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stroke dark:border-dark-4 bg-gray-1 dark:bg-dark-3 text-dark dark:text-white text-xs font-medium focus:outline-hidden focus:border-primary transition"
            />
          </div>

          {/* Blood Group */}
          <div>
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-stroke dark:border-dark-4 bg-gray-1 dark:bg-dark-3 text-dark dark:text-white text-xs font-medium focus:outline-hidden focus:border-primary transition"
            >
              <option value="all">All Blood Groups</option>
              {ALL_BLOOD_GROUPS.map((g) => (
                <option key={g} value={g}>
                  Blood Group: {g}
                </option>
              ))}
            </select>
          </div>

          {/* Hall Unit */}
          <div>
            <select
              value={selectedHall}
              onChange={(e) => setSelectedHall(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-stroke dark:border-dark-4 bg-gray-1 dark:bg-dark-3 text-dark dark:text-white text-xs font-medium focus:outline-hidden focus:border-primary transition"
            >
              <option value="all">All Hall Units</option>
              {ALL_HALL_UNITS.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Hall Preset */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-stroke/60 dark:border-dark-3 text-xs">
          <span className="font-bold text-dark-5 dark:text-dark-6">Quick Filter:</span>
          <button
            onClick={() => setSelectedHall("all")}
            className={`px-2.5 py-1 rounded-lg font-medium transition ${
              selectedHall === "all"
                ? "bg-primary text-white"
                : "bg-gray-2 dark:bg-dark-3 text-dark dark:text-white hover:bg-gray-3"
            }`}
          >
            All Units
          </button>
          <button
            onClick={() => setSelectedHall(currentVolunteer.hallUnit)}
            className={`px-2.5 py-1 rounded-lg font-medium transition ${
              selectedHall === currentVolunteer.hallUnit
                ? "bg-primary text-white"
                : "bg-gray-2 dark:bg-dark-3 text-dark dark:text-white hover:bg-gray-3"
            }`}
          >
            My Unit ({currentVolunteer.hallUnit.split(" ")[0]})
          </button>
        </div>
      </div>

      {/* Pending Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-dark-2 border border-stroke dark:border-dark-3">
          <div className="size-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 mx-auto flex items-center justify-center mb-3">
            <CheckCircle2 className="size-8" />
          </div>
          <h3 className="text-lg font-bold text-dark dark:text-white">
            No Pending Donations!
          </h3>
          <p className="text-xs text-dark-5 dark:text-dark-6 mt-1 max-w-md mx-auto">
            All assigned blood bags have been verified and completed, or no active requisitions have assigned donors at this moment.
          </p>
          <Link
            href="/search-blood"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-xs hover:bg-primary/90 transition"
          >
            <Search className="size-3.5" />
            <span>Search & Assign Donors</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item) => (
            <div
              key={`${item.requestId}-bag-${item.bagNumber}`}
              className="rounded-3xl bg-white dark:bg-dark-2 border border-stroke dark:border-dark-3 p-5 shadow-xs space-y-4 hover:shadow-md transition"
            >
              {/* Header: Requisition and Bag info */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-amber-300">
                      Bag #{item.bagNumber} of {item.totalBags}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.urgency.toLowerCase().includes("emergency")
                          ? "bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30"
                          : "bg-blue-500/20 text-blue-600 dark:text-blue-400"
                      }`}
                    >
                      {item.urgency}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-dark dark:text-white flex items-center gap-1.5 mt-1">
                    <Building2 className="size-4 text-dark-5 dark:text-dark-6 shrink-0" />
                    <span>{item.hospital}</span>
                  </h3>
                  <p className="text-xs text-dark-5 dark:text-dark-6">
                    Patient: <strong>{item.patientName}</strong> • Needed by: {item.dateNeeded}
                  </p>
                </div>

                <span className="flex size-11 items-center justify-center rounded-2xl bg-rose-600 text-white font-black text-base shadow-md shrink-0">
                  {item.donorBloodGroup}
                </span>
              </div>

              {/* Assigned Donor Card Box */}
              <div className="p-3.5 rounded-2xl bg-gray-1 dark:bg-dark-3 border border-stroke dark:border-dark-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="size-7 rounded-full bg-primary/20 text-primary flex items-center justify-center font-black text-xs">
                      {item.donorName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-dark dark:text-white leading-tight">
                        {item.donorName}
                      </p>
                      <p className="text-[11px] text-dark-5 dark:text-dark-6">
                        {item.donorHall}
                      </p>
                    </div>
                  </div>

                  <a
                    href={getSafeTelUri(item.donorPhone)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-xs transition"
                  >
                    <PhoneCall className="size-3" />
                    <span>Dial</span>
                  </a>
                </div>

                <div className="text-[11px] text-dark-5 dark:text-dark-6 flex items-center justify-between pt-1 border-t border-stroke/60 dark:border-dark-4">
                  <span>Phone: <strong className="font-mono text-dark dark:text-white">{item.donorPhone}</strong></span>
                  <button
                    onClick={() => handleCallDonor(item.donorId)}
                    className="text-primary hover:underline font-bold text-[11px] cursor-pointer"
                  >
                    Open Call Lock Console
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() =>
                    handleConfirmDonation(item.requestId, item.bagNumber, item.donorName)
                  }
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition active:scale-98 cursor-pointer"
                >
                  <CheckCircle2 className="size-4" />
                  <span>Mark Verified & Completed</span>
                </button>

                <button
                  onClick={() =>
                    handleUnassign(item.requestId, item.bagNumber, item.donorName)
                  }
                  className="inline-flex items-center justify-center gap-1 py-2.5 px-3 rounded-xl border border-stroke dark:border-dark-4 hover:bg-rose-500/10 hover:border-rose-500/40 text-rose-600 dark:text-rose-400 text-xs font-bold transition cursor-pointer"
                  title="Remove donor assignment from this bag"
                >
                  <XCircle className="size-4" />
                  <span className="hidden sm:inline">Unassign</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
