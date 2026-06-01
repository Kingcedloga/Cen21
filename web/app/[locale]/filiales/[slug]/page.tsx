import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { EventCard } from "@/components/cards/EventCard";
import { StickyMobileActions } from "@/components/filiales/StickyMobileActions";
import { SubsidiaryContactBand } from "@/components/filiales/SubsidiaryContactBand";
import { SubsidiaryThemeShell } from "@/components/filiales/SubsidiaryThemeShell";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
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
import { resolvePageMetadata } from "@/lib/seo";
import { getSubsidiaryContactImage } from "@/lib/subsidiary-contact-images";
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

  const galleryCategoryLabels = {
    all: t("galleryFilterAll"),
    vibes: t("galleryCategories.vibes"),
    guests: t("galleryCategories.guests"),
    events: t("galleryCategories.events"),
    food: t("galleryCategories.food"),
    drinks: t("galleryCategories.drinks"),
    interior: t("galleryCategories.interior"),
    ambiance: t("galleryCategories.ambiance"),
  };

  const heroSlides =
    slug === "filiale-02" || subsidiary.heroVideo
      ? [
          {
            src: subsidiary.heroVideo?.poster ?? subsidiary.coverImage,
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

  const contactImage = getSubsidiaryContactImage(slug, subsidiary.coverImage);

  const content = (
    <>
      <ReadingProgress
        barClassName={
          isThemed
            ? "sub-reading-progress fixed left-0 right-0 top-0 z-[55] h-[3px] origin-left"
            : undefined
        }
      />
      <SubsidiaryHero
        slides={heroSlides}
        sectorLabel={getSectorLabel(l, subsidiary.sector)}
        name={subsidiary.name}
        tagline={subsidiary.tagline}
        social={subsidiary.social}
        brandLogo={subsidiary.brandLogo}
        accentColor={subsidiary.accentColor}
        theme={pageTheme ?? undefined}
        backgroundVideo={subsidiary.heroVideo}
      />

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

      <section className="px-4 py-12 md:px-6 md:py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <AnimateIn>
            <p className="max-w-3xl text-lg leading-relaxed text-taupe">
              {subsidiary.description}
            </p>
          </AnimateIn>
        </div>
      </section>

      <SubsidiaryContactBand
        backgroundImage={contactImage}
        hoursLabel={t("contactBand.hours")}
        findUsLabel={t("contactBand.findUs")}
        callUsLabel={t("contactBand.callUs")}
        ctaLabel={t("contactBand.getDirection")}
        hours={subsidiary.practicalInfo.hours}
        address={subsidiary.practicalInfo.address}
        phone={subsidiary.practicalInfo.phone}
        mapsUrl={subsidiary.practicalInfo.address ? mapsUrl : undefined}
        themed={isThemed}
      />

      {galleryItems.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
          <AnimateIn>
            <h2 className={sectionHeadingClass}>{t("gallery")}</h2>
            <p className="-mt-4 mb-8 max-w-2xl text-sm text-taupe md:mb-10">
              {t("galleryDescription")}
            </p>
          </AnimateIn>
          <GalleryGrid
            items={galleryItems}
            showFilters
            categoryLabels={galleryCategoryLabels}
            emptyFilterLabel={t("galleryEmptyCategory")}
          />
        </section>
      )}

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
