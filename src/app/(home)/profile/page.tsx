"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useBadhon } from "@/context/badhon-context";
import { getSafeTelUri } from "@/utils/security";
import {
  AlertCircle,
  CheckCircle2,
  Droplet,
  Edit3,
  ExternalLink,
  Lock,
  LogOut,
  Phone,
  ShieldCheck,
  User,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";

export default function ProfilePage() {
  const router = useRouter();
  const { currentVolunteer, bloodRequests, donors } = useBadhon();

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: currentVolunteer.name,
    phone: currentVolunteer.phone,
    department: currentVolunteer.department,
    bloodGroup: currentVolunteer.bloodGroup || "B+",
    bio: "Active voluntary blood transfusion coordinator at Dhaka University.",
    currentPassword: "",
    newPassword: "",
  });
  const [saveLoading, setSaveLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);

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

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/auth/sign-in");
    } catch {
      router.push("/auth/sign-in");
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      const data = await res.json();
      if (!res.ok) {
        setFeedback({ type: "error", msg: data.error || "Failed to update profile." });
        setSaveLoading(false);
        return;
      }

      setFeedback({ type: "success", msg: "Profile successfully updated!" });
      setTimeout(() => {
        setIsEditing(false);
        setFeedback(null);
        window.location.reload();
      }, 1200);
    } catch {
      setFeedback({ type: "error", msg: "Network error saving profile." });
      setSaveLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumb pageName="Volunteer Profile" crumbName="Profile" hideTitle />

      {/* Main Identity Hero Card */}
      <div className="bg-white dark:bg-dark-2 rounded-3xl p-6 border border-stroke dark:border-dark-3 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stroke dark:border-dark-3 pb-5 mb-5">
          <div className="flex items-center gap-4">
            <div
              className="size-16 sm:size-20 rounded-2xl text-white font-black text-xl flex items-center justify-center shrink-0 shadow-md ring-4 ring-rose-50 dark:ring-rose-950/40"
              style={{ backgroundColor: currentVolunteer.avatarBg }}
            >
              {currentVolunteer.name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-dark dark:text-white">
                  {currentVolunteer.name}
                </h1>
                <span className="size-2 rounded-full bg-emerald-500" title="Active Duty Session" />
              </div>
              <p className="text-xs text-rose-600 dark:text-rose-400 font-bold mt-0.5">
                {currentVolunteer.role} • {currentVolunteer.hallUnit}
              </p>
              <p className="text-xs text-dark-5 dark:text-dark-6 mt-0.5">
                Student ID: <strong>{currentVolunteer.studentId}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-stroke dark:border-dark-3 hover:border-rose-400 text-dark dark:text-white text-xs font-bold transition"
            >
              <Edit3 className="size-3.5 text-rose-600" />
              <span>Edit Profile</span>
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-1 dark:bg-dark-3 hover:bg-rose-50 hover:text-rose-600 text-dark-5 dark:text-dark-6 text-xs font-bold transition"
            >
              <LogOut className="size-3.5" />
              <span>Sign Out</span>
            </button>
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
            <span className="text-dark-5 dark:text-dark-6 text-[11px] block">Blood Group</span>
            <span className="font-bold text-dark dark:text-white inline-flex items-center gap-1">
              <Droplet className="size-3 text-rose-600 fill-rose-600" />
              <span>{currentVolunteer.bloodGroup || "B+"}</span>
            </span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl border border-stroke dark:border-dark-4 bg-white dark:bg-dark-2">
            <span className="text-[11px] text-dark-5 dark:text-dark-6 font-semibold block">
              Calls Placed
            </span>
            <span className="text-xl font-black text-rose-600 mt-1 block">
              {myCallLogs.length}
            </span>
          </div>
          <div className="p-3.5 rounded-xl border border-stroke dark:border-dark-4 bg-white dark:bg-dark-2">
            <span className="text-[11px] text-dark-5 dark:text-dark-6 font-semibold block">
              Managed Requests
            </span>
            <span className="text-xl font-black text-emerald-600 mt-1 block">
              {coordinatedRequests.length}
            </span>
          </div>
          <div className="p-3.5 rounded-xl border border-stroke dark:border-dark-4 bg-white dark:bg-dark-2 col-span-2 sm:col-span-1">
            <span className="text-[11px] text-dark-5 dark:text-dark-6 font-semibold block">
              Assigned Hall Unit
            </span>
            <span className="text-xs font-bold text-dark dark:text-white mt-1 block truncate">
              {currentVolunteer.hallUnit}
            </span>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white dark:bg-dark-2 rounded-2xl shadow-2xl border border-stroke dark:border-dark-3 overflow-hidden">
            <div className="p-5 border-b border-stroke dark:border-dark-3 flex items-center justify-between">
              <h2 className="font-black text-sm text-dark dark:text-white flex items-center gap-2">
                <Edit3 className="size-4 text-rose-600" />
                <span>Edit Profile & Security</span>
              </h2>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1 rounded-lg hover:bg-gray-1 dark:hover:bg-dark-3 text-dark-5"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-5 space-y-4 text-xs">
              {feedback && (
                <div
                  className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                    feedback.type === "success"
                      ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400"
                      : "bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400"
                  }`}
                >
                  {feedback.type === "success" ? (
                    <CheckCircle2 className="size-4" />
                  ) : (
                    <AlertCircle className="size-4" />
                  )}
                  <span>{feedback.msg}</span>
                </div>
              )}

              <div>
                <label className="font-bold text-dark dark:text-white block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full rounded-xl border border-stroke dark:border-dark-3 bg-gray-1 dark:bg-dark-3 px-3 py-2 text-dark dark:text-white outline-none focus:border-rose-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-dark dark:text-white block mb-1">
                    Phone Contact
                  </label>
                  <input
                    type="tel"
                    required
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full rounded-xl border border-stroke dark:border-dark-3 bg-gray-1 dark:bg-dark-3 px-3 py-2 text-dark dark:text-white outline-none focus:border-rose-600"
                  />
                </div>
                <div>
                  <label className="font-bold text-dark dark:text-white block mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.department}
                    onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                    className="w-full rounded-xl border border-stroke dark:border-dark-3 bg-gray-1 dark:bg-dark-3 px-3 py-2 text-dark dark:text-white outline-none focus:border-rose-600"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-stroke dark:border-dark-3 space-y-3">
                <span className="font-bold text-dark dark:text-white block">
                  Change Password (Optional)
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-dark-5 dark:text-dark-6 block mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      placeholder="Enter current"
                      value={editForm.currentPassword}
                      onChange={(e) =>
                        setEditForm({ ...editForm, currentPassword: e.target.value })
                      }
                      className="w-full rounded-xl border border-stroke dark:border-dark-3 bg-gray-1 dark:bg-dark-3 px-3 py-2 text-dark dark:text-white outline-none focus:border-rose-600"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-dark-5 dark:text-dark-6 block mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      placeholder="At least 4 chars"
                      value={editForm.newPassword}
                      onChange={(e) =>
                        setEditForm({ ...editForm, newPassword: e.target.value })
                      }
                      className="w-full rounded-xl border border-stroke dark:border-dark-3 bg-gray-1 dark:bg-dark-3 px-3 py-2 text-dark dark:text-white outline-none focus:border-rose-600"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-stroke dark:border-dark-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl border border-stroke text-dark-5 hover:text-dark text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveLoading}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md transition disabled:opacity-60"
                >
                  {saveLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Two Column Section: Recent Calls and Coordinated Blood Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Call Logs */}
        <div className="bg-white dark:bg-dark-2 rounded-2xl p-5 border border-stroke dark:border-dark-3 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-sm text-dark dark:text-white flex items-center gap-2">
              <Phone className="size-4 text-rose-600" />
              <span>Recent Calls Placed ({myCallLogs.length})</span>
            </h2>
            <Link
              href="/search-blood"
              className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline"
            >
              Call More Donors
            </Link>
          </div>

          {myCallLogs.length === 0 ? (
            <p className="text-xs text-dark-5 dark:text-dark-6 py-8 text-center">
              You have not logged any donor calls yet. Go to{" "}
              <Link href="/search-blood" className="text-rose-600 font-bold hover:underline">
                Search Donors
              </Link>{" "}
              to start coordinating.
            </p>
          ) : (
            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {myCallLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-gray-1/60 dark:bg-dark-3/60 border border-stroke dark:border-dark-4 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-dark dark:text-white">{log.donorName}</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                        {log.bloodGroup}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        log.outcome === "agreed"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                          : log.outcome === "refused"
                            ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                            : "bg-gray-2 text-dark-5 dark:bg-dark-4 dark:text-dark-6"
                      }`}
                    >
                      {log.outcome}
                    </span>
                  </div>
                  <p className="text-dark-5 dark:text-dark-6 text-[11px]">{log.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Coordinated Blood Requests */}
        <div className="bg-white dark:bg-dark-2 rounded-2xl p-5 border border-stroke dark:border-dark-3 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-sm text-dark dark:text-white flex items-center gap-2">
              <Droplet className="size-4 text-rose-600" />
              <span>Coordinated Requisitions ({coordinatedRequests.length})</span>
            </h2>
            <Link
              href="/blood-requests"
              className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline"
            >
              View All Requests
            </Link>
          </div>

          {coordinatedRequests.length === 0 ? (
            <p className="text-xs text-dark-5 dark:text-dark-6 py-8 text-center">
              No requisitions coordinated yet. When you create or manage requests, they will appear here.
            </p>
          ) : (
            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {coordinatedRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-3 rounded-xl bg-gray-1/60 dark:bg-dark-3/60 border border-stroke dark:border-dark-4 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-dark dark:text-white">{req.patientName}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-dark-5 dark:text-dark-6">
                      {req.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-dark-5 dark:text-dark-6 text-[11px]">
                    <span>{req.hospital}</span>
                    <span className="font-bold text-rose-600">{req.bloodGroup}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
