"use client";

import { PasswordIcon } from "@/assets/icons";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import InputGroup from "../FormElements/InputGroup";
import { Checkbox } from "../FormElements/checkbox";
import { AlertCircle, LogIn, User, Sparkles } from "lucide-react";

export default function SigninWithPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawCallback = searchParams.get("callbackUrl");
  const callbackUrl =
    rawCallback &&
    !rawCallback.startsWith("/api") &&
    !rawCallback.startsWith("/auth") &&
    rawCallback.startsWith("/")
      ? rawCallback
      : "/dashboard";

  const [data, setData] = useState({
    identifier: "member1",
    password: "member1",
    remember: true,
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleQuickSelect = (identifier: string) => {
    setData({
      identifier,
      password: identifier,
      remember: true,
    });
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const resData = await res.json();

      if (!res.ok) {
        setErrorMsg(resData.error || "Failed to sign in. Please verify your credentials.");
        setLoading(false);
        return;
      }

      // Successful sign in
      window.location.href = callbackUrl;
    } catch {
      setErrorMsg("Network error connecting to authentication service.");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3 sm:space-y-3.5">
      {/* Quick Test Login Badges */}
      <div className="p-2.5 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700 dark:text-rose-400">
          <Sparkles className="size-3" />
          <span>Quick Test Accounts:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: "member1", label: "member1" },
            { id: "member2", label: "member2" },
            { id: "president1", label: "president1" },
            { id: "admin", label: "admin" },
          ].map((acc) => (
            <button
              key={acc.id}
              type="button"
              onClick={() => handleQuickSelect(acc.id)}
              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md border transition ${
                data.identifier === acc.id
                  ? "bg-rose-600 text-white border-rose-600 shadow-xs"
                  : "bg-white dark:bg-dark-2 text-dark dark:text-white border-stroke dark:border-dark-3 hover:border-rose-400"
              }`}
            >
              {acc.label}
            </button>
          ))}
        </div>
      </div>

      {errorMsg && (
        <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="size-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-2.5 sm:space-y-3">
        <InputGroup
          type="text"
          label="Username, Phone, or Email"
          className="[&_input]:py-2 sm:[&_input]:py-2.5 [&_label]:text-xs [&_div]:mt-1"
          placeholder="member1, 017XXXXXXXX, or email"
          name="identifier"
          handleChange={handleChange}
          value={data.identifier}
          icon={<User className="size-4 text-gray-4" />}
        />

        <InputGroup
          type="password"
          label="Password"
          className="[&_input]:py-2 sm:[&_input]:py-2.5 [&_label]:text-xs [&_div]:mt-1"
          placeholder="Enter your password"
          name="password"
          handleChange={handleChange}
          value={data.password}
          icon={<PasswordIcon />}
        />

        <div className="flex items-center justify-between gap-2 py-0.5 text-xs font-medium">
          <Checkbox
            label="Remember me (30 days)"
            name="remember"
            withIcon="check"
            minimal
            radius="md"
            onChange={(e) =>
              setData({
                ...data,
                remember: e.target.checked,
              })
            }
          />

          <Link
            href="/auth/sign-in"
            className="text-dark-5 hover:text-rose-600 dark:text-dark-6 dark:hover:text-rose-400 text-xs"
          >
            Need Help?
          </Link>
        </div>

        <div className="pt-0.5">
          <button
            type="submit"
            disabled={loading}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-700 py-2.5 px-4 font-bold text-xs sm:text-sm text-white shadow-md transition active:scale-95 disabled:opacity-60"
          >
            <LogIn className="size-4" />
            <span>{loading ? "Signing in..." : "Sign In to DU Badhon"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
