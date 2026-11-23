import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white dark:bg-dark-2 flex flex-col font-sans relative text-dark dark:text-white">
      {/* Top Navbar */}
      <header className="w-full border-b border-stroke dark:border-dark-3 bg-white/95 dark:bg-dark-2/95 backdrop-blur-md sticky top-0 z-40 px-6 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/images/logo/logo-icon.svg"
              width={32}
              height={34}
              alt="Badhon Logo"
              priority
            />
            <div>
              <span className="text-xl font-black text-rose-600 tracking-wider block leading-none">
                BADHON
              </span>
              <span className="text-[10px] font-bold text-gray-5 uppercase tracking-widest">
                DU Blood Donors&apos; Org
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/search-blood"
              className="text-xs font-bold text-dark dark:text-white hover:text-rose-600 dark:hover:text-rose-400 transition hidden sm:inline-block"
            >
              Search Blood
            </Link>
            <Link
              href="/blood-requests"
              className="text-xs font-bold text-dark dark:text-white hover:text-rose-600 dark:hover:text-rose-400 transition hidden sm:inline-block"
            >
              Blood Requests
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm transition active:scale-95"
            >
              Go to Dashboard &rarr;
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center py-20 px-4 bg-gradient-to-b from-rose-50/60 via-white to-gray-1 dark:from-dark-3 dark:via-dark-2 dark:to-dark-2 overflow-hidden text-center">
        <div className="max-w-3xl mx-auto space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-rose-100 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-900 px-3.5 py-1 text-xs font-bold text-rose-700 dark:text-rose-300">
            <span className="size-2 rounded-full bg-rose-600 animate-ping" />
            <span>Dhaka University Central Management Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Eka Noy, Sobai Mile <br />
            <span className="text-rose-600">Rokto Diye Bachai Pran</span>
          </h1>

          <p className="text-sm sm:text-base text-dark-5 dark:text-dark-6 max-w-xl mx-auto leading-relaxed">
            Connecting voluntary blood donors and seekers across 16 Dhaka University halls.
            Track emergency requests, coordinate volunteer calls without conflicts, and save lives.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/search-blood"
              className="px-7 py-3.5 rounded-xl font-bold bg-rose-600 hover:bg-rose-700 text-white text-sm shadow-md transition active:scale-95 flex items-center gap-2"
            >
              <span>🔍 Search Donors</span>
            </Link>

            <Link
              href="/blood-requests?new=true"
              className="px-7 py-3.5 rounded-xl font-bold bg-white dark:bg-dark-3 hover:bg-gray-2 dark:hover:bg-dark-4 text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-900 text-sm shadow-xs transition active:scale-95 flex items-center gap-2"
            >
              <span>+ Record Blood Request</span>
            </Link>

            <Link
              href="/dashboard"
              className="px-6 py-3.5 rounded-xl font-bold bg-blue-700 hover:bg-blue-800 text-white text-sm shadow-md transition active:scale-95"
            >
              Operations Center &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Highlights Grid */}
      <section className="py-16 px-4 max-w-5xl mx-auto w-full">
        <h2 className="text-2xl font-black text-center mb-2">
          Why Badhon Platform?
        </h2>
        <p className="text-xs text-dark-5 dark:text-dark-6 text-center max-w-md mx-auto mb-10">
          Built specifically for Badhon club members and hall unit coordinators.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-dark-3 rounded-2xl p-6 border border-stroke dark:border-dark-4 shadow-xs space-y-2.5">
            <span className="size-12 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center text-xl font-bold">
              🔒
            </span>
            <h3 className="font-bold text-base">Member Call Conflict Prevention</h3>
            <p className="text-xs text-dark-5 dark:text-dark-6 leading-relaxed">
              When one member calls a donor, other members see &ldquo;Saikat is calling this donor&rdquo;.
              Prevents bothering donors with multiple simultaneous calls.
            </p>
          </div>

          <div className="bg-white dark:bg-dark-3 rounded-2xl p-6 border border-stroke dark:border-dark-4 shadow-xs space-y-2.5">
            <span className="size-12 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center text-xl font-bold">
              🩸
            </span>
            <h3 className="font-bold text-base">Multi-Bag & Plasma Fulfillment</h3>
            <p className="text-xs text-dark-5 dark:text-dark-6 leading-relaxed">
              Track requests requiring 1 to 5+ bags. Assign donors to individual bag slots and track whole blood or plasma requirements.
            </p>
          </div>

          <div className="bg-white dark:bg-dark-3 rounded-2xl p-6 border border-stroke dark:border-dark-4 shadow-xs space-y-2.5">
            <span className="size-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center text-xl font-bold">
              🏛️
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
        <p>© 2026 Badhon (Voluntary Blood Donors&apos; Organization) - Dhaka University.</p>
        <p className="mt-1">Dedicated to humanity, voluntary blood donation, and life saving.</p>
      </footer>
    </main>
  );
}
