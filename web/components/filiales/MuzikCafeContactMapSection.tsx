"use client";

import { googleMapsEmbedUrl } from "@/lib/map";

import "@/styles/muzik-cafe-contact-map.css";

type Props = {
  mapQuery: string;
  subsidiaryName: string;
};

export function MuzikCafeContactMapSection({ mapQuery, subsidiaryName }: Props) {
  const embedUrl = googleMapsEmbedUrl(mapQuery);

  return (
    <section className="muzik-contact-map">
      <div className="muzik-contact-map__map-clip">
        <iframe
          title={`Carte — ${subsidiaryName}`}
          src={embedUrl}
          className="muzik-contact-map__iframe"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
