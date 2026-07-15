"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useCallback, useRef, useState } from "react";

import { ChevronDown, ChevronUp, ShoppingCart } from "@/lib/icons";
import { cormorant } from "@/lib/fonts";
import { DURATION_S, EASE } from "@/lib/motion";
import type { Subsidiary } from "@/lib/types";

import "@/styles/muzik-cafe-hero.css";

// 3 slots pour la navigation "1 · 2 · 3" — les slides 2 et 3 réutilisent encore
// la 1re photo tant que 2 visuels supplémentaires n'ont pas été fournis.
const HERO_IMAGES = [
  "/filiales/photos/filiale-05/herosectio-img.png",
  "/filiales/photos/filiale-05/herosectio-img.png",
  "/filiales/photos/filiale-05/herosectio-img.png",
] as const;

export function MuzikCafeHero({ subsidiary }: { subsidiary: Subsidiary }) {
  const reduced = useReducedMotion() ?? false;
  const t = useTranslations("subsidiaries");
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  const go = useCallback(
    (delta: number) =>
      setActive((i) => (i + delta + HERO_IMAGES.length) % HERO_IMAGES.length),
    [],
  );

  const scrollToNext = useCallback(() => {
    sectionRef.current?.nextElementSibling?.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      block: "start",
    });
  }, [reduced]);

  const textItemMotion = (i: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: DURATION_S.luxe, ease: EASE.luxury, delay: i * 0.08 },
        };

  return (
    <section
      ref={sectionRef}
      className={`muzik-hero ${cormorant.variable}`}
      aria-label={subsidiary.name}
    >
      <div className="muzik-hero__texture" aria-hidden="true" />

      <motion.span
        className="muzik-hero__shape muzik-hero__shape--top"
        aria-hidden="true"
        initial={reduced ? false : { opacity: 0, scale: 0.9 }}
        animate={reduced ? undefined : { opacity: 1, scale: 1 }}
        transition={{ duration: DURATION_S.grand, ease: EASE.luxury, delay: 0.2 }}
      />
      <motion.span
        className="muzik-hero__shape muzik-hero__shape--bottom"
        aria-hidden="true"
        initial={reduced ? false : { opacity: 0, scale: 0.9 }}
        animate={reduced ? undefined : { opacity: 1, scale: 1 }}
        transition={{ duration: DURATION_S.grand, ease: EASE.luxury, delay: 0.3 }}
      />

      <div className="muzik-hero__content">
        <div className="muzik-hero__text">
          <motion.p className="muzik-hero__eyebrow" {...textItemMotion(0)}>
            {t("muzikCafeHero.eyebrow")}
          </motion.p>
          <motion.h1 className="muzik-hero__title" {...textItemMotion(1)}>
            {t("muzikCafeHero.title")}
          </motion.h1>
          <motion.p className="muzik-hero__description" {...textItemMotion(2)}>
            {subsidiary.description}
          </motion.p>
          <motion.div className="muzik-hero__actions" {...textItemMotion(3)}>
            <button type="button" className="muzik-hero__cta-primary" onClick={scrollToNext}>
              {t("muzikCafeHero.ctaPrimary")}
            </button>
            <button type="button" className="muzik-hero__cta-secondary" onClick={scrollToNext}>
              {t("muzikCafeHero.ctaSecondary")}
            </button>
          </motion.div>

          <motion.div
            className="muzik-hero__dish-card"
            initial={reduced ? false : { opacity: 0, y: 24 }}
            animate={reduced ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: DURATION_S.luxe, ease: EASE.luxury, delay: 0.4 }}
          >
            <div className="muzik-hero__dish-head">
              <span className="muzik-hero__dish-name">{t("muzikCafeHero.dishName")}</span>
              <span className="muzik-hero__dish-stars" aria-label={t("muzikCafeHero.dishRatingAria")}>
                ★★★★★
              </span>
            </div>
            <div className="muzik-hero__dish-foot">
              <p className="muzik-hero__dish-description">{t("muzikCafeHero.dishDescription")}</p>
              <span className="muzik-hero__dish-cart" aria-hidden="true">
                <ShoppingCart size={16} weight="fill" />
              </span>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="muzik-hero__visual"
          initial={reduced ? false : { opacity: 0, x: 60 }}
          animate={reduced ? undefined : { opacity: 1, x: 0 }}
          transition={{ duration: DURATION_S.grand, ease: EASE.luxury, delay: 0.15 }}
        >
          <Image
            src={HERO_IMAGES[active]}
            alt={subsidiary.name}
            fill
            priority
            className="muzik-hero__photo"
            sizes="(max-width: 767px) 90vw, 45vw"
          />
        </motion.div>
      </div>

      {HERO_IMAGES.length > 1 && (
        <div className="muzik-hero__nav" aria-label={subsidiary.name}>
          <button
            type="button"
            className="muzik-hero__nav-arrow"
            aria-label={t("muzikCafeHero.previousVisual")}
            onClick={() => go(-1)}
          >
            <ChevronUp size={16} aria-hidden="true" />
          </button>
          <div className="muzik-hero__nav-dots">
            {HERO_IMAGES.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`muzik-hero__nav-dot${i === active ? " muzik-hero__nav-dot--active" : ""}`}
                aria-label={t("muzikCafeHero.goToVisual", { index: i + 1 })}
                aria-current={i === active}
                onClick={() => setActive(i)}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="muzik-hero__nav-arrow"
            aria-label={t("muzikCafeHero.nextVisual")}
            onClick={() => go(1)}
          >
            <ChevronDown size={16} aria-hidden="true" />
          </button>
        </div>
      )}
    </section>
  );
}
