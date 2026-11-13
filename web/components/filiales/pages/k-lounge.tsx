import { getTranslations } from "next-intl/server";

import { contactHouses, filialePhotos } from "@/components/filiales/blocks/data";
import { FilialeBrandStyle } from "@/components/filiales/blocks/FilialeBrandStyle";
import { FilialeCapsuleAction } from "@/components/filiales/blocks/FilialeCapsuleAction";
import { FilialeEvents, filialeDeckEvents } from "@/components/filiales/blocks/FilialeEvents";
import { FilialeFaq } from "@/components/filiales/blocks/FilialeFaq";
import { FilialeGalleryDrift } from "@/components/filiales/blocks/FilialeGalleryDrift";
import { FilialeHero } from "@/components/filiales/blocks/FilialeHero";
import { FilialeMark } from "@/components/filiales/blocks/FilialeMark";
import { FilialeOtherHouses } from "@/components/filiales/blocks/FilialeOtherHouses";
import { FilialePractical } from "@/components/filiales/blocks/FilialePractical";
import { FilialeReservation } from "@/components/filiales/blocks/FilialeReservation";
import { FilialeTriptych, type TriptychItem } from "@/components/filiales/blocks/FilialeTriptych";
import { PageSection, SECTION_SURFACE } from "@/components/layout/PageSection";
import { SectionBlend } from "@/components/layout/SectionBlend";
import { AboutStory } from "@/components/sections/about/AboutStory";
import { Button } from "@/components/ui/Button";
import { getSubsidiaryFaq } from "@/lib/content";
import { cormorant } from "@/lib/fonts";

import type { FilialeContext } from "./context";

/** Proportions du logo (public/filiales/logos/filiale-03.png, 560 × 1024). */
const LOGO_RATIO = 560 / 1024;

/**
 * K Lounge (filiale-03) — refonte R7 : les blocs du socle en noir et blanc,
 * titres en Cormorant.
 *
 * Hero vidéo plein écran → manifeste épinglé → le rooftop en triptyque (noir
 * et blanc qui s'allume) → photos en rangées croisées sur surface claire →
 * rendez-vous → infos pratiques
 * (Kinshasa, Lubumbashi) et FAQ → réservation → autres maisons. « Réserver »
 * suit la lecture dans la capsule de navigation.
 */
export async function KLoungePage({ locale, subsidiary, pageTheme, heroVideo, mapQuery, mapsUrl }: FilialeContext) {
  const t = await getTranslations("filiale");
  const tSub = await getTranslations("subsidiaries");
  const { slug, name, introSection, aboutSection } = subsidiary;
  const photos = filialePhotos(subsidiary, (n) => t("photoAlt", { name, n }));
  const events = filialeDeckEvents(locale, slug);
  const faq = getSubsidiaryFaq(locale, slug);

  // Le rooftop : ses trois points forts, chacun avec sa photo (triptyque).
  const rooftop: TriptychItem[] = (aboutSection?.highlights ?? []).flatMap((item) =>
    item.image ? [{ title: item.title, description: item.description, image: item.image }] : [],
  );

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
      <FilialeCapsuleAction label={t("reserve")} heroSelector='[aria-labelledby="filiale-hero-title"]' />

      <FilialeHero
        subsidiary={subsidiary}
        locale={locale}
        image={heroVideo?.poster ?? subsidiary.coverImage}
        video={heroVideo}
        mapsUrl={mapsUrl}
      />

      {introSection && (
        <AboutStory
          tone="dark"
          titleId="filiale-story-title"
          mark={subsidiary.brandLogo && <FilialeMark src={subsidiary.brandLogo} ratio={LOGO_RATIO} width="clamp(3.75rem, 6vw, 5rem)" />}
          eyebrow={t("storyEyebrow")}
          title={introSection.title}
          statement={introSection.paragraphs.join(" ")}
        />
      )}

      {aboutSection && rooftop.length > 0 && (
        <PageSection variant="dark" ariaLabelledby="klounge-rooftop-title">
          <FilialeTriptych
            eyebrow={aboutSection.eyebrow}
            title={aboutSection.title}
            titleId="klounge-rooftop-title"
            text={subsidiary.description}
            items={rooftop}
            actions={
              <>
                <Button href="#reservation" native>
                  {t("reserve")}
                </Button>
                <Button href="#galerie" native variant="secondary">
                  {t("galleryCta")}
                </Button>
              </>
            }
          />
        </PageSection>
      )}

      <SectionBlend from={SECTION_SURFACE.dark} to={SECTION_SURFACE.light} />
      <PageSection variant="light" id="galerie" ariaLabelledby="filiale-gallery-title" overflow="hidden" className="scroll-mt-6">
        <FilialeGalleryDrift
          name={name}
          photos={photos}
          tone="light"
          house={{ slug, name, href: `/filiales/${slug}`, external: false }}
        />
      </PageSection>

      {events.length > 0 ? (
        <>
          <SectionBlend from={SECTION_SURFACE.light} to={SECTION_SURFACE.default} />
          <FilialeEvents slug={slug} name={name} events={events} />
          <SectionBlend from={SECTION_SURFACE.default} to={SECTION_SURFACE.dark} />
        </>
      ) : (
        <SectionBlend from={SECTION_SURFACE.light} to={SECTION_SURFACE.dark} />
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
          title={tSub("kLoungeReservation.eyebrow")}
        />
      </PageSection>

      <SectionBlend from={SECTION_SURFACE.default} to={SECTION_SURFACE.dark} />
      <PageSection variant="dark" ariaLabelledby="filiale-others-title" overflow="hidden">
        <FilialeOtherHouses slug={slug} locale={locale} />
      </PageSection>
    </>
  );
}
