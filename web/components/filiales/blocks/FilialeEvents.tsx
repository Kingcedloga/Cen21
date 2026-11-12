import { getTranslations } from "next-intl/server";

import { HomeEventsDeck, type DeckEvent } from "@/components/sections/home/HomeEventsDeck";
import type { Locale } from "@/i18n/routing";
import { getEvents, getPastEvents } from "@/lib/content";
import type { EventItem } from "@/lib/types";

/** Cartes de la pile sur une fiche. */
const DECK_SIZE = 5;

/**
 * Événements de la maison pour la pile : à venir d'abord, complétés par les
 * plus récents passés. Vide si la maison n'en a aucun (la fiche saute alors
 * la section et ses fondus).
 */
export function filialeDeckEvents(locale: Locale, slug: string): DeckEvent[] {
  const ofHouse = (event: EventItem) => event.subsidiarySlug === slug;
  const source = [
    ...getEvents(locale).filter(ofHouse).map((event) => ({ event, status: "upcoming" as const })),
    ...getPastEvents(locale).filter(ofHouse).map((event) => ({ event, status: "past" as const })),
  ].slice(0, DECK_SIZE);
  const dateFormat = new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  return source.map(({ event, status }) => ({
    id: event.id,
    title: event.displayTitle ?? event.title,
    dateLabel: dateFormat.format(new Date(event.date)),
    dateTime: event.date,
    location: event.location,
    excerpt: event.excerpt,
    image: event.image,
    status,
  }));
}

/**
 * Rendez-vous de la maison : la pile épinglée de l'accueil, lien vers
 * l'agenda filtré sur la maison (`/evenements?maison=…`).
 */
export async function FilialeEvents({ slug, name, events }: { slug: string; name: string; events: DeckEvent[] }) {
  const t = await getTranslations("filiale");
  const tHome = await getTranslations("home");
  if (events.length === 0) return null;
  return (
    <HomeEventsDeck
      eyebrow={t("eventsEyebrow")}
      title={t("eventsTitle", { name })}
      titleSweep={name}
      statusLabels={{ upcoming: tHome("eventsStatusUpcoming"), past: tHome("eventsStatusPast") }}
      cta={{ href: `/evenements?maison=${slug}`, label: t("eventsCta") }}
      events={events}
      titleId="filiale-events-title"
    />
  );
}
