"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useRef } from "react";

import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { MexicanMotifs } from "@/components/filiales/MexicanMotifs";
import { ArrowLeft, ArrowRight, ArrowUpRight, Calendar, User } from "@/lib/icons";
import { resolveEventImage } from "@/lib/event-images";
import { DURATION_S, EASE, defaultScrollViewport } from "@/lib/motion";
import type { EventItem } from "@/lib/types";

import "@/styles/gourmet-mexicana-events.css";

const CARD_STEP = 400;

function formatShortDate(iso: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

type Props = {
  events: EventItem[];
  authorName: string;
  fallbackImage?: string;
};

export function GourmetMexicanaEventsSection({ events, authorName, fallbackImage }: Props) {
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
    <section className="mex-events">
      <MexicanMotifs variant="events" />

      <div className="mex-events__inner">
        <div className="mex-events__header">
          <AnimateIn className="mex-events__heading">
            <p className="mex-events__eyebrow">{t("gourmetMexicanaEvents.eyebrow")}</p>
            <h2 className="mex-events__title">{t("gourmetMexicanaEvents.title")}</h2>
          </AnimateIn>
          <AnimateIn delay={0.08}>
            <Link href="/evenements" className="mex-events__all-cta">
              {t("gourmetMexicanaEvents.allEventsLabel")}
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </AnimateIn>
        </div>

        <div className="mex-events__row">
          {events.length > 1 && (
            <motion.button
              type="button"
              className="mex-events__nav-btn mex-events__nav-btn--prev"
              aria-label={t("gourmetMexicanaEvents.previous")}
              onClick={() => scroll(-CARD_STEP)}
              whileHover={reduced ? undefined : { scale: 1.1 }}
              transition={{ duration: DURATION_S.base, ease: EASE.spring }}
            >
              <ArrowLeft size={18} aria-hidden="true" />
            </motion.button>
          )}

          <div className="mex-events__track" ref={trackRef}>
            {events.map((event, i) => (
              <motion.article
                key={event.id}
                className="mex-events__card"
                initial={reduced ? false : { opacity: 0, y: 24, scale: 0.96 }}
                whileInView={reduced ? undefined : { opacity: 1, y: 0, scale: 1 }}
                whileHover={
                  reduced ? undefined : { y: -6, transition: { duration: 0.3, ease: EASE.luxury } }
                }
                viewport={defaultScrollViewport}
                transition={{ duration: DURATION_S.luxe, ease: EASE.luxury, delay: i * 0.09 }}
              >
                <div className="mex-events__photo-wrap">
                  <Image
                    src={resolveEventImage(event, fallbackImage)}
                    alt={event.title}
                    fill
                    className="mex-events__photo"
                    sizes="(max-width: 767px) 85vw, 24rem"
                  />
                </div>
                <div className="mex-events__content">
                  <div className="mex-events__meta">
                    <span className="mex-events__meta-item">
                      <User size={13} className="mex-events__meta-icon" aria-hidden="true" />
                      {authorName}
                    </span>
                    <span className="mex-events__meta-item">
                      <Calendar size={13} className="mex-events__meta-icon" aria-hidden="true" />
                      {formatShortDate(event.date, locale)}
                    </span>
                  </div>
                  <h3 className="mex-events__card-title">{event.title}</h3>
                  <Link href="/evenements" className="mex-events__read-more">
                    {t("gourmetMexicanaEvents.readMoreLabel")}
                    <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>

          {events.length > 1 && (
            <motion.button
              type="button"
              className="mex-events__nav-btn mex-events__nav-btn--next"
              aria-label={t("gourmetMexicanaEvents.next")}
              onClick={() => scroll(CARD_STEP)}
              whileHover={reduced ? undefined : { scale: 1.1 }}
              transition={{ duration: DURATION_S.base, ease: EASE.spring }}
            >
              <ArrowRight size={18} aria-hidden="true" />
            </motion.button>
          )}
        </div>
      </div>
    </section>
  );
}
