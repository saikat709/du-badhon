"use client";

import { useBadhon } from "@/context/badhon-context";
import { CallOutcome, Donor } from "@/types/badhon";
import { getSafeTelUri, sanitizeInputText } from "@/utils/security";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Lock,
  MessageSquare,
  PhoneCall,
  PhoneOff,
  Timer,
  X,
  XCircle,
} from "lucide-react";
import React, { useEffect, useState } from "react";

interface CallDonorModalProps {
  donor: Donor | null;
  activeRequestId?: string;
  activeBagNumber?: number;
  onClose: () => void;
}

const OUTCOMES: {
  id: CallOutcome;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}[] = [
  {
    id: "agreed",
    label: "Agreed to Donate",
    icon: CheckCircle2,
    color: "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300",
  },
  {
    id: "refused",
    label: "Refused / Unavailable",
    icon: XCircle,
    color: "border-rose-500 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300",
  },
  {
    id: "unreachable",
    label: "No Answer / Unreachable",
    icon: PhoneOff,
    color: "border-amber-500 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300",
  },
  {
    id: "busy",
    label: "Busy / Call Later",
    icon: Clock,
    color: "border-blue-500 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300",
  },
  {
    id: "ineligible",
    label: "Temporarily Ineligible",
    icon: AlertTriangle,
    color: "border-purple-500 bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300",
  },
];

