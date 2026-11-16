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
import faqEn from "@/content/en/faq.json";
import faqFr from "@/content/fr/faq.json";

import type { Locale } from "@/i18n/routing";
import type {
  AboutContent,
  EventItem,
  ExperienceVideo,
  GalleryItem,
  SiteConfig,
  StatsContent,
  Subsidiary,
  SubsidiaryFaqContent,
  SubsidiaryFaqItem,
} from "./types";
import { EVENTS_TAG, eventsFromCsv } from "./events-sheet";
import { parseYoutubeId } from "./youtube";

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
const FAQ: Record<Locale, SubsidiaryFaqContent> = {
  en: faqEn as SubsidiaryFaqContent,
  fr: faqFr as SubsidiaryFaqContent,
};

export function getSiteConfig(locale: Locale): SiteConfig {
  return SITE[locale];
}

/** ID YouTube pour la section Expérience (contenu JSON ou variable d'environnement). */
export function getExperienceVideoId(locale: Locale): string | undefined {
  const videos = getExperienceVideos(locale);
  return videos[0]?.id;
}

/** Vidéos parsées pour le slider Expérience (CTA). */
export function getExperienceVideos(
  locale: Locale,
): { id: string; title?: string; titleAccent?: string }[] {
  const site = getSiteConfig(locale);
  const fromConfig = (site.experienceVideos ?? [])
    .map((entry) => parseExperienceVideo(entry))
    .filter((v): v is { id: string; title?: string; titleAccent?: string } => v != null);

  if (fromConfig.length > 0) return fromConfig;

  const legacy =
    site.experienceYoutubeId?.trim() ||
    process.env.NEXT_PUBLIC_EXPERIENCE_YOUTUBE_ID?.trim() ||
    "";
  const id = parseYoutubeId(legacy);
  return id ? [{ id }] : [];
}

function parseExperienceVideo(
  entry: ExperienceVideo,
): { id: string; title?: string; titleAccent?: string } | undefined {
  const id = parseYoutubeId(entry.youtubeId?.trim() ?? "");
  if (!id) return undefined;
  return {
    id,
    title: entry.title?.trim() || undefined,
    titleAccent: titleAccentOrUndefined(entry.titleAccent),
  };
}

function titleAccentOrUndefined(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed || undefined;
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

export const SUBSIDIARY_SLUG_ALIASES: Record<string, string> = {
  "filiale-01": "olive-verte",
  "l-olive-verte": "olive-verte",
  "filiale-02": "wabi-sabi",
  "filiale-03": "k-lounge",
  "filiale-04": "millionaire-club",
  "filiale-05": "cafe-muzik",
  "muzik-cafe": "cafe-muzik",
  "filiale-06": "moka-more",
  "filiale-07": "gourmet-mexicana",
  "filiale-08": "papa-johns",
  "filiale-09": "pinkberry",
  "filiale-10": "pain-quotidien",
  "le-pain-quotidien": "pain-quotidien",
};

export function normalizeSubsidiarySlug(slug: string): string {
  return SUBSIDIARY_SLUG_ALIASES[slug] ?? slug;
}

export function getSubsidiaryBySlug(
  locale: Locale,
  slug: string,
): Subsidiary | undefined {
  const normalized = normalizeSubsidiarySlug(slug);
  return getSubsidiaries(locale).find((s) => s.slug === normalized || s.slug === slug);
}

export function getAllSubsidiarySlugs(locale: Locale): string[] {
  return getSubsidiaries(locale).map((s) => s.slug);
}

/** Fréquence de relecture de la feuille d'agenda (secondes). */
const EVENTS_REVALIDATE = 600;

/**
 * Agenda : la feuille Google Sheets si EVENTS_SHEET_CSV_URL est renseignée
 * (relue au plus toutes les 10 min, ou tout de suite via
 * /api/evenements/publier), sinon content/{fr,en}/events.json.
 *
 * Feuille injoignable ou illisible : le site ne tombe pas en erreur ; il
 * reprend le dernier agenda lu avec succès par ce serveur, à défaut le JSON.
 */
const lastGoodEvents: Partial<Record<Locale, EventItem[]>> = {};

async function loadEvents(locale: Locale): Promise<EventItem[]> {
  const url = process.env.EVENTS_SHEET_CSV_URL?.trim();
  if (!url) return EVENTS[locale];
  try {
    const response = await fetch(url, { next: { revalidate: EVENTS_REVALIDATE, tags: [EVENTS_TAG] } });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const text = await response.text();
    if (/^\s*</.test(text)) throw new Error("réponse HTML : la feuille est-elle publiée en CSV ?");
    const { events, skipped } = eventsFromCsv(text, SUBSIDIARIES);
    if (skipped.length) console.warn(`[agenda] ${skipped.length} remarque(s) :\n- ${skipped.join("\n- ")}`);
    lastGoodEvents.fr = events.fr;
    lastGoodEvents.en = events.en;
    return events[locale];
  } catch (error) {
    const fallback = lastGoodEvents[locale];
    console.error(
      `[agenda] feuille Google Sheets illisible : ${error instanceof Error ? error.message : error} — ` +
        (fallback ? "dernier agenda lu conservé" : `repli sur content/${locale}/events.json`),
    );
    return fallback ?? EVENTS[locale];
  }
}

export async function getEvents(locale: Locale, includePast = false): Promise<EventItem[]> {
  const now = Date.now();
  const events = await loadEvents(locale);
  const sorted = [...events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
  if (includePast) return sorted;
  return sorted.filter((e) => new Date(e.date).getTime() >= now);
}

export async function getPastEvents(locale: Locale): Promise<EventItem[]> {
  const now = Date.now();
  return (await loadEvents(locale))
    .filter((e) => new Date(e.date).getTime() < now)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getGalleryItems(locale: Locale): GalleryItem[] {
  return GALLERY[locale];
}

/** FAQ d'une maison (dress code, privatisation, âge minimum) — vide si non renseignée. */
export function getSubsidiaryFaq(
  locale: Locale,
  slug: string,
): SubsidiaryFaqItem[] {
  const houses = FAQ[locale]?.houses;
  if (!houses) return [];
  const normalized = normalizeSubsidiarySlug(slug);
  return houses[normalized] ?? houses[slug] ?? [];
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
