/** Thème page dédiée — scoped à une filiale, sans toucher au design system global. */
export type SubsidiaryPageTheme = {
  id: string;
  slug: string;
  colors: {
    bg: string;
    gold: string;
    goldRgb: string;
    text: string;
    textMuted: string;
    textSubtle: string;
    surface: string;
    surfaceElevated: string;
    border: string;
    /** Couleur boutons (optionnel — sinon `gold` ou `bg`). */
    btn?: string;
    /** Palette étendue (ex. drapeau mexicain). */
    red?: string;
    redRgb?: string;
    ochre?: string;
    ochreRgb?: string;
    terracotta?: string;
    terracottaRgb?: string;
  };
  hero: {
    overlayGradient: string;
    blurTint: string;
  };
};

export const MILLIONAIRE_CLUB_THEME: SubsidiaryPageTheme = {
  id: "millionaire-club",
  slug: "filiale-04",
  colors: {
    bg: "#000000",
    gold: "#C9A84C",
    goldRgb: "201 168 76",
    text: "#FFFFFF",
    textMuted: "rgba(255, 255, 255, 0.68)",
    textSubtle: "rgba(255, 255, 255, 0.48)",
    surface: "rgba(255, 255, 255, 0.04)",
    surfaceElevated: "rgba(255, 255, 255, 0.07)",
    border: "rgba(201, 168, 76, 0.22)",
  },
  hero: {
    overlayGradient: "transparent",
    blurTint: "#0a0a0a",
  },
};

/** K Lounge — lounge premium noir & blanc (accent = blanc via --sub-gold). */
export const K_LOUNGE_THEME: SubsidiaryPageTheme = {
  id: "k-lounge",
  slug: "filiale-03",
  colors: {
    bg: "#000000",
    gold: "#FFFFFF",
    goldRgb: "255 255 255",
    text: "#FFFFFF",
    textMuted: "rgba(255, 255, 255, 0.72)",
    textSubtle: "rgba(255, 255, 255, 0.5)",
    surface: "rgba(255, 255, 255, 0.04)",
    surfaceElevated: "rgba(255, 255, 255, 0.08)",
    border: "rgba(255, 255, 255, 0.18)",
  },
  hero: {
    overlayGradient:
      "linear-gradient(180deg, rgba(0,0,0,0.58) 0%, rgba(0,0,0,0.42) 45%, rgba(0,0,0,0.62) 100%), radial-gradient(ellipse 110% 85% at 50% 50%, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.52) 100%)",
    blurTint: "#000000",
  },
};

/** Moka & More — café-lounge rouge, noir & blanc (accent = rouge via --sub-gold). */
export const MOKA_MORE_THEME: SubsidiaryPageTheme = {
  id: "moka-more",
  slug: "filiale-06",
  colors: {
    bg: "#000000",
    gold: "#CC0000",
    goldRgb: "204 0 0",
    text: "#FFFFFF",
    textMuted: "rgba(255, 255, 255, 0.7)",
    textSubtle: "rgba(255, 255, 255, 0.48)",
    surface: "rgba(255, 255, 255, 0.04)",
    surfaceElevated: "rgba(255, 255, 255, 0.07)",
    border: "rgba(204, 0, 0, 0.24)",
  },
  hero: {
    overlayGradient:
      "linear-gradient(to top, #000000 0%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0.28) 68%, transparent 100%), linear-gradient(90deg, rgba(0,0,0,0.8) 0%, transparent 46%), radial-gradient(ellipse 85% 62% at 50% 100%, rgba(204,0,0,0.16) 0%, transparent 58%)",
    blurTint: "#0a0a0a",
  },
};

/** Le Pain Quotidien — boulangerie artisanale chocolat & blanc (accent = blanc via --sub-gold). */
export const PAIN_QUOTIDIEN_THEME: SubsidiaryPageTheme = {
  id: "pain-quotidien",
  slug: "filiale-10",
  colors: {
    bg: "#8B5E3C",
    gold: "#FFFFFF",
    goldRgb: "255 255 255",
    text: "#FFFFFF",
    textMuted: "rgba(255, 255, 255, 0.78)",
    textSubtle: "rgba(255, 255, 255, 0.55)",
    surface: "rgba(0, 0, 0, 0.12)",
    surfaceElevated: "rgba(0, 0, 0, 0.18)",
    border: "rgba(255, 255, 255, 0.22)",
  },
  hero: {
    overlayGradient:
      "linear-gradient(to top, #8B5E3C 0%, rgba(139,94,60,0.88) 42%, rgba(139,94,60,0.42) 68%, transparent 100%), linear-gradient(90deg, rgba(107,72,46,0.82) 0%, transparent 50%), radial-gradient(ellipse 78% 56% at 50% 100%, rgba(255,255,255,0.1) 0%, transparent 58%)",
    blurTint: "#8B5E3C",
  },
};