export function CallDonorModal({
  donor,
  activeRequestId,
  activeBagNumber,
  onClose,
}: CallDonorModalProps) {
  const { currentVolunteer, bloodRequests, logCallOutcome, releaseCallingDonor } =
    useBadhon();

  const [outcome, setOutcome] = useState<CallOutcome>("agreed");
  const [comment, setComment] = useState("");
  const [selectedRequestId, setSelectedRequestId] = useState<string>(() => {
    if (activeRequestId) return activeRequestId;
    if (donor) {
      const match = bloodRequests.find(
        (r) =>
          r.bloodGroup === donor.bloodGroup &&
          (r.status === "active" || r.status === "partially_managed"),
      );
      return match?.id || "";
    }
    return "";
  });

  const [selectedBagNumber, setSelectedBagNumber] = useState<number>(() => {
    if (activeBagNumber) return activeBagNumber;
    if (donor) {
      const match = bloodRequests.find(
        (r) =>
          r.bloodGroup === donor.bloodGroup &&
          (r.status === "active" || r.status === "partially_managed"),
      );
      const firstEmptyBag = match?.assignedBags.find((b) => !b.donorId);
      return firstEmptyBag?.bagNumber || 1;
    }
    return 1;
  });

  const [callDuration, setCallDuration] = useState(0);

  // Track submission to prevent releasing lock when saved
  const isSubmittedRef = React.useRef(false);
  const donorId = donor?.id;

  // Call timer
  useEffect(() => {
    if (!donor) return;
    const interval = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [donor]);

  // Clean unmount & Escape key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (donorId && !isSubmittedRef.current) {
          releaseCallingDonor(donorId);
        }
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      // If modal unmounts unexpectedly before completion, safely release caller lock
      if (donorId && !isSubmittedRef.current) {
        releaseCallingDonor(donorId);
      }
    };
  }, [donorId, releaseCallingDonor, onClose]);

  if (!donor) return null;

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const matchingRequests = bloodRequests.filter(
    (r) =>
      r.bloodGroup === donor.bloodGroup &&
      (r.status === "active" || r.status === "partially_managed"),
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanComment = sanitizeInputText(comment, 500);
    if (!cleanComment) {
      return alert("Please enter a brief comment describing the call feedback.");
    }

    isSubmittedRef.current = true;
    const shouldAssign = outcome === "agreed" && selectedRequestId;

    logCallOutcome(
      donor.id,
      outcome,
      cleanComment,
      shouldAssign ? selectedRequestId : undefined,
      shouldAssign ? selectedBagNumber : undefined,
    );

    onClose();
  };

  const handleCancelAndRelease = () => {
    if (donor) {
      isSubmittedRef.current = true;
      releaseCallingDonor(donor.id);
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto"
      onClick={handleCancelAndRelease}
    >
      <div
        className="w-full max-w-xl bg-white dark:bg-dark-2 rounded-2xl shadow-2xl border border-stroke dark:border-dark-3 my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Call Lock Banner */}
        <div className="bg-gradient-to-r from-rose-600 via-rose-700 to-red-800 p-5 text-white">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <span className="flex size-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider bg-black/25 px-2.5 py-0.5 rounded-full">
                <Lock className="size-3" />
                <span>Active Call Lock</span>
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-mono font-bold bg-white/20 px-2.5 py-0.5 rounded-md">
                <Timer className="size-3" />
                <span>{formatTimer(callDuration)}</span>
              </span>
            </div>

            <button
              onClick={handleCancelAndRelease}
              className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
            >
              <X className="size-5" />
            </button>
          </div>

          <div className="mt-3">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-black">{donor.name}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-white text-rose-700 shadow-sm">
                {donor.bloodGroup}
              </span>
            </div>
            <p className="text-xs text-rose-100 mt-0.5">
              {donor.hallUnit} • {donor.department} ({donor.session})
            </p>
          </div>
        </div>

        {/* Lock Announcement Notice */}
        <div className="bg-amber-50 dark:bg-amber-950/30 px-5 py-2.5 border-b border-amber-200 dark:border-amber-900/40 flex items-center justify-between text-xs text-amber-900 dark:text-amber-300">
          <span className="flex items-center gap-1.5 font-medium">
            <Lock className="size-3.5 text-amber-600 shrink-0" />
            <span>
              Locked by <strong>{currentVolunteer.name}</strong> ({currentVolunteer.hallUnit.split(" ")[0]} Hall). Other members see this donor as currently in-call.
            </span>
          </span>
        </div>

        <form onSubmit={handleSave} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Direct Phone Dial Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 bg-gray-1 dark:bg-dark-3 rounded-xl border border-stroke dark:border-dark-4">
            <div>
              <p className="text-xs text-dark-5 dark:text-dark-6">Donor Contact Number:</p>
              <p className="text-lg font-black text-dark dark:text-white font-mono">
                {donor.phone}
              </p>
            </div>

            <a
              href={getSafeTelUri(donor.phone)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition active:scale-95"
            >
              <PhoneCall className="size-4" />
              <span>Click to Dial Donor</span>
            </a>
          </div>

          {/* Call Outcome Options */}
          <div>
            <label className="block text-xs font-bold text-dark dark:text-white mb-2">
              Call Outcome / Status: <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {OUTCOMES.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setOutcome(item.id)}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs font-bold transition text-left ${
                      outcome === item.id
                        ? `${item.color} shadow-sm ring-2 ring-rose-500/40`
                        : "border-stroke dark:border-dark-3 text-dark dark:text-white hover:bg-gray-1 dark:hover:bg-dark-3"
                    }`}
                  >
                    <IconComponent className="size-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Blood Request Assignment (if agreed) */}
          {outcome === "agreed" && (
            <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 space-y-2.5 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-blue-900 dark:text-blue-300">
                  Assign to Active Blood Request:
                </label>
                <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400">
                  ({matchingRequests.length} matching requests found)
                </span>
              </div>

              {matchingRequests.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <select
                    value={selectedRequestId}
                    onChange={(e) => {
                      setSelectedRequestId(e.target.value);
                      const req = bloodRequests.find((r) => r.id === e.target.value);
                      if (req) {
                        const emptyBag = req.assignedBags.find((b) => !b.donorId);
                        if (emptyBag) setSelectedBagNumber(emptyBag.bagNumber);
                      }
                    }}
                    className="sm:col-span-2 rounded-lg border border-blue-300 dark:border-blue-800 bg-white dark:bg-dark-2 px-3 py-2 text-xs text-dark dark:text-white outline-none"
                  >
                    <option value="">-- Don&apos;t assign to request right now --</option>
                    {matchingRequests.map((req) => (
                      <option key={req.id} value={req.id}>
                        {req.id}: {req.hospital} ({req.managedBags}/{req.totalBags} bags)
                      </option>
                    ))}
                  </select>

                  {selectedRequestId && (
                    <select
                      value={selectedBagNumber}
                      onChange={(e) => setSelectedBagNumber(parseInt(e.target.value))}
                      className="rounded-lg border border-blue-300 dark:border-blue-800 bg-white dark:bg-dark-2 px-3 py-2 text-xs text-dark dark:text-white outline-none"
                    >
                      {bloodRequests
                        .find((r) => r.id === selectedRequestId)
                        ?.assignedBags.map((bag) => (
                          <option key={bag.bagNumber} value={bag.bagNumber}>
                            Bag #{bag.bagNumber} {bag.donorId ? "(Reassign)" : "(Open)"}
                          </option>
                        ))}
                    </select>
                  )}
                </div>
              ) : (
                <p className="text-xs text-blue-700 dark:text-blue-400">
                  No active requests currently require {donor.bloodGroup}. Donor will be logged as agreed for future/upcoming calls.
                </p>
              )}
            </div>
          )}

          {/* Mandatory Call Comment */}
          <div>
            <label className="block text-xs font-bold text-dark dark:text-white mb-1">
              Call Comment & Donor Feedback: <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="e.g. Donor is ready, will arrive at DMCH 10:30 AM tomorrow. Informed attendant Kamal..."
              className="w-full rounded-xl border border-stroke bg-transparent p-3 text-xs text-dark dark:text-white outline-none focus:border-rose-600 dark:border-dark-3"
            />
          </div>

          {/* Past Call History Trail */}
          {donor.callHistory.length > 0 && (
            <div className="pt-2 border-t border-stroke dark:border-dark-3">
              <p className="text-xs font-bold text-dark dark:text-white mb-2 flex items-center gap-1.5">
                <MessageSquare className="size-3.5 text-rose-600" />
                <span>Previous Call History ({donor.callHistory.length}):</span>
              </p>
              <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                {donor.callHistory.map((call) => (
                  <div
                    key={call.id}
                    className="p-2.5 rounded-xl bg-gray-1 dark:bg-dark-3 text-xs space-y-1 border border-stroke dark:border-dark-4"
                  >
                    <div className="flex justify-between items-center text-[10px] text-dark-5 dark:text-dark-6">
                      <span className="font-semibold text-rose-600 dark:text-rose-400">
                        {call.volunteerName} ({call.volunteerHall.split(" ")[0]})
                      </span>
                      <span>{new Date(call.timestamp).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold capitalize text-dark-5 dark:text-dark-6 text-[10px]">
                        [{call.outcome}]
                      </span>
                      <p className="text-dark dark:text-white">{call.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-3 border-t border-stroke dark:border-dark-3 flex justify-between items-center gap-3">
            <button
              type="button"
              onClick={handleCancelAndRelease}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
            >
              Cancel & Release Lock
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition active:scale-95"
            >
              Save Feedback & Complete Call
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
