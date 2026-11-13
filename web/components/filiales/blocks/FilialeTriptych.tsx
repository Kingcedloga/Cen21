"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef, type ReactNode } from "react";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { useReducedMotionSafe } from "@/lib/use-media-query";

import "@/styles/filiale-blocks.css";

export type TriptychItem = {
  title: string;
  description: string;
  image: { src: string; alt: string };
};

/** Décalage de parallaxe par colonne (px) : la colonne du milieu remonte le plus. */
const DRIFT = [24, 72, 44];

/**
 * Reduced motion : valeurs fixes explicites (et non `undefined`, qui laisserait
 * en place la dernière valeur posée avant l'hydratation, photo grise).
 */
const STILL_ITEM = { y: 0 };
const STILL_IMAGE = { filter: "none", scale: 1 };

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Triptyque nocturne (K Lounge) : titre et texte en tête, puis trois photos
 * portrait décalées, chacune avec son point fort. Au défilement, chaque photo
 * passe du noir et blanc à la couleur (la charte noir et blanc qui s'allume)
 * et les colonnes glissent à des vitesses différentes. Mêmes animations sur
 * mobile (photos empilées). Reduced motion : couleur, rien ne bouge.
 */
export function FilialeTriptych({
  eyebrow,
  title,
  titleId,
  text,
  actions,
  items,
}: {
  eyebrow: string;
  title: string;
  titleId: string;
  text: string;
  actions?: ReactNode;
  items: TriptychItem[];
}) {
  return (
    <div className="filiale-triptych">
      <header className="filiale-triptych__head">
        <SectionHeading look="editorial" eyebrow={eyebrow} title={title} titleAs="h2" titleId={titleId} align="left" className="mb-0!" />
        <div className="filiale-triptych__intro">
          <p className="filiale-triptych__text">{text}</p>
          {actions && <div className="filiale-triptych__actions">{actions}</div>}
        </div>
      </header>

      <ol className="filiale-triptych__list">
        {items.map((item, index) => (
          <TriptychCard key={item.title} item={item} index={index} />
        ))}
      </ol>
    </div>
  );
}

function TriptychCard({ item, index }: { item: TriptychItem; index: number }) {
  const reduced = useReducedMotionSafe();
  const ref = useRef<HTMLLIElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // Noir et blanc à l'entrée, couleur pleine avant le milieu de l'écran.
  const filter = useTransform(scrollYProgress, (v) => {
    const k = Math.min(1, Math.max(0, (v - 0.12) / 0.3));
    return `grayscale(${(1 - k).toFixed(3)}) brightness(${(0.62 + 0.38 * k).toFixed(3)})`;
  });
  const scale = useTransform(scrollYProgress, [0, 0.6], [1.14, 1], { clamp: true });
  const drift = DRIFT[index % DRIFT.length];
  const y = useTransform(scrollYProgress, [0, 1], [drift, -drift]);

  return (
    <motion.li ref={ref} className="filiale-triptych__item" style={reduced ? STILL_ITEM : { y }}>
      <figure className="filiale-triptych__figure">
        <motion.div className="absolute inset-0" style={reduced ? STILL_IMAGE : { filter, scale }}>
          <Image src={item.image.src} alt={item.image.alt} fill sizes="(min-width: 768px) 30vw, 92vw" className="object-cover" />
        </motion.div>
        <figcaption className="filiale-triptych__caption">
          <span aria-hidden="true" className="filiale-triptych__num">
            {pad(index + 1)}
          </span>
          <span className="filiale-triptych__title title-section">{item.title}</span>
        </figcaption>
      </figure>
      <p className="filiale-triptych__desc">{item.description}</p>
    </motion.li>
  );
}
