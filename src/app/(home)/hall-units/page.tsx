"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import {
  Building2,
  Phone,
  MessageCircle,
  Search,
  ShieldCheck,
  User,
  GraduationCap,
  Droplet,
  ExternalLink,
  RotateCcw,
  Sparkles,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useBadhon } from "@/context/badhon-context";
import { HallUnit, VolunteerMember } from "@/types/badhon";

export default function HallUnitsPage() {
  const { volunteers, currentVolunteer, switchVolunteer } = useBadhon();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedHall, setSelectedHall] = useState<string>("all");
  const [selectedRole, setSelectedRole] = useState<string>("all");

  // Unique list of halls
  const halls = useMemo(() => {
    const set = new Set<string>();
    volunteers.forEach((v) => set.add(v.hallUnit));
    return Array.from(set).sort();
  }, [volunteers]);

  // Filtered volunteers
  const filteredVolunteers = useMemo(() => {
    return volunteers.filter((vol) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !q ||
        vol.name.toLowerCase().includes(q) ||
        vol.hallUnit.toLowerCase().includes(q) ||
        vol.phone.includes(q) ||
        (vol.department && vol.department.toLowerCase().includes(q)) ||
        (vol.bloodGroup && vol.bloodGroup.toLowerCase().includes(q));

      const matchHall = selectedHall === "all" || vol.hallUnit === selectedHall;
      const matchRole = selectedRole === "all" || vol.role === selectedRole;

      return matchSearch && matchHall && matchRole;
    });
  }, [volunteers, searchQuery, selectedHall, selectedRole]);

  // Group by hall for organized display
  const groupedByHall = useMemo(() => {
    const map = new Map<string, VolunteerMember[]>();
    filteredVolunteers.forEach((v) => {
      const list = map.get(v.hallUnit) || [];
      list.push(v);
      map.set(v.hallUnit, list);
    });
    return map;
  }, [filteredVolunteers]);

  return (
    <div className="space-y-6">
      <Breadcrumb pageName="Hall Units & Executives" />

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-900 via-rose-950 to-slate-900 p-6 md:p-8 text-white border border-rose-500/30 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold">
              <Building2 className="w-3.5 h-3.5" />
              <span>Inter-Hall Coordination Directory</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
              DU Badhon Executive Committee & Hall Members
            </h1>

            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              Direct contact directory for all 16 DU hall units. Reach out to hall Presidents, General Secretaries, and Blood Affairs Secretaries to coordinate cross-hall blood and plasma emergencies.
            </p>
          </div>

          <div className="shrink-0 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center space-y-1">
            <span className="text-[11px] font-semibold text-rose-300 block uppercase tracking-wider">
              Your Current Unit
            </span>
            <p className="text-sm font-black text-white">{currentVolunteer.hallUnit}</p>
            <p className="text-xs text-rose-200">
              {currentVolunteer.name} ({currentVolunteer.role})
            </p>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-10 -bottom-10 size-60 rounded-full bg-rose-500/10 pointer-events-none" />
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white dark:bg-gray-dark p-4 rounded-2xl border border-stroke dark:border-stroke-dark shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search Input */}
          <div className="relative sm:col-span-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, hall, dept, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stroke dark:border-stroke-dark bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-rose-500"
            />
          </div>

          {/* Hall Filter */}
          <div>
            <select
              value={selectedHall}
              onChange={(e) => setSelectedHall(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stroke dark:border-stroke-dark bg-slate-50 dark:bg-slate-900 text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-hidden focus:border-rose-500"
            >
              <option value="all">All 16 DU Halls ({volunteers.length} Executives)</option>
              {halls.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
          </div>

          {/* Role Filter */}
          <div>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stroke dark:border-stroke-dark bg-slate-50 dark:bg-slate-900 text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-hidden focus:border-rose-500"
            >
              <option value="all">All Executive Roles</option>
              <option value="President">Presidents</option>
              <option value="General Secretary">General Secretaries</option>
              <option value="Blood Affairs Secretary">Blood Affairs Secretaries</option>
              <option value="Executive Member">Executive Members</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1 pt-1">
          <span>
            Showing <strong>{filteredVolunteers.length}</strong> executives across{" "}
            <strong>{groupedByHall.size}</strong> hall units
          </span>
          {(searchQuery || selectedHall !== "all" || selectedRole !== "all") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedHall("all");
                setSelectedRole("all");
              }}
              className="text-rose-600 dark:text-rose-400 font-bold hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Hall Groups and Member Cards */}
      <div className="space-y-8">
        {Array.from(groupedByHall.entries()).map(([hallName, members]) => {
          const isUserHall = currentVolunteer.hallUnit === hallName;

          return (
            <div
              key={hallName}
              className={`rounded-3xl border p-5 md:p-6 transition-all ${
                isUserHall
                  ? "border-rose-500/50 bg-rose-500/5 dark:bg-rose-950/20 shadow-md"
                  : "border-stroke dark:border-stroke-dark bg-white dark:bg-gray-dark shadow-xs"
              }`}
            >
              {/* Hall Title Banner */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-stroke dark:border-stroke-dark/80">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base md:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{hallName}</span>
                      {isUserHall && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white shadow-xs">
                          Your Hall
                        </span>
                      )}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      DU Badhon Hall Unit • {members.length} Contact Executive{members.length > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    Direct Contact Available
                  </span>
                </div>
              </div>

              {/* Members Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {members.map((member) => {
                  const isCurrent = currentVolunteer.id === member.id;

                  return (
                    <div
                      key={member.id}
                      className={`relative rounded-2xl p-4.5 border transition-all flex flex-col justify-between ${
                        isCurrent
                          ? "bg-rose-600/10 border-rose-500 text-slate-900 dark:text-white"
                          : "bg-slate-50/80 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800 hover:border-rose-400/50 text-slate-800 dark:text-slate-100"
                      }`}
                    >
                      <div className="space-y-3">
                        {/* Member Header */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0 shadow-xs"
                              style={{ backgroundColor: member.avatarBg || "#e11d48" }}
                            >
                              {member.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <h3 className="font-bold text-xs sm:text-sm truncate leading-snug">
                                {member.name}
                              </h3>
                              <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                                {member.role}
                              </span>
                            </div>
                          </div>

                          {member.bloodGroup && (
                            <span className="px-2 py-0.5 rounded-lg text-xs font-black bg-rose-600 text-white shadow-2xs shrink-0">
                              {member.bloodGroup}
                            </span>
                          )}
                        </div>

                        {/* Details */}
                        <div className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-400 pt-1">
                          {member.department && (
                            <div className="flex items-center gap-1.5 truncate">
                              <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="truncate">{member.department} ({member.session})</span>
                            </div>
                          )}

                          {member.roomNo && (
                            <div className="flex items-center gap-1.5 truncate">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="truncate">{member.roomNo}</span>
                            </div>
                          )}

                          <div className="flex items-center gap-1.5 truncate">
                            <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">Student ID: {member.studentId}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-4 mt-4 border-t border-slate-200/60 dark:border-slate-800 flex items-center gap-2">
                        {/* 1-Tap Call Button */}
                        <a
                          href={`tel:${member.phone}`}
                          title={`Call ${member.name} (${member.phone})`}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition active:scale-95"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Call ({member.phone.slice(-4)})</span>
                        </a>

                        {/* WhatsApp Message */}
                        <a
                          href={`https://wa.me/88${member.phone}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Message on WhatsApp"
                          className="p-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition"
                        >
                          <MessageCircle className="w-4 h-4 text-emerald-500" />
                        </a>

                        {/* Switch Volunteer Context */}
                        {!isCurrent && (
                          <button
                            onClick={() => switchVolunteer(member.id)}
                            title="Switch duty session to this volunteer"
                            className="p-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition"
                          >
                            <RotateCcw className="w-4 h-4 text-rose-500" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
