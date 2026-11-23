"use client";

import { SmartAppButton } from "@/components/PWA/PWAInstaller";
import { ThemeToggleSwitch } from "@/components/Layouts/header/theme-toggle";
import { useBadhon, isDonorEligible } from "@/context/badhon-context";
import { BloodGroup, HallUnit } from "@/types/badhon";
import {
  AlertCircle,
  ArrowRight,
  Award,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Download,
  Droplet,
  ExternalLink,
  Heart,
  HeartHandshake,
  HelpCircle,
  Info,
  Lock,
  MapPin,
  Menu,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  User,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useMemo, useState } from "react";

const BLOOD_GROUPS: BloodGroup[] = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

const HALL_CLUSTERS: Array<{
  category: string;
  description: string;
  halls: HallUnit[];
}> = [
  {
    category: "Science Faculty & Curzon Hall Campus",
    description: "Units covering biological, chemical, physical, and engineering students.",
    halls: ["Fazlul Huq Muslim Hall", "Shahidullah Hall", "Amar Ekushey Hall"],
  },
  {
    category: "Arts, Social Science & Business Campus",
    description: "Central residential halls situated around Nilkhet and TSC.",
    halls: [
      "Surja Sen Hall",
      "Haji Muhammad Mohsin Hall",
      "Kabi Jasimuddin Hall",
      "Bijoy Ekattor Hall",
      "Ziaur Rahman Hall",
      "Bangabandhu Sheikh Mujibur Rahman Hall",
      "Salimullah Muslim Hall",
      "Jagannath Hall",
    ],
  },
  {
    category: "Female Residential Halls",
    description: "Dedicated residential hall units for female students and researchers.",
    halls: [
      "Ruqayyah Hall",
      "Shamsun Nahar Hall",
      "Kabi Sufia Kamal Hall",
      "Bangladesh-Kuwait Maitree Hall",
      "Fazilatunnesa Mujib Hall",
    ],
  },
];

