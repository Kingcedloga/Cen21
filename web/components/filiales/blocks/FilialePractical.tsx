"use client";

import { useTranslations } from "next-intl";

import { MapEmbed } from "@/components/maps/MapEmbed";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { kinshasaNow } from "@/lib/opening-status";
import { buildHoursSchedule, weekdayLabel } from "@/lib/subsidiary-hours";
import type { Subsidiary } from "@/lib/types";
import { MapPin, Phone } from "@/lib/icons";
import { useHydrated } from "@/lib/use-media-query";

import { FilialeOpenStatus } from "./FilialeOpenStatus";

import "@/styles/filiale-blocks.css";

/**
 * Infos pratiques en bento (Orbix : bento de trois cartes) : horaires (jours
 * regroupés, jour courant à Kinshasa surligné après hydratation), adresse et
 * carte, contact et réseaux.
 */
export function FilialePractical({ subsidiary, locale, mapQuery, mapsUrl }: { subsidiary: Subsidiary; locale: string; mapQuery: string; mapsUrl: string }) {
  const t = useTranslations("filiale");
  const tCommon = useTranslations("common");
  const tSub = useTranslations("subsidiaries");
  const hydrated = useHydrated();
  const { hours, address, phone } = subsidiary.practicalInfo;

  // Jours consécutifs au même horaire regroupés (« MAR – DIM »), bornes gardées
  // pour surligner le jour courant à Kinshasa (après hydratation).
  const schedule = hours ? buildHoursSchedule(hours, locale).schedule : [];
  const ranges: { from: number; to: number; closed: boolean; range: string }[] = [];
  for (const entry of schedule) {
    const last = ranges[ranges.length - 1];
    const closed = Boolean(entry.closed);
    if (last && last.closed === closed && (closed || last.range === entry.range)) last.to = entry.index;
    else ranges.push({ from: entry.index, to: entry.index, closed, range: entry.range });
  }
  const dayName = (index: number) => weekdayLabel(locale, index).replace(/\./g, "").toUpperCase();
  const today = hydrated ? kinshasaNow().day : -1;

  return (
    <div className="filiale-practical">
      <SectionHeading
        look="editorial"
        eyebrow={t("practicalEyebrow")}
        title={t("practicalTitle", { name: subsidiary.name })}
        sweep={subsidiary.name}
        titleAs="h2"
        titleId="filiale-practical-title"
        align="left"
        className="mb-10! max-w-2xl"
      />
      <div className="filiale-bento">
        {hours && (
          <article className="filiale-bento__card filiale-bento__card--hours">
            <h3 className="filiale-bento__label">{t("hoursTitle")}</h3>
            <FilialeOpenStatus hours={hours} locale={locale} />
            <ul className="filiale-hours">
              {ranges.map((group) => {
                const isToday = today >= group.from && today <= group.to;
                const days = group.from === group.to ? dayName(group.from) : `${dayName(group.from)} – ${dayName(group.to)}`;
                return (
                  <li key={group.from} data-today={isToday ? "" : undefined} data-closed={group.closed ? "" : undefined}>
                    <span>
                      {days}
                      {isToday && <span className="filiale-hours__today">{t("today")}</span>}
                    </span>
                    <span>{group.closed ? t("closed") : group.range}</span>
                  </li>
                );
              })}
            </ul>
          </article>
        )}

        <article className="filiale-bento__card filiale-bento__card--map">
          <h3 className="filiale-bento__label">{t("addressTitle")}</h3>
          {address && (
            <p className="filiale-bento__line">
              <MapPin size={16} aria-hidden="true" />
              {address}
            </p>
          )}
          <MapEmbed query={mapQuery} title={tSub("mapTitle", { name: subsidiary.name })} variant="compact" className="mt-auto" />
        </article>

        <article className="filiale-bento__card filiale-bento__card--contact">
          <h3 className="filiale-bento__label">{t("contactTitle")}</h3>
          {phone && (
            <a href={`tel:${phone.replace(/\s/g, "")}`} className="filiale-bento__phone title-section">
              <Phone size={18} aria-hidden="true" />
              {phone}
            </a>
          )}
          <div className="filiale-bento__actions">
            <a href="#reservation" className="btn-primary tap-press inline-flex min-h-11 items-center px-6 text-sm font-medium">
              {t("reserve")}
            </a>
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary tap-press inline-flex min-h-11 items-center px-6 text-sm font-medium">
              {tCommon("directions")}
            </a>
          </div>
          <SocialLinks social={subsidiary.social} label={t("socialLabel", { name: subsidiary.name })} className="mt-auto" />
        </article>
      </div>
    </div>
  );
}
