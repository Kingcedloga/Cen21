import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";

import { EventCard } from "@/components/cards/EventCard";
import { StickyMobileActions } from "@/components/filiales/StickyMobileActions";
import { SubsidiaryThemeShell } from "@/components/filiales/SubsidiaryThemeShell";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { MapEmbed } from "@/components/maps/MapEmbed";
import { SubsidiaryHero } from "@/components/sections/SubsidiaryHero";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
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
import { resolvePageMetadata } from "@/lib/seo";
import { getSubsidiaryPageTheme } from "@/lib/subsidiary-themes";

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
  const galleryItems = [
    ...subsidiary.galleryImages.map((src, i) => ({
      id: `${slug}-gal-${i}`,
      src,
      alt: `${subsidiary.name} — ${i + 1}`,
      subsidiarySlug: slug,
      tags: ["filiale"],
    })),
    ...getGalleryBySubsidiary(l, slug),
  ];

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
          ...subsidiary.galleryImages.slice(0, 5).map((src, i) => ({
            src,
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

  const infoBandClass = isThemed
    ? "sub-themed-info-band py-12 px-4 md:px-6"
    : "py-12 px-4 md:px-6 bg-anthracite/40";

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
        brandLogo={isThemed ? subsidiary.brandLogo : undefined}
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

      <section className={infoBandClass}>
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-3">
          {(() => {
            let infoIndex = 0;
            return (
              <>
                {subsidiary.practicalInfo.address && (
                  <AnimateIn delay={infoIndex++ * 0.05}>
                    <InfoItem
                      icon={<Icon name="location" size="md" />}
                      label={t("address")}
                      value={subsidiary.practicalInfo.address}
                      themed={isThemed}
                    />
                  </AnimateIn>
                )}
                {subsidiary.practicalInfo.hours && (
                  <AnimateIn delay={infoIndex++ * 0.05}>
                    <InfoItem
                      icon={<Icon name="hours" size="md" />}
                      label={t("hours")}
                      value={subsidiary.practicalInfo.hours}
                      themed={isThemed}
                    />
                  </AnimateIn>
                )}
                {subsidiary.practicalInfo.phone && (
                  <AnimateIn delay={infoIndex++ * 0.05}>
                    <InfoItem
                      icon={<Icon name="phone" size="md" />}
                      label={t("phone")}
                      value={
                        <a
                          href={`tel:${subsidiary.practicalInfo.phone?.replace(/\s/g, "")}`}
                          className="transition-colors hover:text-gold cursor-pointer"
                        >
                          {subsidiary.practicalInfo.phone}
                        </a>
                      }
                      themed={isThemed}
                    />
                  </AnimateIn>
                )}
              </>
            );
          })()}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <AnimateIn>
          <h2 className={headingClass}>{t("mapAccess")}</h2>
          <p className="mb-6 max-w-2xl text-sm text-taupe">{t("mapDescription")}</p>
        </AnimateIn>
        <MapEmbed query={mapQuery} title={t("mapTitle", { name: subsidiary.name })} />
      </section>

      {galleryItems.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
          <AnimateIn>
            <h2 className={sectionHeadingClass}>{t("gallery")}</h2>
          </AnimateIn>
          <GalleryGrid items={galleryItems} showFilters={false} />
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

function InfoItem({
  icon,
  label,
  value,
  themed = false,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  themed?: boolean;
}) {
  return (
    <div className="glass-panel rounded-xl p-6">
      <div className="mb-2 flex items-center gap-2">
        <span className={themed ? "text-[var(--sub-gold)]" : undefined}>{icon}</span>
        <span className="text-xs uppercase tracking-[0.15em] text-gold">{label}</span>
      </div>
      <p className="text-sm text-ivory">{value}</p>
    </div>
  );
}
