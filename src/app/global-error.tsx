"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { AlertOctagon, RefreshCw, Home } from "lucide-react";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("DU Badhon Critical Global Error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#020d1a] text-white font-sans">
        <div className="w-full max-w-md text-center space-y-6">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <Image
              src="/images/logo/logo-icon.svg"
              width={36}
              height={36}
              alt="Badhon Logo"
              style={{ width: "auto", height: "auto" }}
            />
            <span className="text-xl font-black text-rose-500 tracking-wider">
              DU BADHON
            </span>
          </div>

          <div className="flex size-16 items-center justify-center rounded-2xl bg-rose-950/80 border border-rose-800 text-rose-400 mx-auto">
            <AlertOctagon className="size-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black tracking-tight text-white">
              Critical Application Error
            </h1>
            <p className="text-sm text-slate-400">
              A root system error occurred. You can reload the application or return to the homepage.
            </p>
          </div>

          {error.digest && (
            <p className="text-xs font-mono text-slate-500 bg-slate-900 py-1.5 px-3 rounded-lg border border-slate-800">
              Digest: {error.digest}
            </p>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => reset()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-700 px-6 py-2.5 text-xs font-bold text-white transition cursor-pointer"
            >
              <RefreshCw className="size-4" />
              <span>Reload App</span>
            </button>

            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-800 px-5 py-2.5 text-xs font-bold text-slate-300 transition"
            >
              <Home className="size-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
