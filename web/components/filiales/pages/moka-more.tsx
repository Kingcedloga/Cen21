import { getTranslations } from "next-intl/server";

import { contactHouses, filialePhotos } from "@/components/filiales/blocks/data";
import { FilialeBrandStyle } from "@/components/filiales/blocks/FilialeBrandStyle";
import { FilialeCapsuleAction } from "@/components/filiales/blocks/FilialeCapsuleAction";
import { FilialeFaq } from "@/components/filiales/blocks/FilialeFaq";
import { FilialeOtherHouses } from "@/components/filiales/blocks/FilialeOtherHouses";
import { FilialePractical } from "@/components/filiales/blocks/FilialePractical";
import { FilialeReservation } from "@/components/filiales/blocks/FilialeReservation";
import { MokaAgenda } from "@/components/filiales/moka/MokaAgenda";
import { MokaHero } from "@/components/filiales/moka/MokaHero";
import { MokaManifesto } from "@/components/filiales/moka/MokaManifesto";
import { MokaMenu } from "@/components/filiales/moka/MokaMenu";
import { MokaTour } from "@/components/filiales/moka/MokaTour";
import { PageSection, SECTION_SURFACE } from "@/components/layout/PageSection";
import { SectionBlend } from "@/components/layout/SectionBlend";
import { getEvents, getSubsidiaryFaq } from "@/lib/content";
import { dynalight, nunito } from "@/lib/fonts";

import type { FilialeContext } from "./context";

/** Rendez-vous affichés dans l'agenda de la maison. */
const AGENDA_SIZE = 4;
/** Le lounge du soir (mur végétal) : la photo de la une. */
const HERO_IMAGE = "/filiales/photos/filiale-06/gallery/dsc09704.jpg";
/** Assiette détourée, au centre du badge « salles privées & banquets ». */
const BADGE_PLATE = "/filiales/photos/filiale-06/main-photo.png";

/** Aplat rouge de la maison (manifeste), pour les fondus qui l'encadrent. */
const SURFACE_RED = "var(--brand-fill)";

/**
 * Moka & More (filiale-06) — restaurant et lounge bar, sans les blocs
 * habituels des fiches pour le cœur de la page : la une (le nom comme le
 * logo, l'arche du lounge, le badge des salles privées) → le manifeste sur
 * aplat rouge → la carte du matin au soir sur fond blanc, et les atouts →
 * la visite du lieu, d'espace en espace → l'agenda → infos pratiques et FAQ
 * → réservation → autres maisons. Noir, rouge et blanc ; titres en capitales
 * rondes (Nunito), mots manuscrits en rouge (Dynalight). « Réserver » suit
 * la lecture dans la capsule.
 */
export async function MokaMorePage({ locale, subsidiary, pageTheme, mapQuery, mapsUrl }: FilialeContext) {
  const t = await getTranslations("filiale");
  const tMoka = await getTranslations("moka");
  const { slug, name } = subsidiary;
  const photos = filialePhotos(subsidiary, (n) => t("photoAlt", { name, n }));
  const events = getEvents(locale)
    .filter((event) => event.subsidiarySlug === slug)
    .slice(0, AGENDA_SIZE);
  const faq = getSubsidiaryFaq(locale, slug);
  const house = { slug, name, href: `/filiales/${slug}`, external: false };

  return (
    <>
      {pageTheme && (
        <FilialeBrandStyle
          theme={pageTheme}
          options={{
            titleFont: nunito.style.fontFamily,
            titleWeight: 800,
            titleTracking: { display: "-0.04em", section: "-0.03em" },
          }}
        />
      )}
      {/* Écriture manuscrite de la maison (« Lounge Bar » du logo), limitée à cette page. */}
      <style dangerouslySetInnerHTML={{ __html: `body{--moka-script:${dynalight.style.fontFamily}}` }} />
      {/* Habillage de la maison sur les blocs partagés (styles/moka.css). */}
      <div hidden data-filiale-moka="" />
      <FilialeCapsuleAction label={t("reserve")} heroSelector='[aria-labelledby="moka-hero-title"]' />

      <MokaHero
        name={name}
        tagline={subsidiary.tagline}
        hours={subsidiary.practicalInfo.hours}
        locale={locale}
        image={HERO_IMAGE}
        imageAlt={tMoka("heroImageAlt")}
        plate={BADGE_PLATE}
        mapsUrl={mapsUrl}
      />

      <SectionBlend from={SECTION_SURFACE.dark} to={SURFACE_RED} />
      <MokaManifesto label={tMoka("manifestoLabel")} text={tMoka("manifesto")} signature={name} />

      <SectionBlend from={SURFACE_RED} to={SECTION_SURFACE.light} />
      <MokaMenu moments={subsidiary.menuMoments ?? []} />

      <SectionBlend from={SECTION_SURFACE.light} to={SECTION_SURFACE.dark} />
      <MokaTour stops={subsidiary.venueTour ?? []} photos={photos} house={house} />

      {events.length > 0 && (
        <>
          <SectionBlend from={SECTION_SURFACE.dark} to={SECTION_SURFACE.default} />
          <PageSection ariaLabelledby="moka-agenda-title">
            <MokaAgenda events={events} locale={locale} slug={slug} />
          </PageSection>
          <SectionBlend from={SECTION_SURFACE.default} to={SECTION_SURFACE.dark} />
        </>
      )}

      <PageSection variant="dark" ariaLabelledby="filiale-practical-title">
        <FilialePractical subsidiary={subsidiary} locale={locale} mapQuery={mapQuery} mapsUrl={mapsUrl} />
      </PageSection>
      {faq.length > 0 && (
        <PageSection variant="dark" spacing="compact" ariaLabelledby="filiale-faq-title" className="pt-0! md:pt-0!">
          <FilialeFaq name={name} items={faq} />
        </PageSection>
      )}

      <SectionBlend from={SECTION_SURFACE.dark} to={SECTION_SURFACE.default} />
      <PageSection ariaLabelledby="filiale-reservation-title">
        <FilialeReservation
          slug={slug}
          name={name}
          houses={contactHouses(locale)}
          title={tMoka("reservationTitle")}
          text={tMoka("reservationText")}
        />
      </PageSection>

      <SectionBlend from={SECTION_SURFACE.default} to={SECTION_SURFACE.dark} />
      <PageSection variant="dark" ariaLabelledby="filiale-others-title" overflow="hidden">
        <FilialeOtherHouses slug={slug} locale={locale} />
      </PageSection>
    </>
  );
}
