import { KLoungeIntroSection } from "@/components/filiales/KLoungeIntroSection";
import { KLoungeMarqueeGallery } from "@/components/filiales/KLoungeMarqueeGallery";
import { KLoungeReservationBanner } from "@/components/filiales/KLoungeReservationBanner";
import { WabiSabiEstablishmentsSection } from "@/components/filiales/WabiSabiEstablishmentsSection";
import { getSubsidiaryContactImage } from "@/lib/subsidiary-contact-images";

import type { FilialeContext } from "./context";
import {
  DefaultHero,
  EditorialAbout,
  EventShowcase,
  MobileActions,
  ReadingProgressBar,
  StandardEvents,
  StandardMap,
} from "./sections";

/** K Lounge (filiale-03) — composition actuelle, avant sa refonte (R7). */
export function KLoungePage(ctx: FilialeContext) {
  const { slug, subsidiary, galleryItems, sisterSubsidiaries, useEventShowcase, t } = ctx;
  return (
    <>
      <ReadingProgressBar {...ctx} />
      <DefaultHero {...ctx} />
      {subsidiary.introSection && <KLoungeIntroSection content={subsidiary.introSection} />}
      <EventShowcase {...ctx} />
      <KLoungeReservationBanner
        backgroundImage={getSubsidiaryContactImage(slug, subsidiary.coverImage)}
        eyebrow={t("kLoungeReservation.eyebrow")}
        title={t("kLoungeReservation.title")}
        ctaLabel={t("kLoungeReservation.cta")}
        ctaHref="/contact"
        locations={subsidiary.practicalInfo.locations}
      />
      {sisterSubsidiaries.length > 0 && (
        <WabiSabiEstablishmentsSection
          subsidiaries={sisterSubsidiaries}
          title={t("wabiEstablishments.title")}
          description={t("wabiEstablishments.description")}
          variant="k-lounge"
        />
      )}
      {galleryItems.length > 0 && (
        <KLoungeMarqueeGallery items={galleryItems} title={t("gallery")} description={t("kLoungeGallery.description")} />
      )}
      <EditorialAbout {...ctx} />
      {!useEventShowcase && <StandardEvents {...ctx} />}
      <StandardMap {...ctx} />
      <MobileActions {...ctx} />
    </>
  );
}
