import { EventsList } from "@/components/events/EventsList";
import { PageHero } from "@/components/sections/PageHero";
import { PageSection } from "@/components/layout/PageSection";
import { SectionWave } from "@/components/layout/SectionWave";
import { getEvents, getPastEvents } from "@/lib/content";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Événements",
  description:
    "Soirées, expériences et activités des établissements Cen21 Hospitality.",
  path: "/evenements",
});

export default function EventsPage() {
  const upcoming = getEvents(false);
  const past = getPastEvents();

  return (
    <>
      <PageHero
        eyebrow="Agenda"
        title="Événements"
        description="Découvrez les prochaines soirées et expériences de nos filiales."
      />
      <PageSection variant="default">
        <EventsList events={upcoming} pastEvents={past} />
      </PageSection>

      <SectionWave fill="petrol" />
    </>
  );
}
