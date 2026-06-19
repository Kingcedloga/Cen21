import type { HeroVideo } from "./types";

export type SubsidiaryHeroLayout = "default" | "cinematic-center";

export type SubsidiaryHeroLogoSize =
  | "default"
  | "compact"
  | "cinematic"
  | "cinematic-xl";

/** Options de contenu hero par filiale (ex. K Lounge — logo centré, sans titre). */
export type SubsidiaryHeroContent = {
  hideSectorLabel?: boolean;
  hideTitle?: boolean;
  logoSize?: SubsidiaryHeroLogoSize;
  taglineVariant?: "default" | "editorial";
  typographyScale?: "default" | "compact";
  /** Qualité Next/Image (défaut 75) — utile pour les visuels hero plein écran. */
  imageQuality?: number;
  /** Masquer les liens sociaux dans le hero. */
  hideSocialLinks?: boolean;
  /** Masquer le logo dans le hero (contenu déplacé sous le hero). */
  hideLogo?: boolean;
  /** Masquer la tagline dans le hero. */
  hideTagline?: boolean;
};

const HERO_LAYOUT_BY_SLUG: Partial<Record<string, SubsidiaryHeroLayout>> = {
  "filiale-03": "cinematic-center",
};

const HERO_CONTENT_BY_SLUG: Partial<Record<string, SubsidiaryHeroContent>> = {
  "filiale-03": {
    hideSectorLabel: true,
    hideTitle: true,
    logoSize: "cinematic-xl",
    taglineVariant: "editorial",
  },
  "filiale-04": {
    hideSectorLabel: true,
    hideTitle: true,
    hideLogo: true,
    hideTagline: true,
    hideSocialLinks: true,
  },
  "filiale-02": {
    hideSectorLabel: true,
    hideTitle: true,
    hideSocialLinks: true,
    logoSize: "cinematic-xl",
    imageQuality: 92,
  },
};

/** Visuel hero dédié (prioritaire sur `coverImage` pour la slide hero). */
const HERO_IMAGE_BY_SLUG: Partial<Record<string, string>> = {
  "filiale-02": "/filiales/photos/filiale-02/hero/01-salle-principale.jpg",
};

/**
 * Vidéos hero par slug — remplacer `src` (et optionnellement `webm`) par la vidéo officielle.
 * Priorité : `heroVideo` dans subsidiaries.json > entrée ci-dessous.
 */
export const SUBSIDIARY_HERO_VIDEOS: Partial<Record<string, HeroVideo>> = {
  "filiale-03": {
    src: "/filiales/videos/filiale-03/klounge-hero.mp4",
    poster: "/filiales/photos/filiale-03/cover.webp",
  },
};

export function getSubsidiaryHeroLayout(slug: string): SubsidiaryHeroLayout {
  return HERO_LAYOUT_BY_SLUG[slug] ?? "default";
}

export function getSubsidiaryHeroContent(slug: string): SubsidiaryHeroContent {
  return HERO_CONTENT_BY_SLUG[slug] ?? {};
}

export function resolveSubsidiaryHeroVideo(
  slug: string,
  fromContent?: HeroVideo,
): HeroVideo | undefined {
  return fromContent ?? SUBSIDIARY_HERO_VIDEOS[slug];
}

export function resolveSubsidiaryHeroImage(slug: string, coverImage: string): string {
  return HERO_IMAGE_BY_SLUG[slug] ?? coverImage;
}
