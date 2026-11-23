import "@/css/satoshi.css";
import "@/css/style.css";

import { Sidebar } from "@/components/Layouts/sidebar";
import { Header } from "@/components/Layouts/header";
import NextTopLoader from "nextjs-toploader";
import type { PropsWithChildren } from "react";

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <div>
      <NextTopLoader color="#E11D48" showSpinner={false} />
      <div className="flex min-h-screen bg-gray-2 dark:bg-[#020d1a]">
        <Sidebar />

        <div className="flex flex-col flex-1 min-w-0">
          <Header />

          <main className="isolate mx-auto w-full max-w-screen-2xl overflow-hidden p-4 md:p-6 2xl:p-10">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
