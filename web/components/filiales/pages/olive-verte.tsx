import { KLoungeMarqueeGallery } from "@/components/filiales/KLoungeMarqueeGallery";
import { OliveMotifs } from "@/components/filiales/OliveMotifs";
import { OliveVerteEventsSection } from "@/components/filiales/OliveVerteEventsSection";
import { OliveVerteHero } from "@/components/filiales/OliveVerteHero";
import { OliveVerteMenuSection } from "@/components/filiales/OliveVerteMenuSection";
import { OliveVerteMotifs } from "@/components/filiales/OliveVerteMotifs";
import { OliveVerteReservationSection } from "@/components/filiales/OliveVerteReservationSection";
import { OliveVerteSpecialties } from "@/components/filiales/OliveVerteSpecialties";
import { WabiSabiEstablishmentsSection } from "@/components/filiales/WabiSabiEstablishmentsSection";
import { MapEmbed } from "@/components/maps/MapEmbed";
import { getSubsidiaryContactImage } from "@/lib/subsidiary-contact-images";

import type { FilialeContext } from "./context";
import { EditorialAbout, EventShowcase, MobileActions, ReadingProgressBar } from "./sections";

/** L'Olive Verte (filiale-01) — composition actuelle, avant sa refonte (R11). */
export function OliveVertePage(ctx: FilialeContext) {
  const { slug, subsidiary, galleryItems, events, sisterSubsidiaries, mapQuery, t } = ctx;
  return (
    <>
      <ReadingProgressBar {...ctx} />
      <OliveVerteHero subsidiary={subsidiary} />
      {subsidiary.specialtiesSection && <OliveVerteSpecialties content={subsidiary.specialtiesSection} />}
      {galleryItems.length > 0 && (
        <div style={{ position: "relative", overflow: "hidden" }}>
          <OliveMotifs section="gallery" />
          <KLoungeMarqueeGallery
            items={galleryItems}
            title={t("gallery")}
            description={t("oliveVerteGallery.description")}
          />
        </div>
      )}
      {subsidiary.menuCategoriesSection && <OliveVerteMenuSection content={subsidiary.menuCategoriesSection} />}
      <OliveVerteEventsSection events={events} fallbackImage={subsidiary.coverImage} />
      <OliveVerteReservationSection
        backgroundImage={getSubsidiaryContactImage(slug, subsidiary.coverImage)}
        subsidiaryName={subsidiary.name}
        phone={subsidiary.practicalInfo.phone}
      />
      {sisterSubsidiaries.length > 0 && (
        <WabiSabiEstablishmentsSection
          subsidiaries={sisterSubsidiaries}
          title={t("wabiEstablishments.title")}
          description={t("wabiEstablishments.description")}
          variant="olive-verte"
          decorativeSlot={
            <>
              <OliveVerteMotifs />
              <OliveMotifs section="establishments" />
            </>
          }
        />
      )}
      <EventShowcase {...ctx} />
      <EditorialAbout {...ctx} />
      <section className="relative overflow-hidden mx-auto max-w-7xl px-4 pb-16 md:px-6 md:pb-20 flex justify-center">
        <OliveVerteMotifs />
        <OliveMotifs section="map" />
        <MapEmbed query={mapQuery} title={t("mapTitle", { name: subsidiary.name })} variant="compact" />
      </section>
      <MobileActions {...ctx} />
    </>
  );
}
