"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";

import { AnimateIn } from "@/components/ui/AnimateIn";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { resolveEventImage } from "@/lib/event-images";
import { DURATION_S, EASE, defaultScrollViewport } from "@/lib/motion";
import type { EventItem } from "@/lib/types";

import "@/styles/pinkberry-news-section.css";

function formatShortDate(iso: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

type Props = {
  events: EventItem[];
  backgroundImage: string;
  fallbackImage?: string;
};

export function PinkberryEventsSection({ events, backgroundImage, fallbackImage }: Props) {
  const reduced = useReducedMotion();
  const locale = useLocale() as Locale;
  const t = useTranslations("subsidiaries");

  if (events.length === 0) return null;

  return (
    <section className="pinkberry-news" aria-labelledby="pinkberry-news-title">
      <Image
        src={backgroundImage}
        alt=""
        fill
        aria-hidden="true"
        className="pinkberry-news__bg-photo"
        sizes="100vw"
      />

      <AnimateIn className="pinkberry-news__header">
        <p className="pinkberry-news__eyebrow">{t("pinkberryEvents.eyebrow")}</p>
        <h2 id="pinkberry-news-title" className="pinkberry-news__title">
          {t("pinkberryEvents.title")}
        </h2>
      </AnimateIn>

      <div className="pinkberry-news__grid">
        {events.map((event, i) => (
          <motion.article
            key={event.id}
            className="pinkberry-news__card"
            initial={reduced ? false : { opacity: 0, y: 24 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={defaultScrollViewport}
            transition={{
              duration: DURATION_S.luxe,
              ease: EASE.luxury,
              delay: i * 0.08,
            }}
          >
            <div className="pinkberry-news__card-image-wrap">
              <motion.span
                className="pinkberry-news__badge"
                initial={reduced ? false : { opacity: 0, scale: 0.9 }}
                whileInView={reduced ? undefined : { opacity: 1, scale: 1 }}
                viewport={defaultScrollViewport}
                transition={{
                  duration: DURATION_S.base,
                  ease: EASE.luxury,
                  delay: i * 0.08 + 0.1,
                }}
              >
                {t("pinkberryEvents.badgeLabel")}
              </motion.span>
              <Image
                src={resolveEventImage(event, fallbackImage)}
                alt={event.title}
                fill
                className="pinkberry-news__card-image"
                sizes="(max-width: 899px) 90vw, 24rem"
              />
            </div>
            <div className="pinkberry-news__body">
              <p className="pinkberry-news__meta">
                {formatShortDate(event.date, locale)} / {t("pinkberryEvents.author")}
              </p>
              <h3 className="pinkberry-news__card-title">{event.title}</h3>
              <p className="pinkberry-news__description">{event.excerpt}</p>
              <Link href="/evenements" className="pinkberry-news__cta">
                {t("pinkberryEvents.ctaLabel")}
              </Link>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
