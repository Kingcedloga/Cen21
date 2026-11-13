import { Cormorant_Garamond, Dynalight, Inter, Nunito } from "next/font/google";

/**
 * Inter (variable) — sans-serif pour le corps et l’UI.
 * Les titres principaux utilisent DM Sans (locale, @font-face dans globals.css).
 */
export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  axes: ["opsz"],
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
