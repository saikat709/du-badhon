"use client";

import React, { useEffect, useState } from "react";
import { WifiOff, RefreshCw, CheckCircle2 } from "lucide-react";

export function OfflineBanner() {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return typeof navigator !== "undefined" ? navigator.onLine : true;
  });
  const [wasOffline, setWasOffline] = useState(false);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleOnline = () => {
      setIsOnline(true);
      setWasOffline(true);
      const timer = setTimeout(() => setWasOffline(false), 4000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleRetry = async () => {
    setChecking(true);
    try {
      const res = await fetch("/icon.svg", { method: "HEAD", cache: "no-store" });
      if (res.ok) {
        setIsOnline(true);
        setWasOffline(true);
        setTimeout(() => setWasOffline(false), 4000);
      } else {
        setIsOnline(false);
      }
    } catch {
      setIsOnline(false);
    } finally {
      setChecking(false);
    }
  };

  if (isOnline && !wasOffline) return null;

  if (wasOffline && isOnline) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-emerald-600 text-white text-xs font-bold py-2 px-4 shadow-md flex items-center justify-center gap-2 animate-in slide-in-from-top duration-300">
        <CheckCircle2 className="size-4" />
        <span>Internet connection restored! Synchronizing latest donor caller locks...</span>
      </div>
    );
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white text-xs font-semibold py-2 px-4 shadow-lg flex items-center justify-between gap-3 animate-in slide-in-from-top duration-300">
      <div className="flex items-center gap-2 truncate">
        <WifiOff className="size-4 shrink-0 text-amber-200 animate-pulse" />
        <span className="truncate">
          <strong>You are offline:</strong> Viewing cached Badhon records. Calling locks and new requests will sync once connection returns.
        </span>
      </div>

      <button
        onClick={handleRetry}
        disabled={checking}
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/25 hover:bg-black/40 text-white text-[11px] font-bold shrink-0 transition active:scale-95 disabled:opacity-50 cursor-pointer"
      >
        <RefreshCw className={`size-3 ${checking ? "animate-spin" : ""}`} />
        <span>{checking ? "Checking..." : "Retry Connection"}</span>
      </button>
    </div>
  );
}
