import siteData from "@/content/site.json";
import statsData from "@/content/stats.json";
import aboutData from "@/content/about.json";
import subsidiariesData from "@/content/subsidiaries.json";
import eventsData from "@/content/events.json";
import galleryData from "@/content/gallery.json";

import type {
  AboutContent,
  EventItem,
  GalleryItem,
  SiteConfig,
  StatsContent,
  Subsidiary,
} from "./types";

export function getSiteConfig(): SiteConfig {
  return siteData as SiteConfig;
}

export function getStatsContent(): StatsContent {
  return statsData as StatsContent;
}

export function getAboutContent(): AboutContent {
  return aboutData as AboutContent;
}

export function getSubsidiaries(): Subsidiary[] {
  return subsidiariesData.subsidiaries as Subsidiary[];
}

export function getFeaturedSubsidiaries(): Subsidiary[] {
  return getSubsidiaries().filter((s) => s.featured);
}

export function getSubsidiaryBySlug(slug: string): Subsidiary | undefined {
  return getSubsidiaries().find((s) => s.slug === slug);
}

export function getAllSubsidiarySlugs(): string[] {
  return getSubsidiaries().map((s) => s.slug);
}

export function getEvents(includePast = false): EventItem[] {
  const now = Date.now();
  const events = eventsData.events as EventItem[];
  const sorted = [...events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
  if (includePast) return sorted;
  return sorted.filter((e) => new Date(e.date).getTime() >= now);
}

export function getPastEvents(): EventItem[] {
  const now = Date.now();
  return (eventsData.events as EventItem[])
    .filter((e) => new Date(e.date).getTime() < now)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getEventsBySubsidiary(slug: string): EventItem[] {
  return getEvents(true).filter((e) => e.subsidiarySlug === slug);
}

export function getUpcomingEventsBySubsidiary(slug: string): EventItem[] {
  return getEvents(false).filter((e) => e.subsidiarySlug === slug);
}

export function getGalleryItems(): GalleryItem[] {
  return galleryData.items as GalleryItem[];
}

export function getGalleryBySubsidiary(slug: string): GalleryItem[] {
  return getGalleryItems().filter((i) => i.subsidiarySlug === slug);
}

export const SECTOR_LABELS: Record<string, string> = {
  restaurant: "Restaurant",
  bar: "Bar",
  lounge: "Lounge",
  nightclub: "Boîte de nuit",
  evenementiel: "Événementiel",
};
