import siteEn from "@/content/en/site.json";
import siteFr from "@/content/fr/site.json";
import statsEn from "@/content/en/stats.json";
import statsFr from "@/content/fr/stats.json";
import aboutEn from "@/content/en/about.json";
import aboutFr from "@/content/fr/about.json";
import subsidiariesEn from "@/content/en/subsidiaries.json";
import subsidiariesFr from "@/content/fr/subsidiaries.json";
import eventsEn from "@/content/en/events.json";
import eventsFr from "@/content/fr/events.json";
import galleryEn from "@/content/en/gallery.json";
import galleryFr from "@/content/fr/gallery.json";

import type { Locale } from "@/i18n/routing";
import type {
  AboutContent,
  EventItem,
  GalleryItem,
  SiteConfig,
  StatsContent,
  Subsidiary,
} from "./types";

const SITE: Record<Locale, SiteConfig> = { en: siteEn, fr: siteFr };
const STATS: Record<Locale, StatsContent> = {
  en: statsEn as StatsContent,
  fr: statsFr as StatsContent,
};
const ABOUT: Record<Locale, AboutContent> = { en: aboutEn, fr: aboutFr };
const SUBSIDIARIES: Record<Locale, Subsidiary[]> = {
  en: subsidiariesEn.subsidiaries as Subsidiary[],
  fr: subsidiariesFr.subsidiaries as Subsidiary[],
};
const EVENTS: Record<Locale, EventItem[]> = {
  en: eventsEn.events as EventItem[],
  fr: eventsFr.events as EventItem[],
};
const GALLERY: Record<Locale, GalleryItem[]> = {
  en: galleryEn.items as GalleryItem[],
  fr: galleryFr.items as GalleryItem[],
};

export function getSiteConfig(locale: Locale): SiteConfig {
  return SITE[locale];
}

export function getStatsContent(locale: Locale): StatsContent {
  return STATS[locale];
}

export function getAboutContent(locale: Locale): AboutContent {
  return ABOUT[locale];
}

export function getSubsidiaries(locale: Locale): Subsidiary[] {
  return SUBSIDIARIES[locale];
}

export function getFeaturedSubsidiaries(locale: Locale): Subsidiary[] {
  return getSubsidiaries(locale).filter((s) => s.featured);
}

export function getSubsidiaryBySlug(
  locale: Locale,
  slug: string,
): Subsidiary | undefined {
  return getSubsidiaries(locale).find((s) => s.slug === slug);
}

export function getAllSubsidiarySlugs(locale: Locale): string[] {
  return getSubsidiaries(locale).map((s) => s.slug);
}

export function getEvents(locale: Locale, includePast = false): EventItem[] {
  const now = Date.now();
  const events = EVENTS[locale];
  const sorted = [...events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
  if (includePast) return sorted;
  return sorted.filter((e) => new Date(e.date).getTime() >= now);
}

export function getPastEvents(locale: Locale): EventItem[] {
  const now = Date.now();
  return EVENTS[locale]
    .filter((e) => new Date(e.date).getTime() < now)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getEventsBySubsidiary(
  locale: Locale,
  slug: string,
): EventItem[] {
  return getEvents(locale, true).filter((e) => e.subsidiarySlug === slug);
}

export function getUpcomingEventsBySubsidiary(
  locale: Locale,
  slug: string,
): EventItem[] {
  return getEvents(locale, false).filter((e) => e.subsidiarySlug === slug);
}

export function getGalleryItems(locale: Locale): GalleryItem[] {
  return GALLERY[locale];
}

export function getGalleryBySubsidiary(
  locale: Locale,
  slug: string,
): GalleryItem[] {
  return getGalleryItems(locale).filter((i) => i.subsidiarySlug === slug);
}

export type SectorKey =
  | "restaurant"
  | "bar"
  | "lounge"
  | "nightclub"
  | "evenementiel";

export function getSectorLabel(
  locale: Locale,
  sector: SectorKey,
): string {
  const labels: Record<Locale, Record<SectorKey, string>> = {
    en: {
      restaurant: "Restaurant",
      bar: "Bar",
      lounge: "Lounge",
      nightclub: "Nightclub",
      evenementiel: "Events",
    },
    fr: {
      restaurant: "Restaurant",
      bar: "Bar",
      lounge: "Lounge",
      nightclub: "Boîte de nuit",
      evenementiel: "Événementiel",
    },
  };
  return labels[locale][sector];
}