/** Papa John's — pizzeria moderne vert naturel & blanc (accent = blanc via --sub-gold). */
export const PAPA_JOHNS_THEME: SubsidiaryPageTheme = {
  id: "papa-johns",
  slug: "filiale-08",
  colors: {
    bg: "#006B3F",
    gold: "#FFFFFF",
    goldRgb: "255 255 255",
    text: "#FFFFFF",
    textMuted: "rgba(255, 255, 255, 0.78)",
    textSubtle: "rgba(255, 255, 255, 0.55)",
    surface: "rgba(255, 255, 255, 0.08)",
    surfaceElevated: "rgba(255, 255, 255, 0.12)",
    border: "rgba(255, 255, 255, 0.24)",
    btn: "#005A35",
  },
  hero: {
    overlayGradient:
      "linear-gradient(to top, #006B3F 0%, rgba(0,107,63,0.9) 42%, rgba(0,107,63,0.4) 68%, transparent 100%), linear-gradient(90deg, rgba(0,80,47,0.85) 0%, transparent 50%), radial-gradient(ellipse 80% 58% at 50% 100%, rgba(255,255,255,0.1) 0%, transparent 58%)",
    blurTint: "#006B3F",
  },
};

/** Gourmet Mexicana — hacienda contemporaine sobre (brun nuit, vert & rouge mexicains en accents discrets, or). */
export const GOURMET_MEXICANA_THEME: SubsidiaryPageTheme = {
  id: "gourmet-mexicana",
  slug: "filiale-07",
  colors: {
    bg: "#1A1208",
    gold: "#CE1126",
    goldRgb: "206 17 38",
    text: "#F5EFE0",
    textMuted: "rgba(245, 239, 224, 0.72)",
    textSubtle: "rgba(245, 239, 224, 0.5)",
    surface: "rgba(245, 239, 224, 0.05)",
    surfaceElevated: "rgba(245, 239, 224, 0.09)",
    border: "rgba(201, 169, 110, 0.24)",
    btn: "#CE1126",
    red: "#CE1126",
    redRgb: "206 17 38",
    ochre: "#C9A96E",
    ochreRgb: "201 169 110",
    terracotta: "#006847",
    terracottaRgb: "0 104 71",
  },
  hero: {
    overlayGradient:
      "linear-gradient(to top, #1A1208 0%, rgba(26,18,8,0.9) 40%, rgba(26,18,8,0.36) 68%, transparent 100%), linear-gradient(90deg, rgba(26,18,8,0.85) 0%, transparent 48%), radial-gradient(ellipse 85% 62% at 50% 100%, rgba(206,17,38,0.14) 0%, transparent 58%), radial-gradient(ellipse 55% 42% at 88% 18%, rgba(201,169,110,0.12) 0%, transparent 52%)",
    blurTint: "#1A1208",
  },
};

/** Café Muzik — café musical bleu, rouge & blanc (festif & vibrant). */
export const MUZIK_CAFE_THEME: SubsidiaryPageTheme = {
  id: "muzik-cafe",
  slug: "filiale-05",
  colors: {
    bg: "#0033A0",
    gold: "#EF3340",
    goldRgb: "239 51 64",
    text: "#FFFFFF",
    textMuted: "rgba(255, 255, 255, 0.78)",
    textSubtle: "rgba(255, 255, 255, 0.55)",
    surface: "rgba(255, 255, 255, 0.08)",
    surfaceElevated: "rgba(255, 255, 255, 0.12)",
    border: "rgba(255, 255, 255, 0.22)",
    btn: "#EF3340",
    red: "#EF3340",
    redRgb: "239 51 64",
  },
  hero: {
    overlayGradient:
      "linear-gradient(to top, #0033A0 0%, rgba(0,51,160,0.92) 40%, rgba(0,51,160,0.4) 68%, transparent 100%), linear-gradient(90deg, rgba(0,38,120,0.88) 0%, transparent 48%), radial-gradient(ellipse 88% 64% at 50% 100%, rgba(239,51,64,0.24) 0%, transparent 58%), radial-gradient(ellipse 48% 38% at 12% 22%, rgba(255,255,255,0.08) 0%, transparent 52%)",
    blurTint: "#0033A0",
  },
};

