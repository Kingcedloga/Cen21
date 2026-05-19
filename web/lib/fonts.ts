import { Inter } from "next/font/google";

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
