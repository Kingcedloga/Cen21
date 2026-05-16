import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";

import { getSubsidiaryBySlug } from "@/lib/content";
import { BLUR_PETROL } from "@/lib/image-blur";
import type { EventItem } from "@/lib/types";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function EventCard({ event }: { event: EventItem }) {
  const subsidiary = getSubsidiaryBySlug(event.subsidiarySlug);

  return (
    <article className="glass-panel rounded-sm overflow-hidden flex flex-col h-full">
      <div className="relative aspect-[16/10]">
        <Image
          src={event.image}
          alt={event.title}
          fill
          placeholder="blur"
          blurDataURL={BLUR_PETROL}
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      <div className="p-6 flex flex-col flex-1">
        {subsidiary && (
          <Link
            href={`/filiales/${subsidiary.slug}`}
            className="text-gold text-xs tracking-[0.15em] uppercase mb-2 hover:underline cursor-pointer"
          >
            {subsidiary.name}
          </Link>
        )}
        <h3 className="font-[family-name:var(--font-cormorant)] text-xl text-ivory mb-3">
          {event.title}
        </h3>
        <p className="text-taupe text-sm mb-4 flex-1">{event.excerpt}</p>
        <ul className="space-y-2 text-sm text-stone">
          <li className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gold shrink-0" aria-hidden />
            <time dateTime={event.date}>{formatDate(event.date)}</time>
          </li>
          <li className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gold shrink-0" aria-hidden />
            {event.location}
          </li>
        </ul>
      </div>
    </article>
  );
}
