import Image from "next/image";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Clock, MapPin, Phone } from "lucide-react";

import { EventCard } from "@/components/cards/EventCard";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { Button } from "@/components/ui/Button";
import { SocialLinks } from "@/components/ui/SocialLinks";
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

  return (
    <>
      <section className="relative min-h-[60vh] flex items-end">
        <Image
          src={subsidiary.coverImage}
          alt={subsidiary.name}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to top, #0B2429 0%, transparent 60%), linear-gradient(90deg, ${subsidiary.accentColor}33 0%, transparent 30%)`,
          }}
        />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-10 pb-16 md:pb-20 pt-32 md:pt-36">
          <p className="text-gold text-sm tracking-[0.2em] uppercase mb-3">
            {SECTOR_LABELS[subsidiary.sector]}
          </p>
          <h1 className="font-[family-name:var(--font-cormorant)] text-5xl md:text-6xl text-ivory mb-4">
            {subsidiary.name}
          </h1>
          <p className="text-xl text-taupe max-w-2xl mb-6">{subsidiary.tagline}</p>
          <SocialLinks social={subsidiary.social} label="Suivez-nous" />
        </div>
      </section>

      <section className="py-16 px-4 md:px-6 max-w-7xl mx-auto">
        <AnimateIn>
          <p className="text-taupe text-lg leading-relaxed max-w-3xl">
            {subsidiary.description}
          </p>
        </AnimateIn>
      </section>

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

      {galleryItems.length > 0 && (
        <section className="py-16 px-4 md:px-6 max-w-7xl mx-auto">
          <h2 className="font-[family-name:var(--font-cormorant)] text-3xl text-ivory mb-8">
            Galerie
          </h2>
          <GalleryGrid items={galleryItems} showFilters={false} />
        </section>
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

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
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
