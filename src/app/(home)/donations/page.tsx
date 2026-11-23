"use client";

import { useBadhon } from "@/context/badhon-context";
import {
  CheckCircle2,
  ClipboardList,
  Droplet,
  HeartHandshake,
  Search,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import React, { Suspense, useMemo, useState } from "react";

function DonationsContent() {
  const { bloodRequests } = useBadhon();
  const [filterHospital, setFilterHospital] = useState("all");
  const [search, setSearch] = useState("");

  // Extract all completed donation records from bloodRequests
  const completedDonations = useMemo(() => {
    const list: Array<{
      id: string;
      requestId: string;
      hospital: string;
      patientName: string;
      bloodGroup: string;
      isPlasma: boolean;
      bagNumber: number;
      donorName: string;
      donorPhone: string;
      donorHall: string;
      date: string;
      coordinator: string;
    }> = [];

    bloodRequests.forEach((req) => {
      req.assignedBags.forEach((bag) => {
        if (bag.donorId && (bag.status === "donated" || req.status === "completed")) {
          list.push({
            id: `${req.id}-bag-${bag.bagNumber}`,
            requestId: req.id,
            hospital: req.hospital,
            patientName: req.patientName,
            bloodGroup: req.bloodGroup,
            isPlasma: req.isPlasma,
            bagNumber: bag.bagNumber,
            donorName: bag.donorName || "Unknown",
            donorPhone: bag.donorPhone || "",
            donorHall: bag.donorHall || "",
            date: req.dateNeeded || req.createdAt.split("T")[0],
            coordinator: req.createdByVolunteerName,
          });
        }
      });
    });

    return list.filter((item) => {
      if (filterHospital !== "all" && item.hospital !== filterHospital) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          item.patientName.toLowerCase().includes(q) ||
          item.donorName.toLowerCase().includes(q) ||
          item.hospital.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [bloodRequests, filterHospital, search]);

  const hospitals = useMemo(() => {
    const set = new Set<string>();
    bloodRequests.forEach((r) => set.add(r.hospital));
    return Array.from(set);
  }, [bloodRequests]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-dark dark:text-white flex items-center gap-2">
            <ClipboardList className="size-7 text-rose-600" />
            <span>DU Badhon Donation Ledger</span>
          </h1>
          <p className="text-xs text-dark-5 dark:text-dark-6 mt-1">
            Historical audit trail of completed blood and plasma units donated through Badhon.
          </p>
        </div>

        <Link
          href="/blood-requests"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm transition"
        >
          <HeartHandshake className="size-4" />
          <span>View Blood Requests</span>
        </Link>
      </div>

      {/* Filter */}
      <div className="bg-white dark:bg-dark-2 p-4 rounded-2xl border border-stroke dark:border-dark-3 flex flex-col sm:flex-row gap-3 justify-between items-center shadow-xs">
        <div className="w-full sm:w-72 relative">
          <input
            type="text"
            placeholder="Search patient, donor, hospital..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-stroke bg-gray-1 dark:bg-dark-3 pl-8 pr-3 py-2 text-xs text-dark dark:text-white outline-none focus:border-rose-600"
          />
          <Search className="size-3.5 text-gray-4 absolute left-2.5 top-2.5" />
        </div>

        <div className="w-full sm:w-72">
          <select
            value={filterHospital}
            onChange={(e) => setFilterHospital(e.target.value)}
            className="w-full rounded-xl border border-stroke bg-gray-1 dark:bg-dark-3 px-3 py-2 text-xs text-dark dark:text-white outline-none focus:border-rose-600"
          >
            <option value="all">All Hospitals</option>
            {hospitals.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-dark-2 rounded-2xl border border-stroke dark:border-dark-3 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-1 dark:bg-dark-3 text-dark-5 dark:text-dark-6 border-b border-stroke dark:border-dark-3 uppercase font-bold text-[11px]">
              <tr>
                <th className="p-4">Req # / Date</th>
                <th className="p-4">Hospital & Patient</th>
                <th className="p-4">Group / Type</th>
                <th className="p-4">Donor Details</th>
                <th className="p-4">Coordinator</th>
                <th className="p-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stroke dark:divide-dark-3">
              {completedDonations.length > 0 ? (
                completedDonations.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-1/60 dark:hover:bg-dark-3/60 transition"
                  >
                    <td className="p-4">
                      <span className="font-bold text-rose-600 dark:text-rose-400 block">
                        {item.requestId}
                      </span>
                      <span className="text-[11px] text-gray-5">{item.date}</span>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-dark dark:text-white block">
                        {item.hospital}
                      </span>
                      <span className="text-[11px] text-dark-5 dark:text-dark-6">
                        Patient: {item.patientName}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full font-black text-xs bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                        {item.bloodGroup}
                      </span>
                      <span className="block text-[10px] text-gray-5 mt-0.5">
                        {item.isPlasma ? "Plasma" : "Whole Blood"} (Bag #{item.bagNumber})
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-dark dark:text-white block">
                        {item.donorName}
                      </span>
                      <span className="text-[11px] text-dark-5 dark:text-dark-6">
                        {item.donorHall.split(" ")[0]} Hall • {item.donorPhone}
                      </span>
                    </td>
                    <td className="p-4 text-dark-5 dark:text-dark-6">
                      {item.coordinator}
                    </td>
                    <td className="p-4 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                        <CheckCircle2 className="size-3" />
                        <span>Donated</span>
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-dark-5 dark:text-dark-6">
                    No donation records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function DonationsPage() {
  return (
    <Suspense>
      <DonationsContent />
    </Suspense>
  );
}
