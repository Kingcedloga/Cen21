"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useRef } from "react";

import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { ArrowLeft, ArrowRight, Calendar, ChatCircle } from "@/lib/icons";
import { resolveEventImage } from "@/lib/event-images";
import { cormorant } from "@/lib/fonts";
import { DURATION_S, EASE, defaultScrollViewport } from "@/lib/motion";
import type { EventItem } from "@/lib/types";

import "@/styles/muzik-cafe-events-section.css";

const CARD_STEP = 340;

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
  title: string;
  ctaLabel: string;
  fallbackImage?: string;
};

export function MuzikCafeEventsSection({ events, title, ctaLabel, fallbackImage }: Props) {
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
    <section className="muzik-events">
      <AnimateIn className="muzik-events__header">
        <h2 className={`muzik-events__title ${cormorant.variable}`}>{title}</h2>
      </AnimateIn>

      <div className="muzik-events__row">
        {events.length > 1 && (
          <button
            type="button"
            className="muzik-events__nav-btn"
            aria-label={t("muzikCafeEvents.previous")}
            onClick={() => scroll(-CARD_STEP)}
          >
            <ArrowLeft size={18} aria-hidden="true" />
          </button>
        )}

        <div className="muzik-events__track" ref={trackRef}>
          {events.map((event, i) => (
            <motion.article
              key={event.id}
              className="muzik-events__card"
              initial={reduced ? false : { opacity: 0, y: 24 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={defaultScrollViewport}
              transition={{ duration: DURATION_S.luxe, ease: EASE.luxury, delay: i * 0.08 }}
            >
              <div className="muzik-events__photo-wrap">
                <Image
                  src={resolveEventImage(event, fallbackImage)}
                  alt={event.title}
                  fill
                  className="muzik-events__photo"
                  sizes="(max-width: 767px) 40vw, 12rem"
                />
              </div>
              <div className="muzik-events__content">
                <div className="muzik-events__meta">
                  <span className="muzik-events__meta-item">
                    <Calendar size={14} aria-hidden="true" />
                    {formatShortDate(event.date, locale)}
                  </span>
                  <span className="muzik-events__meta-item">
                    <ChatCircle size={14} aria-hidden="true" />
                    {pseudoViews(event.id)}
                  </span>
                </div>
                <h3 className="muzik-events__card-title">{event.title}</h3>
                <p className="muzik-events__excerpt">{event.excerpt}</p>
                <Link href="/evenements" className="muzik-events__cta">
                  {ctaLabel}
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        {events.length > 1 && (
          <button
            type="button"
            className="muzik-events__nav-btn"
            aria-label={t("muzikCafeEvents.next")}
            onClick={() => scroll(CARD_STEP)}
          >
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        )}
      </div>
    </section>
  );
}
