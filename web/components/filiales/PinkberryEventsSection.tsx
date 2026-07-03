"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import { AnimateIn } from "@/components/ui/AnimateIn";
import { Link } from "@/i18n/navigation";
import { DURATION_S, EASE, defaultScrollViewport } from "@/lib/motion";
import type { SubsidiaryNewsSection } from "@/lib/types";

import "@/styles/pinkberry-news-section.css";

export function PinkberryEventsSection({
  content,
  backgroundImage,
}: {
  content: SubsidiaryNewsSection;
  backgroundImage: string;
}) {
  const reduced = useReducedMotion();

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
        <p className="pinkberry-news__eyebrow">{content.eyebrow}</p>
        <h2 id="pinkberry-news-title" className="pinkberry-news__title">
          {content.title}
        </h2>
      </AnimateIn>

      <div className="pinkberry-news__grid">
        {content.cards.map((card, i) => (
          <motion.article
            key={card.title}
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
                {card.badgeLabel}
              </motion.span>
              <Image
                src={card.image}
                alt={card.imageAlt}
                fill
                className="pinkberry-news__card-image"
                sizes="(max-width: 899px) 90vw, 24rem"
              />
            </div>
            <div className="pinkberry-news__body">
              <p className="pinkberry-news__meta">
                {card.date} / {card.author}
              </p>
              <h3 className="pinkberry-news__card-title">{card.title}</h3>
              <p className="pinkberry-news__description">{card.description}</p>
              <Link href="/evenements" className="pinkberry-news__cta">
                {content.ctaLabel}
              </Link>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
