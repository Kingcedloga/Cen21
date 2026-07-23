"use client";

import { useTranslations } from "next-intl";

import { AnimateIn } from "@/components/ui/AnimateIn";
import { MapPin } from "@/lib/icons";
import { googleMapsEmbedUrl } from "@/lib/map";

import "@/styles/gourmet-mexicana-contact-map.css";

type Props = {
  mapQuery: string;
  mapsUrl: string;
};

export function GourmetMexicanaContactMapSection({ mapQuery, mapsUrl }: Props) {
  const t = useTranslations("subsidiaries");
  const embedUrl = googleMapsEmbedUrl(mapQuery);

  return (
    <section className="mex-map">
      <div className="mex-map__inner">
        <AnimateIn className="mex-map__header">
          <div>
            <p className="mex-map__eyebrow">{t("gourmetMexicanaMap.eyebrow")}</p>
            <h2 className="mex-map__title">{t("gourmetMexicanaMap.title")}</h2>
          </div>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mex-map__cta"
          >
            <MapPin size={15} aria-hidden="true" />
            {t("gourmetMexicanaMap.ctaLabel")}
          </a>
        </AnimateIn>

        <div className="mex-map__clip">
          <iframe
            title={t("gourmetMexicanaMap.iframeTitle")}
            src={embedUrl}
            className="mex-map__iframe"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
}
