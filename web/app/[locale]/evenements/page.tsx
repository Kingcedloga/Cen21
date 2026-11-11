import { getTranslations, setRequestLocale } from "next-intl/server";

import { EventsAgenda, type AgendaEvent } from "@/components/events/EventsAgenda";
import { EventsHero, type HeroEvent } from "@/components/events/EventsHero";
import { EventsNewsletter } from "@/components/events/EventsNewsletter";
import { HeroCurtain } from "@/components/layout/HeroCurtain";
import { SECTION_SURFACE } from "@/components/layout/PageSection";
import { SectionBlend } from "@/components/layout/SectionBlend";
import { HomeEventsDeck, type DeckEvent } from "@/components/sections/home/HomeEventsDeck";
import { PageOutro } from "@/components/sections/PageOutro";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Locale } from "@/i18n/routing";
import { getEvents, getPastEvents, getSubsidiaries } from "@/lib/content";
import { resolveEventImage } from "@/lib/event-images";
import { resolvePageMetadata } from "@/lib/seo";
import { getSubsidiaryHref, isSubsidiaryExternalLink } from "@/lib/subsidiary-links";
import type { EventItem } from "@/lib/types";

const FALLBACK_HERO_IMAGE =
  "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=2400&q=85";

/** Cartes de la pile « Les prochains rendez-vous » (la suite est dans l'agenda). */
const DECK_SIZE = 5;

/** Formulaire de contact prérempli : réservation dans la maison de l'événement. */
function reserveHref(event: EventItem) {
  return `/contact?besoin=reservation&maison=${event.subsidiarySlug}#contact-form`;
}

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "events" });
  return resolvePageMetadata({
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/evenements",
    locale: locale as Locale,
  });
}

