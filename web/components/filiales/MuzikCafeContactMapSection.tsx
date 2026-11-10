"use client";


import { reveal } from "@/components/motion/Reveal";
import { googleMapsEmbedUrl } from "@/lib/map";
import { defaultScrollViewport, fadeUpTransition, fadeUpVariants } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/use-media-query";

import "@/styles/muzik-cafe-contact-map.css";

type Props = {
  mapQuery: string;
  subsidiaryName: string;
};

export function MuzikCafeContactMapSection({ mapQuery, subsidiaryName }: Props) {
  const reduced = useReducedMotionSafe();
  const embedUrl = googleMapsEmbedUrl(mapQuery);

  return (
    <section className="muzik-contact-map">
      <reveal.div
        className="muzik-contact-map__map-clip"
        initial={reduced ? false : "hidden"}
        whileInView={reduced ? undefined : "visible"}
        viewport={defaultScrollViewport}
        variants={reduced ? undefined : fadeUpVariants}
        transition={fadeUpTransition}
      >
        <iframe
          title={`Carte — ${subsidiaryName}`}
          src={embedUrl}
          className="muzik-contact-map__iframe"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          aria-hidden="true"
        />
      </reveal.div>
    </section>
  );
}
