import { getTranslations } from "next-intl/server";

import { contactHouses } from "@/components/filiales/blocks/data";
import { FilialeBrandStyle } from "@/components/filiales/blocks/FilialeBrandStyle";
import { FilialeCapsuleAction } from "@/components/filiales/blocks/FilialeCapsuleAction";
import { FilialeFaq } from "@/components/filiales/blocks/FilialeFaq";
import { FilialeOtherHouses } from "@/components/filiales/blocks/FilialeOtherHouses";
import { FilialePractical } from "@/components/filiales/blocks/FilialePractical";
import { FilialeReservation } from "@/components/filiales/blocks/FilialeReservation";

import { MuzikDates } from "@/components/filiales/muzik/MuzikDates";
import { MuzikHero } from "@/components/filiales/muzik/MuzikHero";
import { MuzikKaraoke } from "@/components/filiales/muzik/MuzikKaraoke";
import { MuzikSetlist, type SetlistTrack } from "@/components/filiales/muzik/MuzikSetlist";
import { MuzikTeaser } from "@/components/filiales/muzik/MuzikTeaser";
import { PageSection } from "@/components/layout/PageSection";
import { getEvents, getSubsidiaryFaq } from "@/lib/content";
import { inter } from "@/lib/fonts";

import type { FilialeContext } from "./context";

/** Fond du hero (scène de nuit) : un plat de la maison sur fond noir. */
const HERO_PHOTO = "/filiales/photos/filiale-05/hero-nuit.jpg";

/** Proportions du logo (public/filiales/logos/filiale-05.png, 1024 × 597). */
const LOGO_RATIO = 1024 / 597;
/** Le logo en titre du hero, rogné à sa zone visible (fichier 1024 × 597). */
const TITLE_LOGO = {
  src: "/filiales/logos/filiale-05.png",
  size: [1024, 597],
  box: [145, 107, 880, 533],
  width: "clamp(16rem, 8rem + 24vw, 30rem)",
} as const;
/** Dates affichées dans la liste « tournée ». */
const DATES_SIZE = 4;

/**
 * Café Muzik (filiale-05) — restaurant, lounge bar et musique live, sans les
 * blocs habituels des fiches pour le cœur de la page : la scène (le nom en
 * affiche de concert, la guitare du logo, six cordes qui vibrent au
 * défilement) → le refrain en karaoké → la carte en face A d'un album, avec
 * son vinyle → le teaser du patio en clip vidéo → les prochaines dates sur
 * aplat rouge → infos pratiques et FAQ → réservation → autres maisons. Rouge
 * et blanc, le refrain en bleu roi ; titres en capitales d'affiche (Inter
 * 900). « Réserver » suit la lecture dans la capsule.
 */
export async function MuzikCafePage({ locale, subsidiary, pageTheme, mapQuery, mapsUrl }: FilialeContext) {
  const t = await getTranslations("filiale");
  const tMuzik = await getTranslations("muzik");
  const { slug, name, muzikMenuSection, muzikGallerySection } = subsidiary;
  const events = (await getEvents(locale))
    .filter((event) => event.subsidiarySlug === slug)
    .slice(0, DATES_SIZE);
  const faq = getSubsidiaryFaq(locale, slug);

  // La carte : plats du menu puis ceux de la galerie, sans doublon.
  const tracks: SetlistTrack[] = [];
  for (const item of [...(muzikMenuSection?.items ?? []), ...(muzikGallerySection?.items ?? [])]) {
    if (!tracks.some((track) => track.name === item.name)) {
      tracks.push({ name: item.name, price: item.price, image: item.image, imageAlt: item.imageAlt });
    }
  }

  return (
    <>
      {pageTheme && (
        <FilialeBrandStyle
          theme={pageTheme}
          options={{
            titleFont: inter.style.fontFamily,
            titleWeight: 900,
            titleTracking: { display: "-0.05em", section: "-0.035em" },
          }}
        />
      )}
      {/* Habillage de la maison sur les blocs partagés (styles/muzik.css). */}
      <div hidden data-filiale-muzik="" />
      <FilialeCapsuleAction label={t("reserve")} heroSelector='[aria-labelledby="muzik-hero-title"]' />

      <MuzikHero
        name={name}
        tagline={subsidiary.tagline}
        hours={subsidiary.practicalInfo.hours}
        phone={subsidiary.practicalInfo.phone}
        locale={locale}
        logo={subsidiary.brandLogo}
        logoRatio={LOGO_RATIO}
        photo={HERO_PHOTO}
        titleLogo={TITLE_LOGO}
      />
      <MuzikKaraoke label={tMuzik("lyricsLabel")} lines={tMuzik.raw("lyrics") as string[]} note={tMuzik("lyricsNote")} />

      <MuzikSetlist tracks={tracks} credits={muzikMenuSection?.benefits ?? []} />

      {subsidiary.teaserVideo && <MuzikTeaser video={subsidiary.teaserVideo} />}

      {events.length > 0 && (
        <MuzikDates events={events} locale={locale} slug={slug} />
      )}

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
          title={tMuzik("reservationTitle")}
          text={tMuzik("reservationText")}
        />
      </PageSection>

      <PageSection variant="dark" ariaLabelledby="filiale-others-title" overflow="hidden">
        <FilialeOtherHouses slug={slug} locale={locale} />
      </PageSection>
    </>
  );
}