const FAQS = [
  {
    q: "Who is eligible to donate blood at Dhaka University?",
    a: "Any healthy student or staff aged 18 to 60, weighing at least 45 kg (females) or 48 kg (males), with hemoglobin of at least 12 g/dL, and who has not donated blood in the past 90 days (3 months).",
  },
  {
    q: "Does donating blood make a donor weak?",
    a: "No. The human body replenishes lost blood plasma within 24 to 48 hours, and red blood cells are completely regenerated within 4 to 8 weeks. Donating blood actually stimulates fresh bone marrow blood production.",
  },
  {
    q: "Does Badhon charge any money for blood?",
    a: "Never. Badhon operates on a strict 100% voluntary, non-remunerated, non-commercial code of humanity. No donor or executive receives or requests any financial compensation for voluntary blood donation.",
  },
  {
    q: "How does the 'Member Caller Lock' prevent donor disturbance?",
    a: "When a Badhon executive calls a donor to fulfill an emergency request, our system locks the donor's profile campus-wide for 10 minutes. Other hall coordinators see who is currently calling, eliminating duplicate calls.",
  },
  {
    q: "How can I join Badhon as an active executive or hall volunteer?",
    a: "First-year residential students are welcomed into Badhon during annual hall recruitment drives. You can also visit your hall unit's Badhon room or reach out to the hall president listed in our Hall Units Directory.",
  },
];

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const { donors, bloodRequests, volunteers } = useBadhon();

  // Donor readiness stats per blood group
  const readyDonorsByGroup = useMemo(() => {
    const counts: Record<string, number> = {};
    BLOOD_GROUPS.forEach((bg) => {
      counts[bg] = donors.filter(
        (d) => d.bloodGroup === bg && isDonorEligible(d.lastDonationDate),
      ).length;
    });
    return counts;
  }, [donors]);

  // Urgent ongoing blood requests (active or partially managed)
  const urgentRequests = useMemo(() => {
    return bloodRequests
      .filter((r) => r.status === "active" || r.status === "partially_managed")
      .slice(0, 3);
  }, [bloodRequests]);

  // Total completed bags
  const totalBagsCompleted = useMemo(() => {
    return bloodRequests
      .filter((r) => r.status === "completed")
      .reduce((sum, r) => sum + r.managedBags, 0);
  }, [bloodRequests]);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#020d1a] flex flex-col font-sans relative text-slate-800 dark:text-slate-100 selection:bg-rose-500 selection:text-white">
      {/* ================================================================= */}
      {/* 1. TOP NAVBAR                                                     */}
      {/* ================================================================= */}
      <header className="sticky top-0 z-40 w-full border-b border-stroke/80 dark:border-dark-3/80 bg-white/95 dark:bg-[#020d1a]/95 backdrop-blur-md px-4 sm:px-6 py-2.5 transition-colors">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          {/* Logo and Badhon Brand */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="size-9 rounded-xl bg-gradient-to-tr from-rose-600 via-rose-500 to-red-600 p-0.5 shadow-md shadow-rose-600/30 group-hover:scale-105 transition-transform">
              <div className="size-full rounded-[10px] bg-slate-900 flex items-center justify-center">
                <Image
                  src="/images/logo/logo-icon.svg"
                  width={24}
                  height={24}
                  alt="Badhon Logo"
                  style={{ width: "auto", height: "auto" }}
                  priority
                />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black text-rose-600 dark:text-rose-500 tracking-wider block leading-none">
                  BADHON
                </span>
                <span className="rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 px-1 py-0.2 text-[8px] font-black uppercase tracking-wider border border-rose-500/20">
                  DU
                </span>
              </div>
              <span className="text-[10px] font-semibold text-gray-5 dark:text-gray-4 uppercase tracking-widest block mt-0.5">
                Blood Donors&apos; Org
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-bold text-dark dark:text-white">
            <Link
              href="/search-blood"
              className="px-3 py-1.5 rounded-lg hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
            >
              Search Donors
            </Link>
            <Link
              href="/blood-requests"
              className="px-3 py-1.5 rounded-lg hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
            >
              Emergency Requests
            </Link>
            <Link
              href="/hall-units"
              className="px-3 py-1.5 rounded-lg hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
            >
              16 Hall Units
            </Link>
            <Link
              href="/donations"
              className="px-3 py-1.5 rounded-lg hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
            >
              Ledger & Reports
            </Link>
          </nav>

          {/* Action Cluster */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <SmartAppButton />
            <ThemeToggleSwitch />

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 transition active:scale-95"
            >
              <span className="hidden sm:inline">Coordinator</span>
              <span>Dashboard</span>
              <ArrowRight className="size-3.5" />
            </Link>

            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
              className="md:hidden p-2 rounded-xl border border-stroke dark:border-dark-3 text-dark dark:text-white hover:bg-gray-1 dark:hover:bg-dark-3 transition"
            >
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-stroke dark:border-dark-3 mt-2.5 pt-3 pb-2 space-y-1.5 text-xs font-bold">
            <Link
              href="/search-blood"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 transition"
            >
              <Search className="size-4 text-rose-600" />
              <span>Search Voluntary Donors</span>
            </Link>
            <Link
              href="/blood-requests"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 transition"
            >
              <HeartHandshake className="size-4 text-rose-600" />
              <span>Emergency Blood Requisitions</span>
            </Link>
            <Link
              href="/hall-units"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 transition"
            >
              <Building2 className="size-4 text-rose-600" />
              <span>16 DU Hall Units & Executives</span>
            </Link>
            <Link
              href="/donations"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 transition"
            >
              <Award className="size-4 text-rose-600" />
              <span>Donations Ledger & Monthly Performance</span>
            </Link>
          </div>
        )}
      </header>

      {/* ================================================================= */}
      {/* 2. IMMERSIVE HERO WITH BACKGROUND BANNER & ATMOSPHERIC GLOW       */}
      {/* ================================================================= */}
      <section className="relative overflow-hidden pt-12 pb-20 md:py-24 text-white">
        {/* Layer 1: Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/badhon-banner.jpg"
            alt="Badhon Dhaka University Banner"
            fill
            priority
            className="object-cover object-center filter brightness-[0.4] contrast-[1.1] scale-105"
          />
        </div>

        {/* Layer 2: Gradient Backdrop Overlay */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-rose-950/85 via-slate-950/90 to-[#020d1a] pointer-events-none" />

        {/* Layer 3: Ambient Radial Glow Lights */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-rose-600/30 blur-[140px] rounded-full pointer-events-none z-0" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[300px] bg-red-800/20 blur-[130px] rounded-full pointer-events-none z-0" />

        {/* Content Container */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            {/* University Tag Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-rose-500/20 border border-rose-400/30 px-4 py-1.5 text-xs font-bold text-rose-200 backdrop-blur-md shadow-lg">
              <span className="size-2 rounded-full bg-rose-400 animate-ping" />
              <span>University of Dhaka • Voluntary Blood Donors&apos; Org • Est. 1997</span>
            </div>

            {/* Main Headlines */}
            <div className="space-y-3">
              <p className="text-rose-300 font-bold tracking-widest uppercase text-xs sm:text-sm">
                একা নয়, সবাই মিলে রক্ত দিয়ে বাঁচাই প্রাণ
              </p>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight drop-shadow-md">
                Connecting Voluntary Blood Donors Across{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-rose-300 to-amber-200">
                  16 DU Halls
                </span>
              </h1>
            </div>

            <p className="text-sm sm:text-base text-slate-200/90 max-w-2xl mx-auto leading-relaxed font-medium">
              Badhon is Dhaka University&apos;s pioneering non-remunerated voluntary blood donors&apos; platform.
              Coordinate emergency requisitions, prevent duplicate calling disturbances, and save lives 24/7.
            </p>

            {/* Quick Action CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/blood-requests?new=true"
                className="px-6 py-3.5 rounded-xl font-bold bg-rose-600 hover:bg-rose-500 text-white text-sm shadow-xl shadow-rose-600/40 transition active:scale-95 flex items-center gap-2"
              >
                <Plus className="size-4" />
                <span>Post Emergency Request</span>
              </Link>

              <Link
                href="/search-blood"
                className="px-6 py-3.5 rounded-xl font-bold bg-white/10 hover:bg-white/20 text-white text-sm backdrop-blur-md border border-white/20 shadow-lg transition active:scale-95 flex items-center gap-2"
              >
                <Search className="size-4" />
                <span>Search Ready Donors</span>
              </Link>

              <Link
                href="/dashboard"
                className="px-5 py-3.5 rounded-xl font-bold bg-slate-900/80 hover:bg-slate-900 text-slate-200 hover:text-white text-sm border border-slate-700/60 transition active:scale-95 flex items-center gap-2"
              >
                <span>Operations Center</span>
                <ArrowRight className="size-4 text-rose-400" />
              </Link>
            </div>

            {/* ======================================================= */}
            {/* 1-CLICK INSTANT BLOOD GROUP MATCHER CARD                 */}
            {/* ======================================================= */}
            <div className="mt-8 text-left rounded-3xl bg-slate-900/85 backdrop-blur-xl border border-rose-500/30 p-5 sm:p-7 shadow-2xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="size-8 rounded-xl bg-rose-600/30 text-rose-400 flex items-center justify-center">
                    <Droplet className="size-4.5 fill-rose-500 text-rose-500" />
                  </span>
                  <div>
                    <h2 className="text-sm font-black uppercase tracking-wider text-white">
                      Need Blood Urgently on DU Campus or Nearby Hospital?
                    </h2>
                    <p className="text-[11px] text-slate-400">
                      Select blood group to instantly match eligible student donors:
                    </p>
                  </div>
                </div>

                <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20 self-start sm:self-auto">
                  Instant Campus Match
                </span>
              </div>

              {/* 8 Blood Group Pills with Live Count */}
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
                {BLOOD_GROUPS.map((bg) => {
                  const readyCount = readyDonorsByGroup[bg] || 0;
                  return (
                    <Link
                      key={bg}
                      href={`/search-blood?group=${encodeURIComponent(bg)}`}
                      className="flex flex-col items-center justify-center py-2.5 px-1.5 rounded-2xl bg-white/5 hover:bg-rose-600 border border-white/10 hover:border-rose-500 transition duration-200 group text-center"
                    >
                      <span className="font-black text-sm text-white group-hover:scale-110 transition-transform">
                        {bg}
                      </span>
                      <span className="text-[10px] font-medium text-rose-300 group-hover:text-white mt-0.5">
                        {readyCount} ready
                      </span>
                    </Link>
                  );
                })}
              </div>

              {/* Helper Micro-notice */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="size-3.5 text-emerald-400" />
                  <span>All donors are verified DU residential students with tracked 90-day rest periods.</span>
                </span>
                <Link
                  href="/search-blood"
                  className="text-rose-300 hover:text-white font-bold flex items-center gap-1"
                >
                  <span>Advanced Hall Filter</span>
                  <ChevronRight className="size-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 3. OFFICIAL IMPACT METRICS BAR                                    */}
      {/* ================================================================= */}
      <section className="bg-white dark:bg-dark-2 border-y border-stroke dark:border-dark-3 py-8 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-black text-rose-600 dark:text-rose-500">
              16
            </span>
            <p className="text-xs font-bold text-dark dark:text-white uppercase tracking-wider">
              DU Residential Halls
            </p>
            <p className="text-[11px] text-dark-5 dark:text-dark-6">
              Connected across Curzon & Central campus
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-black text-rose-600 dark:text-rose-500">
              10,000+
            </span>
            <p className="text-xs font-bold text-dark dark:text-white uppercase tracking-wider">
              Registered Student Donors
            </p>
            <p className="text-[11px] text-dark-5 dark:text-dark-6">
              Indexed by session, hall & blood group
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-black text-rose-600 dark:text-rose-500">
              {totalBagsCompleted > 0 ? `${totalBagsCompleted}+` : "50,000+"}
            </span>
            <p className="text-xs font-bold text-dark dark:text-white uppercase tracking-wider">
              Blood Bags Managed
            </p>
            <p className="text-[11px] text-dark-5 dark:text-dark-6">
              Delivered safely to Dhaka hospitals
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400">
              100% Free
            </span>
            <p className="text-xs font-bold text-dark dark:text-white uppercase tracking-wider">
              Voluntary Service
            </p>
            <p className="text-[11px] text-dark-5 dark:text-dark-6">
              Zero commercial fee, purely for humanity
            </p>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 4. LIVE URGENT REQUISITIONS BOARD                                */}
      {/* ================================================================= */}
      {urgentRequests.length > 0 && (
        <section className="py-14 px-4 max-w-6xl mx-auto w-full space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-rose-600">
                <Clock className="size-4.5 animate-pulse" />
                <span className="text-xs font-black uppercase tracking-wider">
                  Live Emergency Feed
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-dark dark:text-white mt-0.5">
                Urgent Hospital Blood Requisitions Right Now
              </h2>
            </div>

            <Link
              href="/blood-requests"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400"
            >
              <span>View All Emergency Requests</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {urgentRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white dark:bg-dark-2 rounded-2xl p-5 border border-stroke dark:border-dark-3 shadow-sm hover:border-rose-400 transition space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 font-black text-xs px-2.5 py-0.5 rounded-lg bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                    <Droplet className="size-3 fill-rose-600" />
                    <span>{req.bloodGroup}</span>
                    {req.isPlasma && <span className="text-[10px]">(Plasma)</span>}
                  </span>
                  <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full">
                    {req.urgency.split(" ")[0]}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-dark dark:text-white truncate">
                    {req.patientName}
                  </h3>
                  <p className="text-xs text-dark-5 dark:text-dark-6 truncate mt-0.5">
                    {req.hospital}
                  </p>
                </div>

                <div className="pt-2 border-t border-stroke dark:border-dark-3 flex items-center justify-between text-xs">
                  <span className="text-dark-5 dark:text-dark-6">
                    Bags: <strong>{req.managedBags}/{req.totalBags}</strong>
                  </span>
                  <Link
                    href={`/search-blood?requestId=${req.id}&group=${encodeURIComponent(req.bloodGroup)}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline"
                  >
                    <span>Help Fulfill</span>
                    <ArrowRight className="size-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ================================================================= */}
      {/* 5. HOW DU BADHON WORKS (4-STEP TRANSPARENCY)                       */}
      {/* ================================================================= */}
      <section className="py-16 px-4 bg-white dark:bg-dark-2 border-y border-stroke dark:border-dark-3">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-rose-600 dark:text-rose-400">
              Coordinated Voluntary Transfusion
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-dark dark:text-white">
              How DU Badhon Operates
            </h2>
            <p className="text-xs text-dark-5 dark:text-dark-6 leading-relaxed">
              Our campus-tested workflow coordinates voluntary blood donation efficiently while protecting donors from harassment.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-gray-1 dark:bg-dark-3 border border-stroke dark:border-dark-4 space-y-3 relative">
              <span className="size-10 rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-950/70 dark:text-rose-300 font-black text-sm flex items-center justify-center">
                1
              </span>
              <h3 className="font-bold text-sm text-dark dark:text-white">Request Lodged</h3>
              <p className="text-xs text-dark-5 dark:text-dark-6 leading-relaxed">
                Hospitalized patient or DU student attendant posts verified blood requirement specifying group, hospital ward, and bags needed.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gray-1 dark:bg-dark-3 border border-stroke dark:border-dark-4 space-y-3 relative">
              <span className="size-10 rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950/70 dark:text-blue-300 font-black text-sm flex items-center justify-center">
                2
              </span>
              <h3 className="font-bold text-sm text-dark dark:text-white">Caller Lock Protection</h3>
              <p className="text-xs text-dark-5 dark:text-dark-6 leading-relaxed">
                A hall coordinator locks the donor profile during phone inquiries. Zero disturbance from multiple volunteers calling the same donor.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gray-1 dark:bg-dark-3 border border-stroke dark:border-dark-4 space-y-3 relative">
              <span className="size-10 rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/70 dark:text-emerald-300 font-black text-sm flex items-center justify-center">
                3
              </span>
              <h3 className="font-bold text-sm text-dark dark:text-white">Safe Hospital Donation</h3>
              <p className="text-xs text-dark-5 dark:text-dark-6 leading-relaxed">
                Donor reports to the hospital blood bank (DMCH, BSMMU, NICVD, etc.) for cross-matching and voluntary donation.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gray-1 dark:bg-dark-3 border border-stroke dark:border-dark-4 space-y-3 relative">
              <span className="size-10 rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-950/70 dark:text-purple-300 font-black text-sm flex items-center justify-center">
                4
              </span>
              <h3 className="font-bold text-sm text-dark dark:text-white">90-Day Rest Tracked</h3>
              <p className="text-xs text-dark-5 dark:text-dark-6 leading-relaxed">
                Completed donation is stamped in the club ledger. The donor automatically rests for 90 days before appearing as eligible again.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 6. 16 DU RESIDENTIAL HALL UNITS SHOWCASE                          */}
      {/* ================================================================= */}
      <section className="py-16 px-4 max-w-6xl mx-auto w-full space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-rose-600">
              <Building2 className="size-4.5" />
              <span className="text-xs font-black uppercase tracking-wider">
                16 DU Hall Units Connected
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-dark dark:text-white mt-1">
              Find Your Hall Coordinators
            </h2>
            <p className="text-xs text-dark-5 dark:text-dark-6">
              Direct emergency contacts for student presidents and secretaries in every residential hall.
            </p>
          </div>

          <Link
            href="/hall-units"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition self-start sm:self-auto"
          >
            <span>Complete 16 Units Directory</span>
            <ExternalLink className="size-3.5" />
          </Link>
        </div>

        <div className="space-y-6">
          {HALL_CLUSTERS.map((cluster) => (
            <div
              key={cluster.category}
              className="bg-white dark:bg-dark-2 rounded-3xl p-6 border border-stroke dark:border-dark-3 shadow-xs space-y-4"
            >
              <div>
                <h3 className="font-black text-sm text-dark dark:text-white">
                  {cluster.category}
                </h3>
                <p className="text-[11px] text-dark-5 dark:text-dark-6">
                  {cluster.description}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {cluster.halls.map((hallName) => {
                  const leadVol = volunteers.find((v) => v.hallUnit === hallName);
                  return (
                    <div
                      key={hallName}
                      className="p-3.5 rounded-2xl bg-gray-1/60 dark:bg-dark-3/60 border border-stroke dark:border-dark-4 flex items-center justify-between gap-3 hover:border-rose-400 transition"
                    >
                      <div className="min-w-0">
                        <h4 className="font-bold text-xs text-dark dark:text-white truncate">
                          {hallName}
                        </h4>
                        {leadVol && (
                          <p className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold truncate mt-0.5">
                            {leadVol.name} ({leadVol.role})
                          </p>
                        )}
                      </div>

                      {leadVol ? (
                        <Link
                          href={`/hall-units?unit=${encodeURIComponent(hallName)}`}
                          className="size-8 rounded-xl bg-white dark:bg-dark-2 border border-stroke dark:border-dark-4 flex items-center justify-center text-dark-5 hover:text-rose-600 transition shrink-0"
                          title={`View ${hallName} Unit Coordinator`}
                        >
                          <ChevronRight className="size-4" />
                        </Link>
                      ) : (
                        <Link
                          href="/hall-units"
                          className="size-8 rounded-xl bg-white dark:bg-dark-2 border border-stroke dark:border-dark-4 flex items-center justify-center text-dark-5 hover:text-rose-600 transition shrink-0"
                        >
                          <ChevronRight className="size-4" />
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================================================================= */}
      {/* 7. DONOR ELIGIBILITY & FAQS                                       */}
      {/* ================================================================= */}
      <section className="py-16 px-4 bg-white dark:bg-dark-2 border-t border-stroke dark:border-dark-3">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-rose-600 dark:text-rose-400">
              Health & Safety Criteria
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-dark dark:text-white">
              Donor Eligibility Guidelines
            </h2>
            <p className="text-xs text-dark-5 dark:text-dark-6">
              Ensuring the complete safety of voluntary blood donors and recipient patients.
            </p>
          </div>

          {/* 4 Eligibility Pillars */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
            <div className="p-4 rounded-2xl bg-gray-1 dark:bg-dark-3 border border-stroke dark:border-dark-4 space-y-1">
              <span className="text-xl font-black text-rose-600">18 - 60</span>
              <p className="text-xs font-bold text-dark dark:text-white">Years of Age</p>
              <p className="text-[10px] text-dark-5 dark:text-dark-6">Active student or staff</p>
            </div>
            <div className="p-4 rounded-2xl bg-gray-1 dark:bg-dark-3 border border-stroke dark:border-dark-4 space-y-1">
              <span className="text-xl font-black text-rose-600">≥ 48 kg</span>
              <p className="text-xs font-bold text-dark dark:text-white">Body Weight</p>
              <p className="text-[10px] text-dark-5 dark:text-dark-6">≥ 45 kg for females</p>
            </div>
            <div className="p-4 rounded-2xl bg-gray-1 dark:bg-dark-3 border border-stroke dark:border-dark-4 space-y-1">
              <span className="text-xl font-black text-rose-600">90 Days</span>
              <p className="text-xs font-bold text-dark dark:text-white">Rest Interval</p>
              <p className="text-[10px] text-dark-5 dark:text-dark-6">Since last donation</p>
            </div>
            <div className="p-4 rounded-2xl bg-gray-1 dark:bg-dark-3 border border-stroke dark:border-dark-4 space-y-1">
              <span className="text-xl font-black text-rose-600">≥ 12 g/dL</span>
              <p className="text-xs font-bold text-dark dark:text-white">Hemoglobin</p>
              <p className="text-[10px] text-dark-5 dark:text-dark-6">Safe iron concentration</p>
            </div>
          </div>

          {/* Interactive FAQ Accordion */}
          <div className="space-y-3 pt-4">
            <h3 className="font-black text-base text-dark dark:text-white mb-2">
              Frequently Asked Questions:
            </h3>

            {FAQS.map((faq, idx) => (
              <div
                key={faq.q}
                className="rounded-2xl border border-stroke dark:border-dark-3 overflow-hidden bg-gray-1/40 dark:bg-dark-3/40"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-4 text-left font-bold text-xs sm:text-sm text-dark dark:text-white flex items-center justify-between gap-3 hover:text-rose-600 transition"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`size-4 shrink-0 transition-transform ${
                      activeFaq === idx ? "rotate-180 text-rose-600" : "text-gray-5"
                    }`}
                  />
                </button>
                {activeFaq === idx && (
                  <div className="px-4 pb-4 text-xs text-dark-5 dark:text-dark-6 leading-relaxed border-t border-stroke dark:border-dark-4 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 8. PWA & ANDROID MOBILE APP BANNER                                */}
      {/* ================================================================= */}
      <section className="py-14 px-4 bg-gradient-to-r from-rose-900 via-rose-950 to-slate-900 text-white">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-rose-300 text-xs font-bold">
              <Smartphone className="size-3.5" />
              <span>Offline Ready • Progressive Web App & Android APK</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Get the Official DU Badhon App on Your Phone
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Don&apos;t get stuck during emergency hospital runs. Install DU Badhon directly from your browser or download the native APK for instant one-tap donor search and offline hall contact lists.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <Link
              href="/download-app"
              className="px-6 py-3.5 rounded-xl font-bold bg-white text-rose-900 hover:bg-rose-50 text-xs shadow-xl transition active:scale-95 flex items-center gap-2"
            >
              <Download className="size-4" />
              <span>Download Android APK</span>
            </Link>
            <Link
              href="/download-app"
              className="px-6 py-3.5 rounded-xl font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs transition active:scale-95 flex items-center gap-2"
            >
              <Smartphone className="size-4" />
              <span>Install Web App (PWA)</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 9. OFFICIAL FOOTER                                                */}
      {/* ================================================================= */}
      <footer className="mt-auto border-t border-stroke dark:border-dark-3 bg-white dark:bg-[#020d1a] py-12 px-4 text-xs text-dark-5 dark:text-dark-6">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-rose-600 tracking-wider">BADHON</span>
                <span className="text-[10px] font-bold text-gray-5 uppercase tracking-widest">
                  University of Dhaka
                </span>
              </div>
              <p className="text-xs leading-relaxed max-w-md">
                Badhon (Voluntary Blood Donors&apos; Organization) started its journey on October 24, 1997 at Shahidullah Hall, University of Dhaka. It is dedicated to humanitarian service, voluntary blood donation, and raising blood safety awareness across Bangladesh.
              </p>
              <p className="text-[11px] font-semibold text-rose-600 dark:text-rose-400">
                Motto: &ldquo;একা নয়, সবাই মিলে রক্ত দিয়ে বাঁচাই প্রাণ&rdquo;
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-dark dark:text-white uppercase tracking-wider text-[11px]">
                Central DU Office
              </h4>
              <p className="text-xs leading-relaxed">
                Room #10, 1st Floor,<br />
                Teacher-Student Centre (TSC),<br />
                University of Dhaka, Dhaka-1000.
              </p>
              <p className="text-xs pt-1">
                Volunteer Help Desk: <strong>Available via Portal</strong>
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-dark dark:text-white uppercase tracking-wider text-[11px]">
                Platform Links
              </h4>
              <ul className="space-y-1.5 text-xs">
                <li>
                  <Link href="/search-blood" className="hover:text-rose-600 transition">
                    Search Donors Directory
                  </Link>
                </li>
                <li>
                  <Link href="/blood-requests" className="hover:text-rose-600 transition">
                    Post Emergency Blood Request
                  </Link>
                </li>
                <li>
                  <Link href="/hall-units" className="hover:text-rose-600 transition">
                    16 Hall Units Directory
                  </Link>
                </li>
                <li>
                  <Link href="/donations" className="hover:text-rose-600 transition">
                    Donations Ledger & Reports
                  </Link>
                </li>
                <li>
                  <Link href="/download-app" className="hover:text-rose-600 transition">
                    Get DU Badhon Mobile App
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-stroke dark:border-dark-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-[11px]">
            <p>© 2026 Badhon (Voluntary Blood Donors&apos; Organization) — University of Dhaka.</p>
            <p>100% Non-Remunerated Voluntary Blood Donation Platform.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
