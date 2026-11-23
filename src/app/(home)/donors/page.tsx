"use client";

import { CallDonorModal } from "@/components/Donors/CallDonorModal";
import { DonorCard } from "@/components/Donors/DonorCard";
import { NewDonorModal } from "@/components/Donors/NewDonorModal";
import { useBadhon, isDonorEligible, isLockActive } from "@/context/badhon-context";
import { BloodGroup, Donor, HallUnit } from "@/types/badhon";
import {
  Droplet,
  Lock,
  Plus,
  Search,
  ShieldCheck,
  UserCheck,
  Users,
} from "lucide-react";
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

function DonorsContent() {
  const { donors, addDonor, startCallingDonor } = useBadhon();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string>("all");
  const [selectedHall, setSelectedHall] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCallDonor, setActiveCallDonor] = useState<Donor | null>(null);

  const stats = useMemo(() => {
    const total = donors.length;
    const totalDonations = donors.reduce((sum, d) => sum + d.totalDonations, 0);
    const readyCount = donors.filter((d) => isDonorEligible(d.lastDonationDate)).length;
    const currentlyCalling = donors.filter((d) => isLockActive(d.currentLock)).length;

    return { total, totalDonations, readyCount, currentlyCalling };
  }, [donors]);

  const filteredDonors = useMemo(() => {
    return donors.filter((d) => {
      if (selectedGroup !== "all" && d.bloodGroup !== selectedGroup) return false;
      if (selectedHall !== "all" && d.hallUnit !== selectedHall) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const mName = d.name.toLowerCase().includes(q);
        const mDept = d.department.toLowerCase().includes(q);
        const mSession = d.session.toLowerCase().includes(q);
        const mPhone = d.phone.includes(q);
        if (!mName && !mDept && !mSession && !mPhone) return false;
      }
      return true;
    });
  }, [donors, selectedGroup, selectedHall, searchQuery]);

  const handleStartCall = (donor: Donor) => {
    const res = startCallingDonor(donor.id);
    if (!res.success) {
      alert(res.message);
      return;
    }
    setActiveCallDonor(donor);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-dark dark:text-white flex items-center gap-2">
            <Users className="size-7 text-rose-600" />
            <span>DU Badhon Donors Registry</span>
          </h1>
          <p className="text-xs text-dark-5 dark:text-dark-6 mt-1">
            Student blood donor directory across 16 Dhaka University halls.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm transition active:scale-95"
        >
          <Plus className="size-4" />
          <span>Register New Donor</span>
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-dark-2 p-4 rounded-xl border border-stroke dark:border-dark-3 shadow-xs">
          <p className="text-xs text-dark-5 dark:text-dark-6 font-medium">Registered Donors</p>
          <p className="text-2xl font-black text-dark dark:text-white mt-1">{stats.total}</p>
          <p className="text-[11px] text-dark-5 dark:text-dark-6 mt-0.5">Across 16 DU Halls</p>
        </div>

        <div className="bg-white dark:bg-dark-2 p-4 rounded-xl border border-stroke dark:border-dark-3 shadow-xs">
          <p className="text-xs text-dark-5 dark:text-dark-6 font-medium">Ready to Donate</p>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {stats.readyCount}
          </p>
          <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold mt-0.5">
            Cooldown cleared (90d+)
          </p>
        </div>

        <div className="bg-white dark:bg-dark-2 p-4 rounded-xl border border-stroke dark:border-dark-3 shadow-xs">
          <p className="text-xs text-dark-5 dark:text-dark-6 font-medium">Currently In-Call</p>
          <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
            {stats.currentlyCalling}
          </p>
          <p className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold mt-0.5">
            Locked by volunteers
          </p>
        </div>

        <div className="bg-white dark:bg-dark-2 p-4 rounded-xl border border-stroke dark:border-dark-3 shadow-xs">
          <p className="text-xs text-dark-5 dark:text-dark-6 font-medium">Total Blood Units Donated</p>
          <p className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">
            {stats.totalDonations} bags
          </p>
          <p className="text-[11px] text-rose-700 dark:text-rose-400 font-semibold mt-0.5">
            Cumulative life-saving donations
          </p>
        </div>
      </div>

      {/* Filter and Search Box */}
      <div className="bg-white dark:bg-dark-2 p-4 rounded-2xl border border-stroke dark:border-dark-3 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
          <div className="w-full sm:w-72 relative">
            <input
              type="text"
              placeholder="Search by name, department, session, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-stroke bg-gray-1 dark:bg-dark-3 pl-8 pr-3.5 py-2 text-xs text-dark dark:text-white outline-none focus:border-rose-600"
            />
            <Search className="size-3.5 text-gray-4 absolute left-2.5 top-2.5" />
          </div>

          <div className="w-full sm:w-64">
            <select
              value={selectedHall}
              onChange={(e) => setSelectedHall(e.target.value)}
              className="w-full rounded-xl border border-stroke bg-gray-1 dark:bg-dark-3 px-3.5 py-2 text-xs text-dark dark:text-white outline-none focus:border-rose-600"
            >
              <option value="all">All Hall Units</option>
              {HALL_UNITS.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Blood Groups: Wrapped responsive pills, no ugly horizontal scrollbar */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-stroke dark:border-dark-3">
          <span className="text-[11px] font-bold text-dark-5 dark:text-dark-6 mr-1 inline-flex items-center gap-1">
            <Droplet className="size-3 text-rose-500" />
            <span>Group:</span>
          </span>
          <button
            onClick={() => setSelectedGroup("all")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
              selectedGroup === "all"
                ? "bg-dark text-white dark:bg-white dark:text-dark shadow-2xs"
                : "bg-gray-2 text-dark-5 dark:bg-dark-3 dark:text-dark-6 hover:bg-gray-3 hover:text-dark dark:hover:text-white"
            }`}
          >
            All
          </button>
          {BLOOD_GROUPS.map((bg) => (
            <button
              key={bg}
              onClick={() => setSelectedGroup(bg)}
              className={`px-2.5 py-1 rounded-lg text-xs font-black transition ${
                selectedGroup === bg
                  ? "bg-rose-600 text-white shadow-xs"
                  : "bg-gray-2 text-dark-5 dark:bg-dark-3 dark:text-dark-6 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"
              }`}
            >
              {bg}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDonors.map((donor) => (
          <DonorCard key={donor.id} donor={donor} onCall={handleStartCall} />
        ))}
      </div>

      {/* Modals */}
      <NewDonorModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={(data) => {
          addDonor(data);
        }}
      />

      <CallDonorModal
        donor={activeCallDonor}
        onClose={() => setActiveCallDonor(null)}
      />
    </div>
  );
}

export default function DonorsPage() {
  return (
    <Suspense>
      <DonorsContent />
    </Suspense>
  );
}
