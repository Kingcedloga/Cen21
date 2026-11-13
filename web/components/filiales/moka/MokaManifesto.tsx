"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";

import { useReducedMotionSafe } from "@/lib/use-media-query";

import "@/styles/moka.css";

/** Reduced motion : valeurs fixes explicites (rien de l'état d'avant hydratation). */
const STILL_Y = { y: 0 };
const STILL_WORD = { opacity: 1 };

/**
 * Le manifeste de la maison sur un aplat rouge pleine largeur : la phrase en
 * très grands caractères blancs, dont les mots s'allument un à un au fil du
 * défilement ; une esperluette géante, rouge sur rouge, remonte en fond.
 * Reduced motion : texte entier, immobile.
 */
export function MokaManifesto({ label, text, signature }: { label: string; text: string; signature: string }) {
  const reduced = useReducedMotionSafe();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.75", "end 0.55"] });
  const ampY = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const words = text.split(" ");

  return (
    <section ref={ref} aria-labelledby="moka-manifesto-title" data-surface="dark" className="moka-manifesto">
      <motion.span aria-hidden="true" className="moka-manifesto__amp" style={reduced ? STILL_Y : { y: ampY }}>
        &amp;
      </motion.span>

      <div className="moka-manifesto__inner">
        <h2 id="moka-manifesto-title" className="moka-manifesto__label">
          {label}
        </h2>
        <p className="moka-manifesto__text" aria-label={text}>
          {words.map((word, index) => (
            <Word
              key={`${word}-${index}`}
              word={word}
              progress={scrollYProgress}
              start={index / words.length}
              end={(index + 1) / words.length}
              reduced={reduced}
            />
          ))}
        </p>
        <p aria-hidden="true" className="moka-manifesto__sign moka-script">
          {signature}
        </p>
      </div>
    </section>
  );
}

function Word({
  word,
  progress,
  start,
  end,
  reduced,
}: {
  word: string;
  progress: MotionValue<number>;
  start: number;
  end: number;
  reduced: boolean;
}) {
  const opacity = useTransform(progress, [start, end], [0.24, 1]);
  return (
    <>
      <motion.span aria-hidden="true" style={reduced ? STILL_WORD : { opacity }}>
        {word}
      </motion.span>{" "}
    </>
  );
}
