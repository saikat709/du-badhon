"use client";

import { BloodRequest } from "@/types/badhon";
import {
  AlertCircle,
  Building2,
  Calendar,
  CheckCircle2,
  Droplet,
  Search,
  Sparkles,
  User,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import React from "react";

interface RequestCardProps {
  request: BloodRequest;
  onOpenDetails: (request: BloodRequest) => void;
  onMarkCompleted: (requestId: string) => void;
  onCancelRequest: (requestId: string) => void;
}

export function RequestCard({
  request,
  onOpenDetails,
  onMarkCompleted,
  onCancelRequest,
}: RequestCardProps) {
  const isManaged = request.managedBags >= request.totalBags;
  const isCompleted = request.status === "completed";
  const isCancelled = request.status === "cancelled";

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-2xl p-5 border transition-all duration-200 shadow-sm hover:shadow-md ${
        isCompleted
          ? "bg-white dark:bg-dark-2 border-emerald-300 dark:border-emerald-900/50"
          : isCancelled
            ? "bg-gray-1 dark:bg-dark-3 border-gray-300 dark:border-dark-4 opacity-75"
            : "bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white border-blue-600 shadow-blue-500/10"
      }`}
    >
      {/* Top Badges: Blood Group Badge */}
      <div className="absolute -top-3.5 -right-2 flex items-center gap-1.5 z-10">
        <span
          className={`flex size-11 items-center justify-center rounded-full text-base font-black shadow-md border-2 ${
            isCompleted
              ? "bg-emerald-600 border-white text-white"
              : isCancelled
                ? "bg-gray-500 border-white text-white"
                : "bg-rose-600 border-white text-white animate-pulse"
          }`}
        >
          {request.bloodGroup}
        </span>
      </div>

      <div className="space-y-3.5">
        {/* Header Tags */}
        <div className="flex flex-wrap items-center gap-1.5 pr-12">
          <span
            className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
              request.isPlasma
                ? "bg-amber-400 text-amber-950 font-black"
                : isCompleted || isCancelled
                  ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                  : "bg-white/20 text-white backdrop-blur-xs"
            }`}
          >
            {request.isPlasma ? (
              <>
                <Sparkles className="size-3" />
                <span>Plasma / Platelet</span>
              </>
            ) : (
              <>
                <Droplet className="size-3 text-rose-300" />
                <span>Whole Blood</span>
              </>
            )}
          </span>

          <span
            className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
              request.urgency.includes("Emergency")
                ? "bg-rose-500/30 text-rose-200 border border-rose-400/40"
                : "bg-black/20 text-white/90"
            }`}
          >
            <AlertCircle className="size-3" />
            <span>{request.urgency.split(" ")[0]}</span>
          </span>

          {isCompleted && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white">
              <CheckCircle2 className="size-3" />
              <span>Completed</span>
            </span>
          )}
          {isCancelled && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-600 text-white">
              <XCircle className="size-3" />
              <span>Cancelled</span>
            </span>
          )}
        </div>

        {/* Hospital Name & Reason */}
        <div>
          <div className="flex items-start gap-2">
            <Building2 className={`size-5 shrink-0 mt-0.5 ${isCompleted || isCancelled ? "text-rose-600 dark:text-rose-400" : "text-blue-200"}`} />
            <h3
              className={`font-bold text-base leading-snug line-clamp-2 ${
                isCompleted || isCancelled
                  ? "text-dark dark:text-white"
                  : "text-white"
              }`}
            >
              {request.hospital}
            </h3>
          </div>
          <p
            className={`text-xs mt-1.5 font-medium ${
              isCompleted || isCancelled
                ? "text-dark-5 dark:text-dark-6"
                : "text-blue-100"
            }`}
          >
            Reason: <span className="font-semibold">{request.reason}</span>
          </p>
        </div>

        {/* Patient & Bag Fulfillment */}
        <div
          className={`rounded-xl p-3 text-xs space-y-2 ${
            isCompleted || isCancelled
              ? "bg-gray-2 dark:bg-dark-3 text-dark dark:text-white"
              : "bg-black/20 backdrop-blur-xs text-white"
          }`}
        >
          <div className="flex justify-between items-center font-bold">
            <span className="inline-flex items-center gap-1.5">
              <Droplet className="size-3.5 text-rose-400" />
              <span>
                {request.totalBags} bag ({request.managedBags} Managed)
              </span>
            </span>
            <span
              className={`text-[11px] px-2 py-0.5 rounded-md font-semibold ${
                isManaged
                  ? "bg-emerald-500/30 text-emerald-300 font-bold"
                  : "text-amber-300"
              }`}
            >
              {isManaged ? "Fulfilled" : `${request.totalBags - request.managedBags} bag needed`}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-black/30 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                isManaged ? "bg-emerald-400" : "bg-rose-500"
              }`}
              style={{
                width: `${Math.min(
                  100,
                  (request.managedBags / request.totalBags) * 100,
                )}%`,
              }}
            />
          </div>

          <div className="flex justify-between items-center text-[11px] pt-1 text-white/80 dark:text-dark-6">
            <span className="inline-flex items-center gap-1">
              <User className="size-3 text-gray-4" />
              <span>{request.patientName}</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="size-3 text-gray-4" />
              <span>{request.dateNeeded}</span>
            </span>
          </div>
        </div>

        {/* Assigned Donors Pill Preview */}
        {request.assignedBags.some((b) => b.donorName) && (
          <div className="text-[11px] space-y-1">
            <p className="font-semibold text-white/90 dark:text-dark-6">Assigned Donors:</p>
            <div className="flex flex-wrap gap-1">
              {request.assignedBags
                .filter((b) => b.donorName)
                .map((b) => (
                  <span
                    key={b.bagNumber}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/20 text-white dark:bg-dark-3 dark:text-white text-[10px]"
                  >
                    <span>Bag {b.bagNumber}:</span>
                    <span className="font-bold">{b.donorName}</span>
                  </span>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-3 border-t border-white/20 dark:border-dark-3 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          {!isCompleted && !isCancelled && !isManaged && (
            <Link
              href={`/search-blood?requestId=${request.id}&group=${encodeURIComponent(
                request.bloodGroup,
              )}`}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white text-blue-900 font-bold text-xs shadow-md hover:bg-blue-50 transition active:scale-95"
            >
              <Search className="size-3.5 text-blue-800" />
              <span>Start Search</span>
            </Link>
          )}

          <button
            onClick={() => onOpenDetails(request)}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition ${
              isCompleted || isCancelled || isManaged
                ? "flex-1 bg-rose-600 hover:bg-rose-700 text-white"
                : "bg-white/20 text-white hover:bg-white/30"
            }`}
          >
            Manage / Details
          </button>
        </div>

        {!isCompleted && !isCancelled && (
          <div className="flex items-center justify-between text-[11px] px-1">
            <button
              onClick={() => onMarkCompleted(request.id)}
              className="inline-flex items-center gap-1 text-emerald-300 hover:text-emerald-200 font-bold transition"
            >
              <CheckCircle2 className="size-3" />
              <span>Mark Completed</span>
            </button>
            <button
              onClick={() => onCancelRequest(request.id)}
              className="inline-flex items-center gap-1 text-rose-300 hover:text-rose-200 font-medium transition"
            >
              <XCircle className="size-3" />
              <span>Cancel Request</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
