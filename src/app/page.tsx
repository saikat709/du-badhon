"use client";

import {
  ArrowRight,
  Building2,
  Droplet,
  HeartHandshake,
  Lock,
  Menu,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { SmartAppButton } from "@/components/PWA/PWAInstaller";
import { ThemeToggleSwitch } from "@/components/Layouts/header";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"] as const;

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-white dark:bg-dark-2 flex flex-col font-sans relative text-dark dark:text-white">
      {/* Single Unified Fixed Top Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-stroke dark:border-dark-3 bg-white/95 dark:bg-dark-2/95 backdrop-blur-md px-4 sm:px-6 py-2.5 transition-colors">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="size-9 rounded-xl bg-gradient-to-tr from-rose-600 via-rose-500 to-red-600 p-0.5 shadow-md shadow-rose-600/20">
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
                <span className="text-lg font-black text-rose-600 tracking-wider block leading-none">
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

          {/* Desktop Navigation Links */}
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
              Blood Requests
            </Link>
            <Link
              href="/hall-units"
              className="px-3 py-1.5 rounded-lg hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
            >
              Hall Units
            </Link>
          </nav>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Unified PWA / APK install button */}
            <SmartAppButton />

            {/* Dark / Light Theme Toggle */}
            <ThemeToggleSwitch />

            {/* Dashboard CTA */}
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm transition active:scale-95"
            >
              <span className="hidden sm:inline">Operations</span>
              <span>Dashboard</span>
              <ArrowRight className="size-3.5" />
            </Link>

            {/* Mobile Menu Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
              className="md:hidden p-2 rounded-xl border border-stroke dark:border-dark-3 text-dark dark:text-white hover:bg-gray-1 dark:hover:bg-dark-3 transition"
            >
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-stroke dark:border-dark-3 mt-2.5 pt-3 pb-2 space-y-1.5 text-xs font-bold animate-fadeIn">
            <Link
              href="/search-blood"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-dark dark:text-white hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 transition"
            >
              <Search className="size-4 text-rose-600" />
              <span>Search Donors</span>
            </Link>
            <Link
              href="/blood-requests"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-dark dark:text-white hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 transition"
            >
              <HeartHandshake className="size-4 text-rose-600" />
              <span>Emergency Blood Requests</span>
            </Link>
            <Link
              href="/hall-units"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-dark dark:text-white hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 transition"
            >
              <Building2 className="size-4 text-rose-600" />
              <span>16 DU Hall Units & Executives</span>
            </Link>
          </div>
        )}
      </header>

      {/* Hero Section (Focused on Life Saving, No Redundant Second Navbar) */}
      <section className="relative flex flex-col items-center justify-center py-16 sm:py-24 px-4 bg-gradient-to-b from-rose-50/70 via-white to-gray-1 dark:from-dark-3 dark:via-dark-2 dark:to-dark-2 overflow-hidden text-center">
        <div className="max-w-3xl mx-auto space-y-6 relative z-10">
          {/* Central DU Platform Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-rose-100 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-900 px-3.5 py-1 text-xs font-bold text-rose-700 dark:text-rose-300">
            <span className="size-2 rounded-full bg-rose-600 animate-ping" />
            <span>Dhaka University Central Management Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Eka Noy, Sobai Mile <br />
            <span className="text-rose-600">Rokto Diye Bachai Pran</span>
          </h1>

          <p className="text-sm sm:text-base text-dark-5 dark:text-dark-6 max-w-xl mx-auto leading-relaxed">
            Connecting voluntary blood donors and seekers across 16 residential halls of the
            University of Dhaka. Track emergency requirements, avoid member calling conflicts, and save lives faster.
          </p>

          {/* Quick Emergency Blood Finder Tool (Functional Seeker Card, Not a Redundant Navbar) */}
          <div className="mt-8 mx-auto max-w-xl w-full bg-white dark:bg-dark-3 rounded-2xl p-5 sm:p-6 border border-stroke dark:border-dark-4 shadow-lg text-left space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                <Droplet className="size-4.5 fill-rose-600 text-rose-600" />
                <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-dark dark:text-white">
                  Need Blood Urgently on Campus?
                </h2>
              </div>
              <span className="text-[11px] font-bold text-gray-5 dark:text-gray-4">
                Instant Filter
              </span>
            </div>

            <p className="text-xs text-dark-5 dark:text-dark-6">
              Select the required blood group to instantly discover ready donors across DU halls:
            </p>

            {/* Blood Group Selectors */}
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {BLOOD_GROUPS.map((bg) => (
                <Link
                  key={bg}
                  href={`/search-blood?group=${encodeURIComponent(bg)}`}
                  className="flex flex-col items-center justify-center py-2.5 px-1 rounded-xl font-black text-xs sm:text-sm bg-rose-50 hover:bg-rose-600 hover:text-white dark:bg-dark-2 dark:hover:bg-rose-600 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-dark-4 shadow-2xs transition active:scale-95 group"
                >
                  <span>{bg}</span>
                </Link>
              ))}
            </div>

            {/* Emergency Blood Request Quick Link */}
            <div className="pt-3 border-t border-stroke dark:border-dark-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className="text-dark-5 dark:text-dark-6 text-center sm:text-left">
                Cannot find a donor? Post an official emergency requisition:
              </span>
              <Link
                href="/blood-requests?new=true"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shrink-0 shadow-xs transition active:scale-95"
              >
                <Plus className="size-3.5" />
                <span>Post Request</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights Grid */}
      <section className="py-16 px-4 max-w-5xl mx-auto w-full">
        <h2 className="text-2xl font-black text-center mb-2">
          Why Badhon Platform?
        </h2>
        <p className="text-xs text-dark-5 dark:text-dark-6 text-center max-w-md mx-auto mb-10">
          Engineered specifically for Badhon volunteer executives and hall unit coordinators.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-dark-3 rounded-2xl p-6 border border-stroke dark:border-dark-4 shadow-xs space-y-3">
            <span className="size-12 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center">
              <Lock className="size-6" />
            </span>
            <h3 className="font-bold text-base">Member Call Conflict Prevention</h3>
            <p className="text-xs text-dark-5 dark:text-dark-6 leading-relaxed">
              When one volunteer calls a donor, the donor card locks campus-wide for 10 minutes.
              Prevents disturbing donors with duplicate calls from multiple executives.
            </p>
          </div>

          <div className="bg-white dark:bg-dark-3 rounded-2xl p-6 border border-stroke dark:border-dark-4 shadow-xs space-y-3">
            <span className="size-12 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
              <Droplet className="size-6" />
            </span>
            <h3 className="font-bold text-base">Multi-Bag & Plasma Fulfillment</h3>
            <p className="text-xs text-dark-5 dark:text-dark-6 leading-relaxed">
              Track multi-bag operations (1 to 5+ bags) slot by slot. Assign distinct donors to individual bags and manage whole blood or plasma demands.
            </p>
          </div>

          <div className="bg-white dark:bg-dark-3 rounded-2xl p-6 border border-stroke dark:border-dark-4 shadow-xs space-y-3">
            <span className="size-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <Building2 className="size-6" />
            </span>
            <h3 className="font-bold text-base">16 DU Hall Units Connected</h3>
            <p className="text-xs text-dark-5 dark:text-dark-6 leading-relaxed">
              Fazlul Huq, Shahidullah, Amar Ekushey, Jagannath, Sufia Kamal and all residential halls indexed by session, batch, and blood group.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-stroke dark:border-dark-3 py-6 px-4 text-center text-xs text-dark-5 dark:text-dark-6">
        <p>© 2026 Badhon (Voluntary Blood Donors&apos; Organization) - University of Dhaka.</p>
        <p className="mt-1">Dedicated to humanity, voluntary blood donation, and saving lives.</p>
      </footer>
    </main>
  );
}
