import { getTranslations } from "next-intl/server";

import { HomeEventsDeck, type DeckEvent } from "@/components/sections/home/HomeEventsDeck";
import type { Locale } from "@/i18n/routing";
import { getEvents, getPastEvents } from "@/lib/content";
import type { EventItem } from "@/lib/types";

/** Cartes de la pile sur une fiche. */
const DECK_SIZE = 5;

/**
 * Rendez-vous de la maison : la pile épinglée de l'accueil (à venir d'abord,
 * complétée par les plus récents passés), lien vers l'agenda filtré sur la
 * maison (`/evenements?maison=…`). Rien si la maison n'a aucun événement.
 */
export async function FilialeEvents({ slug, name, locale }: { slug: string; name: string; locale: Locale }) {
  const t = await getTranslations("filiale");
  const tHome = await getTranslations("home");
  const ofHouse = (event: EventItem) => event.subsidiarySlug === slug;
  const upcoming = getEvents(locale).filter(ofHouse);
  const past = getPastEvents(locale).filter(ofHouse);
  const source = [
    ...upcoming.map((event) => ({ event, status: "upcoming" as const })),
    ...past.map((event) => ({ event, status: "past" as const })),
  ].slice(0, DECK_SIZE);
  if (source.length === 0) return null;

  const dateFormat = new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  const events: DeckEvent[] = source.map(({ event, status }) => ({
    id: event.id,
    title: event.displayTitle ?? event.title,
    dateLabel: dateFormat.format(new Date(event.date)),
    dateTime: event.date,
    location: event.location,
    excerpt: event.excerpt,
    image: event.image,
    status,
  }));

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
