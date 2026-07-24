"use client";

import Image from "next/image";
import { useState, useCallback } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { resolveEventImage } from "@/lib/event-images";
import { EASE, DURATION_S } from "@/lib/motion";
import type { EventItem } from "@/lib/types";

import "@/styles/olive-verte-events-section.css";

const CARDS_PER_PAGE = 2;

function formatShortDate(iso: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <rect x="1" y="2.5" width="14" height="12" rx="1.5" />
      <path d="M1 6h14" strokeLinecap="round" />
      <path d="M5 1v3M11 1v3" strokeLinecap="round" />
    </svg>
  );
}

function CommentIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M13.5 2.5h-11A1.5 1.5 0 001 4v6a1.5 1.5 0 001.5 1.5h2l1.5 2 1.5-2h6A1.5 1.5 0 0015 10V4a1.5 1.5 0 00-1.5-1.5z" />
    </svg>
  );
}

function ChevronLeft({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M11 4L6 9l5 5" />
    </svg>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M7 4l5 5-5 5" />
    </svg>
  );
}

type Props = {
  events: EventItem[];
  fallbackImage?: string;
};

export function OliveVerteEventsSection({ events, fallbackImage }: Props) {
  const reduced = useReducedMotion();
  const locale = useLocale() as Locale;
  const t = useTranslations("subsidiaries");
  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(events.length / CARDS_PER_PAGE);
  const visibleEvents = events.slice(page * CARDS_PER_PAGE, page * CARDS_PER_PAGE + CARDS_PER_PAGE);

  const prev = useCallback(() => setPage((p) => (p - 1 + totalPages) % totalPages), [totalPages]);
  const next = useCallback(() => setPage((p) => (p + 1) % totalPages), [totalPages]);

  if (events.length === 0) return null;

  return (
    <section className="ov-events" aria-labelledby="ov-events-title">
      <h2 id="ov-events-title" className="ov-events__title">
        {t("oliveVerteEvents.title")}
      </h2>

      <div className="ov-events__nav-row">
        {/* Flèche gauche */}
        <button
          className="ov-events__nav-btn"
          onClick={prev}
          aria-label="Événements précédents"
          disabled={totalPages <= 1}
        >
          <ChevronLeft />
        </button>
        <span className="ov-events__nav-line" aria-hidden />

        {/* Cartes */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={page}
            className="ov-events__cards"
            initial={reduced ? false : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduced ? undefined : { opacity: 0, x: -24 }}
            transition={{ duration: DURATION_S.luxe, ease: EASE.luxury }}
          >
            {visibleEvents.map((event) => (
              <article key={event.id} className="ov-events__card">
                {/* Image gauche */}
                <div className="ov-events__card-image-wrap">
                  <Image
                    src={resolveEventImage(event, fallbackImage)}
                    alt={event.title}
                    fill
                    className="ov-events__card-image"
                    sizes="(max-width: 767px) 42vw, 18rem"
                  />
                </div>

                {/* Contenu droit */}
                <div className="ov-events__card-body">
                  <div className="ov-events__meta">
                    <span className="ov-events__meta-item">
                      <CalendarIcon className="ov-events__meta-icon" />
                      {formatShortDate(event.date, locale)}
                    </span>
                    <span className="ov-events__meta-item">
                      <CommentIcon className="ov-events__meta-icon" />
                      {t("oliveVerteEvents.badgeLabel")}
                    </span>
                  </div>
                  <h3 className="ov-events__card-title">{event.title}</h3>
                  <p className="ov-events__card-description">{event.excerpt}</p>
                  <Link href="/evenements" className="ov-events__cta">
                    {t("oliveVerteEvents.ctaLabel")}
                  </Link>
                </div>
              </article>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Flèche droite */}
        <span className="ov-events__nav-line" aria-hidden />
        <button
          className="ov-events__nav-btn"
          onClick={next}
          aria-label="Événements suivants"
          disabled={totalPages <= 1}
        >
          <ChevronRight />
        </button>
      </div>

      {/* Points de navigation */}
      {totalPages > 1 && (
        <div className="ov-events__dots" role="tablist" aria-label="Pages d'événements">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              className={`ov-events__dot${i === page ? " is-active" : ""}`}
              onClick={() => setPage(i)}
              role="tab"
              aria-selected={i === page}
              aria-label={`Page ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
