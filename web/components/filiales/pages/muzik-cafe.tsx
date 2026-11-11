import { MuzikCafeContactMapSection } from "@/components/filiales/MuzikCafeContactMapSection";
import { MuzikCafeEventsSection } from "@/components/filiales/MuzikCafeEventsSection";
import { MuzikCafeGallerySection } from "@/components/filiales/MuzikCafeGallerySection";
import { MuzikCafeHero } from "@/components/filiales/MuzikCafeHero";
import { MuzikCafeMenuSection } from "@/components/filiales/MuzikCafeMenuSection";
import { MuzikCafeReservationSection } from "@/components/filiales/MuzikCafeReservationSection";
import { WabiSabiEstablishmentsSection } from "@/components/filiales/WabiSabiEstablishmentsSection";
import { getSubsidiaryContactImage } from "@/lib/subsidiary-contact-images";

import type { FilialeContext } from "./context";
import { EditorialAbout, EventShowcase, MobileActions, ReadingProgressBar } from "./sections";

/** Café Muzik (filiale-05) — composition actuelle, avant sa refonte (R10). */
export function MuzikCafePage(ctx: FilialeContext) {
  const { slug, subsidiary, events, sisterSubsidiaries, mapQuery, t } = ctx;
  return (
    <>
      <ReadingProgressBar {...ctx} />
      <MuzikCafeHero subsidiary={subsidiary} />
      {subsidiary.muzikMenuSection && <MuzikCafeMenuSection content={subsidiary.muzikMenuSection} />}
      {subsidiary.muzikGallerySection && <MuzikCafeGallerySection content={subsidiary.muzikGallerySection} />}
      {sisterSubsidiaries.length > 0 && (
        <WabiSabiEstablishmentsSection
          subsidiaries={sisterSubsidiaries}
          title={t("wabiEstablishments.title")}
          description={t("wabiEstablishments.description")}
          variant="muzik-cafe"
        />
      )}
      <MuzikCafeReservationSection
        backgroundImage={getSubsidiaryContactImage(slug, subsidiary.coverImage)}
        subsidiaryName={subsidiary.name}
        phone={subsidiary.practicalInfo.phone}
      />
      <EventShowcase {...ctx} />
      <EditorialAbout {...ctx} />
      <MuzikCafeEventsSection
        events={events}
        title={t("muzikCafeEvents.title")}
        ctaLabel={t("muzikCafeEvents.ctaLabel")}
        fallbackImage={subsidiary.coverImage}
      />
      <MuzikCafeContactMapSection mapQuery={mapQuery} subsidiaryName={subsidiary.name} />
      <MobileActions {...ctx} />
    </>
  );
}
