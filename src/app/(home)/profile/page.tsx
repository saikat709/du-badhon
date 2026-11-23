"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useBadhon } from "@/context/badhon-context";
import { getSafeTelUri } from "@/utils/security";
import {
  Building2,
  Calendar,
  CheckCircle2,
  Droplet,
  ExternalLink,
  GraduationCap,
  MapPin,
  Phone,
  ShieldCheck,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import React, { useMemo } from "react";

export default function ProfilePage() {
  const { currentVolunteer, volunteers, switchVolunteer, bloodRequests, donors } =
    useBadhon();

  // Requests created or managed by this volunteer
  const coordinatedRequests = useMemo(() => {
    return bloodRequests.filter(
      (r) =>
        r.createdByVolunteerName === currentVolunteer.name ||
        r.managedByVolunteerId === currentVolunteer.id,
    );
  }, [bloodRequests, currentVolunteer]);

  // Calls logged by this volunteer
  const myCallLogs = useMemo(() => {
    const logs: Array<{
      id: string;
      donorName: string;
      donorPhone: string;
      bloodGroup: string;
      outcome: string;
      comment: string;
      timestamp: string;
    }> = [];

    donors.forEach((donor) => {
      donor.callHistory.forEach((c) => {
        if (c.volunteerId === currentVolunteer.id) {
          logs.push({
            id: c.id,
            donorName: donor.name,
            donorPhone: donor.phone,
            bloodGroup: donor.bloodGroup,
            outcome: c.outcome,
            comment: c.comment,
            timestamp: c.timestamp,
          });
        }
      });
    });

    return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [donors, currentVolunteer]);

  // Unit peers in the same hall
  const myUnitMembers = useMemo(() => {
    return volunteers.filter((v) => v.hallUnit === currentVolunteer.hallUnit);
  }, [volunteers, currentVolunteer.hallUnit]);

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <Breadcrumb pageName="Volunteer Profile" />

      {/* Profile Card */}
      <div className="overflow-hidden rounded-3xl bg-white dark:bg-dark-2 shadow-xs border border-stroke dark:border-dark-3">
        {/* Cover / Header Banner */}
        <div className="h-36 bg-gradient-to-r from-rose-700 via-rose-800 to-red-950 p-6 flex items-end justify-between text-white">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4.5 text-rose-300" />
            <span className="text-xs font-bold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full backdrop-blur-xs">
              Badhon Active Executive Member
            </span>
          </div>

          <Link
            href="/hall-units"
            className="text-xs font-bold bg-black/20 hover:bg-black/40 px-3 py-1 rounded-full text-white/90 hover:text-white transition flex items-center gap-1.5"
          >
            <span>Unit Directory</span>
            <ExternalLink className="size-3" />
          </Link>
        </div>

        <div className="px-6 pb-6 pt-0 relative">
          {/* Avatar and Basic Info */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-12 mb-5 gap-4">
            <div className="flex items-end gap-4">
              <div
                className="size-24 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg ring-4 ring-white dark:ring-dark-2 shrink-0"
                style={{ backgroundColor: currentVolunteer.avatarBg }}
              >
                {currentVolunteer.name
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")}
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black text-dark dark:text-white">
                    {currentVolunteer.name}
                  </h1>
                  {currentVolunteer.bloodGroup && (
                    <span className="inline-flex items-center gap-1 text-xs font-black px-2 py-0.5 rounded-lg bg-rose-600 text-white">
                      <Droplet className="size-3 fill-white" />
                      <span>{currentVolunteer.bloodGroup}</span>
                    </span>
                  )}
                </div>
                <p className="text-xs text-rose-600 dark:text-rose-400 font-bold">
                  {currentVolunteer.role} • {currentVolunteer.hallUnit}
                </p>
                <p className="text-xs text-dark-5 dark:text-dark-6">
                  Student ID: <strong>{currentVolunteer.studentId}</strong>
                </p>
              </div>
            </div>

            {/* Test Volunteer Switcher */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-dark-5 dark:text-dark-6 font-semibold">
                Active Member:
              </span>
              <select
                value={currentVolunteer.id}
                onChange={(e) => switchVolunteer(e.target.value)}
                className="rounded-xl border border-stroke dark:border-dark-3 bg-gray-1 dark:bg-dark-3 px-3 py-1.5 text-xs font-bold text-dark dark:text-white outline-none focus:border-rose-600"
              >
                {volunteers.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.hallUnit.split(" ")[0]})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Detailed Personal Attributes Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-gray-1 dark:bg-dark-3 border border-stroke dark:border-dark-4 text-xs mb-5">
            <div>
              <span className="text-dark-5 dark:text-dark-6 text-[11px] block">Department</span>
              <span className="font-bold text-dark dark:text-white">
                {currentVolunteer.department || "Faculty of Science"}
              </span>
            </div>
            <div>
              <span className="text-dark-5 dark:text-dark-6 text-[11px] block">Academic Session</span>
              <span className="font-bold text-dark dark:text-white">
                {currentVolunteer.session || "2020-21"}
              </span>
            </div>
            <div>
              <span className="text-dark-5 dark:text-dark-6 text-[11px] block">Phone Contact</span>
              <a
                href={getSafeTelUri(currentVolunteer.phone)}
                className="font-bold text-rose-600 dark:text-rose-400 hover:underline"
              >
                {currentVolunteer.phone}
              </a>
            </div>
            <div>
              <span className="text-dark-5 dark:text-dark-6 text-[11px] block">Hall Residence</span>
              <span className="font-bold text-dark dark:text-white">
                {currentVolunteer.roomNo || "Main Building"}
              </span>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-stroke dark:border-dark-3">
            <div className="p-3.5 rounded-xl bg-gray-1/60 dark:bg-dark-3/60 text-center">
              <p className="text-xs text-dark-5 dark:text-dark-6">Managed & Coordinated</p>
              <p className="text-xl font-black text-rose-600 dark:text-rose-400 mt-0.5">
                {coordinatedRequests.length}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-gray-1/60 dark:bg-dark-3/60 text-center">
              <p className="text-xs text-dark-5 dark:text-dark-6">Calls & Inquiries Logged</p>
              <p className="text-xl font-black text-blue-600 dark:text-blue-400 mt-0.5">
                {myCallLogs.length}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-gray-1/60 dark:bg-dark-3/60 text-center col-span-2 sm:col-span-1">
              <p className="text-xs text-dark-5 dark:text-dark-6">Assigned Unit</p>
              <p className="text-sm font-bold text-dark dark:text-white mt-1 truncate">
                {currentVolunteer.hallUnit.split(" ")[0]} Hall
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* My Hall Unit Executive Committee Members */}
      <div className="rounded-3xl bg-white dark:bg-dark-2 p-6 border border-stroke dark:border-dark-3 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-black text-dark dark:text-white flex items-center gap-2">
              <Users className="size-5 text-rose-600" />
              <span>My Hall Unit Team ({currentVolunteer.hallUnit})</span>
            </h2>
            <p className="text-xs text-dark-5 dark:text-dark-6">
              Executive committee peers of your hall unit. To see all 16 DU halls, visit the Hall Units Directory.
            </p>
          </div>

          <Link
            href="/hall-units"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 hover:bg-rose-100 transition self-start sm:self-auto"
          >
            <span>All 16 Hall Units</span>
            <ExternalLink className="size-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {myUnitMembers.map((member) => (
            <div
              key={member.id}
              className={`p-3.5 rounded-2xl border transition flex items-center justify-between gap-3 ${
                member.id === currentVolunteer.id
                  ? "border-rose-300 bg-rose-50/50 dark:border-rose-900/60 dark:bg-rose-950/20"
                  : "border-stroke dark:border-dark-4 bg-gray-1/50 dark:bg-dark-3/50 hover:bg-white dark:hover:bg-dark-3"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="size-10 rounded-xl text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs"
                  style={{ backgroundColor: member.avatarBg }}
                >
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-dark dark:text-white truncate">
                      {member.name}
                    </span>
                    {member.id === currentVolunteer.id && (
                      <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-rose-600 text-white">
                        You
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold block">
                    {member.role}
                  </span>
                  <span className="text-[10px] text-dark-5 dark:text-dark-6 block truncate">
                    {member.department || member.session || member.studentId}
                  </span>
                </div>
              </div>

              <a
                href={getSafeTelUri(member.phone)}
                className="size-8 rounded-xl bg-white dark:bg-dark-2 border border-stroke dark:border-dark-4 flex items-center justify-center text-rose-600 hover:bg-rose-600 hover:text-white transition shrink-0"
                title={`Call ${member.name}`}
              >
                <Phone className="size-3.5" />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Calls by this Volunteer */}
      <div className="rounded-3xl bg-white dark:bg-dark-2 p-6 border border-stroke dark:border-dark-3 shadow-xs space-y-4">
        <h3 className="text-base font-black text-dark dark:text-white">
          My Call History & Donor Feedback ({myCallLogs.length})
        </h3>

        {myCallLogs.length > 0 ? (
          <div className="space-y-2.5">
            {myCallLogs.map((c) => (
              <div
                key={c.id}
                className="p-3.5 rounded-xl bg-gray-1 dark:bg-dark-3 border border-stroke dark:border-dark-4 text-xs space-y-1"
              >
                <div className="flex justify-between items-center text-dark-5 dark:text-dark-6 text-[11px]">
                  <span className="font-bold text-dark dark:text-white">
                    {c.donorName} ({c.bloodGroup}) • {c.donorPhone}
                  </span>
                  <span>{new Date(c.timestamp).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-rose-600 dark:text-rose-400 uppercase text-[10px] bg-rose-50 dark:bg-rose-950 px-2 py-0.5 rounded-md">
                    {c.outcome}
                  </span>
                  <p className="text-dark dark:text-white font-medium">{c.comment}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-dark-5 dark:text-dark-6 italic">
            You have not logged any donor calls yet. Go to{" "}
            <Link href="/search-blood" className="text-rose-600 font-bold hover:underline">
              Search Blood
            </Link>{" "}
            to call donors.
          </p>
        )}
      </div>
    </div>
  );
}
