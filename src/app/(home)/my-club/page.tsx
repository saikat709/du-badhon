"use client";

import { useBadhon } from "@/context/badhon-context";
import { ALL_HALL_UNITS, VolunteerMember } from "@/types/badhon";
import { getSafeTelUri } from "@/utils/security";
import {
  Award,
  Building2,
  Check,
  CheckCircle2,
  Edit2,
  GraduationCap,
  HeartHandshake,
  Mail,
  Phone,
  PhoneCall,
  Plus,
  Search,
  Shield,
  ShieldCheck,
  User,
  UserCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import React, { useMemo, useState } from "react";

const AVAILABLE_ROLES = [
  "President",
  "Vice President",
  "General Secretary",
  "Joint General Secretary",
  "Organizing Secretary",
  "Assistant Organizing Secretary",
  "Public Relations Secretary",
  "Executive Member",
  "Active Volunteer",
  "Member",
];

export default function MyClubPage() {
  const { currentVolunteer, volunteers, updateVolunteerRole, addVolunteerMember, donors } =
    useBadhon();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState("all");
  const [editingVolunteerId, setEditingVolunteerId] = useState<string | null>(null);
  const [newRoleValue, setNewRoleValue] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Form state for adding new member
  const [newMemberData, setNewMemberData] = useState({
    name: "",
    phone: "",
    studentId: "",
    department: "",
    session: "2021-2022",
    role: "Member",
  });

  const userRole = (currentVolunteer.role || "").toUpperCase();
  const isExecutiveOrAdmin =
    userRole.includes("ADMIN") ||
    userRole.includes("PRESIDENT") ||
    userRole.includes("SECRETARY") ||
    userRole.includes("EXECUTIVE");

  // Filter volunteers strictly from the current volunteer's hall unit
  const unitVolunteers = useMemo(() => {
    return volunteers.filter((v) => v.hallUnit === currentVolunteer.hallUnit);
  }, [volunteers, currentVolunteer.hallUnit]);

  // Donors from this hall unit
  const unitDonors = useMemo(() => {
    return donors.filter((d) => d.hallUnit === currentVolunteer.hallUnit);
  }, [donors, currentVolunteer.hallUnit]);

  const totalDonationsCoordinated = unitDonors.reduce(
    (acc, d) => acc + (d.totalDonations || 0),
    0,
  );

  // Apply search and role filters
  const filteredVolunteers = useMemo(() => {
    return unitVolunteers.filter((v) => {
      if (selectedRoleFilter !== "all" && v.role !== selectedRoleFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = v.name.toLowerCase().includes(q);
        const matchesPhone = v.phone.includes(q);
        const matchesDept = (v.department || "").toLowerCase().includes(q);
        const matchesId = (v.studentId || "").includes(q);
        return matchesName || matchesPhone || matchesDept || matchesId;
      }
      return true;
    });
  }, [unitVolunteers, selectedRoleFilter, searchQuery]);

  const handleStartEditRole = (volunteer: VolunteerMember) => {
    setEditingVolunteerId(volunteer.id);
    setNewRoleValue(volunteer.role);
  };

  const handleSaveRole = (volunteerId: string) => {
    if (newRoleValue) {
      updateVolunteerRole(volunteerId, newRoleValue);
      setEditingVolunteerId(null);
      setSuccessNotice("Member role successfully updated!");
      setTimeout(() => setSuccessNotice(null), 3000);
    }
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberData.name || !newMemberData.phone) {
      alert("Please enter at least member name and phone number.");
      return;
    }

    addVolunteerMember({
      name: newMemberData.name,
      phone: newMemberData.phone,
      studentId: newMemberData.studentId || "DU-" + Math.floor(100000 + Math.random() * 900000),
      department: newMemberData.department || "Faculty of Science",
      hallUnit: currentVolunteer.hallUnit,
      role: newMemberData.role,
      avatarBg: "bg-rose-600",
    });

    setShowAddModal(false);
    setNewMemberData({
      name: "",
      phone: "",
      studentId: "",
      department: "",
      session: "2021-2022",
      role: "Member",
    });
    setSuccessNotice("New volunteer member added to your unit!");
    setTimeout(() => setSuccessNotice(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-rose-900 via-rose-800 to-slate-900 p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-white/20 backdrop-blur-xs flex items-center gap-1.5">
                <ShieldCheck className="size-3.5" />
                <span>Unit Administration</span>
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-500/40 border border-rose-400/30">
                Your Role: {currentVolunteer.role}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              {currentVolunteer.hallUnit}
            </h1>
            <p className="text-xs sm:text-sm text-rose-100 max-w-xl">
              Official unit management console for DU Badhon. Coordinate volunteers, update leadership designations, and monitor hall blood drives.
            </p>
          </div>

          {isExecutiveOrAdmin && (
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-rose-900 hover:bg-rose-50 font-black text-xs shadow-lg transition active:scale-95 shrink-0 self-start md:self-auto cursor-pointer"
            >
              <Plus className="size-4" />
              <span>Register Unit Member</span>
            </button>
          )}
        </div>
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

      {/* Unit Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-dark-2 border border-stroke dark:border-dark-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-dark-5 dark:text-dark-6 uppercase tracking-wider">
              Unit Volunteers
            </span>
            <span className="size-8 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center font-bold">
              <Users className="size-4" />
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-dark dark:text-white mt-2">
            {unitVolunteers.length}
          </p>
          <p className="text-[11px] text-dark-5 dark:text-dark-6 mt-1">
            Registered volunteers in hall
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-dark-2 border border-stroke dark:border-dark-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-dark-5 dark:text-dark-6 uppercase tracking-wider">
              Executive Committee
            </span>
            <span className="size-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center font-bold">
              <Award className="size-4" />
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 mt-2">
            {unitVolunteers.filter((v) => !v.role.toLowerCase().includes("member") || v.role.toLowerCase().includes("executive")).length}
          </p>
          <p className="text-[11px] text-dark-5 dark:text-dark-6 mt-1">
            Committee leaders
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-dark-2 border border-stroke dark:border-dark-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-dark-5 dark:text-dark-6 uppercase tracking-wider">
              Hall Donors
            </span>
            <span className="size-8 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center font-bold">
              <HeartHandshake className="size-4" />
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400 mt-2">
            {unitDonors.length}
          </p>
          <p className="text-[11px] text-dark-5 dark:text-dark-6 mt-1">
            Total donors from this hall
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-dark-2 border border-stroke dark:border-dark-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-dark-5 dark:text-dark-6 uppercase tracking-wider">
              Total Donations
            </span>
            <span className="size-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="size-4" />
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-2">
            {totalDonationsCoordinated}
          </p>
          <p className="text-[11px] text-dark-5 dark:text-dark-6 mt-1">
            Bags provided by hall donors
          </p>
        </div>
      </div>

      {/* Roster Controls & Filters */}
      <div className="p-4 rounded-2xl bg-white dark:bg-dark-2 border border-stroke dark:border-dark-3 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-dark-5 dark:text-dark-6" />
          <input
            type="text"
            placeholder="Search member by name, phone, or dept..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-stroke dark:border-dark-4 bg-gray-1 dark:bg-dark-3 text-dark dark:text-white text-xs font-medium focus:outline-hidden focus:border-primary transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedRoleFilter}
            onChange={(e) => setSelectedRoleFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 rounded-xl border border-stroke dark:border-dark-4 bg-gray-1 dark:bg-dark-3 text-dark dark:text-white text-xs font-medium focus:outline-hidden focus:border-primary transition"
          >
            <option value="all">All Member Roles</option>
            {AVAILABLE_ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Volunteer Members Roster List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVolunteers.map((vol) => {
          const isCurrentUser = vol.id === currentVolunteer.id;
          const isEditing = editingVolunteerId === vol.id;

          return (
            <div
              key={vol.id}
              className={`rounded-3xl p-5 border transition shadow-xs flex flex-col justify-between space-y-4 ${
                isCurrentUser
                  ? "bg-rose-50/50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-900/60"
                  : "bg-white dark:bg-dark-2 border-stroke dark:border-dark-3"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`size-11 rounded-2xl flex items-center justify-center font-black text-white text-base shadow-sm ${
                        vol.avatarBg || "bg-rose-600"
                      }`}
                    >
                      {vol.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-dark dark:text-white text-sm flex items-center gap-1.5">
                        <span>{vol.name}</span>
                        {isCurrentUser && (
                          <span className="text-[10px] font-black px-1.5 py-0.2 rounded-md bg-rose-600 text-white">
                            You
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-dark-5 dark:text-dark-6">
                        {vol.department || "University of Dhaka"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-gray-1 dark:bg-dark-3 text-xs space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-dark-5 dark:text-dark-6">Phone:</span>
                    <strong className="font-mono text-dark dark:text-white">{vol.phone}</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-dark-5 dark:text-dark-6">Student ID:</span>
                    <strong className="font-mono text-dark dark:text-white">
                      {vol.studentId || "N/A"}
                    </strong>
                  </div>
                </div>

                {/* Role Designation Box */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-dark-5 dark:text-dark-6 block mb-1">
                    Designation:
                  </span>
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <select
                        value={newRoleValue}
                        onChange={(e) => setNewRoleValue(e.target.value)}
                        className="flex-1 px-2.5 py-1.5 rounded-xl border border-primary bg-white dark:bg-dark-2 text-dark dark:text-white text-xs font-bold focus:outline-hidden"
                      >
                        {AVAILABLE_ROLES.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleSaveRole(vol.id)}
                        className="p-1.5 rounded-xl bg-emerald-600 text-white shadow-xs hover:bg-emerald-700"
                        title="Save Role"
                      >
                        <Check className="size-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300">
                        <Award className="size-3.5" />
                        <span>{vol.role}</span>
                      </span>

                      {isExecutiveOrAdmin && (
                        <button
                          onClick={() => handleStartEditRole(vol)}
                          className="text-[11px] font-bold text-dark-5 hover:text-primary transition flex items-center gap-1 cursor-pointer"
                        >
                          <Edit2 className="size-3" />
                          <span>Change Role</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Footer */}
              <div className="pt-2 border-t border-stroke/60 dark:border-dark-4 flex items-center justify-between">
                <a
                  href={getSafeTelUri(vol.phone)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition"
                >
                  <PhoneCall className="size-3.5" />
                  <span>Call Member</span>
                </a>

                <span className="text-[11px] text-dark-5 dark:text-dark-6">
                  {currentVolunteer.hallUnit.split(" ")[0]}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="w-full max-w-lg bg-white dark:bg-dark-2 rounded-3xl p-6 shadow-2xl border border-stroke dark:border-dark-3 space-y-5 animate-in fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-2xl bg-rose-500/10 text-rose-600">
                <Users className="size-6" />
              </span>
              <div>
                <h3 className="text-lg font-black text-dark dark:text-white">
                  Register Volunteer Member
                </h3>
                <p className="text-xs text-dark-5 dark:text-dark-6">
                  Add an active Badhon member to {currentVolunteer.hallUnit}
                </p>
              </div>
            </div>

            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-dark dark:text-white mb-1.5">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tanvir Hasan"
                  value={newMemberData.name}
                  onChange={(e) =>
                    setNewMemberData({ ...newMemberData, name: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stroke dark:border-dark-4 bg-gray-1 dark:bg-dark-3 text-dark dark:text-white text-xs font-medium focus:outline-hidden focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-dark dark:text-white mb-1.5">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="01XXXXXXXXX"
                    value={newMemberData.phone}
                    onChange={(e) =>
                      setNewMemberData({ ...newMemberData, phone: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stroke dark:border-dark-4 bg-gray-1 dark:bg-dark-3 text-dark dark:text-white text-xs font-medium focus:outline-hidden focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-dark dark:text-white mb-1.5">
                    Student ID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2021-123-456"
                    value={newMemberData.studentId}
                    onChange={(e) =>
                      setNewMemberData({ ...newMemberData, studentId: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stroke dark:border-dark-4 bg-gray-1 dark:bg-dark-3 text-dark dark:text-white text-xs font-medium focus:outline-hidden focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-dark dark:text-white mb-1.5">
                    Department
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Physics"
                    value={newMemberData.department}
                    onChange={(e) =>
                      setNewMemberData({ ...newMemberData, department: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stroke dark:border-dark-4 bg-gray-1 dark:bg-dark-3 text-dark dark:text-white text-xs font-medium focus:outline-hidden focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-dark dark:text-white mb-1.5">
                    Designation Role
                  </label>
                  <select
                    value={newMemberData.role}
                    onChange={(e) =>
                      setNewMemberData({ ...newMemberData, role: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stroke dark:border-dark-4 bg-gray-1 dark:bg-dark-3 text-dark dark:text-white text-xs font-medium focus:outline-hidden focus:border-primary"
                  >
                    {AVAILABLE_ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stroke dark:border-dark-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-dark-5 hover:bg-gray-1 dark:hover:bg-dark-3 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-md hover:bg-primary/90 transition"
                >
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
