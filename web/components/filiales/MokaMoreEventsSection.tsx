"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useRef } from "react";

import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { ArrowLeft, ArrowRight, Calendar, Eye } from "@/lib/icons";
import { resolveEventImage } from "@/lib/event-images";
import { DURATION_S, EASE, defaultScrollViewport } from "@/lib/motion";
import type { EventItem } from "@/lib/types";

import "@/styles/moka-more-events-section.css";

const CARD_STEP = 560;

function formatShortDate(iso: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

/** Compteur décoratif déterministe — aucune donnée de vues réelle n'existe pour les événements. */
function pseudoViews(id: string) {
  const hash = Array.from(id).reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return `${((hash % 20) + 5) / 10}K`;
}

type Props = {
  events: EventItem[];
  fallbackImage?: string;
};

export function MokaMoreEventsSection({ events, fallbackImage }: Props) {
  const reduced = useReducedMotion();
  const locale = useLocale() as Locale;
  const t = useTranslations("subsidiaries");
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = useCallback(
    (delta: number) => {
      trackRef.current?.scrollBy({ left: delta, behavior: reduced ? "auto" : "smooth" });
    },
    [reduced],
  );

  if (events.length === 0) return null;

  return (
    <section className="moka-events">
      <motion.span
        className="moka-events__watermark"
        aria-hidden="true"
        initial={reduced ? false : { opacity: 0 }}
        whileInView={reduced ? undefined : { opacity: 0.08 }}
        viewport={defaultScrollViewport}
        transition={{ duration: DURATION_S.grand, ease: EASE.luxury, delay: 0.1 }}
      >
        {t("mokaMoreEvents.watermark")}
      </motion.span>

      {/* Ligne courbe calligraphique — coin haut gauche */}
      <div className="moka-events__motif-curve" aria-hidden="true">
        <svg viewBox="0 0 200 140" fill="none" style={{ width: "100%", height: "100%" }}>
          <path d="M8 92c22-42 62-42 72 0s46 46 62-8" stroke="#CC0000" strokeWidth="2" strokeLinecap="round" />
          <path d="M148 12l12 22" stroke="#CC0000" strokeWidth="2" strokeLinecap="round" />
          <path d="M172 8l7 28" stroke="#CC0000" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      {/* Grille de points blancs — coin bas droit */}
      <div className="moka-events__motif-dots" aria-hidden="true" />

      {/* Cercle outline rouge — milieu droit */}
      <div className="moka-events__motif-circle" aria-hidden="true" />

      <div className="moka-events__inner">
        <AnimateIn className="moka-events__header">
          <p className="moka-events__eyebrow">{t("mokaMoreEvents.eyebrow")}</p>
          <h2 className="moka-events__title">{t("mokaMoreEvents.title")}</h2>
        </AnimateIn>

        <div className="moka-events__row">
          {events.length > 1 && (
            <button
              type="button"
              className="moka-events__nav-btn moka-events__nav-btn--prev"
              aria-label={t("mokaMoreEvents.previous")}
              onClick={() => scroll(-CARD_STEP)}
            >
              <ArrowLeft size={18} aria-hidden="true" />
            </button>
          )}

          <div className="moka-events__track" ref={trackRef}>
            {events.map((event, i) => (
              <motion.article
                key={event.id}
                className="moka-events__card"
                initial={reduced ? false : { opacity: 0, y: 24 }}
                whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                viewport={defaultScrollViewport}
                transition={{ duration: DURATION_S.luxe, ease: EASE.luxury, delay: i * 0.08 }}
              >
                <div className="moka-events__photo-wrap">
                  <Image
                    src={resolveEventImage(event, fallbackImage)}
                    alt={event.title}
                    fill
                    className="moka-events__photo"
                    sizes="(max-width: 767px) 40vw, 16rem"
                  />
                  <motion.span
                    className="moka-events__badge"
                    initial={reduced ? false : { opacity: 0, scale: 0.9 }}
                    whileInView={reduced ? undefined : { opacity: 1, scale: 1 }}
                    viewport={defaultScrollViewport}
                    transition={{ duration: DURATION_S.base, ease: EASE.spring, delay: i * 0.08 + 0.1 }}
                  >
                    {t("mokaMoreEvents.badgeLabel")}
                  </motion.span>
                </div>
                <div className="moka-events__content">
                  <div className="moka-events__meta">
                    <span className="moka-events__meta-item">
                      <Calendar size={14} className="moka-events__meta-icon" aria-hidden="true" />
                      {formatShortDate(event.date, locale)}
                    </span>
                    <span className="moka-events__meta-item">
                      <Eye size={14} className="moka-events__meta-icon" aria-hidden="true" />
                      {pseudoViews(event.id)}
                    </span>
                  </div>
                  <h3 className="moka-events__card-title">{event.title}</h3>
                  <p className="moka-events__excerpt">{event.excerpt}</p>
                  <Link href="/evenements" className="moka-events__cta">
                    {t("mokaMoreEvents.ctaLabel")}
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>

          {events.length > 1 && (
            <button
              type="button"
              className="moka-events__nav-btn moka-events__nav-btn--next"
              aria-label={t("mokaMoreEvents.next")}
              onClick={() => scroll(CARD_STEP)}
            >
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
