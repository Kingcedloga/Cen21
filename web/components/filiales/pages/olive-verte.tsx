import { getTranslations } from "next-intl/server";

import { contactHouses, filialePhotos } from "@/components/filiales/blocks/data";
import { FilialeBrandStyle } from "@/components/filiales/blocks/FilialeBrandStyle";
import { FilialeCapsuleAction } from "@/components/filiales/blocks/FilialeCapsuleAction";
import { FilialeFaq } from "@/components/filiales/blocks/FilialeFaq";
import { FilialeOtherHouses } from "@/components/filiales/blocks/FilialeOtherHouses";
import { FilialePractical } from "@/components/filiales/blocks/FilialePractical";
import { FilialeReservation } from "@/components/filiales/blocks/FilialeReservation";
import { OliveAlbum } from "@/components/filiales/olive/OliveAlbum";
import { OliveHero } from "@/components/filiales/olive/OliveHero";
import { OliveManifesto } from "@/components/filiales/olive/OliveManifesto";
import { OliveMatch } from "@/components/filiales/olive/OliveMatch";
import { OliveMenu } from "@/components/filiales/olive/OliveMenu";
import { PageSection } from "@/components/layout/PageSection";
import { getEvents, getSubsidiaryFaq } from "@/lib/content";
import type { GalleryPhoto } from "@/lib/gallery-photos";

import type { FilialeContext } from "./context";

/** Affiche du teaser (si la maison n'en donne pas) : un toast en terrasse. */
const POSTER = "/filiales/photos/filiale-01/DSC08521.jpg";
/** Les neuf photos de l'album (la 5ᵉ au milieu : on entre dedans). */
const ALBUM = [
  "DSC08521.jpg",
  "olive%20j1135.jpg",
  "DSC08598.jpg",
  "olive%20j1241.jpg",
  "DSC08583.jpg",
  "olive%20j1199.jpg",
  "DSC08736.jpg",
  "olive%20j147.jpg",
  "DSC08842.jpg",
];

/**
 * L'Olive Verte (filiale-01) — restaurant, lounge et bar sportif en plein
 * air, sans les blocs habituels des fiches pour le cœur de la page : la une
 * (le nom en capitales Art déco, le teaser dans un grand ovale) → la
 * maison et le rameau d'olivier (ses feuilles tombent sur la tige) → la
 * carte en cadre Art déco, sur l'olive → l'album, où l'on entre dans la
 * photo → jour de match (tableau d'affichage, prochaine rencontre) → infos
 * pratiques et FAQ → réservation → autres maisons. Crème et olive ; titres en capitales fines (DM Sans 200).
 * « Réserver » suit la lecture dans la capsule.
 */
export async function OliveVertePage({ locale, subsidiary, pageTheme, mapQuery, mapsUrl }: FilialeContext) {
  const t = await getTranslations("filiale");
  const tOlive = await getTranslations("olive");
  const { slug, name, specialtiesSection, menuCategoriesSection, teaserVideo } = subsidiary;
  const photos = filialePhotos(subsidiary, (n) => t("photoAlt", { name, n }));
  const grid = ALBUM.map((file) => photos.find((photo) => photo.src.endsWith(`/${file}`))).filter(
    (photo): photo is GalleryPhoto => Boolean(photo),
  );
  const house = { slug, name, href: `/filiales/${slug}`, external: false };
  const next = (await getEvents(locale)).find((event) => event.subsidiarySlug === slug);
  const faq = getSubsidiaryFaq(locale, slug);

  return (
    <>
      {pageTheme && (
        <FilialeBrandStyle
          theme={pageTheme}
          options={{
            titleFont: "var(--font-dm-sans)",
            titleWeight: 300,
            titleTracking: { display: "0.02em", section: "0.04em" },
          }}
        />
      )}
      {/* Habillage de la maison sur les blocs partagés (styles/olive.css). */}
      <div hidden data-filiale-olive="" />
      <FilialeCapsuleAction label={t("reserve")} heroSelector='[aria-labelledby="olive-hero-title"]' />

      <OliveHero
        name={name}
        tagline={subsidiary.tagline}
        hours={subsidiary.practicalInfo.hours}
        phone={subsidiary.practicalInfo.phone}
        locale={locale}
        video={teaserVideo}
        poster={teaserVideo?.poster ?? POSTER}
        posterAlt={tOlive("heroImageAlt")}
      />

      {specialtiesSection && (
        <OliveManifesto label={tOlive("manifestoLabel")} title={specialtiesSection.title} text={specialtiesSection.description} />
      )}

      {menuCategoriesSection && (
        <OliveMenu
          title={menuCategoriesSection.title}
          description={menuCategoriesSection.description}
          categories={menuCategoriesSection.categories}
        />
      )}

      <OliveAlbum name={name} photos={photos} grid={grid} house={house} />

      <OliveMatch hours={subsidiary.practicalInfo.hours} next={next} locale={locale} slug={slug} />

      <PageSection variant="dark" ariaLabelledby="filiale-practical-title">
        <FilialePractical subsidiary={subsidiary} locale={locale} mapQuery={mapQuery} mapsUrl={mapsUrl} />
      </PageSection>
      {faq.length > 0 && (
        <PageSection variant="dark" spacing="compact" ariaLabelledby="filiale-faq-title" className="pt-0! md:pt-0!">
          <FilialeFaq name={name} items={faq} />
        </PageSection>
      )}

      <PageSection ariaLabelledby="filiale-reservation-title">
        <FilialeReservation
          slug={slug}
          name={name}
          houses={contactHouses(locale)}
          title={tOlive("reservationTitle")}
          text={tOlive("reservationText")}
        />
      </PageSection>

      <PageSection variant="dark" ariaLabelledby="filiale-others-title" overflow="hidden">
        <FilialeOtherHouses slug={slug} locale={locale} />
      </PageSection>
    </>
  );
}
