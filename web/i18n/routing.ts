import { defineRouting } from "next-intl/routing";

export const locales = ["en", "fr"] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: "en",
  localePrefix: "as-needed",
  localeCookie: {
    name: "NEXT_LOCALE",
    maxAge: 60 * 60 * 24 * 365,
  },
  // L'anglais reste la langue par défaut pour tous les visiteurs, quel que
  // soit leur navigateur — le français n'est servi que via /fr ou le
  // sélecteur de langue, jamais imposé par l'Accept-Language du navigateur.
  localeDetection: false,
});
