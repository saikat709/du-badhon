"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useBadhon } from "@/context/badhon-context";
import Link from "next/link";
import React, { useMemo } from "react";

export default function ProfilePage() {
  const { currentVolunteer, volunteers, switchVolunteer, bloodRequests, donors } =
    useBadhon();

  // Requests created by this volunteer
  const coordinatedRequests = useMemo(() => {
    return bloodRequests.filter((r) => r.createdByVolunteerName === currentVolunteer.name);
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

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <Breadcrumb pageName="Volunteer Profile" />

      {/* Profile Card */}
      <div className="overflow-hidden rounded-2xl bg-white dark:bg-dark-2 shadow-xs border border-stroke dark:border-dark-3">
        {/* Cover / Header Banner */}
        <div className="h-36 bg-gradient-to-r from-rose-700 via-rose-800 to-red-950 p-6 flex items-end justify-between text-white">
          <span className="text-xs font-bold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full backdrop-blur-xs">
            Badhon Active Executive Member
          </span>
        </div>

        <div className="px-6 pb-6 pt-0 relative">
          {/* Avatar */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-12 mb-4 gap-4">
            <div className="flex items-end gap-4">
              <div
                className="size-24 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg ring-4 ring-white dark:ring-dark-2"
                style={{ backgroundColor: currentVolunteer.avatarBg }}
              >
                {currentVolunteer.name
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")}
              </div>
              <div className="space-y-0.5">
                <h2 className="text-2xl font-black text-dark dark:text-white">
                  {currentVolunteer.name}
                </h2>
                <p className="text-xs text-rose-600 dark:text-rose-400 font-bold">
                  {currentVolunteer.role} • {currentVolunteer.hallUnit}
                </p>
                <p className="text-xs text-dark-5 dark:text-dark-6">
                  Student ID: {currentVolunteer.studentId} • Phone: {currentVolunteer.phone}
                </p>
              </div>
            </div>

            {/* Volunteer Switcher */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-dark-5 dark:text-dark-6 font-semibold">
                Switch Role:
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

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-stroke dark:border-dark-3">
            <div className="p-3 rounded-xl bg-gray-1 dark:bg-dark-3 text-center">
              <p className="text-xs text-dark-5 dark:text-dark-6">Coordinated Requests</p>
              <p className="text-xl font-black text-rose-600 dark:text-rose-400 mt-0.5">
                {coordinatedRequests.length}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-gray-1 dark:bg-dark-3 text-center">
              <p className="text-xs text-dark-5 dark:text-dark-6">Calls & Inquiries Logged</p>
              <p className="text-xl font-black text-blue-600 dark:text-blue-400 mt-0.5">
                {myCallLogs.length}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-gray-1 dark:bg-dark-3 text-center col-span-2 sm:col-span-1">
              <p className="text-xs text-dark-5 dark:text-dark-6">Assigned Unit</p>
              <p className="text-sm font-bold text-dark dark:text-white mt-1 truncate">
                {currentVolunteer.hallUnit.split(" ")[0]} Hall
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Calls by this Volunteer */}
      <div className="rounded-2xl bg-white dark:bg-dark-2 p-6 border border-stroke dark:border-dark-3 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-dark dark:text-white">
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
            You have not logged any donor calls yet. Go to <Link href="/search-blood" className="text-rose-600 font-bold hover:underline">Search Blood</Link> to call donors.
          </p>
        )}
      </div>
    </div>
  );
}
