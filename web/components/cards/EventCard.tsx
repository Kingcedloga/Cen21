"use client";

import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import { useLocale } from "next-intl";

import { SubsidiaryHrefLink } from "@/components/navigation/SubsidiaryHrefLink";
import type { Locale } from "@/i18n/routing";
import { getSubsidiaryBySlug } from "@/lib/content";
import { BLUR_PETROL } from "@/lib/image-blur";
import { resolveEventImage } from "@/lib/event-images";
import type { EventItem } from "@/lib/types";

function formatDate(iso: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function EventCard({ event }: { event: EventItem }) {
  const locale = useLocale() as Locale;
  const subsidiary = getSubsidiaryBySlug(locale, event.subsidiarySlug);
  const imageSrc = resolveEventImage(event, subsidiary?.coverImage);

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/12 bg-petrol/60 backdrop-blur-md shadow-[0_18px_40px_-22px_rgba(0,0,0,0.55)] transition-all duration-luxe ease-out hover:-translate-y-2 hover:border-gold/50 hover:shadow-[0_26px_60px_-16px_rgba(212,173,101,0.28)]">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={imageSrc}
          alt={event.title}
          fill
          placeholder="blur"
          blurDataURL={BLUR_PETROL}
          className="object-cover transition-transform duration-grand ease-out group-hover:scale-[1.06]"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-petrol/85 via-petrol/20 to-transparent" />
      </div>
      <div className="p-6 flex flex-col flex-1">
        {subsidiary && (
          <SubsidiaryHrefLink
            subsidiary={subsidiary}
            className="text-gold text-xs tracking-[0.15em] uppercase mb-2 hover:underline cursor-pointer"
          >
            {subsidiary.name}
          </SubsidiaryHrefLink>
        )}
        <h3 className="font-[family-name:var(--font-dm-sans)] text-xl text-ivory mb-3">
          {event.title}
        </h3>
        <p className="text-taupe text-sm mb-4 flex-1">{event.excerpt}</p>
        <ul className="space-y-2 text-sm text-stone">
          <li className="flex items-center gap-2">
            <Icon name="calendar" size="sm" />
            <time dateTime={event.date}>{formatDate(event.date, locale)}</time>
          </li>
          <li className="flex items-center gap-2">
            <Icon name="location" size="sm" />
            {event.location}
          </li>
        </ul>
      </div>
    </article>
  );
}
