"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { DURATION_S, EASE, defaultScrollViewport } from "@/lib/motion";

import "@/styles/gourmet-mexicana-promotions.css";

const PANELS = [
  {
    key: "tacos",
    color: "green",
    discount: 40,
    photo: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=700&q=80",
  },
  {
    key: "enchiladas",
    color: "terracotta",
    discount: 45,
    photo: "https://images.unsplash.com/photo-1534352956036-cd81e27dd615?w=700&q=80",
  },
  {
    key: "ceviche",
    color: "red",
    discount: 50,
    photo: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=700&q=80",
  },
] as const;

export function GourmetMexicanaPromotionsSection() {
  const reduced = useReducedMotion();
  const t = useTranslations("subsidiaries");

  return (
    <section className="mex-promo">
      {PANELS.map((panel, i) => (
        <motion.div
          key={panel.key}
          className={`mex-promo__panel mex-promo__panel--${panel.color}`}
          initial={reduced ? false : { opacity: 0, y: 24, scale: 0.96 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0, scale: 1 }}
          whileHover={reduced ? undefined : { y: -4 }}
          viewport={defaultScrollViewport}
          transition={{ duration: DURATION_S.shimmer, ease: EASE.luxury, delay: i * 0.1 }}
        >
          <p className="mex-promo__subtitle">{t("gourmetMexicanaPromotions.subtitle")}</p>
          <h3 className="mex-promo__title">{t(`gourmetMexicanaPromotions.items.${panel.key}`)}</h3>

          <motion.span
            className="mex-promo__arrow"
            aria-hidden="true"
            initial={reduced ? false : { opacity: 0 }}
            whileInView={reduced ? undefined : { opacity: 1 }}
            viewport={defaultScrollViewport}
            transition={{ duration: DURATION_S.base, ease: EASE.luxury, delay: 0.5 }}
          >
            <svg viewBox="0 0 60 60" fill="none">
              <motion.path
                d="M4 8c14 2 24 12 26 32"
                stroke="#ffffff"
                strokeWidth="1.5"
                strokeLinecap="round"
                initial={reduced ? false : { pathLength: 0 }}
                whileInView={reduced ? undefined : { pathLength: 1 }}
                viewport={defaultScrollViewport}
                transition={{ duration: DURATION_S.luxe, ease: EASE.luxury, delay: 0.5 }}
              />
              <path d="M22 36l8 4-2-9" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.span>

          <motion.span
            className="mex-promo__badge"
            initial={reduced ? false : { scale: 0 }}
            whileInView={reduced ? undefined : { scale: 1 }}
            viewport={defaultScrollViewport}
            transition={{ duration: DURATION_S.base, ease: EASE.spring, delay: 0.4 }}
          >
            {panel.discount}%
            <span>{t("gourmetMexicanaPromotions.offLabel")}</span>
          </motion.span>

          <motion.div
            className="mex-promo__photo-wrap"
            initial={reduced ? false : { opacity: 0, y: 20 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={defaultScrollViewport}
            transition={{ duration: DURATION_S.luxe, ease: EASE.luxury, delay: 0.3 }}
          >
            <Image
              src={panel.photo}
              alt={t(`gourmetMexicanaPromotions.items.${panel.key}`)}
              fill
              className="mex-promo__photo"
              sizes="(max-width: 899px) 60vw, 24rem"
            />
          </motion.div>

          <Link href="/contact" className="mex-promo__cta">
            {t("gourmetMexicanaPromotions.ctaLabel")}
          </Link>
        </motion.div>
      ))}
    </section>
  );
}
