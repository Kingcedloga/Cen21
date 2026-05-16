import { Cormorant_Garamond, Inter } from "next/font/google";

/**
 * Cormorant Garamond — serif éditoriale ultra-premium pour titres et accents.
 * Poids fournis : 300 (titres élégants), 400 (paragraphes serif), 500 (accents medium),
 * 600/700 (rares emphases). Italics inclus pour subtitles éditoriales.
 */
export const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

/**
 * Inter (variable) — sans-serif neutre pour le corps, UI et eyebrows.
 * Axe `opsz` activé pour un rendu typographique optimisé selon la taille du texte
 * (tracking et largeur subtilement ajustés par le navigateur — signature luxe).
 */
export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  axes: ["opsz"],
});
