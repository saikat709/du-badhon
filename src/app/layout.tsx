import "@/css/satoshi.css";
import "@/css/style.css";

import "flatpickr/dist/flatpickr.min.css";
import "jsvectormap/dist/jsvectormap.css";

import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import type { PropsWithChildren } from "react";
import { Providers } from "./providers";
import { Header } from "@/components/Layouts/header";

export const metadata: Metadata = {
  title: {
    template: "%s | Badhon - Bond made by blood",
    default: "Badhon - Dhaka University Voluntary Blood Donors' Organization",
  },
  description:
    "Badhon is a voluntary blood donors' organization operating at the University of Dhaka. Digital coordination platform for donor tracking, call locking, feedback logging, and multi-bag blood request fulfillment.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/images/logo/logo-icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
    ],
    apple: [
      { url: "/apple-icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/icon.svg",
  },
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <NextTopLoader showSpinner={false} />

          <div className="flex min-h-screen">
            <div className="w-full bg-gray-200 dark:bg-[#020d1a] min-h-screen flex flex-col justify-between">
              <Header />
              <main className="isolate mx-auto w-full max-w-screen overflow-hidden flex-grow">
                {children}
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
