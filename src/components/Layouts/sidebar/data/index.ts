import * as Icons from "../icons";

export const NAV_DATA = [
  {
    label: "MAIN MENU",
    items: [
      {
        title: "Dashboard",
        icon: Icons.HomeIcon,
        items: [
          {
            title: "FH Hall Unit",
            url: "/",
          },
          {
            title: "Sufia Kamal Hall Unit",
            url: "/",
          },
          {
            title: "SH Hall Unit",
            url: "/",
          },
          {
            title: "Bangabandhu Hall Unit",
            url: "/",
          },
        ],
      },
      // {
      //   title: "Calendar",
      //   url: "/calendar",
      //   icon: Icons.Calendar,
      //   items: [],
      // },
      {
        title: "Your Profile",
        url: "/profile",
        icon: Icons.User,
        items: [],
      },

      {
        title: "Blodd Requests",
        url: "/blood-requets",
        icon: Icons.User,
        items: [],
      },

      {
        title: "Search Blood",
        url: "/search-blood",
        icon: Icons.FourCircle,
        items: [],
      },

      {
        title: "Donations",
        icon: Icons.Alphabet,
        items: [
          {
            title: "Total",
            url: "/forms/form-elements",
          },
          {
            title: "Succesfull",
            url: "/forms/form-elements",
          },
          {
            title: "Pending",
            url: "/forms/form-layout",
          },
          {
            title: "Failed",
            url: "/forms/form-layout",
          },
        ],
      },
      {
        title: "Users",
        url: "/tables",
        icon: Icons.Table,
        items: [
          {
            title: "Volunteers",
            url: "/tables",
          },
          {
            title: "Donors",
            url: "/tables",
          },
          {
            title: "Non-Donors",
            url: "/tables",
          },
          {
            title: "Add Donor",
            url: "/tables",
          },
        ],
      },
      {
        title: "Settings",
        icon: Icons.Alphabet,
        items: [
          {
            title: "Edit Profile",
            url: "/pages/settings",
          },
        ],
      },
    ],
  },
  {
    label: "OTHERS",
    items: [
      // {
      //   title: "Charts",
      //   icon: Icons.PieChart,
      //   items: [
      //     {
      //       title: "Basic Chart",
      //       url: "/charts/basic-chart",
      //     },
      //   ],
      // },
      // {
      //   title: "UI Elements",
      //   icon: Icons.FourCircle,
      //   items: [
      //     {
      //       title: "Alerts",
      //       url: "/ui-elements/alerts",
      //     },
      //     {
      //       title: "Buttons",
      //       url: "/ui-elements/buttons",
      //     },
      //   ],
      // },
      {
        title: "Authentication",
        icon: Icons.Authentication,
        items: [
          {
            title: "Sign In",
            url: "/auth/sign-in",
          },
          {
            title: "Register",
            url: "/auth/resgiter",
          },
          {
            title: "Reset Password",
            url: "/auth/reset-password",
          },
        ],
      },
    ],
  },
];
