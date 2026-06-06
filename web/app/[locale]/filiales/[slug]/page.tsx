import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { EventCard } from "@/components/cards/EventCard";
import { StickyMobileActions } from "@/components/filiales/StickyMobileActions";
import { SubsidiaryContactBand } from "@/components/filiales/SubsidiaryContactBand";
import { SubsidiaryEditorialAbout } from "@/components/filiales/SubsidiaryEditorialAbout";
import { SubsidiaryEventShowcase } from "@/components/filiales/SubsidiaryEventShowcase";
import { SubsidiaryExpandableGallery } from "@/components/filiales/SubsidiaryExpandableGallery";
import { WabiSabiDiningShowcase } from "@/components/filiales/WabiSabiDiningShowcase";
import { WabiSabiEditorialAbout } from "@/components/filiales/WabiSabiEditorialAbout";
import { WabiSabiHero } from "@/components/filiales/WabiSabiHero";
import { WabiSabiPhilosophySection } from "@/components/filiales/WabiSabiPhilosophySection";
import { WabiSabiPracticalSection } from "@/components/filiales/WabiSabiPracticalSection";
import { WabiSabiTestimonials } from "@/components/filiales/WabiSabiTestimonials";
import { SubsidiaryThemeShell } from "@/components/filiales/SubsidiaryThemeShell";
import { MapEmbed } from "@/components/maps/MapEmbed";
import { SubsidiaryHero } from "@/components/sections/SubsidiaryHero";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { ReadingProgress } from "@/components/ui/ReadingProgress";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/i18n/routing";
import {
  getAllSubsidiarySlugs,
  getGalleryBySubsidiary,
  getSectorLabel,
  getSubsidiaryBySlug,
  getUpcomingEventsBySubsidiary,
} from "@/lib/content";
import { buildSubsidiaryGalleryItems, galleryEntrySrc } from "@/lib/gallery-categories";
import {
  getSubsidiaryHeroContent,
  getSubsidiaryHeroLayout,
  resolveSubsidiaryHeroImage,
  resolveSubsidiaryHeroVideo,
} from "@/lib/subsidiary-hero-layout";
import { resolvePageMetadata } from "@/lib/seo";
import { getSubsidiaryContactImage } from "@/lib/subsidiary-contact-images";
import { getSubsidiaryEventShowcaseConfig, hasSubsidiaryEventShowcase } from "@/lib/subsidiary-events-showcase";
import { getSubsidiaryPageTheme } from "@/lib/subsidiary-themes";

import "@/styles/subsidiary-contact-band.css";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getAllSubsidiarySlugs(locale).map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const l = locale as Locale;
  const sub = getSubsidiaryBySlug(l, slug);
  if (!sub) return {};
  return resolvePageMetadata({
    title: sub.name,
    description: sub.tagline,
    path: `/filiales/${slug}`,
    locale: l,
  });
}

