"use client";

import React, { useState, useSyncExternalStore } from "react";
import { Download, Smartphone, X, Share, CheckCircle2, ChevronRight } from "lucide-react";
import Link from "next/link";

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

let globalPrompt: BeforeInstallPromptEvent | null = null;
const promptListeners = new Set<() => void>();

function notifyPromptListeners() {
  promptListeners.forEach((fn) => fn());
}

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    globalPrompt = e as BeforeInstallPromptEvent;
    notifyPromptListeners();
  });

  window.addEventListener("appinstalled", () => {
    globalPrompt = null;
    notifyPromptListeners();
  });

  // Register service worker in background
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    });
  }
}

function getIsStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

function subscribeStandalone(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mql = window.matchMedia("(display-mode: standalone)");
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getIsIOS() {
  if (typeof window === "undefined") return false;
  return /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
}

function subscribeNoop() {
  return () => {};
}

/**
 * Universal hook to access PWA installation status across components
 */
export function usePWAInstall() {
  const isInstalled = useSyncExternalStore(subscribeStandalone, getIsStandalone, () => false);
  const isIOS = useSyncExternalStore(subscribeNoop, getIsIOS, () => false);
  const prompt = useSyncExternalStore(
    (callback) => {
      promptListeners.add(callback);
      return () => promptListeners.delete(callback);
    },
    () => globalPrompt,
    () => null,
  );

  const isInstallable = Boolean(prompt);

  const installPWA = async (): Promise<boolean> => {
    if (!prompt) return false;
    await prompt.prompt();
    const choice = await prompt.userChoice;
    if (choice.outcome === "accepted") {
      globalPrompt = null;
      notifyPromptListeners();
      return true;
    }
    return false;
  };

  return { isInstalled, isIOS, isInstallable, installPWA };
}

/**
 * Single unified smart button for the header bar.
 * Replaces competing dual "Get App" and "Install App" buttons with one cohesive action.
 */
export function SmartAppButton() {
  const { isInstalled, isInstallable, installPWA } = usePWAInstall();

  // If already running as an installed standalone app, hide the button to keep header clean
  if (isInstalled) {
    return (
      <span
        title="DU Badhon is installed and running in App Mode"
        className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 text-[10px] font-bold border border-emerald-200 dark:border-emerald-900/50"
      >
        <CheckCircle2 className="size-3 text-emerald-600 dark:text-emerald-400" />
        <span>App Active</span>
      </span>
    );
  }

  // If browser supports 1-click install, clicking directly prompts the native install
  const handleClick = (e: React.MouseEvent) => {
    if (isInstallable) {
      e.preventDefault();
      installPWA();
    }
  };

  return (
    <Link
      href="/download-app"
      onClick={handleClick}
      title={isInstallable ? "Install DU Badhon to your device (1-Click)" : "Get DU Badhon App (Instant Web App or APK)"}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 text-xs font-bold border border-rose-200 dark:border-rose-900/50 transition active:scale-95 shadow-2xs group"
    >
      {isInstallable ? (
        <>
          <Download className="size-3.5 group-hover:animate-bounce" />
          <span>Install App</span>
        </>
      ) : (
        <>
          <Smartphone className="size-3.5" />
          <span>Get App</span>
        </>
      )}
    </Link>
  );
}

/**
 * Background Service Worker provider and iOS installation modal helper
 */
export function PWAInstaller() {
  const [showIOSModal, setShowIOSModal] = useState(false);

  return (
    <>
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-dark-2 rounded-3xl p-6 max-w-sm w-full border border-stroke dark:border-dark-3 shadow-2xl space-y-4 text-dark dark:text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center">
                  <Smartphone className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base">Add to iPhone Home Screen</h3>
              </div>
              <button
                onClick={() => setShowIOSModal(false)}
                className="p-1.5 rounded-full hover:bg-gray-1 dark:hover:bg-dark-3 text-gray-5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-dark-5 dark:text-dark-6 leading-relaxed">
              Install DU Badhon to your iOS device in 2 simple taps:
            </p>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-gray-1 dark:bg-dark-3 border border-stroke dark:border-dark-4">
                <span className="font-bold text-rose-600 shrink-0">1.</span>
                <span>
                  Tap the <Share className="w-3.5 h-3.5 inline mx-1 text-blue-500" /> <strong>Share</strong> icon in the Safari bottom toolbar.
                </span>
              </div>
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-gray-1 dark:bg-dark-3 border border-stroke dark:border-dark-4">
                <span className="font-bold text-rose-600 shrink-0">2.</span>
                <span>
                  Scroll down and tap <strong>Add to Home Screen</strong> <span className="font-bold text-dark dark:text-white">(➕)</span>.
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
