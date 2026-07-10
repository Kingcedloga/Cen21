"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useCallback, useRef } from "react";

import { AnimateIn } from "@/components/ui/AnimateIn";
import { ChevronLeft, ChevronRight, Lightning, Music2, UtensilsCrossed } from "@/lib/icons";
import { DURATION_S, EASE, defaultScrollViewport } from "@/lib/motion";
import type { SubsidiaryMuzikMenuSection } from "@/lib/types";

import "@/styles/muzik-cafe-menu-section.css";

const BENEFIT_ICONS = [Music2, UtensilsCrossed, Lightning] as const;
const CARD_STEP = 300;

type Props = {
  content: SubsidiaryMuzikMenuSection;
};

export function MuzikCafeMenuSection({ content }: Props) {
  const reduced = useReducedMotion();
  const t = useTranslations("subsidiaries");
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = useCallback(
    (delta: number) => {
      trackRef.current?.scrollBy({ left: delta, behavior: reduced ? "auto" : "smooth" });
    },
    [reduced],
  );

  return (
    <section className="muzik-menu">
      {/* ── Bloc 1 : bandeau avantages ── */}
      <div className="muzik-menu__benefits">
        {content.benefits.map((benefit, i) => {
          const Icon = BENEFIT_ICONS[i % BENEFIT_ICONS.length];
          return (
            <AnimateIn key={benefit.title} className="muzik-menu__benefit" delay={i * 0.08}>
              <span className="muzik-menu__benefit-icon">
                <Icon size={26} aria-hidden="true" />
              </span>
              <div className="muzik-menu__benefit-text">
                <h3 className="muzik-menu__benefit-title">{benefit.title}</h3>
                <p className="muzik-menu__benefit-description">{benefit.description}</p>
              </div>
            </AnimateIn>
          );
        })}
      </div>

      {/* ── Bloc 2 : Notre Menu ── */}
      <div className="muzik-menu__header">
        <AnimateIn>
          <h2 className="muzik-menu__title">{content.menuTitle}</h2>
        </AnimateIn>
        <div className="muzik-menu__nav">
          <button
            type="button"
            className="muzik-menu__nav-btn"
            aria-label={t("muzikCafeMenu.previousDishes")}
            onClick={() => scroll(-CARD_STEP)}
          >
            <ChevronLeft size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="muzik-menu__nav-btn"
            aria-label={t("muzikCafeMenu.nextDishes")}
            onClick={() => scroll(CARD_STEP)}
          >
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="muzik-menu__track" ref={trackRef}>
        {content.items.map((item, i) => (
          <motion.div
            key={item.name}
            className="muzik-menu__card"
            initial={reduced ? false : { opacity: 0, y: 24 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={defaultScrollViewport}
            transition={{ duration: DURATION_S.luxe, ease: EASE.luxury, delay: i * 0.07 }}
          >
            <div className="muzik-menu__card-top">
              <span className="muzik-menu__card-photo-wrap">
                <Image
                  src={item.image}
                  alt={item.imageAlt}
                  fill
                  className="muzik-menu__card-photo"
                  sizes="4rem"
                />
              </span>
              <div className="muzik-menu__card-heading">
                <h3 className="muzik-menu__card-name">{item.name}</h3>
                <p className="muzik-menu__card-subtitle">{item.subtitle}</p>
              </div>
            </div>

            <div className="muzik-menu__card-bottom">
              <div>
                <p className="muzik-menu__card-price-label">{t("muzikCafeMenu.regularPrice")}</p>
                <p className="muzik-menu__card-price">{item.price}</p>
              </div>
              <button
                type="button"
                className="muzik-menu__card-add"
                aria-label={t("muzikCafeMenu.addToOrder", { name: item.name })}
              >
                +
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
