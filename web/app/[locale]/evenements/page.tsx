import { getTranslations, setRequestLocale } from "next-intl/server";

import { EventsList } from "@/components/events/EventsList";
import { PageHero } from "@/components/sections/PageHero";
import { PageSection } from "@/components/layout/PageSection";
import { SectionWave } from "@/components/layout/SectionWave";
import type { Locale } from "@/i18n/routing";
import { getEvents, getPastEvents } from "@/lib/content";
import { createPageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "events" });
  return createPageMetadata({
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
      <PageHero eyebrow={t("eyebrow")} title={t("title")} description={t("description")} />
      <PageSection variant="default">
        <EventsList events={upcoming} pastEvents={past} />
      </PageSection>
      <SectionWave fill="petrol" />
    </>
  );
}
