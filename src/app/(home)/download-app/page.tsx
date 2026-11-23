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
  ArrowRight,
  Info,
  HelpCircle,
  Share,
} from "lucide-react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { usePWAInstall } from "@/components/PWA/PWAInstaller";

export default function DownloadAppPage() {
  const [downloading, setDownloading] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const { isInstalled, isIOS, isInstallable, installPWA } = usePWAInstall();

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => setDownloading(false), 3000);
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 md:px-6">
      <Breadcrumb pageName="Mobile App" crumbName="Mobile App" hideTitle />

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-rose-950 to-slate-900 border border-rose-500/30 p-6 md:p-10 shadow-2xl text-white mb-8">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 rounded-full bg-rose-600/20 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official DU Badhon Mobile Platform</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
              Install DU Badhon on{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-red-500">
                Any Device
              </span>
            </h1>

            <p className="text-sm md:text-base text-slate-300 leading-relaxed">
              Equip yourself with the fastest tool for voluntary blood donation coordination. Choose the <strong>1-Tap Instant Web App</strong> (recommended for all phones & laptops) or download the <strong>Standalone Android APK</strong> for offline sharing.
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3.5 pt-2">
              {/* Context-aware Smart Primary CTA */}
              {isInstalled ? (
                <div className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>App is Active on this Device</span>
                </div>
              ) : isInstallable ? (
                <button
                  onClick={installPWA}
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-sm shadow-xl shadow-rose-600/40 transition-all hover:scale-105 active:scale-95"
                >
                  <Download className="w-5 h-5" />
                  <span>1-Tap Install App (0 MB)</span>
                </button>
              ) : isIOS ? (
                <button
                  onClick={() => setShowIOSGuide(true)}
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-sm shadow-xl shadow-rose-600/40 transition-all hover:scale-105 active:scale-95"
                >
                  <Apple className="w-5 h-5" />
                  <span>Add to iPhone Home Screen</span>
                </button>
              ) : (
                <a
                  href="#options-grid"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-sm shadow-xl shadow-rose-600/40 transition-all hover:scale-105 active:scale-95"
                >
                  <Smartphone className="w-5 h-5" />
                  <span>Choose Install Option</span>
                </a>
              )}

              <a
                href="/downloads/du-badhon.apk"
                download="du-badhon-v1.2.0.apk"
                onClick={handleDownload}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm transition-all"
              >
                <Download className="w-4 h-4 text-rose-400" />
                <span>{downloading ? "Downloading..." : "Direct APK (14 MB)"}</span>
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
                  height={48}
                  alt="DU Badhon"
                  style={{ width: "auto", height: "auto" }}
                  priority
                />
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-white">DU Badhon</h2>
              <p className="text-xs text-rose-400 font-medium">Voluntary Blood Donors Organization</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
              <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60 text-left">
                <span className="text-slate-400 block text-[10px]">Version</span>
                <span className="font-bold text-white">v1.2.0</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60 text-left">
                <span className="text-slate-400 block text-[10px]">Instant Size</span>
                <span className="font-bold text-emerald-400">0 MB</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60 text-left">
                <span className="text-slate-400 block text-[10px]">Compatibility</span>
                <span className="font-bold text-white">All Devices</span>
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

      {/* Which one should I choose? Guidance Banner */}
      <div className="mb-8 p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <h3 className="font-bold text-dark dark:text-white text-sm">
              Which option should you choose?
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              <strong>Option 1 (Instant Web App)</strong> is recommended for almost everyone — it takes 0 MB storage, works on iPhone, Android, and PC, and updates automatically.
            </p>
            <p className="text-slate-600 dark:text-slate-300">
              <strong>Option 2 (Android APK)</strong> is for Android users who want a standalone file to send to friends via Bluetooth/WhatsApp or keep offline.
            </p>
          </div>
        </div>
      </div>

      {/* Main Options Grid */}
      <div id="options-grid" className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Option 1: Progressive Web App (Primary Recommended) */}
        <div className="rounded-3xl border-2 border-rose-500/40 bg-white p-6 md:p-8 shadow-md dark:border-rose-500/40 dark:bg-dark-2 flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <Laptop className="w-6 h-6" />
              </div>
              <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 font-black text-xs uppercase tracking-wider">
                ⭐ Recommended for Everyone
              </span>
            </div>

            <div>
              <h2 className="text-xl font-bold text-dark dark:text-white">
                Option 1: 1-Tap Instant Web App
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Zero download waiting. Works on iPhone (iOS), Android, Windows, Mac & Chromebook.
              </p>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span><strong>Takes 0 MB storage</strong> (saves phone memory)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span><strong>Always up-to-date</strong> with zero manual APK updating</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span><strong>Full support for iPhone / iPad</strong> via Safari Home Screen</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Launches full-screen like a native app with offline caching</span>
              </li>
            </ul>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
            {isInstalled ? (
              <div className="w-full py-3 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 font-bold text-xs text-center border border-emerald-200 dark:border-emerald-900/50">
                ✓ Currently Running in App Mode
              </div>
            ) : isInstallable ? (
              <button
                onClick={installPWA}
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md transition active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Install Instant App Now</span>
              </button>
            ) : isIOS ? (
              <button
                onClick={() => setShowIOSGuide(true)}
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md transition active:scale-95"
              >
                <Apple className="w-4 h-4" />
                <span>View iPhone Installation Steps</span>
              </button>
            ) : (
              <Link
                href="/dashboard"
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md transition active:scale-95"
              >
                <span>Open in App Mode</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}

            <p className="text-[11px] text-center text-slate-500 dark:text-slate-400">
              Tip: You can also tap your browser&apos;s menu (⋮ or Share) and select <strong>&ldquo;Add to Home Screen&rdquo;</strong>.
            </p>
          </div>
        </div>

        {/* Option 2: Android APK */}
        <div className="rounded-3xl border border-stroke bg-white p-6 md:p-8 shadow-xs dark:border-stroke-dark dark:bg-dark-2 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
                <Smartphone className="w-6 h-6" />
              </div>
              <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs">
                For Offline Sharing
              </span>
            </div>

            <div>
              <h2 className="text-xl font-bold text-dark dark:text-white">
                Option 2: Standalone Android APK
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Installable package file for Samsung, Xiaomi, Pixel, Vivo, Oppo, Realme, etc.
              </p>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-rose-500 shrink-0" />
                <span><strong>Shareable file</strong> via Bluetooth, WhatsApp, or USB flash drive</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-rose-500 shrink-0" />
                <span>Runs as a standalone Capacitor native Android application</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-rose-500 shrink-0" />
                <span>Direct dialer and hardware acceleration</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-rose-500 shrink-0" />
                <span>Full package size: 14 MB</span>
              </li>
            </ul>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <a
              href="/downloads/du-badhon.apk"
              download="du-badhon-v1.2.0.apk"
              onClick={handleDownload}
              className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-bold text-sm shadow-md transition active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>{downloading ? "Starting Download..." : "Download APK File (14 MB)"}</span>
            </a>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-800 dark:text-amber-300 flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
              <span>
                <strong>Note:</strong> When prompted &ldquo;File might be harmful&rdquo;, choose <em>&ldquo;Download anyway&rdquo;</em>, open the file, and tap <em>Install</em>.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Step-by-Step Installation Guides */}
      <div className="rounded-3xl border border-stroke bg-white p-6 md:p-8 shadow-xs dark:border-stroke-dark dark:bg-dark-2 mb-10">
        <h2 className="text-lg md:text-xl font-bold text-dark dark:text-white mb-6 flex items-center gap-2">
          <span>How to Install on Your Device</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Android Guide */}
          <div className="space-y-3 p-4 rounded-2xl bg-gray-1 dark:bg-dark-3 border border-stroke dark:border-dark-4">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-sm">
              <Smartphone className="w-4 h-4" />
              <h3>Android</h3>
            </div>
            <ol className="space-y-2 text-xs text-slate-600 dark:text-slate-300 list-decimal list-inside">
              <li>Tap <strong>1-Tap Install App</strong> above (or Download APK).</li>
              <li>Confirm the prompt on your screen.</li>
              <li>DU Badhon icon will appear on your Home Screen.</li>
            </ol>
          </div>

          {/* iOS Guide */}
          <div className="space-y-3 p-4 rounded-2xl bg-gray-1 dark:bg-dark-3 border border-stroke dark:border-dark-4">
            <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold text-sm">
              <Apple className="w-4 h-4" />
              <h3>iPhone / iPad</h3>
            </div>
            <ol className="space-y-2 text-xs text-slate-600 dark:text-slate-300 list-decimal list-inside">
              <li>Open this website in <strong>Safari</strong>.</li>
              <li>Tap the <strong>Share</strong> icon (bottom toolbar).</li>
              <li>Select <strong>Add to Home Screen</strong>.</li>
              <li>Tap <strong>Add</strong> in the top right.</li>
            </ol>
          </div>

          {/* Desktop Guide */}
          <div className="space-y-3 p-4 rounded-2xl bg-gray-1 dark:bg-dark-3 border border-stroke dark:border-dark-4">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm">
              <Laptop className="w-4 h-4" />
              <h3>PC / Mac / Linux</h3>
            </div>
            <ol className="space-y-2 text-xs text-slate-600 dark:text-slate-300 list-decimal list-inside">
              <li>Open in <strong>Chrome</strong> or <strong>Edge</strong>.</li>
              <li>Click the <strong>Install</strong> icon in your URL bar.</li>
              <li>Click <strong>Install</strong> to open in dedicated window.</li>
            </ol>
          </div>
        </div>
      </div>

      {/* iOS Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-dark-2 rounded-3xl p-6 max-w-sm w-full border border-stroke dark:border-dark-3 shadow-2xl space-y-4 text-dark dark:text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center">
                  <Apple className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base">Install on iPhone</h3>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="p-1.5 rounded-full hover:bg-gray-1 dark:hover:bg-dark-3 text-gray-5"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-dark-5 dark:text-dark-6 leading-relaxed">
              Add DU Badhon to your iPhone in 2 quick taps:
            </p>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-gray-1 dark:bg-dark-3 border border-stroke dark:border-dark-4">
                <span className="font-bold text-rose-600 shrink-0">1.</span>
                <span>
                  Tap the <Share className="w-3.5 h-3.5 inline mx-1 text-blue-500" /> <strong>Share</strong> icon in the Safari bottom bar.
                </span>
              </div>
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-gray-1 dark:bg-dark-3 border border-stroke dark:border-dark-4">
                <span className="font-bold text-rose-600 shrink-0">2.</span>
                <span>
                  Scroll down and tap <strong>Add to Home Screen</strong> <span className="font-bold">(➕)</span>.
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
