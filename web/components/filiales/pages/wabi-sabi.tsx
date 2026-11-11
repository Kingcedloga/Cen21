import { WabiSabiBarShowcase } from "@/components/filiales/WabiSabiBarShowcase";
import { WabiSabiDiningShowcase } from "@/components/filiales/WabiSabiDiningShowcase";
import { WabiSabiEstablishmentsSection } from "@/components/filiales/WabiSabiEstablishmentsSection";
import { WabiSabiHero } from "@/components/filiales/WabiSabiHero";
import { WabiSabiImmersiveGallery } from "@/components/filiales/WabiSabiImmersiveGallery";
import { WabiSabiPhilosophySection } from "@/components/filiales/WabiSabiPhilosophySection";
import { WabiSabiPracticalSection } from "@/components/filiales/WabiSabiPracticalSection";
import { WabiSabiSpotlightSection } from "@/components/filiales/WabiSabiSpotlightSection";
import { cormorant } from "@/lib/fonts";

import type { FilialeContext } from "./context";
import { DefaultHero, EventShowcase, MobileActions, ReadingProgressBar, WabiEvents } from "./sections";

/** Wabi Sabi (filiale-02) — composition actuelle, avant sa refonte (R6, pilote). */
export function WabiSabiPage(ctx: FilialeContext) {
  const { subsidiary, heroVideo, galleryItems, sisterSubsidiaries, useEventShowcase, mapQuery, mapsUrl, t } = ctx;
  return (
    <>
      <ReadingProgressBar {...ctx} />
      {subsidiary.heroSection ? (
        <div className="wabi-sabi-intro-flow">
          <span className="wabi-sabi-intro-flow__atmosphere" aria-hidden />
          <WabiSabiHero name={subsidiary.name} hero={subsidiary.heroSection} backgroundVideo={heroVideo} />
          {subsidiary.philosophySection && (
            <WabiSabiPhilosophySection
              name={subsidiary.name}
              brandLogo={subsidiary.brandLogo}
              content={subsidiary.philosophySection}
              sectionLabel={t("wabiPhilosophy.sectionLabel")}
            />
          )}
          {subsidiary.diningSection && <WabiSabiDiningShowcase content={subsidiary.diningSection} />}
        </div>
      ) : (
        <DefaultHero {...ctx} />
      )}
      {subsidiary.barSection && <WabiSabiBarShowcase content={subsidiary.barSection} />}
      {subsidiary.spotlightSection && <WabiSabiSpotlightSection content={subsidiary.spotlightSection} />}
      <EventShowcase {...ctx} />
      <div className={`wabi-sabi-beige-flow ${cormorant.variable}`}>
        {sisterSubsidiaries.length > 0 && (
          <WabiSabiEstablishmentsSection
            subsidiaries={sisterSubsidiaries}
            title={t("wabiEstablishments.title")}
            description={t("wabiEstablishments.description")}
          />
        )}
        {galleryItems.length > 0 && (
          <WabiSabiImmersiveGallery items={galleryItems} title={t("gallery")} description={t("wabiGallery.description")} />
        )}
        {!useEventShowcase && <WabiEvents {...ctx} />}
      </div>
      <WabiSabiPracticalSection
        hours={subsidiary.practicalInfo.hours}
        address={subsidiary.practicalInfo.address}
        mapQuery={mapQuery}
        mapsUrl={subsidiary.practicalInfo.address ? mapsUrl : undefined}
        social={subsidiary.social}
        locations={subsidiary.practicalInfo.locations}
        labels={{
          hoursTitle: t("wabiPractical.hoursTitle"),
          locationTitle: t("wabiPractical.locationTitle"),
          bookTable: t("wabiPractical.bookTable"),
          getDirections: t("wabiPractical.getDirections"),
          closed: t("wabiPractical.closed"),
          socialLabel: t("wabiPractical.socialLabel"),
          mapTitle: t("mapTitle", { name: subsidiary.name }),
        }}
      />
      <MobileActions {...ctx} />
    </>
  );
}
