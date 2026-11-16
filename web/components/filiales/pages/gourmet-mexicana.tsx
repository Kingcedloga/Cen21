import { getTranslations } from "next-intl/server";

import { contactHouses, filialePhotos } from "@/components/filiales/blocks/data";
import { FilialeBrandStyle } from "@/components/filiales/blocks/FilialeBrandStyle";
import { FilialeCapsuleAction } from "@/components/filiales/blocks/FilialeCapsuleAction";
import { FilialeFaq } from "@/components/filiales/blocks/FilialeFaq";
import { FilialeOtherHouses } from "@/components/filiales/blocks/FilialeOtherHouses";
import { FilialePractical } from "@/components/filiales/blocks/FilialePractical";
import { FilialeReservation } from "@/components/filiales/blocks/FilialeReservation";
import { MexicanaCasa } from "@/components/filiales/mexicana/MexicanaCasa";
import { MexicanaElevator } from "@/components/filiales/mexicana/MexicanaElevator";
import { MexicanaFiestas } from "@/components/filiales/mexicana/MexicanaFiestas";
import { MexicanaHero } from "@/components/filiales/mexicana/MexicanaHero";
import { MexicanaLoteria } from "@/components/filiales/mexicana/MexicanaLoteria";
import { MexicanaMascot } from "@/components/filiales/mexicana/MexicanaMascot";
import { PageSection, SECTION_SURFACE } from "@/components/layout/PageSection";
import { SectionBlend } from "@/components/layout/SectionBlend";
import { getEvents, getSubsidiaryFaq } from "@/lib/content";
import { cormorant, dynalight } from "@/lib/fonts";

import type { FilialeContext } from "./context";

/** Affiche du teaser (si la maison n'en donne pas) : la niche au crâne de néon. */
const POSTER = "/filiales/photos/filiale-07/gallery/dsc09820.jpg";
/** La salle vitrée du 9ᵉ étage, derrière les portes de l'ascenseur. */
const ELEVATOR_PHOTO = "/filiales/photos/filiale-07/gallery/dsc09778.jpg";
/** La mascotte (le mariachi), au-dessus de la réservation. */
const MASCOT = "/filiales/photos/filiale-07/mascottemexiacain.png";
/** Fiestas affichées. */
const FIESTAS_SIZE = 4;

/** Surface verte de la charte (fiestas), pour les fondus qui l'encadrent. */
const SURFACE_GREEN = "var(--mx-green)";

/**
 * Gourmet Mexicana (filiale-07) — cuisine mexicaine au 9ᵉ étage de la Matrix
 * Tower, sans les blocs habituels des fiches pour le cœur de la page : la une
 * (papel picado, le nom comme le logo, le teaser dans un cadre de carreaux)
 * → l'ascenseur jusqu'au 9ᵉ étage → la carte en cartes de lotería → la casa
 * en niches peintes → les fiestas sur le vert → infos pratiques et FAQ →
 * réservation (la mascotte passe la tête) → autres maisons. Brun, rouge,
 * ocre, vert et crème ; titres en Cormorant italique, « Mexicana » à la main.
 */
export async function GourmetMexicanaPage({ locale, subsidiary, pageTheme, mapQuery, mapsUrl }: FilialeContext) {
  const t = await getTranslations("filiale");
  const tMx = await getTranslations("mexicana");
  const { slug, name, teaserVideo } = subsidiary;
  const photos = filialePhotos(subsidiary, (n) => t("photoAlt", { name, n }));
  const house = { slug, name, href: `/filiales/${slug}`, external: false };
  const events = getEvents(locale)
    .filter((event) => event.subsidiarySlug === slug)
    .slice(0, FIESTAS_SIZE);
  const faq = getSubsidiaryFaq(locale, slug);
  // Les couleurs de charte que la palette du groupe n'a pas (vert, ocre) et
  // l'écriture manuscrite de la maison, limitées à cette page.
  const houseVars = [
    `--mx-script:${dynalight.style.fontFamily}`,
    pageTheme?.colors.terracotta && `--mx-green:${pageTheme.colors.terracotta}`,
    pageTheme?.colors.ochre && `--mx-ochre:${pageTheme.colors.ochre}`,
  ]
    .filter(Boolean)
    .join(";");

  return (
    <>
      {pageTheme && (
        <FilialeBrandStyle
          theme={pageTheme}
          options={{
            titleFont: cormorant.style.fontFamily,
            titleWeight: 600,
            titleTracking: { display: "-0.01em", section: "0em" },
          }}
        />
      )}
      <style dangerouslySetInnerHTML={{ __html: `body{${houseVars}}` }} />
      {/* Habillage de la maison sur les blocs partagés (styles/mexicana.css). */}
      <div hidden data-filiale-mexicana="" />
      <FilialeCapsuleAction label={t("reserve")} heroSelector='[aria-labelledby="mexicana-hero-title"]' />

      <MexicanaHero
        name={name}
        tagline={subsidiary.tagline}
        hours={subsidiary.practicalInfo.hours}
        locale={locale}
        mapsUrl={mapsUrl}
        video={teaserVideo}
        poster={teaserVideo?.poster ?? POSTER}
        posterAlt={tMx("heroPosterAlt")}
      />

      <MexicanaElevator image={ELEVATOR_PHOTO} imageAlt={tMx("elevatorAlt")} />

      <SectionBlend from={SECTION_SURFACE.dark} to={SECTION_SURFACE.light} />
      <MexicanaLoteria />
      <SectionBlend from={SECTION_SURFACE.light} to={SECTION_SURFACE.dark} />

      <MexicanaCasa name={name} photos={photos} house={house} />

      {events.length > 0 && (
        <>
          <SectionBlend from={SECTION_SURFACE.dark} to={SURFACE_GREEN} />
          <MexicanaFiestas events={events} locale={locale} slug={slug} />
          <SectionBlend from={SURFACE_GREEN} to={SECTION_SURFACE.dark} />
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
      <MexicanaMascot src={MASCOT}>
        <PageSection ariaLabelledby="filiale-reservation-title">
          <FilialeReservation
            slug={slug}
            name={name}
            houses={contactHouses(locale)}
            title={tMx("reservationTitle")}
            text={tMx("reservationText")}
          />
        </PageSection>
      </MexicanaMascot>

      <SectionBlend from={SECTION_SURFACE.default} to={SECTION_SURFACE.dark} />
      <PageSection variant="dark" ariaLabelledby="filiale-others-title" overflow="hidden">
        <FilialeOtherHouses slug={slug} locale={locale} />
      </PageSection>
    </>
  );
}
