"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";

import { dynalight } from "@/lib/fonts";
import { DURATION_S, EASE } from "@/lib/motion";

import "@/styles/home-philosophy.css";

const ROMAN = ["I", "II", "III", "IV"] as const;

type Value = { title: string; description: string };

type Props = {
  eyebrow: string;
  statement: string;
  values: Value[];
};

export function HomePhilosophySection({ eyebrow, statement, values }: Props) {
  const reduced = useReducedMotion() ?? false;
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });

  return (
    <section className={`hphil-section ${dynalight.variable}`} ref={ref}>
      <div className="hphil-inner">

        {/* ── Statement ── */}
        <div className="hphil-statement-block">
          <motion.span
            className="hphil-eyebrow"
            initial={reduced ? false : { opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: DURATION_S.luxe, ease: EASE.luxury }}
          >
            {eyebrow}
          </motion.span>

          <motion.p
            className="hphil-statement"
            initial={reduced ? false : { opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            transition={{ duration: DURATION_S.luxe, ease: EASE.luxury, delay: 0.08 }}
          >
            {statement}
          </motion.p>
        </div>

        {/* ── Divider ── */}
        <motion.div
          className="hphil-divider"
          aria-hidden
          initial={reduced ? false : { scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.9, ease: EASE.luxury, delay: 0.2 }}
          style={{ originX: 0 }}
        />

        {/* ── Values grid ── */}
        <div className="hphil-grid" role="list">
          {values.slice(0, 4).map((value, i) => (
            <motion.div
              key={value.title}
              className="hphil-value"
              role="listitem"
              initial={reduced ? false : { opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              transition={{ duration: DURATION_S.luxe, ease: EASE.luxury, delay: 0.3 + i * 0.1 }}
            >
              <span className="hphil-value__roman" aria-hidden>
                {ROMAN[i]}
              </span>
              <h3 className="hphil-value__title">{value.title}</h3>
              <p className="hphil-value__desc">{value.description}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
