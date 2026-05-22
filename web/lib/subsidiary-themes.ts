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
    overlayGradient:
      "linear-gradient(to top, #000000 0%, rgba(0,0,0,0.72) 42%, rgba(0,0,0,0.25) 68%, transparent 100%), linear-gradient(90deg, rgba(0,0,0,0.82) 0%, transparent 48%), radial-gradient(ellipse 80% 60% at 50% 100%, rgba(201,168,76,0.14) 0%, transparent 58%)",
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
      "linear-gradient(to top, #000000 0%, rgba(0,0,0,0.68) 44%, rgba(0,0,0,0.22) 72%, transparent 100%), linear-gradient(90deg, rgba(0,0,0,0.78) 0%, transparent 52%), radial-gradient(ellipse 72% 52% at 50% 100%, rgba(255,255,255,0.07) 0%, transparent 58%)",
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

const THEMES_BY_SLUG: Record<string, SubsidiaryPageTheme> = {
  [K_LOUNGE_THEME.slug]: K_LOUNGE_THEME,
  [MILLIONAIRE_CLUB_THEME.slug]: MILLIONAIRE_CLUB_THEME,
  [MOKA_MORE_THEME.slug]: MOKA_MORE_THEME,
};

export function getSubsidiaryPageTheme(slug: string): SubsidiaryPageTheme | null {
  return THEMES_BY_SLUG[slug] ?? null;
}
