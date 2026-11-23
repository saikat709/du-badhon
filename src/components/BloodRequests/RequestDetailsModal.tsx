"use client";

import { BloodRequest } from "@/types/badhon";
import Link from "next/link";
import React, { useState } from "react";

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

  if (!request) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-white dark:bg-dark-2 rounded-2xl shadow-2xl border border-stroke dark:border-dark-3 my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-6 text-white flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
                {request.id}
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-600">
                {request.bloodGroup} {request.isPlasma ? "Plasma" : "Blood"}
              </span>
              <span className="text-xs font-medium text-white/80">
                Created by {request.createdByVolunteerName}
              </span>
            </div>
            <h2 className="text-xl font-bold">{request.hospital}</h2>
            <p className="text-sm text-blue-100">
              Patient: <span className="font-semibold text-white">{request.patientName}</span> ({request.reason})
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-white/80 hover:text-white text-2xl font-bold p-1 leading-none"
          >
            &times;
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Key Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-1 dark:bg-dark-3 p-4 rounded-xl text-xs">
            <div>
              <span className="text-dark-5 dark:text-dark-6 block">Attendant Phone</span>
              <a
                href={`tel:${request.contactPhone}`}
                className="font-bold text-rose-600 dark:text-rose-400 text-sm hover:underline"
              >
                {request.contactPhone}
              </a>
              <span className="text-[10px] text-gray-5 block">{request.contactPerson}</span>
            </div>

            <div>
              <span className="text-dark-5 dark:text-dark-6 block">Bags Status</span>
              <span className="font-bold text-dark dark:text-white text-sm">
                {request.managedBags} / {request.totalBags} Managed
              </span>
            </div>

            <div>
              <span className="text-dark-5 dark:text-dark-6 block">Urgency</span>
              <span className="font-bold text-amber-600 dark:text-amber-400 text-sm">
                {request.urgency.split(" ")[0]}
              </span>
            </div>

            <div>
              <span className="text-dark-5 dark:text-dark-6 block">Needed Date</span>
              <span className="font-bold text-dark dark:text-white text-sm">
                {request.dateNeeded}
              </span>
            </div>
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
              <h3 className="text-sm font-bold text-dark dark:text-white">
                Bag Slots ({request.totalBags} Required)
              </h3>
              {request.managedBags < request.totalBags &&
                request.status !== "completed" &&
                request.status !== "cancelled" && (
                  <Link
                    href={`/search-blood?requestId=${request.id}&group=${encodeURIComponent(
                      request.bloodGroup,
                    )}`}
                    onClick={onClose}
                    className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
                  >
                    <span>+ Search Donors to Fill Remaining</span>
                  </Link>
                )}
            </div>

            <div className="space-y-2">
              {request.assignedBags.map((bag) => (
                <div
                  key={bag.bagNumber}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl border text-xs gap-2 ${
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
                            href={`tel:${bag.donorPhone}`}
                            className="text-emerald-700 dark:text-emerald-400 font-medium hover:underline"
                          >
                            📞 {bag.donorPhone}
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
                          className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition"
                        >
                          Find Donor
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
              <h4 className="text-xs font-bold text-rose-700 dark:text-rose-400">
                Cancel Blood Request
              </h4>
              <input
                type="text"
                placeholder="Reason for cancellation (e.g. Patient managed from family, surgery postponed)"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full rounded-lg border border-rose-300 dark:border-rose-900 bg-white dark:bg-dark-2 px-3 py-2 text-xs text-dark dark:text-white outline-none"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCancelPrompt(false)}
                  className="px-3 py-1.5 rounded-lg border text-xs font-semibold"
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
                  className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold"
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
                className="text-xs text-rose-600 dark:text-rose-400 font-semibold hover:underline"
              >
                Cancel this Request
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg border border-stroke text-dark hover:bg-gray-2 dark:border-dark-3 dark:text-white text-xs font-semibold transition"
                >
                  Close
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onMarkCompleted(request.id, completeNote);
                    onClose();
                  }}
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition"
                >
                  ✓ Mark Donation as Completed
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
