import "@/css/satoshi.css";
import "@/css/style.css";

import { Sidebar } from "@/components/Layouts/sidebar";
import { Header } from "@/components/Layouts/header";
import type { PropsWithChildren } from "react";

export default function HomeLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-2 dark:bg-[#020d1a]">
      {/* Pinned Left Sidebar */}
      <Sidebar />

      {/* Independently Scrollable Content Area */}
      <div className="flex flex-col flex-1 min-w-0 h-screen overflow-hidden">
        {/* Single Top Header */}
        <Header />

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 2xl:p-10 custom-scrollbar">
          <div className="mx-auto w-full max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
