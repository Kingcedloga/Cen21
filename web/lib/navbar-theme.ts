
/** Couleurs de charte par maison (fond, texte, accent) : surfaces des logos (lib/subsidiary-brand.ts). */
export type SubsidiaryNavbarTheme = {
  background: string;
  foreground: string;
  accent: string;
};

/** Slug → charte navbar (aligné sur content/en|fr/subsidiaries.json). */
export const SUBSIDIARY_NAVBAR_THEMES: Record<string, SubsidiaryNavbarTheme> = {
  "olive-verte": {
    background: "#ECE7D1",
    foreground: "#767F34",
    accent: "#BA2525",
  },
  "wabi-sabi": {
    background: "#0b2F49",
    foreground: "#e1c676",
    accent: "#e1c676",
  },
  "k-lounge": {
    background: "#000000",
    foreground: "#FFFFFF",
    accent: "#FFFFFF",
  },
  "millionaire-club": {
    background: "#000000",
    foreground: "#C9A84C",
    accent: "#C9A84C",
  },
  "cafe-muzik": {
    background: "#FFFFFF",
    foreground: "#161616",
    accent: "#EF3340",
  },
  "muzik-cafe": {
    background: "#FFFFFF",
    foreground: "#161616",
    accent: "#EF3340",
  },
  "moka-more": {
    background: "#000000",
    foreground: "#FFFFFF",
    accent: "#CC0000",
  },
  "gourmet-mexicana": {
    background: "#006847",
    foreground: "#FFFFFF",
    accent: "#CE1126",
  },
  "papa-johns": {
    background: "#006B3F",
    foreground: "#FFFFFF",
    accent: "#FFFFFF",
  },
  "pinkberry": {
    background: "#F4A7C3",
    foreground: "#FFFFFF",
    accent: "#FFFFFF",
  },
  "pain-quotidien": {
    background: "#8B5E3C",
    foreground: "#FFFFFF",
    accent: "#FFFFFF",
  },
  "le-pain-quotidien": {
    background: "#8B5E3C",
    foreground: "#FFFFFF",
    accent: "#FFFFFF",
  },

  // Anciens slugs pour rétrocompatibilité
  "filiale-01": {
    background: "#ECE7D1",
    foreground: "#767F34",
    accent: "#BA2525",
  },
  "filiale-02": {
    background: "#0b2F49",
    foreground: "#e1c676",
    accent: "#e1c676",
  },
  "filiale-03": {
    background: "#000000",
    foreground: "#FFFFFF",
    accent: "#FFFFFF",
  },
  "filiale-04": {
    background: "#000000",
    foreground: "#C9A84C",
    accent: "#C9A84C",
  },
  "filiale-05": {
    background: "#FFFFFF",
    foreground: "#161616",
    accent: "#EF3340",
  },
  "filiale-06": {
    background: "#000000",
    foreground: "#FFFFFF",
    accent: "#CC0000",
  },
  "filiale-07": {
    background: "#006847",
    foreground: "#FFFFFF",
    accent: "#CE1126",
  },
  "filiale-08": {
    background: "#006B3F",
    foreground: "#FFFFFF",
    accent: "#FFFFFF",
  },
  "filiale-09": {
    background: "#F4A7C3",
    foreground: "#FFFFFF",
    accent: "#FFFFFF",
  },
  "filiale-10": {
    background: "#8B5E3C",
    foreground: "#FFFFFF",
    accent: "#FFFFFF",
  },
};
