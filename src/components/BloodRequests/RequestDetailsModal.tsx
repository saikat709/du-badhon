"use client";

import { BloodRequest, getShortHallUnit } from "@/types/badhon";
import { getSafeTelUri } from "@/utils/security";
import {
  AlertCircle,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Droplet,
  Phone,
  PhoneCall,
  Search,
  Sparkles,
  User,
  X,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface RequestDetailsModalProps {
  request: BloodRequest | null;
  onClose: () => void;
  onUnassignBag: (requestId: string, bagNumber: number) => void;
  onMarkCompleted: (requestId: string, notes?: string) => void;
  onCancelRequest: (requestId: string, reason: string) => void;
}

export function RequestDetailsModal({
  request,
  onClose,
  onUnassignBag,
  onMarkCompleted,
  onCancelRequest,
}: RequestDetailsModalProps) {
  const [completeNote, setCompleteNote] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [showCancelPrompt, setShowCancelPrompt] = useState(false);

  useEffect(() => {
    if (!request) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [request, onClose]);

  if (!request) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-dark-2 rounded-2xl shadow-2xl border border-stroke dark:border-dark-3 my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-6 text-white flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
                {request.id}
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-600">
                {request.isPlasma ? (
                  <Sparkles className="size-3" />
                ) : (
                  <Droplet className="size-3" />
                )}
                <span>
                  {request.bloodGroup} {request.isPlasma ? "Plasma" : "Blood"}
                </span>
              </span>
              <span className="text-xs font-medium text-white/90 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/20">
                Created by {request.createdByVolunteerName} ({getShortHallUnit(request.createdByVolunteerHall || "DU Central")})
              </span>
            </div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Building2 className="size-5 text-blue-200 shrink-0" />
              <span>{request.hospital}</span>
            </h2>
            <p className="text-xs text-blue-100 mt-1">
              Patient: <span className="font-semibold text-white">{request.patientName}</span> ({request.reason})
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Key Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-1 dark:bg-dark-3 p-4 rounded-xl text-xs">
            <div>
              <span className="text-dark-5 dark:text-dark-6 flex items-center gap-1">
                <Phone className="size-3" />
                <span>Attendant Phone</span>
              </span>
              <a
                href={getSafeTelUri(request.contactPhone)}
                className="font-bold text-rose-600 dark:text-rose-400 text-sm hover:underline block mt-0.5"
              >
                {request.contactPhone}
              </a>
              <span className="text-[10px] text-gray-5 block truncate">
                {request.contactPerson}
              </span>
            </div>

            <div>
              <span className="text-dark-5 dark:text-dark-6 flex items-center gap-1">
                <Droplet className="size-3 text-rose-500" />
                <span>Bags Status</span>
              </span>
              <span className="font-bold text-dark dark:text-white text-sm block mt-0.5">
                {request.managedBags} / {request.totalBags} Managed
              </span>
            </div>

            <div>
              <span className="text-dark-5 dark:text-dark-6 flex items-center gap-1">
                <AlertCircle className="size-3 text-amber-500" />
                <span>Urgency</span>
              </span>
              <span className="font-bold text-amber-600 dark:text-amber-400 text-sm block mt-0.5">
                {request.urgency.split(" ")[0]}
              </span>
            </div>

            <div>
              <span className="text-dark-5 dark:text-dark-6 flex items-center gap-1">
                <Calendar className="size-3" />
                <span>Needed Date</span>
              </span>
              <span className="font-bold text-dark dark:text-white text-sm block mt-0.5">
                {request.dateNeeded}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3 rounded-xl bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <User className="size-3.5 text-rose-600 shrink-0" />
                  <span className="text-dark-5 dark:text-dark-6">Created by:</span>
                  <span className="font-bold text-dark dark:text-white truncate">
                    {request.createdByVolunteerName}
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-200/70 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300 shrink-0">
                  {getShortHallUnit(request.createdByVolunteerHall || "DU Central")}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
                  <span className="text-dark-5 dark:text-dark-6">Managed by:</span>
                  <span className="font-bold text-dark dark:text-white truncate">
                    {request.managedByVolunteerName || "In Coordination"}
                  </span>
                </div>
                {request.managedByVolunteerHall && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 shrink-0">
                    {getShortHallUnit(request.managedByVolunteerHall)}
                  </span>
                )}
              </div>
            </div>

            {(request.status === "completed" || request.status === "cancelled") && (
              <div className="flex items-center justify-end px-1 text-xs">
                {request.status === "completed" && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                    <CheckCircle2 className="size-3" />
                    <span>Fulfillment Completed {request.completedAt ? `(${request.completedAt.split("T")[0]})` : ""}</span>
                  </span>
                )}
                {request.status === "cancelled" && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-rose-600 dark:text-rose-400 font-bold">
                    <XCircle className="size-3" />
                    <span>Cancelled {request.cancelledAt ? `(${request.cancelledAt.split("T")[0]})` : ""}</span>
                  </span>
                )}
              </div>
            )}
          </div>

          {request.notes && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-xl text-xs text-amber-900 dark:text-amber-300">
              <span className="font-bold block mb-0.5">Special Notes / Ward:</span>
              {request.notes}
            </div>
          )}

          {/* Bag Slots Management */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold text-dark dark:text-white flex items-center gap-1.5">
                <Droplet className="size-4 text-rose-600" />
                <span>Bag Slots ({request.totalBags} Required)</span>
              </h3>
              {request.managedBags < request.totalBags &&
                request.status !== "completed" &&
                request.status !== "cancelled" && (
                  <Link
                    href={`/search-blood?requestId=${request.id}&group=${encodeURIComponent(
                      request.bloodGroup,
                    )}`}
                    onClick={onClose}
                    className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline inline-flex items-center gap-1"
                  >
                    <Search className="size-3" />
                    <span>Search Donors to Fill Remaining</span>
                  </Link>
                )}
            </div>

            <div className="space-y-2">
              {request.assignedBags.map((bag) => (
                <div
                  key={bag.bagNumber}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border text-xs gap-2 ${
                    bag.donorId
                      ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40"
                      : "bg-gray-1 dark:bg-dark-3 border-dashed border-gray-300 dark:border-dark-4"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex size-7 items-center justify-center rounded-full text-xs font-bold ${
                        bag.donorId
                          ? "bg-emerald-600 text-white"
                          : "bg-gray-300 dark:bg-dark-4 text-dark dark:text-white"
                      }`}
                    >
                      #{bag.bagNumber}
                    </span>
                    <div>
                      {bag.donorId ? (
                        <>
                          <p className="font-bold text-dark dark:text-white text-sm">
                            {bag.donorName}{" "}
                            <span className="text-xs font-normal text-dark-5 dark:text-dark-6">
                              ({bag.donorHall?.split(" ")[0]} Hall)
                            </span>
                          </p>
                          <a
                            href={getSafeTelUri(bag.donorPhone || "")}
                            className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-medium hover:underline mt-0.5"
                          >
                            <PhoneCall className="size-3" />
                            <span>{bag.donorPhone}</span>
                          </a>
                        </>
                      ) : (
                        <p className="text-dark-5 dark:text-dark-6 italic">
                          Bag #{bag.bagNumber} - Awaiting Donor Assignment
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {bag.donorId ? (
                      request.status !== "completed" &&
                      request.status !== "cancelled" && (
                        <button
                          type="button"
                          onClick={() => onUnassignBag(request.id, bag.bagNumber)}
                          className="px-2.5 py-1 text-[11px] font-semibold text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-950/40 rounded-lg transition"
                        >
                          Unassign
                        </button>
                      )
                    ) : (
                      request.status !== "completed" &&
                      request.status !== "cancelled" && (
                        <Link
                          href={`/search-blood?requestId=${request.id}&bagNumber=${
                            bag.bagNumber
                          }&group=${encodeURIComponent(request.bloodGroup)}`}
                          onClick={onClose}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition"
                        >
                          <Search className="size-3" />
                          <span>Find Donor</span>
                        </Link>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cancellation View */}
          {showCancelPrompt ? (
            <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/20 space-y-3">
              <h4 className="text-xs font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                <XCircle className="size-4" />
                <span>Cancel Blood Request</span>
              </h4>
              <input
                type="text"
                placeholder="Reason for cancellation (e.g. Patient managed from family, surgery postponed)"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full rounded-xl border border-rose-300 dark:border-rose-900 bg-white dark:bg-dark-2 px-3 py-2 text-xs text-dark dark:text-white outline-none"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCancelPrompt(false)}
                  className="px-3 py-1.5 rounded-xl border text-xs font-semibold"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!cancelReason.trim()) return alert("Please specify cancellation reason");
                    onCancelRequest(request.id, cancelReason.trim());
                    onClose();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold"
                >
                  Confirm Cancel
                </button>
              </div>
            </div>
          ) : null}

          {/* Lifecycle Action Footer */}
          {request.status !== "completed" && request.status !== "cancelled" && (
            <div className="pt-4 border-t border-stroke dark:border-dark-3 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setShowCancelPrompt(true)}
                className="text-xs text-rose-600 dark:text-rose-400 font-semibold hover:underline flex items-center gap-1"
              >
                <XCircle className="size-3.5" />
                <span>Cancel this Request</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-stroke text-dark hover:bg-gray-2 dark:border-dark-3 dark:text-white text-xs font-semibold transition"
                >
                  Close
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onMarkCompleted(request.id, completeNote);
                    onClose();
                  }}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition"
                >
                  <CheckCircle2 className="size-3.5" />
                  <span>Mark Donation as Completed</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
