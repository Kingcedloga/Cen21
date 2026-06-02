import { Cormorant_Garamond, Inter } from "next/font/google";

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

/** Serif éditoriale — sections premium (ex. About K Lounge). */
export const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});
