"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";

import { useReducedMotionSafe } from "@/lib/use-media-query";

import "@/styles/muzik.css";

/** Reduced motion : valeurs fixes explicites (rien de l'état d'avant hydratation). */
const STILL_LINE = { backgroundPosition: "0% 0" };
const STILL_BALL = { opacity: 0 };

/**
 * Le refrain de la maison, en paroles de karaoké : chaque ligne se remplit
 * de blanc de gauche à droite au fil du défilement, et la balle rouge du
 * karaoké rebondit de mot en mot sur la ligne en cours. Le défilement pilote
 * tout, dans les deux sens. Reduced motion : paroles pleines, sans balle.
 */
export function MuzikKaraoke({ label, lines, note }: { label: string; lines: string[]; note: string }) {
  const reduced = useReducedMotionSafe();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.78", "end 0.4"] });

  return (
    <section aria-labelledby="muzik-karaoke-title" data-surface="dark" className="muzik-karaoke">
      <div className="muzik-karaoke__inner">
        <h2 id="muzik-karaoke-title" className="muzik-karaoke__label">
          {label}
        </h2>
        <div ref={ref}>
          <p className="muzik-karaoke__lyrics" aria-label={lines.join(" ")}>
            {lines.map((line, index) => (
              <LyricLine
                key={line}
                line={line}
                progress={scrollYProgress}
                start={index / lines.length}
                end={(index + 1) / lines.length}
                reduced={reduced}
              />
            ))}
          </p>
        </div>
        <p className="muzik-karaoke__note">{note}</p>
      </div>
    </section>
  );
}

function LyricLine({
  line,
  progress,
  start,
  end,
  reduced,
}: {
  line: string;
  progress: MotionValue<number>;
  start: number;
  end: number;
  reduced: boolean;
}) {
  const words = Math.max(1, line.split(" ").length);
  const filled = useTransform(progress, [start, end], [0, 1]);
  const backgroundPosition = useTransform(filled, (k) => `${((1 - k) * 100).toFixed(2)}% 0`);
  // La balle : glisse sur la ligne et rebondit une fois par mot.
  const left = useTransform(filled, (k) => `${(k * 100).toFixed(2)}%`);
  const y = useTransform(filled, (k) => -Math.abs(Math.sin(k * Math.PI * words)) * 26);
  const opacity = useTransform(filled, (k) => (k > 0.002 && k < 0.998 ? 1 : 0));

  return (
    <span aria-hidden="true" className="muzik-karaoke__line">
      <motion.span className="muzik-karaoke__text" style={reduced ? STILL_LINE : { backgroundPosition }}>
        {line}
      </motion.span>
      <motion.span className="muzik-karaoke__ball" style={reduced ? STILL_BALL : { left, y, opacity }} />
    </span>
  );
}
