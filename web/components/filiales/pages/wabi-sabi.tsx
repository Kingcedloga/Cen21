import { getTranslations } from "next-intl/server";

import { contactHouses, filialePhotos } from "@/components/filiales/blocks/data";
import { FilialeBrandStyle } from "@/components/filiales/blocks/FilialeBrandStyle";
import { FilialeCapsuleAction } from "@/components/filiales/blocks/FilialeCapsuleAction";
import { FilialeChapters, type FilialeChapterItem } from "@/components/filiales/blocks/FilialeChapters";
import { FilialeEvents, filialeDeckEvents } from "@/components/filiales/blocks/FilialeEvents";
import { FilialeFaq } from "@/components/filiales/blocks/FilialeFaq";
import { FilialeGalleryStrip } from "@/components/filiales/blocks/FilialeGalleryStrip";
import { FilialeHero } from "@/components/filiales/blocks/FilialeHero";
import { FilialeMark } from "@/components/filiales/blocks/FilialeMark";
import { FilialeOtherHouses } from "@/components/filiales/blocks/FilialeOtherHouses";
import { FilialePractical } from "@/components/filiales/blocks/FilialePractical";
import { FilialeReservation } from "@/components/filiales/blocks/FilialeReservation";
import { FilialeTestimonials } from "@/components/filiales/blocks/FilialeTestimonials";
import { PageSection, SECTION_SURFACE } from "@/components/layout/PageSection";
import { SectionBlend } from "@/components/layout/SectionBlend";
import { AboutStory } from "@/components/sections/about/AboutStory";
import { Button } from "@/components/ui/Button";
import { getSubsidiaryFaq } from "@/lib/content";
import { cormorant } from "@/lib/fonts";

import type { FilialeContext } from "./context";

import "@/styles/filiale-luxe.css";

/** Proportions du logo (public/filiales/logos/filiale-02.png, 1024 × 654). */
const LOGO_RATIO = 1024 / 654;

/**
 * Wabi Sabi (filiale-02) — pilote de la refonte des fiches (R6) : les blocs
 * du socle aux couleurs de la maison (marine, crème et or, titres en
 * Cormorant, surface beige des anciens bandeaux), en habillage luxe.
 *
 * Hero → philosophie épinglée → la table et le bar en diptyque épinglé →
 * photos et avis sur beige → rendez-vous → infos pratiques (Kinshasa,
 * Lubumbashi) et FAQ → réservation → autres maisons. « Réserver » suit la
 * lecture dans la capsule de navigation.
 */
export async function WabiSabiPage({ locale, subsidiary, pageTheme, mapQuery, mapsUrl }: FilialeContext) {
  const t = await getTranslations("filiale");
  const tSub = await getTranslations("subsidiaries");
  const { slug, name, philosophySection, diningSection, barSection, spotlightSection, testimonialsSection } = subsidiary;
  const photos = filialePhotos(subsidiary, (n) => t("photoAlt", { name, n }));
  const events = filialeDeckEvents(locale, slug);
  const faq = getSubsidiaryFaq(locale, slug);

  // La table puis le bar, en diptyque épinglé (photo fixe, textes qui défilent).
  const chapters: FilialeChapterItem[] = [];
  if (diningSection) {
    chapters.push({
      id: "dining",
      titleId: "wabi-dining-title",
      label: t("diningEyebrow"),
      title: diningSection.title,
      paragraphs: diningSection.paragraphs,
      highlights: diningSection.highlights,
      image: diningSection.images.back,
      inset: diningSection.images.front,
      actions: (
        <>
          <Button href={diningSection.primaryCta.href} native>
            {diningSection.primaryCta.label}
          </Button>
          <Button href={diningSection.secondaryCta.href} native variant="secondary">
            {diningSection.secondaryCta.label}
          </Button>
        </>
      ),
    });
  }
  if (barSection) {
    chapters.push({
      id: "bar",
      titleId: "wabi-bar-title",
      label: t("barEyebrow"),
      title: barSection.title,
      paragraphs: barSection.paragraphs,
      highlights: barSection.highlights,
      image: { src: barSection.image, alt: barSection.imageAlt },
      inset: barSection.inset,
      actions: (
        <Button href={barSection.cta.href} native variant="secondary">
          {barSection.cta.label}
        </Button>
      ),
    });
  }

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
      {/* Habillage luxe de la maison (styles/filiale-luxe.css), limité à cette page. */}
      <div hidden data-filiale-luxe="" />
      <FilialeCapsuleAction label={t("reserve")} heroSelector='[aria-labelledby="filiale-hero-title"]' />

      <FilialeHero
        subsidiary={subsidiary}
        locale={locale}
        image={subsidiary.heroSection?.image ?? subsidiary.coverImage}
        mapsUrl={mapsUrl}
      />

      {philosophySection && (
        <AboutStory
          tone="dark"
          titleId="filiale-story-title"
          mark={subsidiary.brandLogo && <FilialeMark src={subsidiary.brandLogo} ratio={LOGO_RATIO} width="clamp(6.5rem, 12vw, 9rem)" />}
          eyebrow={tSub("wabiPhilosophy.sectionLabel")}
          title={philosophySection.attribution}
          statement={philosophySection.quote}
        />
      )}

      {chapters.length > 0 && (
        <PageSection variant="dark" className="lg:py-12!">
          <FilialeChapters chapters={chapters} highlightsLabel={t("specialtiesLabel")} />
        </PageSection>
      )}

      <SectionBlend from={SECTION_SURFACE.dark} to={SECTION_SURFACE.light} />
      <PageSection variant="light" id="galerie" ariaLabelledby="filiale-gallery-title" overflow="hidden" className="scroll-mt-6">
        <FilialeGalleryStrip
          name={name}
          photos={photos}
          tone="light"
          house={{ slug, name, href: `/filiales/${slug}`, external: false }}
        />
      </PageSection>
      {testimonialsSection && (
        <PageSection variant="light" ariaLabelledby="filiale-testimonials-title" className="pt-0! md:pt-0!">
          <FilialeTestimonials
            tone="light"
            eyebrow={testimonialsSection.eyebrow}
            title={testimonialsSection.title}
            items={testimonialsSection.items}
          />
        </PageSection>
      )}

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
          title={spotlightSection?.title}
          text={spotlightSection?.description}
        />
      </PageSection>

      <SectionBlend from={SECTION_SURFACE.default} to={SECTION_SURFACE.dark} />
      <PageSection variant="dark" ariaLabelledby="filiale-others-title" overflow="hidden">
        <FilialeOtherHouses slug={slug} locale={locale} />
      </PageSection>
    </>
  );
}