/** L'Olive Verte — crème #ECE7D1 · olive #767F34 (bicolore, sans rouge). */
export const OLIVE_VERTE_THEME: SubsidiaryPageTheme = {
  id: "olive-verte",
  slug: "filiale-01",
  colors: {
    bg: "#ECE7D1",
    gold: "#ECE7D1",
    goldRgb: "236 231 209",
    text: "#767F34",
    textMuted: "rgba(118, 127, 52, 0.76)",
    textSubtle: "rgba(118, 127, 52, 0.54)",
    surface: "rgba(118, 127, 52, 0.07)",
    surfaceElevated: "rgba(118, 127, 52, 0.11)",
    border: "rgba(118, 127, 52, 0.26)",
    btn: "#767F34",
    red: "#767F34",
    redRgb: "118 127 52",
  },
  hero: {
    overlayGradient:
      "linear-gradient(to top, #ECE7D1 0%, rgba(236,231,209,0.94) 38%, rgba(236,231,209,0.52) 62%, transparent 100%), linear-gradient(90deg, rgba(118,127,52,0.48) 0%, transparent 52%), radial-gradient(ellipse 80% 58% at 50% 100%, rgba(118,127,52,0.1) 0%, transparent 58%)",
    blurTint: "#ECE7D1",
  },
};

/** Wabi Sabi — fond bleu #0b2F49 · texte or #e1c676 (zen contemporain). */
export const WABI_SABI_THEME: SubsidiaryPageTheme = {
  id: "wabi-sabi",
  slug: "filiale-02",
  colors: {
    bg: "#0b2F49",
    gold: "#e1c676",
    goldRgb: "225 198 118",
    text: "rgba(225, 198, 118, 0.94)",
    textMuted: "rgba(225, 198, 118, 0.72)",
    textSubtle: "rgba(225, 198, 118, 0.52)",
    surface: "rgba(225, 198, 118, 0.06)",
    surfaceElevated: "rgba(225, 198, 118, 0.1)",
    border: "rgba(225, 198, 118, 0.24)",
    btn: "#e1c676",
  },
  hero: {
    overlayGradient: "transparent",
    blurTint: "#0b2F49",
  },
};

/** Pinkberry — yaourt glacé rose & blanc (frais, gourmand & joyeux). */
export const PINKBERRY_THEME: SubsidiaryPageTheme = {
  id: "pinkberry",
  slug: "filiale-09",
  colors: {
    bg: "#F4A7C3",
    gold: "#FFFFFF",
    goldRgb: "255 255 255",
    text: "#FFFFFF",
    textMuted: "rgba(255, 255, 255, 0.84)",
    textSubtle: "rgba(255, 255, 255, 0.62)",
    surface: "rgba(255, 255, 255, 0.14)",
    surfaceElevated: "rgba(255, 255, 255, 0.2)",
    border: "rgba(255, 255, 255, 0.34)",
    btn: "#FFFFFF",
  },
  hero: {
    overlayGradient:
      "linear-gradient(to top, #F4A7C3 0%, rgba(244,167,195,0.92) 42%, rgba(244,167,195,0.48) 68%, transparent 100%), linear-gradient(90deg, rgba(210,50,105,0.82) 0%, transparent 50%), radial-gradient(ellipse 82% 58% at 50% 100%, rgba(255,255,255,0.16) 0%, transparent 58%), radial-gradient(ellipse 44% 36% at 88% 14%, rgba(255,255,255,0.12) 0%, transparent 52%)",
    blurTint: "#F4A7C3",
  },
};

const THEMES_BY_SLUG: Record<string, SubsidiaryPageTheme> = {
  [GOURMET_MEXICANA_THEME.slug]: GOURMET_MEXICANA_THEME,
  [K_LOUNGE_THEME.slug]: K_LOUNGE_THEME,
  [MILLIONAIRE_CLUB_THEME.slug]: MILLIONAIRE_CLUB_THEME,
  [MOKA_MORE_THEME.slug]: MOKA_MORE_THEME,
  [MUZIK_CAFE_THEME.slug]: MUZIK_CAFE_THEME,
  [OLIVE_VERTE_THEME.slug]: OLIVE_VERTE_THEME,
  [PAIN_QUOTIDIEN_THEME.slug]: PAIN_QUOTIDIEN_THEME,
  [PAPA_JOHNS_THEME.slug]: PAPA_JOHNS_THEME,
  [PINKBERRY_THEME.slug]: PINKBERRY_THEME,
  [WABI_SABI_THEME.slug]: WABI_SABI_THEME,
};

export function getSubsidiaryPageTheme(slug: string): SubsidiaryPageTheme | null {
  return THEMES_BY_SLUG[slug] ?? null;
}
