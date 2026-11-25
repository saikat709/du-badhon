"use client";

import {
  Award,
  BookOpen,
  Building2,
  CheckCircle2,
  Code2,
  Cpu,
  Database,
  ExternalLink,
  Flame,
  Globe,
  Heart,
  Mail,
  Phone,
  Radio,
  Server,
  ShieldCheck,
  Sparkles,
  Smartphone,
  Terminal,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function DeveloperPage() {
  return (
    <div className="space-y-8 pb-20 max-w-5xl mx-auto">
      {/* Breadcrumb Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-dark-5 dark:text-dark-6 mb-1">
          <Link href="/dashboard" className="hover:text-rose-600 transition">
            Platform
          </Link>
          <span>/</span>
          <span className="text-dark dark:text-white">Developer Recognition</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-dark dark:text-white flex items-center gap-2.5">
          <Code2 className="size-7 text-rose-600" />
          <span>Platform Architect & Developer</span>
        </h1>
        <p className="text-sm text-dark-5 dark:text-dark-6 mt-1">
          Engineering behind the DU Badhon voluntary blood donation coordination system.
        </p>
      </div>

      {/* Main Developer Profile Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-rose-950/80 to-slate-900 border border-rose-500/40 p-6 sm:p-8 md:p-10 text-white shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8 text-center md:text-left">
          {/* Avatar with Glow */}
          <div className="relative shrink-0">
            <div className="size-28 sm:size-32 rounded-3xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 p-1 shadow-2xl shadow-rose-600/50">
              <div className="size-full rounded-[22px] bg-slate-900 flex items-center justify-center font-black text-3xl sm:text-4xl text-white overflow-hidden relative">
                <span>SI</span>
                <div className="absolute inset-0 bg-radial from-rose-500/30 to-transparent pointer-events-none" />
              </div>
            </div>
            <span className="absolute -bottom-2 -right-2 px-2.5 py-1 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-md border border-white">
              Lead Architect
            </span>
          </div>

          {/* Profile Bio & Title */}
          <div className="space-y-3 flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold">
              <Sparkles className="size-3.5" />
              <span>University of Dhaka • Badhon Modernization</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
              Md. Saikat Islam
            </h2>

            <p className="text-sm sm:text-base font-semibold text-rose-200">
              Lead Full-Stack Architect & Engineering Lead
            </p>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              Dedicated to empowering student blood donor volunteers across Dhaka University with reliable, high-performance real-time coordination tools. Designed and engineered this platform from the ground up to eliminate donor call collisions, synchronize multi-hall requisitions, and ensure seamless offline mobile readiness.
            </p>

            {/* Quick Links */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              <a
                href="https://github.com/saikat709"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition active:scale-95"
              >
                <Code2 className="size-4 text-rose-300" />
                <span>github.com/saikat709</span>
                <ExternalLink className="size-3 text-slate-400" />
              </a>

              <a
                href="mailto:saikatislam709@gmail.com"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md transition active:scale-95"
              >
                <Mail className="size-4" />
                <span>saikatislam709@gmail.com</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Engineering Highlights & Architecture */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-dark dark:text-white flex items-center gap-2">
            <Cpu className="size-5 text-rose-600" />
            <span>Key Engineering Milestones & Architecture</span>
          </h3>
          <span className="text-xs font-semibold text-dark-5">
            100% Production Ready
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-dark-2 border border-stroke dark:border-dark-3 shadow-xs space-y-2.5">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-sm">
              <Radio className="size-4.5" />
              <span>Realtime Calling Locks & SSE Sync</span>
            </div>
            <p className="text-xs text-dark-5 dark:text-dark-6 leading-relaxed">
              Implemented atomic server-backed caller locks via Server-Sent Events (<code className="px-1 py-0.5 rounded bg-gray-1 dark:bg-dark-3 text-[11px] font-mono">/api/locks/stream</code>) with synchronized countdown timers across all devices and tabs, completely preventing duplicate calls to the same donor.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-dark-2 border border-stroke dark:border-dark-3 shadow-xs space-y-2.5">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
              <Database className="size-4.5" />
              <span>Relational Persistence (Turso & SQLite)</span>
            </div>
            <p className="text-xs text-dark-5 dark:text-dark-6 leading-relaxed">
              Engineered robust schema models in Prisma with Turso libSQL support for zero-data-loss Vercel serverless deployments, memorable volunteer test seed accounts, and cookie-based JWT sessions.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-dark-2 border border-stroke dark:border-dark-3 shadow-xs space-y-2.5">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
              <Smartphone className="size-4.5" />
              <span>Mobile-First Native App UX</span>
            </div>
            <p className="text-xs text-dark-5 dark:text-dark-6 leading-relaxed">
              Added a sticky bottom navigation bar with safe-area insets, a 2-step requisition modal with preference memory, instant one-tap dialing, and compact operational metric cards optimized for on-duty volunteers.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-dark-2 border border-stroke dark:border-dark-3 shadow-xs space-y-2.5">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm">
              <ShieldCheck className="size-4.5" />
              <span>16 DU Hall Unit Administration & Permissions</span>
            </div>
            <p className="text-xs text-dark-5 dark:text-dark-6 leading-relaxed">
              Built the dedicated My Club hall administration interface with role-based member promotions, pending donation verification workflows, and cross-hall emergency search indicators.
            </p>
          </div>
        </div>
      </div>

      {/* Tech Stack Matrix */}
      <div className="p-6 rounded-2xl bg-white dark:bg-dark-2 border border-stroke dark:border-dark-3 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-dark dark:text-white flex items-center gap-2">
          <Terminal className="size-4.5 text-rose-600" />
          <span>Core Technology Stack</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3.5 rounded-xl bg-gray-1 dark:bg-dark-3 border border-stroke dark:border-dark-4">
            <p className="font-bold text-dark dark:text-white text-xs">Next.js 16</p>
            <p className="text-[10px] text-dark-5 mt-0.5">App Router & Turbopack</p>
          </div>
          <div className="p-3.5 rounded-xl bg-gray-1 dark:bg-dark-3 border border-stroke dark:border-dark-4">
            <p className="font-bold text-dark dark:text-white text-xs">Tailwind CSS</p>
            <p className="text-[10px] text-dark-5 mt-0.5">Custom High-Density UI</p>
          </div>
          <div className="p-3.5 rounded-xl bg-gray-1 dark:bg-dark-3 border border-stroke dark:border-dark-4">
            <p className="font-bold text-dark dark:text-white text-xs">Prisma ORM</p>
            <p className="text-[10px] text-dark-5 mt-0.5">Turso & SQLite Edge</p>
          </div>
          <div className="p-3.5 rounded-xl bg-gray-1 dark:bg-dark-3 border border-stroke dark:border-dark-4">
            <p className="font-bold text-dark dark:text-white text-xs">SSE Realtime</p>
            <p className="text-[10px] text-dark-5 mt-0.5">Synchronized Event Stream</p>
          </div>
        </div>
      </div>

      {/* Mission & Badhon DU Heritage Quote */}
      <div className="p-6 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 text-rose-900 dark:text-rose-200 text-center space-y-2">
        <Heart className="size-6 text-rose-600 mx-auto fill-rose-600/30" />
        <p className="text-sm font-bold">
          &ldquo;একের রক্ত অন্যের জীবন, রক্তই হোক আত্মার বাঁধন&rdquo;
        </p>
        <p className="text-xs text-dark-5 dark:text-dark-6 max-w-lg mx-auto">
          Crafted with deep respect for the student volunteers of Badhon, University of Dhaka, who dedicate their days and nights to saving human lives without remuneration.
        </p>
      </div>
    </div>
  );
}
