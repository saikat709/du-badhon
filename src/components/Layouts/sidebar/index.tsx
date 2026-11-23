"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useBadhon } from "@/context/badhon-context";
import { NavItem, NavSection, NavSubItem, NAV_DATA } from "./data";
import { useSidebarContext } from "./sidebar-context";
import { ArrowLeft, ChevronUp, Droplet } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const { setIsOpen, isOpen, isMobile, toggleSidebar } = useSidebarContext();
  const { currentVolunteer } = useBadhon();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) => (prev.includes(title) ? [] : [title]));
  };

  useEffect(() => {
    NAV_DATA.some((section: NavSection) => {
      return section.items.some((item: NavItem) => {
        return item.items?.some((subItem: NavSubItem) => {
          if (subItem.url === pathname) {
            setExpandedItems((prev) =>
              prev.includes(item.title) ? prev : [item.title],
            );
            return true;
          }
        });
      });
    });
  }, [pathname]);

  return (
    <>
      {/* Mobile Overlay Backdrop */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "shrink-0 border-r border-stroke bg-white transition-[width] duration-200 ease-linear dark:border-stroke-dark dark:bg-[#020d1a]",
          isMobile
            ? "fixed inset-y-0 left-0 z-50 shadow-2xl"
            : "sticky top-0 h-screen",
          isOpen ? "w-72" : "w-0 overflow-hidden",
        )}
        aria-label="Main navigation"
        aria-hidden={!isOpen}
      >
        <div className="flex h-full flex-col justify-between py-5 px-4 overflow-y-auto custom-scrollbar">
          <div>
            {/* Logo and Brand Header */}
            <div className="flex items-center justify-between pb-4 border-b border-stroke dark:border-stroke-dark/80">
              <Link
                href="/dashboard"
                onClick={() => isMobile && toggleSidebar()}
                className="flex items-center gap-3 group"
              >
                <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 via-rose-500 to-red-600 p-0.5 shadow-md shadow-rose-600/30 group-hover:scale-105 transition-transform">
                  <div className="w-full h-full rounded-[14px] bg-slate-900 flex items-center justify-center">
                    <Image
                      src="/images/logo/logo-icon.svg"
                      width={24}
                      height={24}
                      alt="Badhon Logo"
                      style={{ width: "auto", height: "auto" }}
                      priority
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-rose-600 dark:text-rose-500 text-lg tracking-wider">
                      BADHON
                    </span>
                    <span className="rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 px-1.5 py-0.2 text-[9px] font-black uppercase tracking-wider border border-rose-500/20">
                      DU
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-tight">
                    University of Dhaka
                  </p>
                </div>
              </Link>

              {isMobile && (
                <button
                  onClick={toggleSidebar}
                  className="rounded-xl border border-stroke p-1.5 text-slate-600 dark:border-stroke-dark dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  aria-label="Close menu"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Active Volunteer Hall Unit Card */}
            <div className="my-4 p-3 rounded-2xl bg-gradient-to-r from-rose-50 to-red-50 dark:from-rose-950/30 dark:to-slate-900/40 border border-rose-200/80 dark:border-rose-900/40 shadow-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider flex items-center gap-1">
                  <Droplet className="w-3 h-3 fill-rose-500 text-rose-500" />
                  Your Hall Unit
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-600 text-white shadow-2xs">
                  {currentVolunteer.role}
                </span>
              </div>
              <p className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate leading-snug">
                {currentVolunteer.hallUnit}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                Logged as: <strong className="font-medium text-slate-700 dark:text-slate-300">{currentVolunteer.name}</strong>
              </p>
            </div>

            {/* Navigation Sections */}
            <nav className="space-y-6 pt-2">
              {NAV_DATA.map((section) => (
                <div key={section.label} className="space-y-1">
                  <p className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {section.label}
                  </p>

                  <ul className="space-y-1 pt-1">
                    {section.items.map((item) => {
                      const isActive = pathname === item.url;
                      const hasChildren = Boolean(item.items?.length);

                      if (hasChildren) {
                        const isExpanded = expandedItems.includes(item.title);
                        const isChildActive = item.items?.some((sub) => sub.url === pathname);

                        return (
                          <li key={item.title}>
                            <button
                              onClick={() => toggleExpanded(item.title)}
                              className={cn(
                                "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all",
                                isChildActive
                                  ? "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400"
                                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60",
                              )}
                            >
                              <div className="flex items-center gap-3">
                                <item.icon className="w-4 h-4 text-slate-500 group-hover:text-rose-500 shrink-0" />
                                <span>{item.title}</span>
                              </div>
                              <ChevronUp
                                className={cn(
                                  "w-3.5 h-3.5 transition-transform duration-200",
                                  isExpanded ? "rotate-0" : "rotate-180",
                                )}
                              />
                            </button>

                            {isExpanded && (
                              <ul className="ml-7 pl-2 border-l border-rose-200 dark:border-rose-900/40 space-y-1 pt-1">
                                {item.items?.map((sub) => (
                                  <li key={sub.title}>
                                    <Link
                                      href={sub.url}
                                      onClick={() => isMobile && toggleSidebar()}
                                      className={cn(
                                        "block px-3 py-1.5 rounded-lg text-xs font-medium transition",
                                        pathname === sub.url
                                          ? "text-rose-600 dark:text-rose-400 font-bold bg-rose-50 dark:bg-rose-950/30"
                                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200",
                                      )}
                                    >
                                      {sub.title}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </li>
                        );
                      }

                      return (
                        <li key={item.title}>
                          <Link
                            href={item.url}
                            onClick={() => isMobile && toggleSidebar()}
                            className={cn(
                              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all",
                              isActive
                                ? "bg-rose-600 text-white shadow-sm shadow-rose-600/30 font-bold"
                                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white",
                            )}
                          >
                            <item.icon
                              className={cn(
                                "w-4 h-4 shrink-0",
                                isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200",
                              )}
                            />
                            <span>{item.title}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </nav>
          </div>

          {/* Footer Motto and Version */}
          <div className="pt-4 mt-6 border-t border-stroke dark:border-stroke-dark/80 text-center">
            <p className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 italic">
              &ldquo;রক্তই হোক আত্মার বাঁধন&rdquo;
            </p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
              DU Badhon v1.2.0 • PWA & APK
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
