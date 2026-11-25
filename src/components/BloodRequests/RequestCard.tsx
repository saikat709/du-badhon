"use client";

import { BloodRequest, getShortHallUnit } from "@/types/badhon";
import { useBadhon } from "@/context/badhon-context";
import {
  AlertCircle,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Droplet,
  Eye,
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
  const { requestViewers } = useBadhon();
  const viewers = requestViewers?.[request.id] || [];

  const isManaged = request.managedBags >= request.totalBags;
  const isCompleted = request.status === "completed";
  const isCancelled = request.status === "cancelled";

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-3xl p-5 md:p-6 border transition-all duration-200 shadow-sm hover:shadow-xl ${
        isCompleted
          ? "bg-white dark:bg-[#151E32] border-emerald-300 dark:border-emerald-900/50 text-slate-800 dark:text-slate-100"
          : isCancelled
            ? "bg-slate-50 dark:bg-[#151E32] border-slate-200 dark:border-slate-800 opacity-75 text-slate-700 dark:text-slate-300"
            : "bg-gradient-to-br from-slate-900 via-rose-950/70 to-slate-900 text-white border-rose-500/40 shadow-rose-950/20"
      }`}
    >
      <div className="space-y-4">
        {/* Header Row: Tags and Blood Group Badge */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className={`inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                request.isPlasma
                  ? "bg-amber-400 text-amber-950 font-black shadow-2xs"
                  : isCompleted || isCancelled
                    ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                    : "bg-white/20 text-white backdrop-blur-xs"
              }`}
            >
              {request.isPlasma ? (
                <>
                  <Sparkles className="size-3" />
                  <span>Plasma</span>
                </>
              ) : (
                <>
                  <Droplet className="size-3 text-rose-300" />
                  <span>Whole Blood</span>
                </>
              )}
            </span>

            <span
              className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                request.urgency.includes("Emergency")
                  ? "bg-rose-500/30 text-rose-200 border border-rose-400/40 animate-pulse"
                  : isCompleted || isCancelled
                    ? "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                    : "bg-black/30 text-slate-200"
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
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-600 text-white">
                <XCircle className="size-3" />
                <span>Cancelled</span>
              </span>
            )}
          </div>

          {/* Blood Group Badge: Safely Contained */}
          <span
            className={`flex size-11 items-center justify-center rounded-2xl text-base font-black shadow-md border shrink-0 ${
              isCompleted
                ? "bg-emerald-600 border-emerald-500 text-white"
                : isCancelled
                  ? "bg-slate-600 border-slate-500 text-white"
                  : "bg-gradient-to-tr from-rose-600 to-red-600 border-rose-400 text-white shadow-rose-600/30"
            }`}
          >
            {request.bloodGroup}
          </span>
        </div>

        {/* Live Search Indicator Chip */}
        {viewers.length > 0 && !isCompleted && !isCancelled && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-semibold animate-pulse">
            <Search className="size-3.5 text-amber-400 shrink-0" />
            <span className="truncate">
              Being searched by {viewers.map((v) => `${v.name} (${v.hallUnit.split(" ")[0]})`).join(", ")}
            </span>
          </div>
        )}

        {/* Hospital Name & Reason */}
        <div>
          <div className="flex items-start gap-2">
            <Building2
              className={`size-4.5 shrink-0 mt-0.5 ${
                isCompleted || isCancelled
                  ? "text-rose-600 dark:text-rose-400"
                  : "text-rose-300"
              }`}
            />
            <h3
              className={`font-bold text-base leading-snug line-clamp-2 ${
                isCompleted || isCancelled
                  ? "text-slate-900 dark:text-white"
                  : "text-white"
              }`}
            >
              {request.hospital}
            </h3>
          </div>
          <p
            className={`text-xs mt-1.5 font-medium ${
              isCompleted || isCancelled
                ? "text-slate-500 dark:text-slate-400"
                : "text-rose-100"
            }`}
          >
            Reason: <span className="font-semibold text-slate-800 dark:text-slate-200">{request.reason}</span>
          </p>
        </div>

        {/* Patient & Bag Fulfillment */}
        <div
          className={`rounded-2xl p-3.5 text-xs space-y-2.5 ${
            isCompleted || isCancelled
              ? "bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800"
              : "bg-black/30 backdrop-blur-xs border border-white/10"
          }`}
        >
          <div className="flex justify-between items-center font-bold">
            <span className="inline-flex items-center gap-1.5">
              <Droplet className="size-3.5 text-rose-400" />
              <span>
                {request.totalBags} Bag{request.totalBags > 1 ? "s" : ""} ({request.managedBags} Managed)
              </span>
            </span>
            <span
              className={`text-[11px] px-2 py-0.5 rounded-md font-bold ${
                isManaged
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "text-amber-300 bg-amber-500/20 border border-amber-500/30"
              }`}
            >
              {isManaged ? "Fulfilled" : `${request.totalBags - request.managedBags} bag needed`}
            </span>
          </div>

          {/* Segmented Bag Slots Visual */}
          <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
            {request.assignedBags.map((bag) => (
              <span
                key={bag.bagNumber}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${
                  bag.donorId
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : isCompleted || isCancelled
                      ? "bg-slate-200 dark:bg-slate-800 text-slate-500 border border-slate-300 dark:border-slate-700"
                      : "bg-white/10 text-slate-300 border border-white/15"
                }`}
              >
                {bag.donorId ? (
                  <CheckCircle2 className="size-2.5 text-emerald-400" />
                ) : (
                  <Clock className="size-2.5 text-amber-400" />
                )}
                <span>
                  Bag #{bag.bagNumber}
                  {bag.donorName ? `: ${bag.donorName.split(" ")[0]}` : ": Open"}
                </span>
              </span>
            ))}
          </div>

          <div className="flex justify-between items-center text-[11px] pt-1 text-slate-400">
            <span className="inline-flex items-center gap-1">
              <User className="size-3" />
              <span className="text-slate-300 font-medium truncate max-w-[150px]">{request.patientName}</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="size-3" />
              <span className="text-slate-300 font-medium">{request.dateNeeded}</span>
            </span>
          </div>

          {/* Creator & Hall Unit Info */}
          <div
            className={`pt-2 border-t text-[11px] space-y-1 ${
              isCompleted || isCancelled
                ? "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                : "border-white/10 text-slate-300"
            }`}
          >
            <div className="flex items-center justify-between gap-1.5">
              <span className="inline-flex items-center gap-1 min-w-0">
                <User className="size-3 text-rose-400 shrink-0" />
                <span className="text-[11px]">Created by:</span>
                <strong
                  className={`truncate ${
                    isCompleted || isCancelled
                      ? "text-slate-800 dark:text-slate-200"
                      : "text-white"
                  }`}
                >
                  {request.createdByVolunteerName}
                </strong>
              </span>

              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                  isCompleted || isCancelled
                    ? "bg-rose-100 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300 border border-rose-200 dark:border-rose-900"
                    : "bg-rose-500/25 text-rose-200 border border-rose-400/30"
                }`}
              >
                {getShortHallUnit(request.createdByVolunteerHall || "DU Central")}
              </span>
            </div>

            {request.managedByVolunteerName &&
              request.managedByVolunteerName !== request.createdByVolunteerName && (
                <div className="flex items-center justify-between gap-1 text-[10px] opacity-75">
                  <span>Managed by: {request.managedByVolunteerName}</span>
                  {request.managedByVolunteerHall && (
                    <span>({getShortHallUnit(request.managedByVolunteerHall)})</span>
                  )}
                </div>
              )}

            {request.visibleUnits && request.visibleUnits.length > 0 && (
              <div className="flex items-center justify-between gap-1 text-[10px] opacity-75 pt-1 border-t border-white/10 dark:border-slate-800">
                <span className="flex items-center gap-1">
                  <Eye className="size-2.5 text-rose-400" />
                  <span>Visible to:</span>
                </span>
                <span className="font-semibold truncate max-w-[170px]" title={request.visibleUnits.join(", ")}>
                  {request.visibleUnits.length === 16
                    ? "All 16 Units"
                    : request.visibleUnits.length === 1
                      ? `${getShortHallUnit(request.visibleUnits[0])} only`
                      : request.visibleUnits.map(getShortHallUnit).join(", ")}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-3 border-t border-white/15 dark:border-slate-800 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          {!isCompleted && !isCancelled && !isManaged && (
            <Link
              href={`/search-blood?requestId=${request.id}&group=${encodeURIComponent(
                request.bloodGroup,
              )}`}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs shadow-md shadow-rose-600/30 transition active:scale-95"
            >
              <Search className="size-3.5" />
              <span>Find Donors</span>
            </Link>
          )}

          <button
            type="button"
            onClick={() => onOpenDetails(request)}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition ${
              isCompleted || isCancelled || isManaged
                ? "flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-center"
                : "bg-white/10 hover:bg-white/20 text-white"
            }`}
          >
            Manage Details
          </button>
        </div>

        {/* Quick Complete / Cancel for In-Progress Requests */}
        {!isCompleted && !isCancelled && (
          <div className="flex items-center justify-between text-[11px] px-1 text-slate-400">
            {isManaged ? (
              <button
                type="button"
                onClick={() => onMarkCompleted(request.id)}
                className="text-emerald-400 hover:underline font-bold inline-flex items-center gap-1"
              >
                <CheckCircle2 className="size-3" />
                <span>Mark Donation Done</span>
              </button>
            ) : (
              <span className="italic truncate max-w-[200px]">
                {request.createdByVolunteerName} ({getShortHallUnit(request.createdByVolunteerHall || "DU Central")})
              </span>
            )}

            <button
              type="button"
              onClick={() => onCancelRequest(request.id)}
              className="hover:text-rose-400 text-slate-400 transition"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
