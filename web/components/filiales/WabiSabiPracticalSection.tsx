"use client";

import { useLocale } from "next-intl";

import { Button } from "@/components/ui/Button";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { cormorant } from "@/lib/fonts";
import type { Locale } from "@/i18n/routing";
import { googleMapsEmbedUrl } from "@/lib/map";
import {
  buildHoursSchedule,
  groupHoursSchedule,
} from "@/lib/subsidiary-hours";
import type { SocialLinks as SocialLinksType } from "@/lib/types";

import "@/styles/subsidiary-wabi-practical.css";

export type WabiPracticalLabels = {
  hoursTitle: string;
  locationTitle: string;
  bookTable: string;
  getDirections: string;
  closed: string;
  mapTitle: string;
  socialLabel: string;
};

type Props = {
  hours?: string;
  address?: string;
  mapQuery: string;
  mapsUrl?: string;
  social: SocialLinksType;
  labels: WabiPracticalLabels;
};

export function WabiSabiPracticalSection({
  hours,
  address,
  mapQuery,
  mapsUrl,
  social,
  labels,
}: Props) {
  const locale = useLocale() as Locale;
  const parsed = hours ? buildHoursSchedule(hours, locale) : null;
  const hourGroups = parsed
    ? groupHoursSchedule(parsed.schedule, locale, labels.closed)
    : [];

  const mapSrc = mapQuery.trim() ? googleMapsEmbedUrl(mapQuery) : null;

  return (
    <section
      className={`wabi-practical ${cormorant.variable}`}
      aria-label={labels.locationTitle}
    >
      <div className="wabi-practical__inner">
        <div className="wabi-practical__grid">
          <article className="wabi-practical__card">
            <h2 className="wabi-practical__card-title">{labels.hoursTitle}</h2>

            {hourGroups.length > 0 ? (
              <ul className="wabi-practical__hours-list">
                {hourGroups.map((group) => (
                  <li key={group.daysLabel} className="wabi-practical__hours-row">
                    <span className="wabi-practical__hours-days">{group.daysLabel}</span>
                    <span
                      className={[
                        "wabi-practical__hours-time",
                        group.closed ? "wabi-practical__hours-time--closed" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      {group.range}
                    </span>
                  </li>
                ))}
              </ul>
            ) : hours ? (
              <p className="wabi-practical__hours-time text-center">{hours}</p>
            ) : null}

            <Button href="/contact" variant="primary" size="lg" className="wabi-practical__cta">
              {labels.bookTable}
            </Button>
          </article>

          <article className="wabi-practical__card">
            <h2 className="wabi-practical__card-title">{labels.locationTitle}</h2>

            {mapSrc ? (
              <div className="wabi-practical__map-wrap">
                <iframe
                  title={labels.mapTitle}
                  src={mapSrc}
                  className="wabi-practical__map-iframe"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            ) : null}

            {address ? (
              <p className="wabi-practical__address">{address}</p>
            ) : null}

            <SocialLinks
              social={social}
              label={labels.socialLabel}
              className="wabi-practical__social"
              size="sm"
            />

            {mapsUrl ? (
              <Button
                href={mapsUrl}
                variant="secondary"
                size="lg"
                external
                className="wabi-practical__directions"
              >
                {labels.getDirections}
              </Button>
            ) : null}
          </article>
        </div>
      </div>
    </section>
  );
}
