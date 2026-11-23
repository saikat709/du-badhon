"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Smartphone,
  Download,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Apple,
  Laptop,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  Info,
} from "lucide-react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

export default function DownloadAppPage() {
  const [downloading, setDownloading] = useState(false);
  const [copiedSha, setCopiedSha] = useState(false);

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => setDownloading(false), 3000);
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 md:px-6">
      <Breadcrumb pageName="Download Mobile App" />

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-rose-950 to-slate-900 border border-rose-500/30 p-6 md:p-10 shadow-2xl text-white mb-8">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 rounded-full bg-rose-600/20 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official DU Badhon Mobile App</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
              Get DU Badhon on your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-red-500">
                Phone & Laptop
              </span>
            </h1>

            <p className="text-sm md:text-base text-slate-300 leading-relaxed">
              Equip yourself with the fastest tool for voluntary blood donation coordination. Real-time donor call locking, emergency multi-bag request tracking, and full DU hall directory in the palm of your hand.
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
              <a
                href="/downloads/du-badhon.apk"
                download="du-badhon-v1.2.0.apk"
                onClick={handleDownload}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-sm shadow-xl shadow-rose-600/40 transition-all hover:scale-105 active:scale-95"
              >
                <Download className="w-5 h-5" />
                <span>{downloading ? "Starting Download..." : "Download Android APK (v1.2.0)"}</span>
              </a>

              <a
                href="#pwa-section"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm transition-all"
              >
                <Smartphone className="w-4 h-4 text-rose-400" />
                <span>PWA (iOS & Laptop)</span>
              </a>
            </div>
          </div>

          {/* App Card Visual */}
          <div className="shrink-0 w-64 md:w-72 bg-slate-900/90 border border-rose-500/40 rounded-3xl p-5 shadow-2xl backdrop-blur-md text-center space-y-4">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-tr from-rose-600 to-red-500 p-0.5 shadow-xl shadow-rose-600/40">
              <div className="w-full h-full rounded-2xl bg-slate-900 flex items-center justify-center">
                <Image
                  src="/images/logo/logo-icon.svg"
                  width={48}
                  height={50}
                  alt="DU Badhon"
                  priority
                />
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-white">DU Badhon</h2>
              <p className="text-xs text-rose-400 font-medium">Capacitor Android & PWA</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
              <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60 text-left">
                <span className="text-slate-400 block text-[10px]">Version</span>
                <span className="font-bold text-white">v1.2.0</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60 text-left">
                <span className="text-slate-400 block text-[10px]">Size</span>
                <span className="font-bold text-white">~14 MB</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60 text-left">
                <span className="text-slate-400 block text-[10px]">OS</span>
                <span className="font-bold text-white">Android 8.0+</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60 text-left">
                <span className="text-slate-400 block text-[10px]">Security</span>
                <span className="font-bold text-emerald-400">Verified</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Safe & Ad-free • No telemetry</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Option 1: Android APK */}
        <div className="rounded-3xl border border-stroke bg-white p-6 md:p-8 shadow-xs dark:border-stroke-dark dark:bg-gray-dark flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <Smartphone className="w-6 h-6" />
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs border border-emerald-500/20">
                Recommended for Android
              </span>
            </div>

            <div>
              <h2 className="text-xl font-bold text-dark dark:text-white">
                Download Android APK
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Install directly on Samsung, Xiaomi, Pixel, OnePlus, Vivo, Oppo, Realme, etc.
              </p>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-rose-500 shrink-0" />
                <span>Native Android WebView with hardware acceleration</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-rose-500 shrink-0" />
                <span>Instant 1-tap phone dialer integration</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-rose-500 shrink-0" />
                <span>Runs smoothly even on low-memory devices</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-rose-500 shrink-0" />
                <span>Offline caching of emergency donor records</span>
              </li>
            </ul>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <a
              href="/downloads/du-badhon.apk"
              download="du-badhon-v1.2.0.apk"
              onClick={handleDownload}
              className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md shadow-rose-600/30 transition-all active:scale-98"
            >
              <Download className="w-4 h-4" />
              <span>Download APK File (14 MB)</span>
            </a>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-800 dark:text-amber-300 flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
              <span>
                <strong>Installation Note:</strong> When prompted &ldquo;File might be harmful&rdquo;, tap <em>&ldquo;Download anyway&rdquo;</em>, open the downloaded file, and tap <em>Install</em>.
              </span>
            </div>
          </div>
        </div>

        {/* Option 2: Progressive Web App */}
        <div id="pwa-section" className="rounded-3xl border border-stroke bg-white p-6 md:p-8 shadow-xs dark:border-stroke-dark dark:bg-gray-dark flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Laptop className="w-6 h-6" />
              </div>
              <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs border border-blue-500/20">
                Instant • No APK Needed
              </span>
            </div>

            <div>
              <h2 className="text-xl font-bold text-dark dark:text-white">
                Browser PWA (All Devices)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Zero storage overhead. Works on iPhone, iPad, Windows, Mac, Chromebook & Android.
              </p>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                <span>Always up-to-date with zero manual APK updating</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                <span>Operates in dedicated standalone desktop/mobile window</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                <span>Full support for iOS Safari (Add to Home Screen)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                <span>Supports Chrome, Edge, Brave, and Opera desktop</span>
              </li>
            </ul>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <Link
              href="/dashboard"
              className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-bold text-sm shadow-md transition-all active:scale-98"
            >
              <span>Launch Web App Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <p className="text-[11px] text-center text-slate-500 dark:text-slate-400">
              Look for the <strong>Install (⊕)</strong> icon in your browser URL bar or use the header button.
            </p>
          </div>
        </div>
      </div>

      {/* Step-by-Step Installation Guides */}
      <div className="rounded-3xl border border-stroke bg-white p-6 md:p-8 shadow-xs dark:border-stroke-dark dark:bg-gray-dark mb-10">
        <h2 className="text-lg md:text-xl font-bold text-dark dark:text-white mb-6 flex items-center gap-2">
          <span>How to Install on Your Device</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Android Guide */}
          <div className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-sm">
              <Smartphone className="w-4 h-4" />
              <h3>Android (APK)</h3>
            </div>
            <ol className="space-y-2 text-xs text-slate-600 dark:text-slate-300 list-decimal list-inside">
              <li>Tap <strong>Download Android APK</strong> above.</li>
              <li>When prompted by browser, choose <strong>Download anyway</strong>.</li>
              <li>Once downloaded, tap the notification to open it.</li>
              <li>Tap <strong>Install</strong> (Allow unknown apps for your browser if asked).</li>
            </ol>
          </div>

          {/* iOS Guide */}
          <div className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold text-sm">
              <Apple className="w-4 h-4" />
              <h3>iPhone / iPad (iOS)</h3>
            </div>
            <ol className="space-y-2 text-xs text-slate-600 dark:text-slate-300 list-decimal list-inside">
              <li>Open this site in <strong>Safari</strong> browser.</li>
              <li>Tap the <strong>Share</strong> button (box with upward arrow).</li>
              <li>Scroll down and select <strong>Add to Home Screen</strong>.</li>
              <li>Tap <strong>Add</strong> in the top right.</li>
            </ol>
          </div>

          {/* Desktop Guide */}
          <div className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm">
              <Laptop className="w-4 h-4" />
              <h3>Windows / Mac / Linux</h3>
            </div>
            <ol className="space-y-2 text-xs text-slate-600 dark:text-slate-300 list-decimal list-inside">
              <li>Open in <strong>Chrome</strong> or <strong>Edge</strong>.</li>
              <li>Click the <strong>Install</strong> icon in the address bar (right side).</li>
              <li>Or click the <strong>Install App</strong> button in our navigation bar.</li>
              <li>Launches in full app mode on your desktop.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
