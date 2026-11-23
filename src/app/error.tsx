"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AlertTriangle,
  Home,
  LayoutDashboard,
  RefreshCw,
  ShieldAlert,
} from "lucide-react";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to console or error reporting service
    console.error("DU Badhon Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-b from-gray-1 via-white to-gray-2 dark:from-[#020d1a] dark:via-[#051326] dark:to-[#020d1a] text-dark dark:text-white">
      <div className="w-full max-w-lg text-center space-y-6">
        {/* Brand Header */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <Image
            src="/images/logo/logo-icon.svg"
            width={36}
            height={36}
            alt="Badhon Logo"
            style={{ width: "auto", height: "auto" }}
            priority
          />
          <span className="text-xl font-black text-rose-600 tracking-wider">
            DU BADHON
          </span>
        </div>

        {/* Warning Icon Graphic */}
        <div className="relative inline-flex items-center justify-center">
          <div className="absolute -inset-6 rounded-full bg-rose-500/10 dark:bg-rose-500/20 blur-2xl animate-pulse" />
          <div className="relative flex size-20 items-center justify-center rounded-3xl bg-rose-100 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 shadow-md">
            <AlertTriangle className="size-10 text-rose-600 dark:text-rose-400" />
          </div>
        </div>

        {/* Error Details */}
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200 dark:border-rose-900">
            <ShieldAlert className="size-3.5" />
            <span>Runtime Exception Handled</span>
          </span>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-dark dark:text-white">
            Something Went Wrong
          </h1>

          <p className="text-sm text-dark-5 dark:text-dark-6 max-w-md mx-auto leading-relaxed">
            An unexpected error occurred while rendering this view. Your saved donor and management data remain safe.
          </p>
        </div>

        {/* Error Digest (if available) */}
        {error.digest && (
          <div className="bg-gray-2 dark:bg-dark-2 border border-stroke dark:border-dark-3 rounded-xl p-2.5 text-xs text-dark-5 dark:text-dark-6 font-mono max-w-xs mx-auto truncate">
            Incident Reference: <span className="font-bold text-dark dark:text-white">{error.digest}</span>
          </div>
        )}

        {/* Recovery Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-700 px-6 py-2.5 text-xs font-bold text-white shadow-md transition active:scale-95"
          >
            <RefreshCw className="size-4" />
            <span>Try Again</span>
          </button>

          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-stroke dark:border-dark-3 bg-white dark:bg-dark-2 hover:bg-gray-1 dark:hover:bg-dark-3 px-5 py-2.5 text-xs font-bold text-dark dark:text-white transition active:scale-95"
          >
            <LayoutDashboard className="size-4 text-rose-600" />
            <span>Volunteer Dashboard</span>
          </Link>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-stroke dark:border-dark-3 bg-white dark:bg-dark-2 hover:bg-gray-1 dark:hover:bg-dark-3 px-5 py-2.5 text-xs font-bold text-dark-5 dark:text-dark-6 hover:text-dark dark:hover:text-white transition active:scale-95"
          >
            <Home className="size-4" />
            <span>Homepage</span>
          </Link>
        </div>

        {/* Footer Support Info */}
        <div className="pt-6 border-t border-stroke dark:border-dark-3 text-[11px] text-dark-5 dark:text-dark-6">
          If this issue persists, please report it to the DU Badhon Central ICT Team or refresh your browser cache.
        </div>
      </div>
    </div>
  );
}
