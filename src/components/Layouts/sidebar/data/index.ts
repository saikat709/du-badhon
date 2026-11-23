import {
  ClipboardList,
  HeartHandshake,
  LayoutDashboard,
  Search,
  Smartphone,
  User,
  Users,
} from "lucide-react";

export const NAV_DATA = [
  {
    label: "MAIN MENU",
    items: [
      {
        title: "Dashboard",
        icon: LayoutDashboard,
        url: "/dashboard",
        items: [
          {
            title: "All Units Overview",
            url: "/dashboard",
          },
          {
            title: "FH Hall Unit",
            url: "/dashboard?unit=Fazlul+Huq+Muslim+Hall",
          },
          {
            title: "Shahidullah Hall Unit",
            url: "/dashboard?unit=Shahidullah+Hall",
          },
          {
            title: "Sufia Kamal Hall Unit",
            url: "/dashboard?unit=Kabi+Sufia+Kamal+Hall",
          },
          {
            title: "Jagannath Hall Unit",
            url: "/dashboard?unit=Jagannath+Hall",
          },
        ],
      },
      {
        title: "Blood Requests",
        url: "/blood-requests",
        icon: HeartHandshake,
        items: [],
      },
      {
        title: "Search Blood",
        url: "/search-blood",
        icon: Search,
        items: [],
      },
      {
        title: "Donors Directory",
        url: "/donors",
        icon: Users,
        items: [],
      },
      {
        title: "Donation Records",
        url: "/donations",
        icon: ClipboardList,
        items: [],
      },
      {
        title: "Your Profile",
        url: "/profile",
        icon: User,
        items: [],
      },
      {
        title: "Download App",
        url: "/download-app",
        icon: Smartphone,
        items: [],
      },
    ],
  },
];
