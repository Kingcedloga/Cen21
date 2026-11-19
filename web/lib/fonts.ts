import { Cormorant_Garamond, Dynalight, Inter, Nunito, Oswald } from "next/font/google";
import localFont from "next/font/local";

/**
 * Inter (variable) — sans-serif pour le corps et l’UI.
 * Les titres principaux utilisent DM Sans (locale, ci-dessous).
 */
export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

/**
 * DM Sans (variable, opsz + wght 100-1000) — titres. Sous-ensemble latin
 * (lib/fonts-files/DMSans-latin.woff2, 69 Ko au lieu de 88 Ko + 22 Ko pour
 * la graisse 700, désormais couverte par l'axe wght). next/font la précharge
 * et génère un repli métriquement ajusté : pas de saut de mise en page au swap.
 */
export const dmSans = localFont({
  src: "./fonts-files/DMSans-latin.woff2",
  weight: "100 1000",
  style: "normal",
  variable: "--font-dm-sans-file",
  display: "swap",
  adjustFontFallback: "Arial",
});

/** Pinkberry page headings — rounded, friendly sans-serif.
 *  Pas de préchargement : seule la page Pinkberry l'utilise ; préchargée, elle
 *  retardait le premier affichage de toutes les pages en réseau lent. */
export const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
  preload: false,
});

/** Moka & More — titres : grotesque grasse et étroite, la famille du
 *  « moka & more » du logo. Pas de préchargement : seule cette page l'utilise. */
export const oswald = Oswald({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-oswald",
  display: "swap",
  preload: false,
});

/** Gourmet Mexicana section labels — display cursive. */
export const dynalight = Dynalight({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-dynalight",
  display: "swap",
});

/** Serif éditoriale — sections premium (ex. About K Lounge). */
export const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  // Italique : citations des fiches (avis Wabi Sabi), chargée à l'usage.
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
  // Pages filiales surtout : chargée quand un texte l'utilise, sans
  // concurrencer la CSS du premier affichage (≈ 76 Ko en 4G lente).
  preload: false,
});
