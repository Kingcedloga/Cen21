"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { MapEmbed } from "@/components/maps/MapEmbed";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArrowUpRight } from "@/lib/icons";
import { DURATION_S, EASE } from "@/lib/motion";
import { kinshasaNow } from "@/lib/opening-status";
import { buildHoursSchedule, weekdayLabel } from "@/lib/subsidiary-hours";
import type { Subsidiary } from "@/lib/types";
import { useHydrated, useReducedMotionSafe } from "@/lib/use-media-query";

import { FilialeOpenStatus } from "./FilialeOpenStatus";

import "@/styles/filiale-blocks.css";

const mapsLink = (query: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

/**
 * Infos pratiques en fiche de lieu : une seule carte, la fiche (état
 * d'ouverture, adresse, horaires, téléphone, réseaux, actions) à côté d'une
 * grande carte Google, passée en mode nuit sur une charte sombre.
 *
 * Maison à plusieurs adresses : le sélecteur de ville, au-dessus de la fiche,
 * change d'un coup l'adresse, la carte, le téléphone et l'itinéraire.
 * Mobile : la carte en tête de fiche, comme une fiche de lieu d'appli.
 */
export function FilialePractical({ subsidiary, locale, mapQuery, mapsUrl }: { subsidiary: Subsidiary; locale: string; mapQuery: string; mapsUrl: string }) {
  const t = useTranslations("filiale");
  const tCommon = useTranslations("common");
  const tSub = useTranslations("subsidiaries");
  const hydrated = useHydrated();
  const reduced = useReducedMotionSafe();
  const { hours, address, phone, locations = [] } = subsidiary.practicalInfo;
  const multi = locations.length > 1;
  const [cityIndex, setCityIndex] = useState(0);
  // La fiche ne se fond qu'après un changement de ville, jamais au chargement.
  const [switched, setSwitched] = useState(false);
  const location = multi ? locations[cityIndex] : undefined;
  const place = location ?? { city: undefined, address, phone };
  const placeQuery = location ? location.address : mapQuery;
  const placeMapsUrl = location ? mapsLink(location.address) : mapsUrl;
  const hasSocial = Boolean(subsidiary.social.instagram || subsidiary.social.facebook || subsidiary.social.linkedin);

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

  const ease = { duration: reduced ? 0 : DURATION_S.base, ease: EASE.luxury };

  return (
    <div className="filiale-practical">
      <div className="filiale-practical__head">
        <SectionHeading
          look="editorial"
          eyebrow={t("practicalEyebrow")}
          title={t("practicalTitle", { name: subsidiary.name })}
          sweep={subsidiary.name}
          titleAs="h2"
          titleId="filiale-practical-title"
          align="left"
          className="mb-0! max-w-2xl"
        />
        {multi && (
          <div role="group" aria-label={t("citiesLabel", { name: subsidiary.name })} className="filiale-switch">
            {locations.map((item, index) => {
              const active = index === cityIndex;
              return (
                <button
                  key={item.city}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    setCityIndex(index);
                    setSwitched(true);
                  }}
                  className="filiale-switch__button tap-press"
                >
                  {active && (
                    <motion.span
                      layoutId={`filiale-switch-${subsidiary.slug}`}
                      aria-hidden="true"
                      className="filiale-switch__pill"
                      transition={ease}
                    />
                  )}
                  <span className="relative">{item.city}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <article className="filiale-place" aria-labelledby="filiale-practical-title">
        <div className="filiale-place__info">
          {hours && <FilialeOpenStatus hours={hours} locale={locale} />}

          <motion.dl
            key={cityIndex}
            className="filiale-place__facts"
            aria-live={multi ? "polite" : undefined}
            initial={switched && !reduced ? { opacity: 0, y: 8 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={ease}
          >
            {place.address && (
              <div className="filiale-place__row">
                <dt>{t("addressTitle")}</dt>
                <dd className="filiale-place__value title-section">{place.address}</dd>
              </div>
            )}
            {hours && (
              <div className="filiale-place__row">
                <dt>{t("hoursTitle")}</dt>
                <dd>
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
                </dd>
              </div>
            )}
            {place.phone && (
              <div className="filiale-place__row">
                <dt>{t("phoneTitle")}</dt>
                <dd>
                  <a href={`tel:${place.phone.replace(/\s/g, "")}`} className="filiale-place__value filiale-place__phone title-section">
                    {place.phone}
                  </a>
                </dd>
              </div>
            )}
            {hasSocial && (
              <div className="filiale-place__row">
                <dt>{t("socialTitle")}</dt>
                <dd>
                  <SocialLinks social={subsidiary.social} className="filiale-place__social" />
                </dd>
              </div>
            )}
          </motion.dl>

          <div className="filiale-place__actions">
            <a href="#reservation" className="btn-primary tap-press inline-flex min-h-11 items-center justify-center px-6 text-sm font-medium">
              {t("reserve")}
            </a>
            <a
              href={placeMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary tap-press inline-flex min-h-11 items-center justify-center gap-2 px-6 text-sm font-medium"
            >
              {tCommon("directions")}
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="filiale-place__map">
          <MapEmbed
            key={placeQuery}
            query={placeQuery}
            title={tSub("mapTitle", { name: place.city ? `${subsidiary.name} ${place.city}` : subsidiary.name })}
            variant="fill"
          />
        </div>
      </article>
    </div>
  );
}
