import { getTranslations } from "next-intl/server";

import type { Locale } from "@/i18n/routing";
import {
  getGalleryBySubsidiary,
  getSubsidiaries,
  getUpcomingEventsBySubsidiary,
} from "@/lib/content";
import { buildSubsidiaryGalleryItems, galleryEntrySrc } from "@/lib/gallery-categories";
import { resolveSubsidiaryHeroImage, resolveSubsidiaryHeroVideo } from "@/lib/subsidiary-hero-layout";
import { getSubsidiaryEventShowcaseConfig, hasSubsidiaryEventShowcase } from "@/lib/subsidiary-events-showcase";
import { getSubsidiaryPageTheme } from "@/lib/subsidiary-themes";
import type { Subsidiary } from "@/lib/types";

/**
 * Données d'une fiche filiale, calculées une fois par page et partagées par
 * toutes les compositions (components/filiales/pages/*). Repris tel quel de
 * l'ancienne page unique (refonte R5 : une composition par maison).
 */
export async function buildFilialeContext(locale: Locale, subsidiary: Subsidiary) {
  const slug = subsidiary.slug;
  const pageTheme = getSubsidiaryPageTheme(slug);
  const isThemed = Boolean(pageTheme);
  const t = await getTranslations("subsidiaries");

  const events = getUpcomingEventsBySubsidiary(locale, slug);
  const galleryItems = buildSubsidiaryGalleryItems(subsidiary, getGalleryBySubsidiary(locale, slug));

  // Maisons sœurs (bandeau « Nos établissements ») : toutes sauf celle-ci.
  const sisterSubsidiaries = getSubsidiaries(locale)
    .filter((s) => s.slug !== slug && s.brandLogo)
    .map((s) => ({
      slug: s.slug,
      name: s.name,
      brandLogo: s.brandLogo!,
      externalUrl: s.externalUrl,
    }));

  const heroVideo = resolveSubsidiaryHeroVideo(slug, subsidiary.heroVideo);
  const heroSlides =
    slug === "filiale-02" || heroVideo
      ? [
          {
            src: heroVideo?.poster ?? resolveSubsidiaryHeroImage(slug, subsidiary.coverImage),
            alt: subsidiary.name,
          },
        ]
      : dedupeSlides([
          { src: subsidiary.coverImage, alt: subsidiary.name },
          ...subsidiary.galleryImages.slice(0, 5).map((entry, i) => ({
            src: galleryEntrySrc(entry),
            alt: `${subsidiary.name} — ${i + 1}`,
          })),
        ]);

  const mapQuery =
    subsidiary.practicalInfo.address?.trim() || subsidiary.practicalInfo.phone?.trim() || subsidiary.name;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;

  const headingFontClass =
    slug === "filiale-03" || slug === "filiale-04"
      ? "font-[family-name:var(--font-cormorant)]"
      : "font-[family-name:var(--font-dm-sans)]";
  const headingClass = isThemed
    ? `sub-themed-heading ${headingFontClass} text-3xl mb-4`
    : `${headingFontClass} text-3xl text-ivory mb-4`;
  const sectionHeadingClass = isThemed
    ? `sub-themed-heading ${headingFontClass} text-3xl mb-8`
    : `${headingFontClass} text-3xl text-ivory mb-8`;

  const useEventShowcase = hasSubsidiaryEventShowcase(slug);
  const eventShowcaseConfig = getSubsidiaryEventShowcaseConfig(slug);
  const showcaseEvents =
    eventShowcaseConfig && useEventShowcase ? events.slice(0, eventShowcaseConfig.maxEvents) : events;

  return {
    locale,
    slug,
    subsidiary,
    pageTheme,
    isThemed,
    t,
    events,
    galleryItems,
    sisterSubsidiaries,
    heroVideo,
    heroSlides,
    mapQuery,
    mapsUrl,
    headingClass,
    sectionHeadingClass,
    useEventShowcase,
    eventShowcaseConfig,
    showcaseEvents,
  };
}

export type FilialeContext = Awaited<ReturnType<typeof buildFilialeContext>>;

function dedupeSlides(slides: { src: string; alt: string }[]) {
  const seen = new Set<string>();
  return slides.filter((s) => {
    if (seen.has(s.src)) return false;
    seen.add(s.src);
    return true;
  });
}
