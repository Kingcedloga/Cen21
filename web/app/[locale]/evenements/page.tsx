import { getTranslations, setRequestLocale } from "next-intl/server";

import { EventsList } from "@/components/events/EventsList";
import { EventsCountdownHero } from "@/components/sections/EventsCountdownHero";
import { PageSection } from "@/components/layout/PageSection";
import type { Locale } from "@/i18n/routing";
import { getEvents, getPastEvents } from "@/lib/content";
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
  const upcoming = getEvents(l, false);
  const past = getPastEvents(l);

  return (
    <>
      <EventsCountdownHero
        events={upcoming}
        fallbackImage={FALLBACK_HERO_IMAGE}
        labels={{
          comingSoonFallback: t("hero.comingSoonFallback"),
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
      <PageSection variant="default">
        <EventsList events={upcoming} pastEvents={past} />
      </PageSection>
    </>
  );
}
