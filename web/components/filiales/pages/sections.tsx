import { EventCard } from "@/components/cards/EventCard";
import { StickyMobileActions } from "@/components/filiales/StickyMobileActions";
import { SubsidiaryContactBand } from "@/components/filiales/SubsidiaryContactBand";
import { SubsidiaryEditorialAbout } from "@/components/filiales/SubsidiaryEditorialAbout";
import { SubsidiaryEventShowcase } from "@/components/filiales/SubsidiaryEventShowcase";
import { SubsidiaryExpandableGallery } from "@/components/filiales/SubsidiaryExpandableGallery";
import { MapEmbed } from "@/components/maps/MapEmbed";
import { SubsidiaryHero } from "@/components/sections/SubsidiaryHero";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { ReadingProgress } from "@/components/ui/ReadingProgress";
import { getSectorLabel } from "@/lib/content";
import { getSubsidiaryContactImage } from "@/lib/subsidiary-contact-images";
import { getSubsidiaryHeroContent, getSubsidiaryHeroLayout } from "@/lib/subsidiary-hero-layout";

import type { FilialeContext } from "./context";

import "@/styles/subsidiary-contact-band.css";
import "@/styles/wabi-sabi-beige-band.css";

/*
 * Sections partagées par les compositions des fiches (refonte R5), reprises
 * à l'identique de l'ancienne page unique. Chaque fonction rend un fragment.
 */

export function ReadingProgressBar({ isThemed }: FilialeContext) {
  return (
    <ReadingProgress
      barClassName={
        isThemed ? "sub-reading-progress fixed left-0 right-0 top-0 z-[55] h-[3px] origin-left" : undefined
      }
    />
  );
}

export function DefaultHero({ slug, locale, subsidiary, pageTheme, heroSlides, heroVideo }: FilialeContext) {
  return (
    <SubsidiaryHero
      slides={heroSlides}
      sectorLabel={getSectorLabel(locale, subsidiary.sector)}
      name={subsidiary.name}
      tagline={subsidiary.tagline}
      social={subsidiary.social}
      brandLogo={subsidiary.brandLogo}
      accentColor={subsidiary.accentColor}
      theme={pageTheme ?? undefined}
      backgroundVideo={heroVideo}
      layout={getSubsidiaryHeroLayout(slug)}
      contentConfig={getSubsidiaryHeroContent(slug)}
    />
  );
}

export function BreadcrumbBar({ subsidiary, t }: FilialeContext) {
  const items = [
    { label: t("breadcrumbHome"), href: "/" },
    { label: t("breadcrumbSubsidiaries"), href: "/filiales" },
    { label: subsidiary.name },
  ];
  return (
    <section className="px-4 pt-8 md:px-6 md:pt-10 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Breadcrumb animate items={items} />
      </div>
    </section>
  );
}

/** Vitrine d'événements (maisons configurées dans lib/subsidiary-events-showcase.ts). */
export function EventShowcase({ useEventShowcase, showcaseEvents, eventShowcaseConfig, t }: FilialeContext) {
  if (!useEventShowcase || showcaseEvents.length === 0) return null;
  return (
    <SubsidiaryEventShowcase
      events={showcaseEvents}
      labels={{
        bookNow: t("eventShowcase.bookNow"),
        eventInfo: t("eventShowcase.eventInfo"),
        viewAllEvents: t("eventShowcase.viewAllEvents"),
        statusUpcoming: t("eventShowcase.statusUpcoming"),
        statusSoldOut: t("eventShowcase.statusSoldOut"),
        statusVip: t("eventShowcase.statusVip"),
      }}
      desktopColumns={eventShowcaseConfig?.desktopColumns}
    />
  );
}

export function DescriptionSection({ subsidiary }: FilialeContext) {
  return (
    <section className="px-4 py-12 md:px-6 md:py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimateIn>
          <p className="max-w-3xl text-lg leading-relaxed text-taupe">{subsidiary.description}</p>
        </AnimateIn>
      </div>
    </section>
  );
}

export function ContactBand({ slug, subsidiary, t, mapsUrl, isThemed }: FilialeContext) {
  return (
    <SubsidiaryContactBand
      backgroundImage={getSubsidiaryContactImage(slug, subsidiary.coverImage)}
      hoursLabel={t("contactBand.hours")}
      findUsLabel={t("contactBand.findUs")}
      callUsLabel={t("contactBand.callUs")}
      hours={subsidiary.practicalInfo.hours}
      address={subsidiary.practicalInfo.address}
      phone={subsidiary.practicalInfo.phone}
      mapsUrl={subsidiary.practicalInfo.address ? mapsUrl : undefined}
      themed={isThemed}
    />
  );
}

export function StandardGallery({ locale, subsidiary, galleryItems, pageTheme, isThemed, sectionHeadingClass, t }: FilialeContext) {
  if (galleryItems.length === 0) return null;
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
      <AnimateIn>
        <h2 className={sectionHeadingClass}>{t("gallery")}</h2>
        <p className="-mt-4 mb-8 max-w-2xl text-sm text-taupe md:mb-10">{t("galleryDescription")}</p>
      </AnimateIn>
      <SubsidiaryExpandableGallery
        items={galleryItems}
        subsidiaryName={subsidiary.name}
        sectorLabel={getSectorLabel(locale, subsidiary.sector)}
        accentColor={pageTheme?.colors.gold ?? subsidiary.accentColor}
        backgroundColor={pageTheme?.colors.surface}
        themed={isThemed}
      />
    </section>
  );
}

/** Présentation éditoriale (si la maison en a une). */
export function EditorialAbout({ subsidiary }: FilialeContext) {
  return subsidiary.aboutSection ? <SubsidiaryEditorialAbout content={subsidiary.aboutSection} /> : null;
}

export function StandardEvents({ events, sectionHeadingClass, t }: FilialeContext) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
      <AnimateIn>
        <h2 className={sectionHeadingClass}>{t("upcomingEvents")}</h2>
      </AnimateIn>
      {events.length === 0 ? (
        <AnimateIn delay={0.05}>
          <p className="mb-8 text-taupe">{t("noEventsScheduled")}</p>
        </AnimateIn>
      ) : (
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event, index) => (
            <AnimateIn key={event.id} delay={index * 0.05}>
              <EventCard event={event} />
            </AnimateIn>
          ))}
        </div>
      )}
      <Button href="/evenements" variant="secondary">
        {t("allEvents")}
      </Button>
    </section>
  );
}

export function StandardMap({ subsidiary, mapQuery, headingClass, t }: FilialeContext) {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 md:px-6 md:pb-20">
      <AnimateIn>
        <h2 className={headingClass}>{t("mapAccess")}</h2>
        <p className="mb-6 max-w-xl text-sm text-taupe">{t("mapDescription")}</p>
      </AnimateIn>
      <MapEmbed query={mapQuery} title={t("mapTitle", { name: subsidiary.name })} variant="compact" />
    </section>
  );
}

/** Espace pour la barre d'actions mobile, puis la barre elle-même. */
export function MobileActions({ subsidiary, mapsUrl, isThemed }: FilialeContext) {
  return (
    <>
      <div className="h-20 lg:hidden" aria-hidden />
      <StickyMobileActions
        phone={subsidiary.practicalInfo.phone}
        mapsUrl={subsidiary.practicalInfo.address ? mapsUrl : undefined}
        subsidiaryName={subsidiary.name}
        themed={isThemed}
      />
    </>
  );
}
