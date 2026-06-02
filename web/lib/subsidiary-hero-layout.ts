import type { HeroVideo } from "./types";

export type SubsidiaryHeroLayout = "default" | "cinematic-center";

const HERO_LAYOUT_BY_SLUG: Partial<Record<string, SubsidiaryHeroLayout>> = {
  "filiale-03": "cinematic-center",
};

/**
 * Vidéos hero par slug — remplacer `src` (et optionnellement `webm`) par la vidéo officielle.
 * Priorité : `heroVideo` dans subsidiaries.json > entrée ci-dessous.
 */
export const SUBSIDIARY_HERO_VIDEOS: Partial<Record<string, HeroVideo>> = {
  "filiale-03": {
    src: "/filiales/videos/filiale-03/hero-ambient.mp4",
    poster: "/filiales/photos/filiale-03/cover.webp",
  },
};

export function getSubsidiaryHeroLayout(slug: string): SubsidiaryHeroLayout {
  return HERO_LAYOUT_BY_SLUG[slug] ?? "default";
}

export function resolveSubsidiaryHeroVideo(
  slug: string,
  fromContent?: HeroVideo,
): HeroVideo | undefined {
  return fromContent ?? SUBSIDIARY_HERO_VIDEOS[slug];
}
