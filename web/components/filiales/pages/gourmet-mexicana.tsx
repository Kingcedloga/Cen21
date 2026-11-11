import { GourmetMexicanaAboutSection } from "@/components/filiales/GourmetMexicanaAboutSection";
import { GourmetMexicanaCategoriesSection } from "@/components/filiales/GourmetMexicanaCategoriesSection";
import { GourmetMexicanaContactMapSection } from "@/components/filiales/GourmetMexicanaContactMapSection";
import { GourmetMexicanaEventsSection } from "@/components/filiales/GourmetMexicanaEventsSection";
import { GourmetMexicanaHero } from "@/components/filiales/GourmetMexicanaHero";
import { GourmetMexicanaPromotionsSection } from "@/components/filiales/GourmetMexicanaPromotionsSection";
import { GourmetMexicanaReservationSection } from "@/components/filiales/GourmetMexicanaReservationSection";
import { KLoungeMarqueeGallery } from "@/components/filiales/KLoungeMarqueeGallery";
import { MexicanMotifs } from "@/components/filiales/MexicanMotifs";
import { WabiSabiEstablishmentsSection } from "@/components/filiales/WabiSabiEstablishmentsSection";
import { galleryEntrySrc } from "@/lib/gallery-categories";

import type { FilialeContext } from "./context";
import { EditorialAbout, EventShowcase, MobileActions, ReadingProgressBar } from "./sections";

/** Gourmet Mexicana (filiale-07) — composition actuelle, avant sa refonte (R12). */
export function GourmetMexicanaPage(ctx: FilialeContext) {
  const { subsidiary, events, sisterSubsidiaries, mapQuery, mapsUrl, t } = ctx;
  const galleryItems = subsidiary.galleryImages.map((entry, i) => ({
    id: `gm-${i + 1}`,
    src: galleryEntrySrc(entry),
    alt: `${subsidiary.name} — ${i + 1}`,
    tags: [] as string[],
  }));
  return (
    <>
      <ReadingProgressBar {...ctx} />
      <GourmetMexicanaHero subsidiary={subsidiary} />
      <GourmetMexicanaCategoriesSection />
      <GourmetMexicanaAboutSection subsidiary={subsidiary} />
      {sisterSubsidiaries.length > 0 && (
        <WabiSabiEstablishmentsSection
          subsidiaries={sisterSubsidiaries}
          eyebrow={t("wabiEstablishments.eyebrow")}
          title={t("wabiEstablishments.title")}
          description={t("wabiEstablishments.description")}
          variant="gourmet-mexicana"
          decorativeSlot={<MexicanMotifs variant="establishments" />}
        />
      )}
      <div style={{ position: "relative", overflow: "hidden" }}>
        <MexicanMotifs variant="gallery" />
        <KLoungeMarqueeGallery
          items={galleryItems}
          title={t("gallery")}
          description={t("gourmetMexicanaGallery.description")}
          eyebrow={t("gourmetMexicanaGallery.eyebrow")}
        />
      </div>
      <GourmetMexicanaEventsSection events={events} authorName={subsidiary.name} fallbackImage={subsidiary.coverImage} />
      <GourmetMexicanaPromotionsSection />
      <GourmetMexicanaReservationSection />
      <GourmetMexicanaContactMapSection mapQuery={mapQuery} mapsUrl={mapsUrl} />
      <EventShowcase {...ctx} />
      <EditorialAbout {...ctx} />
      <MobileActions {...ctx} />
    </>
  );
}
