import { getTranslations, setRequestLocale } from "next-intl/server";

import { EventsHero, type HeroEvent } from "@/components/events/EventsHero";
import { EventsList } from "@/components/events/EventsList";
import { HeroCurtain } from "@/components/layout/HeroCurtain";
import { PageSection } from "@/components/layout/PageSection";
import { SectionBlend } from "@/components/layout/SectionBlend";
import { PageOutro } from "@/components/sections/PageOutro";
import type { Locale } from "@/i18n/routing";
import { getEvents, getPastEvents } from "@/lib/content";
import { resolveEventImage } from "@/lib/event-images";
import { resolvePageMetadata } from "@/lib/seo";

const FALLBACK_HERO_IMAGE =
  "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=2400&q=85";

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
  const tNav = await getTranslations("nav");
  const tCommon = await getTranslations("common");
  const tOutro = await getTranslations("outro");
  const tCta = await getTranslations("cta");
  const upcoming = getEvents(l, false);
  const past = getPastEvents(l);

  // Le prochain rendez-vous passe à l'affiche du hero.
  const next = upcoming[0];
  const dateFormat = new Intl.DateTimeFormat(l === "fr" ? "fr-FR" : "en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
  const nextEvent: HeroEvent | null = next
    ? {
        title: next.displayTitle?.trim() || next.title,
        details: [dateFormat.format(new Date(next.date)), next.location].filter(Boolean).join(" · "),
        dateTime: next.date,
        image: resolveEventImage(next, FALLBACK_HERO_IMAGE),
      }
    : null;

  return (
    <>
      <HeroCurtain
        surface="var(--color-petrol)"
        hero={
          <EventsHero
            className="hero-curtain__hero"
            nextEvent={nextEvent}
            fallbackImage={FALLBACK_HERO_IMAGE}
            breadcrumb={{ label: tCommon("breadcrumb"), home: tNav("home"), current: tNav("events") }}
            labels={{
              eyebrow: t("eyebrow"),
              nextEyebrow: t("hero.nextEyebrow"),
              title: t("title"),
              description: t("description"),
              countdownLabel: t("hero.countdownLabel"),
              daysLabel: t("hero.daysLabel"),
              hoursLabel: t("hero.hoursLabel"),
              minutesLabel: t("hero.minutesLabel"),
              secondsLabel: t("hero.secondsLabel"),
              subscribeText: t("hero.subscribeText"),
              emailPlaceholder: t("hero.emailPlaceholder"),
              subscribeCta: t("hero.subscribeCta"),
              subscribing: t("hero.subscribing"),
              subscribeSuccess: t("hero.subscribeSuccess"),
              subscribeError: t("hero.subscribeError"),
            }}
          />
        }
      >
        <PageSection variant="default">
          <EventsList events={upcoming} pastEvents={past} />
        </PageSection>
      </HeroCurtain>

      <SectionBlend from="var(--color-petrol)" to="var(--color-anthracite)" />

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
