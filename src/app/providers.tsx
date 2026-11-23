"use client";

import { BadhonProvider } from "@/context/badhon-context";
import { SidebarProvider } from "@/components/Layouts/sidebar/sidebar-context";
import { ThemeProvider } from "next-themes";
import React from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="light" attribute="class">
      <BadhonProvider>
        <SidebarProvider>{children}</SidebarProvider>
      </BadhonProvider>
    </ThemeProvider>
  );
}
