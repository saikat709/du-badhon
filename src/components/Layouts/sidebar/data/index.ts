import {
  Building2,
  ClipboardList,
  Clock,
  HeartHandshake,
  LayoutDashboard,
  LucideIcon,
  Search,
  ShieldCheck,
  Smartphone,
  User,
  Users,
} from "lucide-react";

export interface NavSubItem {
  title: string;
  url: string;
}

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  items?: NavSubItem[];
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

export const NAV_DATA: NavSection[] = [
  {
    label: "OPERATIONS",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Blood Requests",
        url: "/blood-requests",
        icon: HeartHandshake,
      },
      {
        title: "Search Donors",
        url: "/search-blood",
        icon: Search,
      },
      {
        title: "Pending Donations",
        url: "/pending-donations",
        icon: Clock,
      },
      {
        title: "Donors Directory",
        url: "/donors",
        icon: Users,
      },
    ],
  },
  {
    label: "COMMUNITY & DIRECTORY",
    items: [
      {
        title: "My Club Unit",
        url: "/my-club",
        icon: ShieldCheck,
      },
      {
        title: "Hall Units & Executives",
        url: "/hall-units",
        icon: Building2,
      },
      {
        title: "Donation Records",
        url: "/donations",
        icon: ClipboardList,
      },
    ],
  },
  {
    label: "ACCOUNT & MOBILE",
    items: [
      {
        title: "Download App",
        url: "/download-app",
        icon: Smartphone,
      },
      {
        title: "Your Profile",
        url: "/profile",
        icon: User,
      },
    ],
  },
];
