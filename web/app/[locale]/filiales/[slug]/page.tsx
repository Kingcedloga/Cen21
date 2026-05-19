import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";
import { Clock, MapPin, Phone } from "lucide-react";

import { EventCard } from "@/components/cards/EventCard";
import { StickyMobileActions } from "@/components/filiales/StickyMobileActions";
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
import { createPageMetadata } from "@/lib/seo";

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
  return createPageMetadata({
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

  const t = await getTranslations("subsidiaries");
  const tCommon = await getTranslations("common");

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

  const heroSlides = dedupeSlides([
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

  return (
    <>
      <ReadingProgress />
      <SubsidiaryHero
        slides={heroSlides}
        sectorLabel={getSectorLabel(l, subsidiary.sector)}
        name={subsidiary.name}
        tagline={subsidiary.tagline}
        social={subsidiary.social}
      />

      <section className="px-4 pt-8 md:px-6 md:pt-10 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Breadcrumb
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

      <section className="py-12 px-4 md:px-6 bg-anthracite/40">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {subsidiary.practicalInfo.address && (
            <InfoItem
              icon={<MapPin className="w-5 h-5 text-gold" />}
              label={t("address")}
              value={subsidiary.practicalInfo.address}
            />
          )}
          {subsidiary.practicalInfo.hours && (
            <InfoItem
              icon={<Clock className="w-5 h-5 text-gold" />}
              label={t("hours")}
              value={subsidiary.practicalInfo.hours}
            />
          )}
          {subsidiary.practicalInfo.phone && (
            <InfoItem
              icon={<Phone className="w-5 h-5 text-gold" />}
              label={t("phone")}
              value={
                <a
                  href={`tel:${subsidiary.practicalInfo.phone?.replace(/\s/g, "")}`}
                  className="hover:text-gold transition-colors cursor-pointer"
                >
                  {subsidiary.practicalInfo.phone}
                </a>
              }
            />
          )}
        </div>
      </section>

      <section className="py-16 px-4 md:px-6 max-w-7xl mx-auto">
        <h2 className="font-[family-name:var(--font-dm-sans)] text-3xl text-ivory mb-4">
          {t("mapAccess")}
        </h2>
        <p className="text-taupe text-sm mb-6 max-w-2xl">{t("mapDescription")}</p>
        <MapEmbed query={mapQuery} title={t("mapTitle", { name: subsidiary.name })} />
      </section>

      {galleryItems.length > 0 && (
        <section className="py-16 px-4 md:px-6 max-w-7xl mx-auto">
          <h2 className="font-[family-name:var(--font-dm-sans)] text-3xl text-ivory mb-8">
            {t("gallery")}
          </h2>
          <GalleryGrid items={galleryItems} showFilters={false} />
        </section>
      )}

      <section className="py-16 px-4 md:px-6 max-w-7xl mx-auto">
        <h2 className="font-[family-name:var(--font-dm-sans)] text-3xl text-ivory mb-8">
          {t("upcomingEvents")}
        </h2>
        {events.length === 0 ? (
          <p className="text-taupe mb-8">{t("noEventsScheduled")}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
        <Button href="/evenements" variant="secondary">
          {t("allEvents")}
        </Button>
      </section>

      <div className="lg:hidden h-20" aria-hidden />

      <StickyMobileActions
        phone={subsidiary.practicalInfo.phone}
        mapsUrl={subsidiary.practicalInfo.address ? mapsUrl : undefined}
        subsidiaryName={subsidiary.name}
      />
    </>
  );
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
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="glass-panel p-6 rounded-xl">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-gold text-xs tracking-[0.15em] uppercase">{label}</span>
      </div>
      <p className="text-ivory text-sm">{value}</p>
    </div>
  );
}
