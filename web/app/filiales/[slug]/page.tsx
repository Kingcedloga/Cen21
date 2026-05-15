import Image from "next/image";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Clock, MapPin, Phone } from "lucide-react";

import { EventCard } from "@/components/cards/EventCard";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { MapEmbed } from "@/components/maps/MapEmbed";
import { SectionWave } from "@/components/layout/SectionWave";
import { SubsidiaryHero } from "@/components/sections/SubsidiaryHero";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { Button } from "@/components/ui/Button";
import {
  SECTOR_LABELS,
  getAllSubsidiarySlugs,
  getGalleryBySubsidiary,
  getSubsidiaryBySlug,
  getUpcomingEventsBySubsidiary,
} from "@/lib/content";
import { createPageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllSubsidiarySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const sub = getSubsidiaryBySlug(slug);
  if (!sub) return {};
  return createPageMetadata({
    title: sub.name,
    description: sub.tagline,
    path: `/filiales/${slug}`,
  });
}

export default async function SubsidiaryPage({ params }: Props) {
  const { slug } = await params;
  const subsidiary = getSubsidiaryBySlug(slug);
  if (!subsidiary) notFound();

  const events = getUpcomingEventsBySubsidiary(slug);
  const galleryItems = [
    ...subsidiary.galleryImages.map((src, i) => ({
      id: `${slug}-gal-${i}`,
      src,
      alt: `${subsidiary.name} — visuel ${i + 1}`,
      subsidiarySlug: slug,
      tags: ["filiale"],
    })),
    ...getGalleryBySubsidiary(slug),
  ];

  const heroSlides = dedupeSlides([
    { src: subsidiary.coverImage, alt: subsidiary.name },
    ...subsidiary.galleryImages.slice(0, 5).map((src, i) => ({
      src,
      alt: `${subsidiary.name} — ambiance ${i + 1}`,
    })),
  ]);

  const mapQuery =
    subsidiary.practicalInfo.address?.trim() ||
    subsidiary.practicalInfo.phone?.trim() ||
    subsidiary.name;

  return (
    <>
      <SubsidiaryHero
        slides={heroSlides}
        sectorLabel={SECTOR_LABELS[subsidiary.sector]}
        name={subsidiary.name}
        tagline={subsidiary.tagline}
        social={subsidiary.social}
      />

      <SectionWave fill="petrol" />

      <section className="py-16 px-4 md:px-6 max-w-7xl mx-auto">
        <AnimateIn>
          <p className="text-taupe text-lg leading-relaxed max-w-3xl">
            {subsidiary.description}
          </p>
        </AnimateIn>
      </section>

      <SectionWave fill="band" />

      <section className="py-12 px-4 md:px-6 bg-anthracite/40">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {subsidiary.practicalInfo.address && (
            <InfoItem
              icon={<MapPin className="w-5 h-5 text-gold" />}
              label="Adresse"
              value={subsidiary.practicalInfo.address}
            />
          )}
          {subsidiary.practicalInfo.hours && (
            <InfoItem
              icon={<Clock className="w-5 h-5 text-gold" />}
              label="Horaires"
              value={subsidiary.practicalInfo.hours}
            />
          )}
          {subsidiary.practicalInfo.phone && (
            <InfoItem
              icon={<Phone className="w-5 h-5 text-gold" />}
              label="Téléphone"
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

      <SectionWave fill="petrol" flip />

      <section className="py-16 px-4 md:px-6 max-w-7xl mx-auto">
        <h2 className="font-[family-name:var(--font-cormorant)] text-3xl text-ivory mb-4">
          Plan d&apos;accès
        </h2>
        <p className="text-taupe text-sm mb-6 max-w-2xl">
          Localisez l&apos;établissement sur la carte. L&apos;itinéraire s&apos;ouvre dans Google Maps.
        </p>
        <MapEmbed
          query={mapQuery}
          title={`Carte — ${subsidiary.name}`}
        />
      </section>

      {galleryItems.length > 0 ? (
        <>
          <SectionWave fill="petrol" />
          <section className="py-16 px-4 md:px-6 max-w-7xl mx-auto">
            <h2 className="font-[family-name:var(--font-cormorant)] text-3xl text-ivory mb-8">
              Galerie
            </h2>
            <GalleryGrid items={galleryItems} showFilters={false} />
          </section>
          <SectionWave fill="petrol" flip />
        </>
      ) : (
        <SectionWave fill="petrol" flip />
      )}

      <section className="py-16 px-4 md:px-6 max-w-7xl mx-auto">
        <h2 className="font-[family-name:var(--font-cormorant)] text-3xl text-ivory mb-8">
          Événements à venir
        </h2>
        {events.length === 0 ? (
          <p className="text-taupe mb-8">
            Aucun événement programmé pour le moment.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
        <Button href="/evenements" variant="secondary">
          Tous les événements
        </Button>
      </section>
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
