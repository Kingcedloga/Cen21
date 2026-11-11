import { MillionaireClubIntroSection } from "@/components/filiales/MillionaireClubIntroSection";
import { MillionaireClubScatteredGallery } from "@/components/filiales/MillionaireClubScatteredGallery";
import { SubsidiaryEditorialAbout } from "@/components/filiales/SubsidiaryEditorialAbout";
import { WabiSabiEstablishmentsSection } from "@/components/filiales/WabiSabiEstablishmentsSection";

import type { FilialeContext } from "./context";
import {
  DefaultHero,
  EventShowcase,
  MobileActions,
  ReadingProgressBar,
  StandardEvents,
  StandardMap,
} from "./sections";

/** Millionaire Club (filiale-04) — composition actuelle, avant sa refonte (R8). */
export function MillionaireClubPage(ctx: FilialeContext) {
  const { subsidiary, galleryItems, sisterSubsidiaries, useEventShowcase, t } = ctx;
  return (
    <>
      <ReadingProgressBar {...ctx} />
      <DefaultHero {...ctx} />
      <MillionaireClubIntroSection
        name={subsidiary.name}
        brandLogo={subsidiary.brandLogo}
        tagline={subsidiary.tagline}
        social={subsidiary.social}
        accentColor={subsidiary.accentColor}
      />
      <EventShowcase {...ctx} />
      {subsidiary.aboutSection && (
        <section className="subsidiary-about-after-band mx-auto max-w-7xl px-4 pb-16 md:px-6 md:pb-20">
          <SubsidiaryEditorialAbout content={subsidiary.aboutSection} variant="luxury-dark" />
        </section>
      )}
      {galleryItems.length > 0 && (
        <MillionaireClubScatteredGallery items={galleryItems} title={t("gallery")} description={t("galleryDescription")} />
      )}
      {sisterSubsidiaries.length > 0 && (
        <WabiSabiEstablishmentsSection
          subsidiaries={sisterSubsidiaries}
          title={t("wabiEstablishments.title")}
          description={t("wabiEstablishments.description")}
          variant="millionaire-club"
        />
      )}
      {!useEventShowcase && <StandardEvents {...ctx} />}
      <StandardMap {...ctx} />
      <MobileActions {...ctx} />
    </>
  );
}
