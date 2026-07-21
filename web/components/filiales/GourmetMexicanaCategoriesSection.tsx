"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useCallback, useRef, useState } from "react";

import { AnimateIn } from "@/components/ui/AnimateIn";
import { MexicanMotifs } from "@/components/filiales/MexicanMotifs";
import { ArrowLeft, ArrowRight } from "@/lib/icons";
import { DURATION_S, EASE, defaultScrollViewport } from "@/lib/motion";

import "@/styles/gourmet-mexicana-categories.css";

const CARD_STEP = 300;

const CATEGORIES = [
  { key: "tacos", photo: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=600&q=80" },
  { key: "ceviches", photo: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&q=80" },
  { key: "grilledMeats", photo: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&q=80" },
  { key: "desserts", photo: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&q=80" },
  { key: "cocktails", photo: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&q=80" },
] as const;

export function GourmetMexicanaCategoriesSection() {
  const reduced = useReducedMotion();
  const t = useTranslations("subsidiaries");
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const scroll = useCallback(
    (delta: number) => {
      trackRef.current?.scrollBy({ left: delta, behavior: reduced ? "auto" : "smooth" });
    },
    [reduced],
  );

  return (
    <section className="mex-categories">
      <MexicanMotifs variant="categories" />

      <div className="mex-categories__inner">
        <AnimateIn className="mex-categories__header">
          <p className="mex-categories__eyebrow">{t("gourmetMexicanaCategories.eyebrow")}</p>
          <h2 className="mex-categories__title">{t("gourmetMexicanaCategories.title")}</h2>
        </AnimateIn>

        <div className="mex-categories__row">
          <button
            type="button"
            className="mex-categories__nav-btn mex-categories__nav-btn--prev"
            aria-label={t("gourmetMexicanaCategories.previous")}
            onClick={() => scroll(-CARD_STEP)}
          >
            <ArrowLeft size={18} aria-hidden="true" />
          </button>

          <div className="mex-categories__track" ref={trackRef}>
            {CATEGORIES.map((cat, i) => (
              <motion.button
                key={cat.key}
                type="button"
                className={`mex-categories__card${activeKey === cat.key ? " mex-categories__card--active" : ""}`}
                onClick={() => setActiveKey((current) => (current === cat.key ? null : cat.key))}
                initial={reduced ? false : { opacity: 0, y: 24, scale: 0.95 }}
                whileInView={reduced ? undefined : { opacity: 1, y: 0, scale: 1 }}
                viewport={defaultScrollViewport}
                transition={{ duration: DURATION_S.luxe, ease: EASE.luxury, delay: i * 0.09 }}
              >
                <span className="mex-categories__photo-circle">
                  <span className="mex-categories__photo-wrap">
                    <Image
                      src={cat.photo}
                      alt=""
                      fill
                      className="mex-categories__photo"
                      sizes="(max-width: 767px) 40vw, 14rem"
                    />
                  </span>
                </span>
                <span className="mex-categories__name">
                  {t(`gourmetMexicanaCategories.items.${cat.key}.name`)}
                </span>
                <span className="mex-categories__brush" aria-hidden="true">
                  <svg viewBox="0 0 300 60" preserveAspectRatio="none">
                    <path
                      d="M0 32 Q20 12 42 26 T84 22 T126 32 T168 16 T210 30 T252 18 T294 30 L300 30 V60 H0 Z"
                      fill="#f5efe0"
                    />
                  </svg>
                </span>
              </motion.button>
            ))}
          </div>

          <button
            type="button"
            className="mex-categories__nav-btn mex-categories__nav-btn--next"
            aria-label={t("gourmetMexicanaCategories.next")}
            onClick={() => scroll(CARD_STEP)}
          >
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
