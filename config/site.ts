export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Memora",
  description:
    "Memora is a sleek and intuitive bookmarking app designed to be your second brain. With its minimalist yet powerful interface, Memora helps you save, organize, and retrieve important links, notes, and resources effortlessly",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "app",
      href: "/app",
    },
    {
      label: "Pricing",
      href: "/pricing",
    },
    {
      label: "Blog",
      href: "/blog",
    },
    {
      label: "About",
      href: "/about",
    },
  ],
  navMenuItems: [
    {
      label: "Profile",
      href: "/profile",
    },
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Settings",
      href: "/settings",
    },
    {
      label: "Logout",
      href: "/logout",
    },
  ],
  links: {
    github: "https://github.com/amrohan",
    twitter: "https://twitter.com/amohxn",
  },
};
