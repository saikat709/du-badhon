"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useBadhon } from "@/context/badhon-context";
import { BloodGroup, HallUnit } from "@/types/badhon";
import {
  Award,
  Building2,
  Calendar,
  CheckCircle2,
  ClipboardList,
  Download,
  Droplet,
  FileSpreadsheet,
  FileText,
  Filter,
  HeartHandshake,
  Loader2,
  Search,
  Sparkles,
  TrendingUp,
  User,
  Users,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import React, { Suspense, useMemo, useState } from "react";

const BLOOD_GROUPS: BloodGroup[] = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const HALL_UNITS: HallUnit[] = [
  "Fazlul Huq Muslim Hall",
  "Shahidullah Hall",
  "Amar Ekushey Hall",
  "Jagannath Hall",
  "Bangabandhu Sheikh Mujibur Rahman Hall",
  "Kabi Jasimuddin Hall",
  "Bijoy Ekattor Hall",
  "Ziaur Rahman Hall",
  "Surja Sen Hall",
  "Haji Muhammad Mohsin Hall",
  "Salimullah Muslim Hall",
  "Ruqayyah Hall",
  "Shamsun Nahar Hall",
  "Kabi Sufia Kamal Hall",
  "Bangladesh-Kuwait Maitree Hall",
  "Fazilatunnesa Mujib Hall",
];

function formatMonthLabel(yearMonth: string): string {
  if (yearMonth === "all") return "All Time";
  const [year, month] = yearMonth.split("-");
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const idx = parseInt(month, 10) - 1;
  return `${monthNames[idx] || month} ${year}`;
}

function formatDateDisplay(dateStr: string): string {
  if (!dateStr) return "N/A";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function triggerFileDownload(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

async function requestServerPdfDownload(endpointPayload: {
  title: string;
  subtitle?: string;
  scope?: string;
  month?: string;
  headers: string[];
  rows: (string | number)[][];
  generatedAt?: string;
}, filename: string) {
  const res = await fetch("/api/donations/export-pdf", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(endpointPayload),
  });

  if (!res.ok) {
    throw new Error(`Failed to generate PDF: ${res.statusText}`);
  }

  const blob = await res.blob();
  triggerFileDownload(filename, blob);
}

function DonationsContent() {
  const { bloodRequests, volunteers, currentVolunteer } = useBadhon();

  // Active top tab: "members" (Monthly Member Performance) vs "club" (Club Donations Ledger & Daily Trends)
  const [activeTab, setActiveTab] = useState<"members" | "club">("members");

  // Filters for Tab 1 (Members Monthly Report)
  const [memberMonthFilter, setMemberMonthFilter] = useState<string>("2026-01");
  const [memberHallFilter, setMemberHallFilter] = useState<string>("all");
  const [isExportingMembersPdf, setIsExportingMembersPdf] = useState(false);

  // Filters for Tab 2 (Club Donations Ledger)
  const [clubHallFilter, setClubHallFilter] = useState<string>(currentVolunteer.hallUnit);
  const [clubMonthFilter, setClubMonthFilter] = useState<string>("all");
  const [clubBloodGroupFilter, setClubBloodGroupFilter] = useState<string>("all");
  const [clubStatusFilter, setClubStatusFilter] = useState<string>("all");
  const [clubSearchQuery, setClubSearchQuery] = useState("");
  const [isExportingClubPdf, setIsExportingClubPdf] = useState(false);
  const [downloadingMonthKey, setDownloadingMonthKey] = useState<string | null>(null);

  // Extract all available months present in the blood requests
  const availableMonths = useMemo(() => {
    const monthsSet = new Set<string>();
    // Pre-populate January 2026 and current November 2026
    monthsSet.add("2026-01");
    monthsSet.add("2026-11");

    bloodRequests.forEach((req) => {
      const date = req.dateNeeded || req.createdAt?.split("T")[0];
      if (date && date.length >= 7) {
        monthsSet.add(date.substring(0, 7));
      }
    });

    return Array.from(monthsSet).sort().reverse();
  }, [bloodRequests]);

  // ==========================================
  // TAB 1: MEMBERS MONTHLY REPORT & LEADERBOARD
  // ==========================================
  const memberReportData = useMemo(() => {
    // Tally completed and cancelled requests for each member in the selected month
    return volunteers
      .filter((v) => memberHallFilter === "all" || v.hallUnit === memberHallFilter)
      .map((volunteer) => {
        const managedInScope = bloodRequests.filter((req) => {
          // Match volunteer
          const matchVolunteer =
            req.managedByVolunteerId === volunteer.id ||
            req.managedByVolunteerName === volunteer.name ||
            req.createdByVolunteerName === volunteer.name;

          if (!matchVolunteer) return false;

          // Match month filter
          if (memberMonthFilter !== "all") {
            const reqDate = req.dateNeeded || req.managedAt?.split("T")[0] || req.createdAt?.split("T")[0];
            if (!reqDate || !reqDate.startsWith(memberMonthFilter)) {
              return false;
            }
          }

          return true;
        });

        // Completed count (bags or completed requests)
        const completedRequests = managedInScope.filter((r) => r.status === "completed");
        const completedBags = completedRequests.reduce((sum, r) => sum + r.managedBags, 0);

        // Cancelled count
        const cancelledRequests = managedInScope.filter((r) => r.status === "cancelled");

        const completedCount = completedBags > 0 ? completedBags : completedRequests.length;
        const cancelledCount = cancelledRequests.length;
        const totalProcessed = completedCount + cancelledCount;
        const successRate =
          totalProcessed > 0 ? Math.round((completedCount / totalProcessed) * 100) : 0;

        return {
          volunteer,
          completedCount,
          cancelledCount,
          totalProcessed,
          successRate,
        };
      })
      // Sort strictly by completed counts descending, as requested!
      .sort((a, b) => {
        if (b.completedCount !== a.completedCount) {
          return b.completedCount - a.completedCount;
        }
        return b.totalProcessed - a.totalProcessed;
      });
  }, [volunteers, bloodRequests, memberMonthFilter, memberHallFilter]);

  // Export Tab 1 Members Report to Server-Generated PDF
  const handleDownloadMembersReport = async () => {
    try {
      setIsExportingMembersPdf(true);
      const monthLabel = formatMonthLabel(memberMonthFilter);
      const hallLabel = memberHallFilter === "all" ? "DU Campus Central" : memberHallFilter;

      const headers = [
        "Rank",
        "Member Name",
        "Hall Unit",
        "Student ID",
        "Role",
        "Completed Bags",
        "Cancelled",
        "Total Handled",
        "Success Rate",
      ];

      const rows = memberReportData.map((item, idx) => [
        idx + 1,
        item.volunteer.name,
        item.volunteer.hallUnit,
        item.volunteer.studentId,
        item.volunteer.role,
        item.completedCount,
        item.cancelledCount,
        item.totalProcessed,
        `${item.successRate}%`,
      ]);

      const safeFilename = `badhon_members_donation_report_${memberMonthFilter}_${memberHallFilter.replace(/\s+/g, "_")}.pdf`;

      await requestServerPdfDownload(
        {
          title: "Monthly Member Blood Management Report",
          subtitle: "Volunteer Performance & Transfusion Records",
          scope: hallLabel,
          month: monthLabel,
          headers,
          rows,
          generatedAt: new Date().toLocaleString(),
        },
        safeFilename
      );
    } catch (err) {
      console.error("PDF download failed:", err);
      alert("Failed to download PDF report. Please try again.");
    } finally {
      setIsExportingMembersPdf(false);
    }
  };

  // ==========================================
  // TAB 2: CLUB DONATIONS INFO & DAILY BREAKDOWN
  // ==========================================
  const clubFilteredRequests = useMemo(() => {
    return bloodRequests.filter((req) => {
      // Hall / Club filter
      if (clubHallFilter !== "all") {
        const matchHall =
          req.managedByVolunteerHall === clubHallFilter ||
          req.assignedBags.some((b) => b.donorHall === clubHallFilter);
        if (!matchHall) return false;
      }

      // Month filter
      if (clubMonthFilter !== "all") {
        const reqDate = req.dateNeeded || req.createdAt?.split("T")[0];
        if (!reqDate || !reqDate.startsWith(clubMonthFilter)) return false;
      }

      // Blood Group filter
      if (clubBloodGroupFilter !== "all" && req.bloodGroup !== clubBloodGroupFilter) {
        return false;
      }

      // Status filter
      if (clubStatusFilter !== "all" && req.status !== clubStatusFilter) {
        return false;
      }

      // Search query
      if (clubSearchQuery.trim()) {
        const q = clubSearchQuery.toLowerCase();
        const match =
          req.patientName.toLowerCase().includes(q) ||
          req.hospital.toLowerCase().includes(q) ||
          (req.managedByVolunteerName && req.managedByVolunteerName.toLowerCase().includes(q)) ||
          req.assignedBags.some(
            (b) => b.donorName && b.donorName.toLowerCase().includes(q),
          );
        if (!match) return false;
      }

      return true;
    });
  }, [bloodRequests, clubHallFilter, clubMonthFilter, clubBloodGroupFilter, clubStatusFilter, clubSearchQuery]);

  // Aggregate stats for Club
  const clubStats = useMemo(() => {
    const completed = clubFilteredRequests.filter((r) => r.status === "completed");
    const cancelled = clubFilteredRequests.filter((r) => r.status === "cancelled");
    const totalBagsDonated = completed.reduce((sum, r) => sum + r.managedBags, 0);
    const totalRequestsManaged = completed.length + cancelled.length;

    // Active managing volunteers
    const volunteerNames = new Set(
      clubFilteredRequests
        .map((r) => r.managedByVolunteerName || r.createdByVolunteerName)
        .filter(Boolean),
    );

    return {
      totalBagsDonated,
      completedCount: completed.length,
      cancelledCount: cancelled.length,
      totalRequestsManaged,
      activeVolunteersCount: volunteerNames.size,
    };
  }, [clubFilteredRequests]);

  // Daily Breakdown: Date and count of managed units
  const dailyManagedTimeline = useMemo(() => {
    const dateMap = new Map<
      string,
      {
        date: string;
        managedBagsCount: number;
        completedRequests: number;
        cancelledRequests: number;
        bloodGroups: Set<string>;
        volunteers: Set<string>;
        items: typeof clubFilteredRequests;
      }
    >();

    clubFilteredRequests.forEach((req) => {
      const dateKey = req.dateNeeded || req.createdAt.split("T")[0];
      if (!dateMap.has(dateKey)) {
        dateMap.set(dateKey, {
          date: dateKey,
          managedBagsCount: 0,
          completedRequests: 0,
          cancelledRequests: 0,
          bloodGroups: new Set(),
          volunteers: new Set(),
          items: [],
        });
      }

      const entry = dateMap.get(dateKey)!;
      entry.items.push(req);
      if (req.bloodGroup) entry.bloodGroups.add(req.bloodGroup);
      if (req.managedByVolunteerName) entry.volunteers.add(req.managedByVolunteerName);

      if (req.status === "completed") {
        entry.completedRequests += 1;
        entry.managedBagsCount += req.managedBags || 1;
      } else if (req.status === "cancelled") {
        entry.cancelledRequests += 1;
      } else if (req.managedBags > 0) {
        entry.managedBagsCount += req.managedBags;
      }
    });

    // Sort dates descending
    return Array.from(dateMap.values()).sort((a, b) => b.date.localeCompare(a.date));
  }, [clubFilteredRequests]);

  // Per-month summary for the selected club (enables downloading PDF for any month)
  const clubMonthlySummaryList = useMemo(() => {
    return availableMonths.map((m) => {
      const monthRequests = bloodRequests.filter((req) => {
        if (clubHallFilter !== "all") {
          const matchHall =
            req.managedByVolunteerHall === clubHallFilter ||
            req.assignedBags.some((b) => b.donorHall === clubHallFilter);
          if (!matchHall) return false;
        }
        const reqDate = req.dateNeeded || req.createdAt?.split("T")[0];
        return reqDate && reqDate.startsWith(m);
      });

      const completed = monthRequests.filter((r) => r.status === "completed");
      const cancelled = monthRequests.filter((r) => r.status === "cancelled");
      const bagsDonated = completed.reduce((sum, r) => sum + r.managedBags, 0);

      return {
        month: m,
        label: formatMonthLabel(m),
        totalRequests: monthRequests.length,
        completedCount: completed.length,
        cancelledCount: cancelled.length,
        bagsDonated,
      };
    });
  }, [availableMonths, bloodRequests, clubHallFilter]);

  // Download Club Ledger for any specified month directly
  const handleDownloadClubMonthLedger = async (targetMonth: string) => {
    try {
      setDownloadingMonthKey(targetMonth);
      const clubLabel = clubHallFilter === "all" ? "All DU Halls (Central)" : clubHallFilter;
      const monthLabel = formatMonthLabel(targetMonth);

      // Filter requests specifically for this club and targeted month
      const monthRequests = bloodRequests.filter((req) => {
        if (clubHallFilter !== "all") {
          const matchHall =
            req.managedByVolunteerHall === clubHallFilter ||
            req.assignedBags.some((b) => b.donorHall === clubHallFilter);
          if (!matchHall) return false;
        }

        if (targetMonth !== "all") {
          const reqDate = req.dateNeeded || req.createdAt?.split("T")[0];
          if (!reqDate || !reqDate.startsWith(targetMonth)) return false;
        }

        return true;
      });

      const totalBags = monthRequests
        .filter((r) => r.status === "completed")
        .reduce((sum, r) => sum + r.managedBags, 0);

      const headers = [
        "Req ID",
        "Date",
        "Patient Name",
        "Blood",
        "Hospital",
        "Reason/Notes",
        "Type",
        "Bags Done",
        "Total",
        "Volunteer",
        "Hall Unit",
        "Status",
      ];

      const rows = monthRequests.map((req) => [
        req.id,
        req.dateNeeded || req.createdAt.split("T")[0],
        req.patientName,
        req.bloodGroup,
        req.hospital,
        req.reason || req.notes || "N/A",
        req.isPlasma ? "Plasma" : "Whole",
        req.managedBags,
        req.totalBags,
        req.managedByVolunteerName || req.createdByVolunteerName || "Unassigned",
        req.managedByVolunteerHall || "DU Central",
        req.status,
      ]);

      const safeFilename = `badhon_${clubHallFilter.replace(/\s+/g, "_")}_ledger_${targetMonth}.pdf`;

      await requestServerPdfDownload(
        {
          title: "DU Badhon Club Monthly Donations Ledger",
          subtitle: `Month: ${monthLabel}  •  Completed Bags: ${totalBags}`,
          scope: clubLabel,
          month: monthLabel,
          headers,
          rows,
          generatedAt: new Date().toLocaleString(),
        },
        safeFilename
      );
    } catch (err) {
      console.error("PDF download for month failed:", err);
      alert("Failed to download PDF ledger for this month. Please try again.");
    } finally {
      setDownloadingMonthKey(null);
    }
  };

  // Export current filtered view of Tab 2 Club Ledger to Server-Generated PDF
  const handleDownloadClubLedger = async () => {
    try {
      setIsExportingClubPdf(true);
      const clubLabel = clubHallFilter === "all" ? "All DU Halls (Central)" : clubHallFilter;
      const monthLabel = formatMonthLabel(clubMonthFilter);

      const headers = [
        "Req ID",
        "Date",
        "Patient Name",
        "Blood",
        "Hospital",
        "Reason/Notes",
        "Type",
        "Bags Done",
        "Total",
        "Volunteer",
        "Hall Unit",
        "Status",
      ];

      const rows = clubFilteredRequests.map((req) => [
        req.id,
        req.dateNeeded || req.createdAt.split("T")[0],
        req.patientName,
        req.bloodGroup,
        req.hospital,
        req.reason || req.notes || "N/A",
        req.isPlasma ? "Plasma" : "Whole",
        req.managedBags,
        req.totalBags,
        req.managedByVolunteerName || req.createdByVolunteerName || "Unassigned",
        req.managedByVolunteerHall || "DU Central",
        req.status,
      ]);

      const safeFilename = `badhon_club_donations_ledger_${clubHallFilter.replace(/\s+/g, "_")}_${clubMonthFilter}.pdf`;

      await requestServerPdfDownload(
        {
          title: "DU Badhon Club Donations & Operations Ledger",
          subtitle: `Total Bags Managed: ${clubStats.totalBagsDonated}`,
          scope: clubLabel,
          month: monthLabel,
          headers,
          rows,
          generatedAt: new Date().toLocaleString(),
        },
        safeFilename
      );
    } catch (err) {
      console.error("PDF download failed:", err);
      alert("Failed to download PDF ledger. Please try again.");
    } finally {
      setIsExportingClubPdf(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <Breadcrumb pageName="Donations Ledger" crumbName="Donations Ledger" hideTitle />

      {/* Hero Title & View Switcher */}
      <div className="bg-white dark:bg-dark-2 rounded-3xl p-6 border border-stroke dark:border-dark-3 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="size-9 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center shrink-0">
                <ClipboardList className="size-5" />
              </span>
              <h1 className="text-lg sm:text-xl md:text-2xl font-black text-dark dark:text-white">
                Donations & Performance Ledger
              </h1>
            </div>
            <p className="text-xs text-dark-5 dark:text-dark-6 max-w-2xl">
              Track which member managed how many blood donations (completed and cancelled),
              download monthly volunteer performance reports, and analyze club-level daily donation trends.
            </p>
          </div>

          {/* Quick Tab Switcher */}
          <div className="inline-flex p-1 rounded-2xl bg-gray-2 dark:bg-dark-3 border border-stroke dark:border-dark-4 self-start md:self-auto">
            <button
              onClick={() => setActiveTab("members")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === "members"
                  ? "bg-rose-600 text-white shadow-xs"
                  : "text-dark-5 dark:text-dark-6 hover:text-dark dark:hover:text-white"
              }`}
            >
              <Users className="size-4" />
              <span>Members Monthly Report</span>
            </button>
            <button
              onClick={() => setActiveTab("club")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === "club"
                  ? "bg-rose-600 text-white shadow-xs"
                  : "text-dark-5 dark:text-dark-6 hover:text-dark dark:hover:text-white"
              }`}
            >
              <Building2 className="size-4" />
              <span>Club Donations & Daily Trends</span>
            </button>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* TAB 1: MEMBERS MONTHLY REPORT (DOWNLOADABLE & SORTED BY COMPLETED)   */}
      {/* ==================================================================== */}
      {activeTab === "members" && (
        <div className="space-y-6">
          {/* Controls & Filter Bar */}
          <div className="bg-white dark:bg-dark-2 p-5 rounded-2xl border border-stroke dark:border-dark-3 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              {/* Month Selector */}
              <div className="flex items-center gap-2 text-xs">
                <Calendar className="size-4 text-rose-600" />
                <span className="font-bold text-dark dark:text-white">Month:</span>
                <select
                  value={memberMonthFilter}
                  onChange={(e) => setMemberMonthFilter(e.target.value)}
                  className="rounded-xl border border-stroke dark:border-dark-4 bg-gray-1 dark:bg-dark-3 px-3 py-2 font-bold text-xs text-dark dark:text-white outline-none focus:border-rose-600"
                >
                  <option value="all">All Time</option>
                  {availableMonths.map((m) => (
                    <option key={m} value={m}>
                      {formatMonthLabel(m)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Hall Unit Filter */}
              <div className="flex items-center gap-2 text-xs">
                <Building2 className="size-4 text-rose-600" />
                <span className="font-bold text-dark dark:text-white">Hall Unit:</span>
                <select
                  value={memberHallFilter}
                  onChange={(e) => setMemberHallFilter(e.target.value)}
                  className="rounded-xl border border-stroke dark:border-dark-4 bg-gray-1 dark:bg-dark-3 px-3 py-2 font-bold text-xs text-dark dark:text-white outline-none focus:border-rose-600 max-w-[220px]"
                >
                  <option value="all">All 16 DU Halls (Central)</option>
                  {HALL_UNITS.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Download Monthly Report Button */}
            <button
              onClick={handleDownloadMembersReport}
              disabled={isExportingMembersPdf}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-70 text-white font-bold text-xs shadow-md transition active:scale-95"
            >
              {isExportingMembersPdf ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <FileText className="size-4" />
              )}
              <span>{isExportingMembersPdf ? "Generating PDF..." : "Download Monthly Report (PDF)"}</span>
            </button>
          </div>

          {/* Top Contributors Podium / Highlights for the Month */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {memberReportData.slice(0, 3).map((item, idx) => {
              const medalColors = [
                "from-amber-400/20 to-amber-500/10 border-amber-400/40 text-amber-600 dark:text-amber-400",
                "from-slate-300/20 to-slate-400/10 border-slate-300/40 text-slate-600 dark:text-slate-300",
                "from-amber-700/20 to-amber-800/10 border-amber-600/40 text-amber-700 dark:text-amber-500",
              ];
              const medals = ["🥇 Top Performer", "🥈 2nd Place", "🥉 3rd Place"];

              return (
                <div
                  key={item.volunteer.id}
                  className={`rounded-2xl p-5 border bg-gradient-to-b ${medalColors[idx]} space-y-3 relative overflow-hidden`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-black/10 dark:bg-white/10">
                      {medals[idx]}
                    </span>
                    <span className="text-xs font-black text-dark-5 dark:text-dark-6">
                      Rank #{idx + 1}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div
                      className="size-11 rounded-xl text-white font-black text-sm flex items-center justify-center shrink-0 shadow-sm"
                      style={{ backgroundColor: item.volunteer.avatarBg }}
                    >
                      {item.volunteer.name
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")}
                    </div>
                    <div className="min-w-0">
                      <h2 className="font-black text-sm text-dark dark:text-white truncate">
                        {item.volunteer.name}
                      </h2>
                      <p className="text-[11px] text-dark-5 dark:text-dark-6 truncate">
                        {item.volunteer.hallUnit}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-black/10 dark:border-white/10 grid grid-cols-2 gap-2 text-center text-xs">
                    <div className="bg-white/60 dark:bg-black/20 p-2 rounded-xl">
                      <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 block leading-tight">
                        {item.completedCount}
                      </span>
                      <span className="text-[10px] font-bold text-dark-5 dark:text-dark-6 uppercase">
                        Completed
                      </span>
                    </div>
                    <div className="bg-white/60 dark:bg-black/20 p-2 rounded-xl">
                      <span className="text-lg font-black text-rose-600 dark:text-rose-400 block leading-tight">
                        {item.cancelledCount}
                      </span>
                      <span className="text-[10px] font-bold text-dark-5 dark:text-dark-6 uppercase">
                        Cancelled
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Full Members Performance Table */}
          <div className="bg-white dark:bg-dark-2 rounded-2xl border border-stroke dark:border-dark-3 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-stroke dark:border-dark-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="font-black text-sm text-dark dark:text-white">
                  Volunteer Blood Management Records ({formatMonthLabel(memberMonthFilter)})
                </h2>
                <p className="text-xs text-dark-5 dark:text-dark-6">
                  Ranked strictly by completed blood units managed.
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
                {memberReportData.length} Members Listed
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-stroke dark:border-dark-3 bg-gray-1 dark:bg-dark-3 text-dark-5 dark:text-dark-6 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Rank</th>
                    <th className="py-3 px-4">Member Name & Role</th>
                    <th className="py-3 px-4">Hall Unit</th>
                    <th className="py-3 px-4 text-center">Completed Count</th>
                    <th className="py-3 px-4 text-center">Cancelled Count</th>
                    <th className="py-3 px-4 text-center">Total Managed</th>
                    <th className="py-3 px-4 text-right">Success Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stroke dark:divide-dark-3">
                  {memberReportData.map((item, index) => (
                    <tr
                      key={item.volunteer.id}
                      className="hover:bg-rose-50/40 dark:hover:bg-dark-3/50 transition"
                    >
                      <td className="py-3.5 px-4 font-black text-dark dark:text-white">
                        <span
                          className={`inline-flex items-center justify-center size-6 rounded-lg text-xs font-black ${
                            index === 0
                              ? "bg-amber-400 text-black shadow-xs"
                              : index === 1
                                ? "bg-slate-300 text-black"
                                : index === 2
                                  ? "bg-amber-700 text-white"
                                  : "text-dark-5 dark:text-dark-6"
                          }`}
                        >
                          #{index + 1}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="size-8 rounded-lg text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs"
                            style={{ backgroundColor: item.volunteer.avatarBg }}
                          >
                            {item.volunteer.name
                              .split(" ")
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join("")}
                          </div>
                          <div>
                            <span className="font-bold text-dark dark:text-white block">
                              {item.volunteer.name}
                            </span>
                            <span className="text-[10px] text-dark-5 dark:text-dark-6">
                              {item.volunteer.role} • {item.volunteer.studentId}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-dark dark:text-white font-medium">
                        {item.volunteer.hallUnit}
                      </td>

                      {/* Completed Count */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full font-black text-xs bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900">
                          <CheckCircle2 className="size-3.5" />
                          <span>{item.completedCount}</span>
                        </span>
                      </td>

                      {/* Cancelled Count */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full font-black text-xs bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900">
                          <XCircle className="size-3.5" />
                          <span>{item.cancelledCount}</span>
                        </span>
                      </td>

                      {/* Total Processed */}
                      <td className="py-3.5 px-4 text-center font-black text-dark dark:text-white">
                        {item.totalProcessed}
                      </td>

                      {/* Success Rate */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex flex-col items-end gap-1">
                          <span className="font-black text-xs text-dark dark:text-white">
                            {item.successRate}%
                          </span>
                          <div className="w-16 h-1.5 rounded-full bg-gray-2 dark:bg-dark-4 overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 rounded-full"
                              style={{ width: `${item.successRate}%` }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 2: CLUB DONATIONS INFO, DAILY BREAKDOWN & DETAILED LEDGER       */}
      {/* ==================================================================== */}
      {activeTab === "club" && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="bg-white dark:bg-dark-2 p-5 rounded-2xl border border-stroke dark:border-dark-3 shadow-xs space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Club / Hall Unit Selector */}
              <div>
                <label className="text-[11px] font-bold text-dark-5 dark:text-dark-6 mb-1 block">
                  Club / Hall Unit
                </label>
                <select
                  value={clubHallFilter}
                  onChange={(e) => setClubHallFilter(e.target.value)}
                  className="w-full rounded-xl border border-stroke dark:border-dark-4 bg-gray-1 dark:bg-dark-3 px-3 py-2 text-xs font-bold text-dark dark:text-white outline-none focus:border-rose-600"
                >
                  <option value="all">All 16 DU Halls (Central)</option>
                  {HALL_UNITS.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>

              {/* Month Selector */}
              <div>
                <label className="text-[11px] font-bold text-dark-5 dark:text-dark-6 mb-1 block">
                  Month
                </label>
                <select
                  value={clubMonthFilter}
                  onChange={(e) => setClubMonthFilter(e.target.value)}
                  className="w-full rounded-xl border border-stroke dark:border-dark-4 bg-gray-1 dark:bg-dark-3 px-3 py-2 text-xs font-bold text-dark dark:text-white outline-none focus:border-rose-600"
                >
                  <option value="all">All Months</option>
                  {availableMonths.map((m) => (
                    <option key={m} value={m}>
                      {formatMonthLabel(m)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Blood Group Selector */}
              <div>
                <label className="text-[11px] font-bold text-dark-5 dark:text-dark-6 mb-1 block">
                  Blood Group
                </label>
                <select
                  value={clubBloodGroupFilter}
                  onChange={(e) => setClubBloodGroupFilter(e.target.value)}
                  className="w-full rounded-xl border border-stroke dark:border-dark-4 bg-gray-1 dark:bg-dark-3 px-3 py-2 text-xs font-bold text-dark dark:text-white outline-none focus:border-rose-600"
                >
                  <option value="all">All Blood Groups</option>
                  {BLOOD_GROUPS.map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="text-[11px] font-bold text-dark-5 dark:text-dark-6 mb-1 block">
                  Management Status
                </label>
                <select
                  value={clubStatusFilter}
                  onChange={(e) => setClubStatusFilter(e.target.value)}
                  className="w-full rounded-xl border border-stroke dark:border-dark-4 bg-gray-1 dark:bg-dark-3 px-3 py-2 text-xs font-bold text-dark dark:text-white outline-none focus:border-rose-600"
                >
                  <option value="all">All (Completed & Cancelled)</option>
                  <option value="completed">Completed Only</option>
                  <option value="cancelled">Cancelled Only</option>
                </select>
              </div>
            </div>

            {/* Search and Download Row */}
            <div className="pt-3 border-t border-stroke dark:border-dark-3 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="w-full sm:w-80 relative">
                <input
                  type="text"
                  placeholder="Search patient, hospital, member..."
                  value={clubSearchQuery}
                  onChange={(e) => setClubSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-stroke dark:border-dark-4 bg-gray-1 dark:bg-dark-3 pl-8 pr-3 py-2 text-xs text-dark dark:text-white outline-none focus:border-rose-600"
                />
                <Search className="size-3.5 text-gray-4 absolute left-2.5 top-2.5" />
              </div>

              <button
                onClick={handleDownloadClubLedger}
                disabled={isExportingClubPdf}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-70 text-white font-bold text-xs shadow-md transition active:scale-95 shrink-0"
              >
                {isExportingClubPdf ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <FileText className="size-4" />
                )}
                <span>{isExportingClubPdf ? "Generating PDF..." : "Download Club Ledger (PDF)"}</span>
              </button>
            </div>
          </div>

          {/* Club KPI Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-dark-2 p-5 rounded-2xl border border-stroke dark:border-dark-3 shadow-xs space-y-1">
              <span className="text-[11px] font-bold text-dark-5 dark:text-dark-6 uppercase tracking-wider block">
                Total Blood Bags Donated
              </span>
              <div className="flex items-center gap-2">
                <Droplet className="size-5 text-rose-600" />
                <span className="text-2xl font-black text-rose-600">
                  {clubStats.totalBagsDonated}
                </span>
                <span className="text-xs font-bold text-dark-5 dark:text-dark-6">bags</span>
              </div>
            </div>

            <div className="bg-white dark:bg-dark-2 p-5 rounded-2xl border border-stroke dark:border-dark-3 shadow-xs space-y-1">
              <span className="text-[11px] font-bold text-dark-5 dark:text-dark-6 uppercase tracking-wider block">
                Completed Requests
              </span>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-5 text-emerald-600" />
                <span className="text-2xl font-black text-emerald-600">
                  {clubStats.completedCount}
                </span>
                <span className="text-xs font-bold text-dark-5 dark:text-dark-6">fulfilled</span>
              </div>
            </div>

            <div className="bg-white dark:bg-dark-2 p-5 rounded-2xl border border-stroke dark:border-dark-3 shadow-xs space-y-1">
              <span className="text-[11px] font-bold text-dark-5 dark:text-dark-6 uppercase tracking-wider block">
                Cancelled Requests
              </span>
              <div className="flex items-center gap-2">
                <XCircle className="size-5 text-rose-500" />
                <span className="text-2xl font-black text-rose-500">
                  {clubStats.cancelledCount}
                </span>
                <span className="text-xs font-bold text-dark-5 dark:text-dark-6">records</span>
              </div>
            </div>

            <div className="bg-white dark:bg-dark-2 p-5 rounded-2xl border border-stroke dark:border-dark-3 shadow-xs space-y-1">
              <span className="text-[11px] font-bold text-dark-5 dark:text-dark-6 uppercase tracking-wider block">
                Active Volunteers
              </span>
              <div className="flex items-center gap-2">
                <Users className="size-5 text-blue-600" />
                <span className="text-2xl font-black text-blue-600">
                  {clubStats.activeVolunteersCount}
                </span>
                <span className="text-xs font-bold text-dark-5 dark:text-dark-6">executives</span>
              </div>
            </div>
          </div>

          {/* Monthly Archives & Per-Month PDF Downloads */}
          <div className="bg-white dark:bg-dark-2 rounded-2xl border border-stroke dark:border-dark-3 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="font-black text-base text-dark dark:text-white flex items-center gap-2">
                  <Calendar className="size-4.5 text-rose-600" />
                  <span>Monthly Archives & Downloadable Reports ({clubHallFilter === "all" ? "Central DU" : clubHallFilter})</span>
                </h2>
                <p className="text-xs text-dark-5 dark:text-dark-6">
                  Select and download official server-rendered PDF monthly ledgers for any month.
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 self-start sm:self-auto">
                {clubMonthlySummaryList.length} Recorded Months
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {clubMonthlySummaryList.map((mItem) => {
                const isDownloadingThis = downloadingMonthKey === mItem.month;
                const isCurrentFilter = clubMonthFilter === mItem.month;

                return (
                  <div
                    key={mItem.month}
                    className={`p-4 rounded-xl border transition flex flex-col justify-between gap-3 ${
                      isCurrentFilter
                        ? "border-rose-500 bg-rose-50/20 dark:bg-rose-950/20 shadow-xs"
                        : "border-stroke dark:border-dark-4 bg-gray-1/40 dark:bg-dark-3/40 hover:border-stroke-dark dark:hover:border-dark-5"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-sm text-dark dark:text-white">
                          {mItem.label}
                        </h3>
                        <p className="text-[11px] text-dark-5 dark:text-dark-6 mt-0.5">
                          {mItem.bagsDonated} Bags Donated • {mItem.completedCount} Completed
                        </p>
                      </div>

                      <button
                        onClick={() => setClubMonthFilter(mItem.month)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md transition ${
                          isCurrentFilter
                            ? "bg-rose-600 text-white"
                            : "bg-gray-2 dark:bg-dark-4 text-dark-5 dark:text-dark-6 hover:text-dark dark:hover:text-white"
                        }`}
                      >
                        {isCurrentFilter ? "Viewing" : "Filter View"}
                      </button>
                    </div>

                    <div className="pt-2 border-t border-stroke dark:border-dark-4 flex items-center justify-between">
                      <span className="text-[11px] font-medium text-dark-5 dark:text-dark-6">
                        {mItem.totalRequests} Total Requests
                      </span>

                      <button
                        onClick={() => handleDownloadClubMonthLedger(mItem.month)}
                        disabled={isDownloadingThis}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 disabled:opacity-70 text-white text-xs font-bold shadow-xs transition active:scale-95"
                        title={`Download PDF ledger for ${mItem.label}`}
                      >
                        {isDownloadingThis ? (
                          <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                          <FileText className="size-3.5" />
                        )}
                        <span>{isDownloadingThis ? "Generating..." : "Download PDF"}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Date and Count of Managed Breakdown */}
          <div className="bg-white dark:bg-dark-2 rounded-2xl border border-stroke dark:border-dark-3 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-black text-base text-dark dark:text-white flex items-center gap-2">
                  <Calendar className="size-4.5 text-rose-600" />
                  <span>Date & Count of Managed Units (Daily Timeline)</span>
                </h2>
                <p className="text-xs text-dark-5 dark:text-dark-6">
                  Detailed daily distribution showing count of managed blood bags and volunteers involved.
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-gray-1 dark:bg-dark-3 text-dark-5 dark:text-dark-6">
                {dailyManagedTimeline.length} Active Dates
              </span>
            </div>

            {dailyManagedTimeline.length === 0 ? (
              <div className="py-8 text-center text-xs text-dark-5 dark:text-dark-6">
                No managed records match the selected club, month, or blood group filters.
              </div>
            ) : (
              <div className="space-y-3">
                {dailyManagedTimeline.map((day) => (
                  <div
                    key={day.date}
                    className="p-4 rounded-xl border border-stroke dark:border-dark-4 bg-gray-1/40 dark:bg-dark-3/40 hover:bg-rose-50/20 dark:hover:bg-dark-3 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start sm:items-center gap-3">
                      <div className="size-10 rounded-xl bg-rose-600 text-white font-black text-xs flex flex-col items-center justify-center shrink-0 shadow-xs">
                        <span>{day.date.split("-")[2] || "01"}</span>
                        <span className="text-[9px] uppercase font-bold opacity-80">
                          {formatMonthLabel(day.date.substring(0, 7)).split(" ")[0].slice(0, 3)}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-dark dark:text-white">
                            {formatDateDisplay(day.date)}
                          </span>
                          <span className="text-xs font-black px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                            {day.managedBagsCount} Bags Managed
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-dark-5 dark:text-dark-6">
                          <span>
                            {day.completedRequests} Completed • {day.cancelledRequests} Cancelled
                          </span>
                          <span>•</span>
                          <span>
                            Managed By:{" "}
                            <strong className="text-dark dark:text-white">
                              {Array.from(day.volunteers).join(", ") || "Assigned Volunteers"}
                            </strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 self-end md:self-center">
                      <span className="text-[10px] font-bold text-dark-5 dark:text-dark-6 mr-1">
                        Blood Groups:
                      </span>
                      {Array.from(day.bloodGroups).map((bg) => (
                        <span
                          key={bg}
                          className="px-2 py-0.5 rounded-md font-black text-[10px] bg-rose-100 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300 border border-rose-300 dark:border-rose-900"
                        >
                          {bg}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Comprehensive Club Donations Table */}
          <div className="bg-white dark:bg-dark-2 rounded-2xl border border-stroke dark:border-dark-3 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-stroke dark:border-dark-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="font-black text-sm text-dark dark:text-white">
                  Detailed Donation Requisitions Ledger ({clubFilteredRequests.length} records)
                </h2>
                <p className="text-xs text-dark-5 dark:text-dark-6">
                  Complete audit trail including patient, hospital, managed volunteer, and lifecycle status.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-stroke dark:border-dark-3 bg-gray-1 dark:bg-dark-3 text-dark-5 dark:text-dark-6 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Patient & Hospital</th>
                    <th className="py-3 px-4 text-center">Blood Group</th>
                    <th className="py-3 px-4 text-center">Bags Managed</th>
                    <th className="py-3 px-4">Managed By</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4">Outcome Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stroke dark:divide-dark-3">
                  {clubFilteredRequests.map((req) => (
                    <tr
                      key={req.id}
                      className="hover:bg-rose-50/40 dark:hover:bg-dark-3/50 transition"
                    >
                      <td className="py-3.5 px-4 font-bold text-dark dark:text-white whitespace-nowrap">
                        {formatDateDisplay(req.dateNeeded || req.createdAt.split("T")[0])}
                      </td>

                      <td className="py-3.5 px-4">
                        <div>
                          <span className="font-bold text-dark dark:text-white block">
                            {req.patientName}
                          </span>
                          <span className="text-[11px] text-dark-5 dark:text-dark-6">
                            {req.hospital}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg font-black text-xs bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900">
                          <Droplet className="size-3 fill-rose-600 text-rose-600" />
                          <span>{req.bloodGroup}</span>
                          {req.isPlasma && <span className="text-[9px] text-amber-500">(Plasma)</span>}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center font-black text-dark dark:text-white">
                        {req.managedBags} / {req.totalBags}
                      </td>

                      <td className="py-3.5 px-4">
                        <div>
                          <span className="font-bold text-dark dark:text-white block">
                            {req.managedByVolunteerName || req.createdByVolunteerName || "Unassigned"}
                          </span>
                          <span className="text-[10px] text-dark-5 dark:text-dark-6">
                            {req.managedByVolunteerHall || "DU Central"}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        {req.status === "completed" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-black text-[11px] bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                            <CheckCircle2 className="size-3" />
                            <span>Completed</span>
                          </span>
                        ) : req.status === "cancelled" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-black text-[11px] bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400">
                            <XCircle className="size-3" />
                            <span>Cancelled</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-black text-[11px] bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400">
                            <span>In Progress</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-dark-5 dark:text-dark-6 text-xs max-w-xs truncate">
                        {req.cancellationReason || req.notes || req.reason}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DonationsPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-xs font-bold text-gray-5">Loading Badhon Donation Ledger...</div>}>
      <DonationsContent />
    </Suspense>
  );
}
