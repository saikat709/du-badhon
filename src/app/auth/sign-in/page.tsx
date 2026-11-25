import Signin from "@/components/Auth/Signin";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { Building2, HeartHandshake, ShieldCheck, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Sign in | DU Badhon",
};

export default function SignIn() {
  return (
    <div className="w-full rounded-3xl bg-white shadow-2xl dark:bg-gray-dark dark:shadow-card border border-stroke dark:border-dark-3 overflow-hidden">
      <div className="flex flex-col lg:flex-row items-stretch">
        {/* Left Side: Sign In Form */}
        <div className="w-full lg:w-7/12 p-6 sm:p-8 md:p-10 flex flex-col justify-center">
          {/* Logo & Platform Header */}
          <div className="flex items-center gap-3 mb-6">
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/images/logo/logo-icon.svg"
                width={36}
                height={36}
                alt="Badhon Logo"
                priority
              />
              <div>
                <span className="text-lg sm:text-xl font-black text-rose-600 tracking-wider">
                  DU BADHON
                </span>
                <span className="block text-[11px] font-bold text-dark-5 dark:text-dark-6">
                  University of Dhaka
                </span>
              </div>
            </Link>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-black text-dark dark:text-white tracking-tight">
              Sign In to Portal
            </h1>
            <p className="text-xs sm:text-sm text-dark-5 dark:text-dark-6 mt-1">
              Enter your volunteer credentials or select a test account below to begin on-duty coordination.
            </p>
          </div>

          <Suspense
            fallback={
              <div className="py-6 text-center text-xs text-gray-500">
                Loading sign in form...
              </div>
            }
          >
            <Signin />
          </Suspense>
        </div>

        {/* Right Side: Badhon Information & DU Heritage (visible on lg+) */}
        <div className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-rose-700 via-rose-800 to-red-950 p-8 sm:p-10 flex-col justify-between text-white relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-black/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-rose-100 text-xs font-bold backdrop-blur-xs">
              <ShieldCheck className="size-3.5" />
              <span>16 DU Hall Units Network</span>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black tracking-tight leading-snug">
                Blood Coordination Made Instant & Reliable
              </h2>
              <p className="text-xs text-rose-100 leading-relaxed">
                Connect directly with emergency patients across DMCH, BSMMU, and Dhaka hospitals with zero donor call collisions.
              </p>
            </div>

            <div className="space-y-3.5 pt-2">
              <div className="flex items-center gap-3 text-xs">
                <span className="size-8 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                  <Sparkles className="size-4 text-amber-300" />
                </span>
                <span>Realtime Calling Locks & Timer Synchronization</span>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="size-8 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                  <Building2 className="size-4 text-rose-200" />
                </span>
                <span>All 16 Hall Units Roster & Directory</span>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="size-8 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                  <HeartHandshake className="size-4 text-emerald-300" />
                </span>
                <span>Multi-volunteer Search Visibility</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-8 border-t border-white/15 text-xs text-rose-200">
            <p className="font-bold text-white">
              &ldquo;একের রক্ত অন্যের জীবন, রক্তই হোক আত্মার বাঁধন&rdquo;
            </p>
            <p className="text-[11px] text-rose-200/80 mt-1">
              Voluntary Blood Donors&apos; Organization — University of Dhaka
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
