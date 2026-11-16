import type { HeroVideo } from "./types";

/*
 * Visuels du hero par maison : photo dédiée (sinon `coverImage`) et vidéo
 * (sinon `heroVideo` du contenu). Lus par les pages groupe (/filiales,
 * /a-propos) et par le contexte des fiches.
 */

/** Visuel hero dédié (prioritaire sur `coverImage` pour la slide hero). */
const HERO_IMAGE_BY_SLUG: Partial<Record<string, string>> = {
  "wabi-sabi": "/filiales/photos/filiale-02/hero/01-salle-principale.jpg",
  "filiale-02": "/filiales/photos/filiale-02/hero/01-salle-principale.jpg",
};

/**
 * Vidéos hero par slug — remplacer `src` (et optionnellement `webm`) par la vidéo officielle.
 * Priorité : `heroVideo` dans subsidiaries.json > entrée ci-dessous.
 */
export const SUBSIDIARY_HERO_VIDEOS: Partial<Record<string, HeroVideo>> = {
  "k-lounge": {
    src: "/filiales/videos/filiale-03/klounge-hero.mp4",
    poster: "/filiales/photos/filiale-03/cover.webp",
  },
  "filiale-03": {
    src: "/filiales/videos/filiale-03/klounge-hero.mp4",
    poster: "/filiales/photos/filiale-03/cover.webp",
  },
};

export function resolveSubsidiaryHeroVideo(
  slug: string,
  fromContent?: HeroVideo,
): HeroVideo | undefined {
  return fromContent ?? SUBSIDIARY_HERO_VIDEOS[slug];
}

export function resolveSubsidiaryHeroImage(slug: string, coverImage: string): string {
  return HERO_IMAGE_BY_SLUG[slug] ?? coverImage;
}
