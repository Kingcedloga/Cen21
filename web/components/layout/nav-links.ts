export const NAV_PATHS = [
  { href: "/", key: "home" },
  { href: "/a-propos", key: "about" },
  { href: "/filiales", key: "subsidiaries" },
  { href: "/evenements", key: "events" },
  { href: "/galerie", key: "gallery" },
  { href: "/contact", key: "contact" },
] as const;

export type NavPathKey = (typeof NAV_PATHS)[number]["key"];
