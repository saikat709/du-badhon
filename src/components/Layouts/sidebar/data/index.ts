import * as Icons from "../icons";

export const NAV_DATA = [
  {
    label: "MAIN MENU",
    items: [
      {
        title: "Dashboard",
        icon: Icons.HomeIcon,
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
        icon: Icons.FourCircle,
        items: [],
      },
      {
        title: "Search Blood",
        url: "/search-blood",
        icon: Icons.Alphabet,
        items: [],
      },
      {
        title: "Donors Directory",
        url: "/donors",
        icon: Icons.User,
        items: [],
      },
      {
        title: "Donation Records",
        url: "/donations",
        icon: Icons.Table,
        items: [],
      },
      {
        title: "Your Profile",
        url: "/profile",
        icon: Icons.User,
        items: [],
      },
    ],
  },
];
