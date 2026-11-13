import { getTranslations } from "next-intl/server";

import { ClubFlash } from "@/components/filiales/club/ClubFlash";
import { ClubHero } from "@/components/filiales/club/ClubHero";
import { ClubLineup, type LineupNight } from "@/components/filiales/club/ClubLineup";
import { ClubNight } from "@/components/filiales/club/ClubNight";
import { ClubTicket } from "@/components/filiales/club/ClubTicket";
import { contactHouses, filialePhotos } from "@/components/filiales/blocks/data";
import { FilialeBrandStyle } from "@/components/filiales/blocks/FilialeBrandStyle";
import { FilialeCapsuleAction } from "@/components/filiales/blocks/FilialeCapsuleAction";
import { FilialeOtherHouses } from "@/components/filiales/blocks/FilialeOtherHouses";
import { FilialeReservation } from "@/components/filiales/blocks/FilialeReservation";
import { PageSection, SECTION_SURFACE } from "@/components/layout/PageSection";
import { SectionBlend } from "@/components/layout/SectionBlend";
import { getEvents, getSubsidiaryFaq } from "@/lib/content";
import { cormorant } from "@/lib/fonts";
import { galleryEntrySrc } from "@/lib/gallery-categories";
import type { Subsidiary } from "@/lib/types";

import type { FilialeContext } from "./context";

/** Soirées affichées dans le line-up. */
const LINEUP_SIZE = 6;

/**
 * Photos posées en premier sur le mur (rangs dans la galerie de la maison) :
 * artistes, bouteilles et invités en alternance. Les autres suivent.
 */
const FEATURED = [10, 0, 3, 5, 6, 12, 1, 4, 13, 2, 7];

/**
 * Galerie de la maison sans doublons (des portraits « invités » reprennent
 * des photos de la galerie, même prise de vue DSC), photos phares en tête.
 */
function wallOrder(subsidiary: Subsidiary): Subsidiary["galleryImages"] {
  const seen = new Set<string>();
  const unique = subsidiary.galleryImages.filter((entry) => {
    const shot = galleryEntrySrc(entry).match(/dsc-(\d+)/i)?.[1];
    if (!shot) return true;
    if (seen.has(shot)) return false;
    seen.add(shot);
    return true;
  });
  const featured = FEATURED.filter((i) => i < unique.length).map((i) => unique[i]);
  return [...featured, ...unique.filter((entry) => !featured.includes(entry))];
}

/**
 * Millionaire Club (filiale-04) — une nuit au club, sans les blocs habituels
 * des fiches : les portes (le nom ajouré sur la vidéo, qui s'ouvre au
 * défilement) → le line-up des soirées à thème → la nuit heure par heure, de
 * 18h à 06h → « Vu au club », le mur de photos au flash → avant de venir
 * (ticket d'entrée et règles de la maison) → la liste (réservation) → autres
 * maisons. Noir et or, titres en Cormorant ; « Réserver » dans la capsule.
 */
export async function MillionaireClubPage({ locale, subsidiary, pageTheme, heroVideo, mapsUrl }: FilialeContext) {
  const t = await getTranslations("filiale");
  const tClub = await getTranslations("club");
  const { slug, name } = subsidiary;
  const photos = filialePhotos({ ...subsidiary, galleryImages: wallOrder(subsidiary) }, (n) => t("photoAlt", { name, n }));
  const faq = getSubsidiaryFaq(locale, slug);

  const intl = locale === "fr" ? "fr-FR" : "en-GB";
  const part = (date: Date, options: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat(intl, options).format(date).replace(/\./g, "").toUpperCase();
  const nights: LineupNight[] = getEvents(locale)
    .filter((event) => event.subsidiarySlug === slug)
    .slice(0, LINEUP_SIZE)
    .map((event) => {
      const date = new Date(event.date);
      return {
        id: event.id,
        title: event.displayTitle ?? event.title,
        day: event.date.slice(0, 10),
        weekday: part(date, { weekday: "short" }),
        dayNumber: part(date, { day: "2-digit" }),
        month: part(date, { month: "short" }),
        time: new Intl.DateTimeFormat(intl, { hour: "2-digit", minute: "2-digit" }).format(date),
        excerpt: event.excerpt,
        image: event.image,
      };
    });
  const next = nights[0] ? `${nights[0].title} · ${nights[0].weekday} ${nights[0].dayNumber} ${nights[0].month}` : undefined;

  return (
    <>
      {pageTheme && (
        <FilialeBrandStyle
          theme={pageTheme}
          options={{
            titleFont: cormorant.style.fontFamily,
            titleWeight: 500,
            titleTracking: { display: "-0.01em", section: "0em" },
          }}
        />
      )}
      <FilialeCapsuleAction label={t("reserve")} heroSelector='[aria-labelledby="club-hero-title"]' />

      <ClubHero
        name={name}
        tagline={subsidiary.tagline}
        hours={subsidiary.practicalInfo.hours}
        locale={locale}
        poster={heroVideo?.poster ?? subsidiary.coverImage}
        video={heroVideo}
        next={next}
      />

      <PageSection variant="dark" id="line-up" ariaLabelledby="club-lineup-title" className="scroll-mt-6">
        <ClubLineup nights={nights} agendaHref={`/evenements?maison=${slug}`} />
      </PageSection>

      <ClubNight steps={subsidiary.nightTimeline ?? []} />

      <PageSection variant="dark" id="galerie" ariaLabelledby="filiale-gallery-title" overflow="hidden" className="scroll-mt-6">
        <ClubFlash name={name} photos={photos} house={{ slug, name, href: `/filiales/${slug}`, external: false }} />
      </PageSection>

      <PageSection variant="dark" ariaLabelledby="club-entry-title">
        <ClubTicket subsidiary={subsidiary} locale={locale} mapsUrl={mapsUrl} rules={faq} />
      </PageSection>

      <SectionBlend from={SECTION_SURFACE.dark} to={SECTION_SURFACE.default} />
      <PageSection ariaLabelledby="filiale-reservation-title">
        <FilialeReservation slug={slug} name={name} houses={contactHouses(locale)} title={tClub("listTitle")} />
      </PageSection>

      <SectionBlend from={SECTION_SURFACE.default} to={SECTION_SURFACE.dark} />
      <PageSection variant="dark" ariaLabelledby="filiale-others-title" overflow="hidden">
        <FilialeOtherHouses slug={slug} locale={locale} />
      </PageSection>
    </>
  );
}
