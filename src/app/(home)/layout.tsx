import "@/css/satoshi.css";
import "@/css/style.css";

import { Sidebar } from "@/components/Layouts/sidebar";
import { Header } from "@/components/Layouts/header";
import { GlobalCallingModal } from "@/components/Donors/GlobalCallingModal";
import { MobileBottomNav } from "@/components/Navigation/MobileBottomNav";
import { OfflineBanner } from "@/components/Offline/OfflineBanner";
import Link from "next/link";
import type { PropsWithChildren } from "react";

export default function HomeLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-2 dark:bg-[#020d1a]">
      {/* Pinned Left Sidebar */}
      <Sidebar />

      {/* Independently Scrollable Content Area */}
      <div className="flex flex-col flex-1 min-w-0 h-screen overflow-hidden">
        {/* Offline Detection Banner */}
        <OfflineBanner />

        {/* Single Top Header */}
        <Header />

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 2xl:p-10 custom-scrollbar pb-24 lg:pb-10">
          <div className="mx-auto w-full max-w-7xl">
            {children}

            {/* Global Portal Footer */}
            <footer className="mt-12 pt-6 border-t border-stroke dark:border-dark-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-dark-5 dark:text-dark-6">
              <p>© 2026 DU Badhon • Voluntary Blood Donors&apos; Coordination Platform</p>
              <p className="flex items-center gap-1">
                <span>Designed & Developed with ❤️ by</span>
                <Link
                  href="/developer"
                  className="font-bold text-rose-600 dark:text-rose-400 hover:underline"
                >
                  Saikat Islam
                </Link>
              </p>
            </footer>
          </div>
        </main>
      </div>

      {/* Synchronized Global Calling Modal */}
      <GlobalCallingModal />

      {/* Mobile Bottom Navigation (< lg screens) */}
      <MobileBottomNav />
    </div>
  );
}
