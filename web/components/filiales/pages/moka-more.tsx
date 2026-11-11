import { MokaMoreAboutSection } from "@/components/filiales/MokaMoreAboutSection";
import { MokaMoreEventsSection } from "@/components/filiales/MokaMoreEventsSection";
import { MokaMoreGallerySection } from "@/components/filiales/MokaMoreGallerySection";
import { MokaMoreHero } from "@/components/filiales/MokaMoreHero";
import { MokaMoreQuoteSection } from "@/components/filiales/MokaMoreQuoteSection";
import { MokaMoreReservationSection } from "@/components/filiales/MokaMoreReservationSection";
import { MokaMoreVideoSection } from "@/components/filiales/MokaMoreVideoSection";
import { MuzikCafeContactMapSection } from "@/components/filiales/MuzikCafeContactMapSection";
import { WabiSabiEstablishmentsSection } from "@/components/filiales/WabiSabiEstablishmentsSection";
import { galleryEntrySrc } from "@/lib/gallery-categories";

import type { FilialeContext } from "./context";
import { EditorialAbout, EventShowcase, MobileActions, ReadingProgressBar } from "./sections";

/** Moka & More (filiale-06) — composition actuelle, avant sa refonte (R9). */
export function MokaMorePage(ctx: FilialeContext) {
  const { subsidiary, events, sisterSubsidiaries, mapQuery, t } = ctx;
  return (
    <>
      <ReadingProgressBar {...ctx} />
      <MokaMoreHero subsidiary={subsidiary} />
      <MokaMoreQuoteSection
        leftImage={subsidiary.coverImage}
        rightImage={galleryEntrySrc(subsidiary.galleryImages[0])}
      />
      <MokaMoreAboutSection subsidiary={subsidiary} />
      <MokaMoreReservationSection subsidiary={subsidiary} />
      <MokaMoreVideoSection
        backgroundImage={galleryEntrySrc(subsidiary.galleryImages[1] ?? subsidiary.coverImage)}
      />
      <MokaMoreGallerySection photos={subsidiary.galleryImages.map((entry) => galleryEntrySrc(entry))} />
      {sisterSubsidiaries.length > 0 && (
        <WabiSabiEstablishmentsSection
          subsidiaries={sisterSubsidiaries}
          title={t("wabiEstablishments.title")}
          description={t("wabiEstablishments.description")}
          variant="moka-more"
        />
      )}
      <EventShowcase {...ctx} />
      <EditorialAbout {...ctx} />
      <MokaMoreEventsSection events={events} fallbackImage={subsidiary.coverImage} />
      <MuzikCafeContactMapSection mapQuery={mapQuery} subsidiaryName={subsidiary.name} />
      <MobileActions {...ctx} />
    </>
  );
}