export default async function SubsidiaryPage({ params }: Props) {
  const { locale, slug } = await params;
  const l = locale as Locale;
  setRequestLocale(locale);

  const subsidiary = getSubsidiaryBySlug(l, slug);
  if (!subsidiary) notFound();

  const pageTheme = getSubsidiaryPageTheme(slug);
  const isThemed = Boolean(pageTheme);

  const t = await getTranslations("subsidiaries");

  const events = getUpcomingEventsBySubsidiary(l, slug);
  const galleryItems = buildSubsidiaryGalleryItems(
    subsidiary,
    getGalleryBySubsidiary(l, slug),
  );

  const heroVideo = resolveSubsidiaryHeroVideo(slug, subsidiary.heroVideo);

  const heroSlides =
    slug === "filiale-02" || heroVideo
      ? [
          {
            src:
              heroVideo?.poster ??
              resolveSubsidiaryHeroImage(slug, subsidiary.coverImage),
            alt: subsidiary.name,
          },
        ]
      : dedupeSlides([
          { src: subsidiary.coverImage, alt: subsidiary.name },
          ...subsidiary.galleryImages.slice(0, 5).map((entry, i) => ({
            src: galleryEntrySrc(entry),
            alt: `${subsidiary.name} — ${i + 1}`,
          })),
        ]);

  const mapQuery =
    subsidiary.practicalInfo.address?.trim() ||
    subsidiary.practicalInfo.phone?.trim() ||
    subsidiary.name;

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;

  const headingClass = isThemed
    ? "sub-themed-heading font-[family-name:var(--font-dm-sans)] text-3xl mb-4"
    : "font-[family-name:var(--font-dm-sans)] text-3xl text-ivory mb-4";

  const sectionHeadingClass = isThemed
    ? "sub-themed-heading font-[family-name:var(--font-dm-sans)] text-3xl mb-8"
    : "font-[family-name:var(--font-dm-sans)] text-3xl text-ivory mb-8";

  const useEventShowcase = hasSubsidiaryEventShowcase(slug);
  const eventShowcaseConfig = getSubsidiaryEventShowcaseConfig(slug);
  const showcaseEvents =
    eventShowcaseConfig && useEventShowcase
      ? events.slice(0, eventShowcaseConfig.maxEvents)
      : events;

  const eventShowcaseLabels = {
    bookNow: t("eventShowcase.bookNow"),
    eventInfo: t("eventShowcase.eventInfo"),
    viewAllEvents: t("eventShowcase.viewAllEvents"),
    statusUpcoming: t("eventShowcase.statusUpcoming"),
    statusSoldOut: t("eventShowcase.statusSoldOut"),
    statusVip: t("eventShowcase.statusVip"),
  };

  const standardEventsSection = (
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

  const content = (
    <>
      <ReadingProgress
        barClassName={
          isThemed
            ? "sub-reading-progress fixed left-0 right-0 top-0 z-[55] h-[3px] origin-left"
            : undefined
        }
      />
      {slug === "filiale-02" && subsidiary.heroSection ? (
        <WabiSabiHero
          name={subsidiary.name}
          hero={subsidiary.heroSection}
          backgroundVideo={heroVideo}
        />
      ) : (
        <SubsidiaryHero
          slides={heroSlides}
          sectorLabel={getSectorLabel(l, subsidiary.sector)}
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
      )}

      {slug === "filiale-02" && subsidiary.philosophySection && (
        <WabiSabiPhilosophySection
          name={subsidiary.name}
          brandLogo={subsidiary.brandLogo}
          content={subsidiary.philosophySection}
          sectionLabel={t("wabiPhilosophy.sectionLabel")}
        />
      )}

      {slug === "filiale-02" && subsidiary.diningSection && (
        <WabiSabiDiningShowcase content={subsidiary.diningSection} />
      )}

      {slug === "filiale-02" && subsidiary.aboutSection?.mosaicImages && (
        <WabiSabiEditorialAbout content={subsidiary.aboutSection} />
      )}

      <section className="px-4 pt-8 md:px-6 md:pt-10 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Breadcrumb
            animate
            items={[
              { label: t("breadcrumbHome"), href: "/" },
              { label: t("breadcrumbSubsidiaries"), href: "/filiales" },
              { label: subsidiary.name },
            ]}
          />
        </div>
      </section>

      {useEventShowcase && showcaseEvents.length > 0 && (
        <SubsidiaryEventShowcase
          events={showcaseEvents}
          labels={eventShowcaseLabels}
          desktopColumns={eventShowcaseConfig?.desktopColumns}
        />
      )}

      {slug !== "filiale-02" && (
      <section className="px-4 py-12 md:px-6 md:py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <AnimateIn>
            <p className="max-w-3xl text-lg leading-relaxed text-taupe">
              {subsidiary.description}
            </p>
          </AnimateIn>
        </div>
      </section>
      )}

      {slug !== "filiale-04" && slug !== "filiale-02" && (
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
      )}

      {slug === "filiale-02" && subsidiary.testimonialsSection && (
        <WabiSabiTestimonials
          section={subsidiary.testimonialsSection}
          labels={{
            carouselLabel: t("wabiTestimonials.carouselLabel"),
            prevSlide: t("wabiTestimonials.prevSlide"),
            nextSlide: t("wabiTestimonials.nextSlide"),
            goToSlide: t("wabiTestimonials.goToSlide"),
            ratingLabel: t("wabiTestimonials.ratingLabel"),
          }}
        />
      )}

      {subsidiary.aboutSection && slug === "filiale-04" && (
        <section className="subsidiary-about-after-band mx-auto max-w-7xl px-4 pb-16 md:px-6 md:pb-20">
          <SubsidiaryEditorialAbout
            content={subsidiary.aboutSection}
            variant="luxury-dark"
          />
        </section>
      )}

      {galleryItems.length > 0 && (
        <section
          id={slug === "filiale-02" ? "wabi-sabi-gallery" : undefined}
          className="mx-auto max-w-7xl px-4 py-16 md:px-6"
        >
          <AnimateIn>
            <h2 className={sectionHeadingClass}>{t("gallery")}</h2>
            <p className="-mt-4 mb-8 max-w-2xl text-sm text-taupe md:mb-10">
              {t("galleryDescription")}
            </p>
          </AnimateIn>
          <SubsidiaryExpandableGallery
            items={galleryItems}
            subsidiaryName={subsidiary.name}
            sectorLabel={getSectorLabel(l, subsidiary.sector)}
            accentColor={pageTheme?.colors.gold ?? subsidiary.accentColor}
            backgroundColor={pageTheme?.colors.surface}
            themed={isThemed}
          />
        </section>
      )}

      {subsidiary.aboutSection && slug !== "filiale-04" && slug !== "filiale-02" && (
        <SubsidiaryEditorialAbout content={subsidiary.aboutSection} />
      )}

      {!useEventShowcase && standardEventsSection}

      {slug === "filiale-02" ? (
        <WabiSabiPracticalSection
          backgroundImage="/filiales/photos/filiale-02/gallery/14-ao8a4577.webp"
          hours={subsidiary.practicalInfo.hours}
          address={subsidiary.practicalInfo.address}
          mapQuery={mapQuery}
          mapsUrl={subsidiary.practicalInfo.address ? mapsUrl : undefined}
          social={subsidiary.social}
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
      ) : (
        <section className="mx-auto max-w-7xl px-4 pb-16 md:px-6 md:pb-20">
          <AnimateIn>
            <h2 className={headingClass}>{t("mapAccess")}</h2>
            <p className="mb-6 max-w-xl text-sm text-taupe">{t("mapDescription")}</p>
          </AnimateIn>
          <MapEmbed
            query={mapQuery}
            title={t("mapTitle", { name: subsidiary.name })}
            variant="compact"
          />
        </section>
      )}

      <div className="h-20 lg:hidden" aria-hidden />

      <StickyMobileActions
        phone={subsidiary.practicalInfo.phone}
        mapsUrl={subsidiary.practicalInfo.address ? mapsUrl : undefined}
        subsidiaryName={subsidiary.name}
        themed={isThemed}
      />
    </>
  );

  if (pageTheme) {
    return <SubsidiaryThemeShell theme={pageTheme}>{content}</SubsidiaryThemeShell>;
  }

  return content;
}

function dedupeSlides(slides: { src: string; alt: string }[]) {
  const seen = new Set<string>();
  return slides.filter((s) => {
    if (seen.has(s.src)) return false;
    seen.add(s.src);
    return true;
  });
}
