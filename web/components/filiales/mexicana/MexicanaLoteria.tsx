"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import { useRef } from "react";

import { useReducedMotionSafe } from "@/lib/use-media-query";

import "@/styles/mexicana.css";

/** Reduced motion : valeurs fixes explicites (rien de l'état d'avant hydratation). */
const STILL = { rotateY: 0 };

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * La carte de la maison en cartes de lotería (le jeu mexicain) : chaque carte
 * arrive de dos — le motif aux calaveras — et se retourne en traversant
 * l'écran (rotation liée au défilement), chacune à son tour. Face : le
 * numéro, la vignette aux couleurs de la maison (l'initiale à la main) et
 * le titre dans son bandeau. Puis les spécialités du moment. Reduced motion : faces visibles.
 */
export function MexicanaLoteria() {
  const t = useTranslations("mexicana");
  const cards = t.raw("loteriaCards") as string[];
  const specials = t.raw("specials") as string[];

  return (
    <section id="carte" aria-labelledby="mexicana-loteria-title" data-surface="light" className="mx-loteria scroll-mt-6">
      <div className="mx-loteria__inner">
        <header className="mx-loteria__head">
          <p className="mx-eyebrow">{t("loteriaEyebrow")}</p>
          <h2 id="mexicana-loteria-title" className="mx-title">
            {t("loteriaTitle")}
          </h2>
          <p className="mx-loteria__lead">{t("loteriaLead")}</p>
        </header>

        <ol className="mx-loteria__deck">
          {cards.map((card, index) => (
            <LoteriaCard key={card} title={card} index={index} />
          ))}
        </ol>

        {specials.length > 0 && (
          <div className="mx-specials">
            <p className="mx-specials__label">{t("specialsLabel")}</p>
            <ul className="mx-specials__list">
              {specials.map((special) => (
                <li key={special}>{special}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

function LoteriaCard({ title, index }: { title: string; index: number }) {
  const reduced = useReducedMotionSafe();
  const ref = useRef<HTMLLIElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center 0.55"] });
  // Décalage par colonne : la carte de droite se retourne un peu après.
  const delay = (index % 4) * 0.08;
  const rotateY = useTransform(scrollYProgress, [0.15 + delay, 0.75 + delay], [180, 0], { clamp: true });

  return (
    <li ref={ref} className="mx-card">
      <motion.div className="mx-card__inner" style={reduced ? STILL : { rotateY }}>
        <div className={`mx-card__face mx-card__face--${index % 4}`}>
          <span className="mx-card__num">{pad(index + 1)}</span>
          <span aria-hidden="true" className="mx-card__art">
            <span className="mx-card__medal mx-script">{title.charAt(0)}</span>
          </span>
          <span className="mx-card__title">{title}</span>
        </div>
        <div aria-hidden="true" className="mx-card__back" />
      </motion.div>
    </li>
  );
}