export default async function EventsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const l = locale as Locale;
  const t = await getTranslations("events");
  const tHome = await getTranslations("home");
  const tNav = await getTranslations("nav");
  const tCommon = await getTranslations("common");
  const tContact = await getTranslations("contact");
  const tOutro = await getTranslations("outro");
  const tCta = await getTranslations("cta");
  const upcoming = getEvents(l, false);
  const past = getPastEvents(l);
  const subsidiaries = getSubsidiaries(l);
  const houseOf = (slug: string) => subsidiaries.find((s) => s.slug === slug);

  // Dates mises en forme ici (fuseau du serveur, comme sur l'accueil) : pas
  // d'écart entre le HTML serveur et le client.
  const intl = l === "fr" ? "fr-FR" : "en-GB";
  const full = new Intl.DateTimeFormat(intl, { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });
  const fullWithYear = new Intl.DateTimeFormat(intl, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const dayNumber = new Intl.DateTimeFormat(intl, { day: "numeric" });
  const weekday = new Intl.DateTimeFormat(intl, { weekday: "short" });
  const month = new Intl.DateTimeFormat(intl, { month: "long", year: "numeric" });

  const titleOf = (event: EventItem) => event.displayTitle?.trim() || event.title;

  const toAgenda = (event: EventItem, status: AgendaEvent["status"]): AgendaEvent => {
    const date = new Date(event.date);
    const house = houseOf(event.subsidiarySlug);
    const title = titleOf(event);
    return {
      id: event.id,
      title,
      dateTime: event.date,
      dateLabel: status === "upcoming" ? full.format(date) : fullWithYear.format(date),
      day: dayNumber.format(date),
      weekday: weekday.format(date),
      monthKey: event.date.slice(0, 7),
      monthLabel: month.format(date),
      location: event.location,
      houseSlug: event.subsidiarySlug,
      image: resolveEventImage(event, house?.coverImage ?? FALLBACK_HERO_IMAGE),
      excerpt: event.excerpt,
      status,
      action:
        status === "upcoming" || !house
          ? { href: reserveHref(event), label: t("reserve"), ariaLabel: t("reserveAria", { title }), external: false }
          : {
              href: getSubsidiaryHref(house),
              label: t("seeHouse"),
              ariaLabel: tCommon("discover", { name: house.name }),
              external: isSubsidiaryExternalLink(house),
            },
    };
  };

  const agendaUpcoming = upcoming.map((event) => toAgenda(event, "upcoming"));
  const agendaPast = past.map((event) => toAgenda(event, "past"));
  // Filtres : les maisons qui ont au moins un événement, dans l'ordre du groupe.
  const houses = subsidiaries
    .filter((s) => upcoming.some((e) => e.subsidiarySlug === s.slug) || past.some((e) => e.subsidiarySlug === s.slug))
    .map((s) => ({ slug: s.slug, name: s.name }));

  // Le prochain rendez-vous passe à l'affiche du hero.
  const next = upcoming[0];
  const nextEvent: HeroEvent | null = next
    ? {
        title: titleOf(next),
        details: [full.format(new Date(next.date)), next.location].filter(Boolean).join(" · "),
        dateTime: next.date,
        image: resolveEventImage(next, FALLBACK_HERO_IMAGE),
        reserve: { href: reserveHref(next), label: t("reserve") },
      }
    : null;

  const deckEvents: DeckEvent[] = upcoming.slice(0, DECK_SIZE).map((event) => ({
    id: event.id,
    title: titleOf(event),
    dateLabel: full.format(new Date(event.date)),
    dateTime: event.date,
    location: event.location,
    excerpt: event.excerpt,
    image: resolveEventImage(event, houseOf(event.subsidiarySlug)?.coverImage ?? FALLBACK_HERO_IMAGE),
    status: "upcoming",
  }));

  const newsletterLabels = {
    subscribeText: t("hero.subscribeText"),
    emailPlaceholder: t("hero.emailPlaceholder"),
    subscribeCta: t("hero.subscribeCta"),
    subscribing: t("hero.subscribing"),
    subscribeSuccess: t("hero.subscribeSuccess"),
    subscribeError: t("hero.subscribeError"),
  };

  const agenda = (
    <EventsAgenda
      upcoming={agendaUpcoming}
      past={agendaPast}
      houses={houses}
      heading={{ eyebrow: t("eyebrow"), title: t("agendaTitle"), sweep: t("agendaSweep") }}
      newTab={tContact("newTab")}
    />
  );

  return (
    <>
      <HeroCurtain
        surface={deckEvents.length > 0 ? SECTION_SURFACE.default : SECTION_SURFACE.dark}
        hero={
          <EventsHero
            className="hero-curtain__hero"
            nextEvent={nextEvent}
            fallbackImage={FALLBACK_HERO_IMAGE}
            breadcrumb={{ label: tCommon("breadcrumb"), home: tNav("home"), current: tNav("events") }}
            labels={{
              ...newsletterLabels,
              eyebrow: t("eyebrow"),
              nextEyebrow: t("hero.nextEyebrow"),
              emptyTitle: t("emptyAgendaTitle"),
              emptyDescription: t("emptyAgendaBody"),
              countdownLabel: t("hero.countdownLabel"),
              daysLabel: t("hero.daysLabel"),
              hoursLabel: t("hero.hoursLabel"),
              minutesLabel: t("hero.minutesLabel"),
              secondsLabel: t("hero.secondsLabel"),
            }}
          />
        }
      >
        {/* Les prochains rendez-vous en pile qui se décolle (pile de l'accueil). */}
        {deckEvents.length > 0 ? (
          <HomeEventsDeck
            titleId="events-deck-title"
            eyebrow={t("deckEyebrow")}
            title={t("deckTitle")}
            titleSweep={t("deckSweep")}
            statusLabels={{ upcoming: tHome("eventsStatusUpcoming"), past: tHome("eventsStatusPast") }}
            cta={{ href: "#agenda", label: t("deckCta"), native: true }}
            events={deckEvents}
          />
        ) : (
          agenda
        )}
      </HeroCurtain>

      {deckEvents.length > 0 && (
        <>
          <SectionBlend from={SECTION_SURFACE.default} to={SECTION_SURFACE.dark} />
          {agenda}
        </>
      )}

      {/* Inscription à l'agenda (dans le hero quand rien n'est programmé). */}
      {nextEvent && (
        <>
          <SectionBlend from={SECTION_SURFACE.dark} to={SECTION_SURFACE.default} />
          <section data-surface="dark" aria-labelledby="newsletter-title" className="bg-petrol px-4 py-20 md:px-8 md:py-28">
            <div className="mx-auto grid max-w-[min(100%,1400px)] gap-10 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-7">
                <SectionHeading
                  look="editorial"
                  eyebrow={t("newsletterEyebrow")}
                  title={t("newsletterTitle")}
                  sweep={t("newsletterSweep")}
                  description={t("newsletterText")}
                  titleAs="h2"
                  titleId="newsletter-title"
                  align="left"
                  className="mb-0!"
                />
              </div>
              <EventsNewsletter labels={newsletterLabels} className="lg:col-span-5 lg:justify-self-end" />
            </div>
          </section>
        </>
      )}

      {/* Sans newsletter, l'agenda a déjà la couleur de la bande de clôture. */}
      {nextEvent && <SectionBlend from={SECTION_SURFACE.default} to="var(--color-anthracite)" />}

      <PageOutro
        eyebrow={tOutro("eyebrow")}
        title={tOutro("eventsTitle")}
        titleSweep={tOutro("eventsSweep")}
        primary={{ href: "/contact", label: tCta("contact") }}
        next={{ href: "/galerie", label: tOutro("next"), title: tNav("gallery") }}
      />
    </>
  );
}
