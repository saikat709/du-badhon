import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Compass,
  Droplet,
  Home,
  LayoutDashboard,
  Phone,
  Search,
} from "lucide-react";

export const metadata = {
  title: "404 - Page Not Found | DU Badhon",
  description: "The page you are looking for does not exist on DU Badhon platform.",
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-b from-gray-1 via-white to-gray-2 dark:from-[#020d1a] dark:via-[#051326] dark:to-[#020d1a] text-dark dark:text-white">
      <div className="w-full max-w-xl text-center space-y-6">
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

        {/* 404 Hero Illustration & Badge */}
        <div className="relative inline-flex items-center justify-center">
          <div className="absolute -inset-6 rounded-full bg-rose-500/10 dark:bg-rose-500/20 blur-2xl animate-pulse" />
          <div className="relative flex flex-col items-center">
            <div className="flex items-center justify-center size-24 rounded-3xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 shadow-inner mb-4">
              <Compass className="size-12 text-rose-600 animate-[spin_12s_linear_infinite]" />
            </div>
            <span className="text-6xl sm:text-7xl font-black tracking-tighter text-rose-600">
              404
            </span>
          </div>
        </div>

        {/* Messaging */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-dark dark:text-white">
            This Page Doesn&apos;t Exist
          </h1>
          <p className="text-sm sm:text-base text-dark-5 dark:text-dark-6 max-w-md mx-auto leading-relaxed">
            The link you followed may be broken, expired, or the page may have been moved within our blood donors coordination network.
          </p>
        </div>

        {/* Quick Navigation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left pt-2">
          <Link
            href="/"
            className="flex items-center gap-3.5 p-3.5 rounded-2xl border border-stroke dark:border-dark-3 bg-white dark:bg-dark-2 hover:border-rose-300 dark:hover:border-rose-900 hover:shadow-md transition group"
          >
            <div className="flex size-10 items-center justify-center rounded-xl bg-gray-2 dark:bg-dark-3 text-dark dark:text-white group-hover:bg-rose-50 group-hover:text-rose-600 dark:group-hover:bg-rose-950/60 transition">
              <Home className="size-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-dark dark:text-white">Homepage</p>
              <p className="text-[11px] text-dark-5 dark:text-dark-6">Public portal & overview</p>
            </div>
          </Link>

          <Link
            href="/dashboard"
            className="flex items-center gap-3.5 p-3.5 rounded-2xl border border-stroke dark:border-dark-3 bg-white dark:bg-dark-2 hover:border-rose-300 dark:hover:border-rose-900 hover:shadow-md transition group"
          >
            <div className="flex size-10 items-center justify-center rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition">
              <LayoutDashboard className="size-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-dark dark:text-white">Volunteer Dashboard</p>
              <p className="text-[11px] text-dark-5 dark:text-dark-6">Hall unit coordination</p>
            </div>
          </Link>

          <Link
            href="/search-blood"
            className="flex items-center gap-3.5 p-3.5 rounded-2xl border border-stroke dark:border-dark-3 bg-white dark:bg-dark-2 hover:border-rose-300 dark:hover:border-rose-900 hover:shadow-md transition group"
          >
            <div className="flex size-10 items-center justify-center rounded-xl bg-gray-2 dark:bg-dark-3 text-dark dark:text-white group-hover:bg-rose-50 group-hover:text-rose-600 dark:group-hover:bg-rose-950/60 transition">
              <Search className="size-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-dark dark:text-white">Find Blood Donors</p>
              <p className="text-[11px] text-dark-5 dark:text-dark-6">Search by group & hall</p>
            </div>
          </Link>

          <Link
            href="/blood-requests"
            className="flex items-center gap-3.5 p-3.5 rounded-2xl border border-stroke dark:border-dark-3 bg-white dark:bg-dark-2 hover:border-rose-300 dark:hover:border-rose-900 hover:shadow-md transition group"
          >
            <div className="flex size-10 items-center justify-center rounded-xl bg-gray-2 dark:bg-dark-3 text-dark dark:text-white group-hover:bg-rose-50 group-hover:text-rose-600 dark:group-hover:bg-rose-950/60 transition">
              <Droplet className="size-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-dark dark:text-white">Blood Requests</p>
              <p className="text-[11px] text-dark-5 dark:text-dark-6">Active emergency cases</p>
            </div>
          </Link>
        </div>

        {/* Primary Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-700 px-6 py-2.5 text-xs font-bold text-white shadow-md transition active:scale-95"
          >
            <ArrowLeft className="size-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Emergency Help Banner */}
        <div className="mt-8 pt-6 border-t border-stroke dark:border-dark-3 text-xs text-dark-5 dark:text-dark-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Emergency blood need? Call Badhon Central TSC</span>
          </div>
          <a
            href="tel:+8801534982674"
            className="inline-flex items-center gap-1.5 font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400"
          >
            <Phone className="size-3.5" />
            <span>+880 1534-982674</span>
          </a>
        </div>
      </div>
    </div>
  );
}
