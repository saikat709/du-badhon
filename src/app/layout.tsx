import "@/css/satoshi.css";
import "@/css/style.css";

import type { Metadata, Viewport } from "next";
import NextTopLoader from "nextjs-toploader";
import type { PropsWithChildren } from "react";
import { Providers } from "./providers";
import { PWAInstaller } from "@/components/PWA/PWAInstaller";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: {
    template: "%s | Badhon - Bond made by blood",
    default: "Badhon - Dhaka University Voluntary Blood Donors' Organization",
  },
  description:
    "Badhon is a voluntary blood donors' organization operating at the University of Dhaka. Digital coordination platform for donor tracking, call locking, feedback logging, and multi-bag blood request fulfillment.",
  applicationName: "DU Badhon",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "DU Badhon",
  },
  formatDetection: {
    telephone: true,
  },
  referrer: "strict-origin-when-cross-origin",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/images/logo/logo-icon.svg", type: "image/svg+xml" },
      { url: "/images/logo/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/images/logo/icon-512.png", sizes: "512x512", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: [
      { url: "/images/logo/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      { url: "/apple-icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/icon.svg",
  },
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html:
              '#nl-badge,[id="nl-badge"],.netlify-badge{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important;}',
          }}
        />
      </head>
      <body className="antialiased bg-gray-2 dark:bg-[#020d1a] text-slate-800 dark:text-slate-100 min-h-screen">
        <Providers>
          <NextTopLoader color="#E11D48" showSpinner={false} />
          {children}
          <PWAInstaller />
        </Providers>
      </body>
    </html>
  );
}
