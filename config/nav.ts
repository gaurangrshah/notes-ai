import { SidebarLink } from "@/components/SidebarItems";
import { Cog, Globe, HomeIcon, Notebook } from "lucide-react";

type AdditionalLinks = {
  title: string;
  links: SidebarLink[];
};

export const defaultLinks: SidebarLink[] = [
  { href: "/dashboard", title: "Home", icon: HomeIcon },
  { href: "/account", title: "Account", icon: Cog },
  { href: "/settings", title: "Settings", icon: Cog },
  { href: "/dash", title: "User Dashboard", icon: Notebook },
];

export const additionalLinks: AdditionalLinks[] = [
  {
    title: "Entities",
    links: [
      {
        href: "/notes",
        title: "Notes",
        icon: Globe,
      },
    ],
  },
];
