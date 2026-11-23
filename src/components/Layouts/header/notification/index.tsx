"use client";

import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "@/components/ui/dropdown";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { AlertCircle, Bell, CheckCircle2, Droplet, HeartHandshake } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const notificationList = [
  {
    id: "notif-1",
    icon: Droplet,
    iconColor: "text-rose-500 bg-rose-50 dark:bg-rose-950/50",
    title: "Emergency B+ Whole Blood Needed",
    subTitle: "Dhaka Medical College Hospital • 2 bags required",
    link: "/blood-requests",
  },
  {
    id: "notif-2",
    icon: AlertCircle,
    iconColor: "text-amber-500 bg-amber-50 dark:bg-amber-950/50",
    title: "O- Negative Plasma Urgency",
    subTitle: "BSMMU Hospital • Immediate donation needed",
    link: "/blood-requests",
  },
  {
    id: "notif-3",
    icon: CheckCircle2,
    iconColor: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/50",
    title: "Donation Completed at DMCH",
    subTitle: "Amar Ekushey Hall donor successfully fulfilled bag #1",
    link: "/donations",
  },
  {
    id: "notif-4",
    icon: HeartHandshake,
    iconColor: "text-blue-500 bg-blue-50 dark:bg-blue-950/50",
    title: "Fazlul Huq Muslim Hall Unit Duty",
    subTitle: "Duty roster updated for evening blood response",
    link: "/hall-units",
  },
];

export function Notification() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDotVisible, setIsDotVisible] = useState(true);
  const isMobile = useIsMobile();

  return (
    <Dropdown
      isOpen={isOpen}
      setIsOpen={(open) => {
        setIsOpen(open);
        if (setIsDotVisible) setIsDotVisible(false);
      }}
    >
      <DropdownTrigger
        className="grid size-12 place-items-center rounded-full border bg-gray-2 text-dark outline-none hover:text-primary focus-visible:border-primary focus-visible:text-primary dark:border-dark-4 dark:bg-dark-3 dark:text-white dark:focus-visible:border-primary"
        aria-label="View Notifications"
      >
        <span className="relative">
          <Bell className="size-5" />

          {isDotVisible && (
            <span
              className={cn(
                "absolute -top-1 -right-1 z-1 size-2 rounded-full bg-rose-600 ring-2 ring-gray-2 dark:ring-dark-3",
              )}
            >
              <span className="absolute inset-0 -z-1 animate-ping rounded-full bg-rose-600 opacity-75" />
            </span>
          )}
        </span>
      </DropdownTrigger>

      <DropdownContent
        align={isMobile ? "end" : "center"}
        className="border border-stroke bg-white px-3.5 py-3 shadow-xl dark:border-dark-3 dark:bg-gray-dark min-[350px]:min-w-[21rem] rounded-2xl"
      >
        <div className="mb-2 flex items-center justify-between px-2 py-1.5 border-b border-stroke dark:border-dark-3">
          <span className="text-sm font-bold text-dark dark:text-white">
            Badhon Live Alerts
          </span>
          <span className="rounded-full bg-rose-600 px-2 py-0.5 text-[10px] font-black text-white">
            {notificationList.length} new
          </span>
        </div>

        <ul className="mb-2 max-h-[20rem] space-y-1.5 overflow-y-auto">
          {notificationList.map((item) => {
            const IconComponent = item.icon;
            return (
              <li key={item.id} role="menuitem">
                <Link
                  href={item.link}
                  onClick={() => setIsOpen(false)}
                  className="flex items-start gap-3 rounded-xl p-2 outline-none hover:bg-gray-1 focus-visible:bg-gray-1 dark:hover:bg-dark-3 dark:focus-visible:bg-dark-3 transition"
                >
                  <div
                    className={cn(
                      "size-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
                      item.iconColor,
                    )}
                  >
                    <IconComponent className="size-4" />
                  </div>

                  <div>
                    <strong className="block text-xs font-bold text-dark dark:text-white leading-snug">
                      {item.title}
                    </strong>
                    <span className="block text-[11px] text-dark-5 dark:text-dark-6 mt-0.5">
                      {item.subTitle}
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>

        <Link
          href="/blood-requests"
          onClick={() => setIsOpen(false)}
          className="block rounded-xl border border-rose-600/30 p-2 text-center text-xs font-bold text-rose-600 outline-none transition-colors hover:bg-rose-50 dark:border-rose-900/40 dark:text-rose-400 dark:hover:bg-rose-950/30"
        >
          View All Blood Requests
        </Link>
      </DropdownContent>
    </Dropdown>
  );
}
