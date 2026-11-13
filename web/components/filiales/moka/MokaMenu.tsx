"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRef } from "react";

import type { SubsidiaryMenuMoment } from "@/lib/types";
import { useReducedMotionSafe } from "@/lib/use-media-query";

import "@/styles/moka.css";

/** Reduced motion : valeurs fixes explicites (rien de l'état d'avant hydratation). */
const STILL_IMAGE = { rotate: 0, y: 0 };
const STILL_HOUR = { x: 0 };

const FEATURES = [1, 2, 3, 4] as const;
const pad = (n: number) => String(n).padStart(2, "0");

/**
 * La carte du matin au soir, sur fond blanc (la carte papier de la maison) :
 * une ligne par moment — l'heure en grand chiffre rouge, le titre, le texte,
 * et la photo dans une arche qui se redresse en traversant l'écran. Puis les
 * atouts de la maison, en quatre colonnes numérotées. Reduced motion : immobile.
 */
export function MokaMenu({ moments }: { moments: SubsidiaryMenuMoment[] }) {
  const t = useTranslations("moka");

  return (
    <section id="carte" aria-labelledby="moka-menu-title" data-surface="light" className="moka-menu scroll-mt-6">
      <div className="moka-menu__inner">
        <header className="moka-menu__head">
          <p className="moka-eyebrow">{t("menuEyebrow")}</p>
          <h2 id="moka-menu-title" className="moka-title">
            {t("menuTitle")}{" "}
            <span className="moka-title__script moka-script">{t("menuScript")}</span>
          </h2>
          <p className="moka-menu__lead">{t("menuLead")}</p>
        </header>

        {moments.length > 0 && (
          <ol className="moka-menu__list">
            {moments.map((moment, index) => (
              <MenuMoment key={moment.title} moment={moment} index={index} />
            ))}
          </ol>
        )}

        <div className="moka-features">
          <div className="moka-features__head">
            <h3 className="moka-features__title">{t("featuresTitle")}</h3>
            <p className="moka-features__text">{t("featuresText")}</p>
          </div>
          <ul className="moka-features__list">
            {FEATURES.map((n) => (
              <li key={n} className="moka-features__item">
                <span aria-hidden="true" className="moka-features__num">
                  {pad(n)}
                </span>
                <span className="moka-features__label">{t(`feature${n}`)}</span>
                <span className="moka-features__detail">{t(`feature${n}Detail`)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function MenuMoment({ moment, index }: { moment: SubsidiaryMenuMoment; index: number }) {
  const reduced = useReducedMotionSafe();
  const ref = useRef<HTMLLIElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // L'arche arrive penchée, se redresse au milieu de l'écran, repart de l'autre côté.
  const tilt = index % 2 === 0 ? 1 : -1;
  const rotate = useTransform(scrollYProgress, [0, 0.5, 1], [9 * tilt, 0, -5 * tilt]);
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const x = useTransform(scrollYProgress, [0, 0.45], [-40, 0], { clamp: true });

  return (
    <li ref={ref} className="moka-moment">
      <motion.p className="moka-moment__hour" style={reduced ? STILL_HOUR : { x }}>
        {moment.hour}
      </motion.p>
      <div className="moka-moment__body">
        <h3 className="moka-moment__title">{moment.title}</h3>
        <p className="moka-moment__text">{moment.text}</p>
      </div>
      <motion.div className="moka-moment__arch" style={reduced ? STILL_IMAGE : { rotate, y }}>
        <Image src={moment.image.src} alt={moment.image.alt} fill sizes="(min-width: 1024px) 18vw, 40vw" className="object-cover" />
      </motion.div>
    </li>
  );
}
