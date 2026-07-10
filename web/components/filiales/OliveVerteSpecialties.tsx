"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { SubsidiarySpecialtiesSection } from "@/lib/types";
import { defaultScrollViewport, DURATION_S, EASE } from "@/lib/motion";
import { OliveMotifs } from "@/components/filiales/OliveMotifs";
import "@/styles/olive-verte-specialties.css";

const MOTIFS = [
  { symbol: "+",      x: "6%",  y: "12%", circle: false },
  { symbol: "",       x: "11%", y: "70%", circle: true  },
  { symbol: "+",      x: "20%", y: "32%", circle: false },
  { symbol: "",       x: "4%",  y: "50%", circle: true  },
  { symbol: "+",      x: "28%", y: "85%", circle: false },
  { symbol: "+",      x: "48%", y: "6%",  circle: false },
  { symbol: "",       x: "56%", y: "93%", circle: true  },
  { symbol: "+",      x: "65%", y: "20%", circle: false },
  { symbol: "",       x: "75%", y: "74%", circle: true  },
  { symbol: "+",      x: "83%", y: "40%", circle: false },
  { symbol: "",       x: "92%", y: "16%", circle: true  },
  { symbol: "+",      x: "97%", y: "62%", circle: false },
  { symbol: "+",      x: "39%", y: "57%", circle: false },
  { symbol: "",       x: "88%", y: "88%", circle: true  },
] as const;

const transition = {
  duration: DURATION_S.grand,
  ease: EASE.luxury,
};

type Props = {
  content: SubsidiarySpecialtiesSection;
};

export function OliveVerteSpecialties({ content }: Props) {
  return (
    <section className="olive-specialties">
      <OliveMotifs section="specialties" />
      {/* Grand cercle outline gauche */}
      <div className="olive-specialties__circle-left" aria-hidden="true" />

      {/* Courbes organiques droite */}
      <div className="olive-specialties__curves-right" aria-hidden="true">
        <span className="olive-specialties__curve olive-specialties__curve--a" />
        <span className="olive-specialties__curve olive-specialties__curve--b" />
      </div>

      {/* Accent cercle plein bas gauche */}
      <div className="olive-specialties__dot-accent" aria-hidden="true" />

      {/* Motifs dispersés */}
      <div className="olive-specialties__motifs" aria-hidden="true">
        {MOTIFS.map((m, i) => (
          <motion.span
            key={i}
            className={`olive-specialties__motif${m.circle ? " olive-specialties__motif--circle" : ""}`}
            style={{ left: m.x, top: m.y }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ...transition, delay: i * 0.12 }}
          >
            {m.symbol}
          </motion.span>
        ))}
      </div>

      {/* En-tête */}
      <motion.div
        className="olive-specialties__header"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ ...defaultScrollViewport, once: true }}
        transition={transition}
      >
        <p className="olive-specialties__eyebrow">{content.eyebrow}</p>
        <h2 className="olive-specialties__title">{content.title}</h2>
        <p className="olive-specialties__description">{content.description}</p>
      </motion.div>

      {/* Blocs alternés */}
      <div className="olive-specialties__rows">
        {content.rows.map((row, i) => {
          const isReverse = i % 2 === 1;
          const imageX = isReverse ? 40 : -40;
          const textX  = isReverse ? -40 : 40;

          return (
            <div
              key={i}
              className={`olive-specialties__row${isReverse ? " olive-specialties__row--reverse" : ""}`}
            >
              {/* Photo */}
              <motion.div
                className="olive-specialties__image-wrap"
                initial={{ opacity: 0, x: imageX }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ ...defaultScrollViewport, once: true }}
                transition={{ ...transition, delay: 0.1 }}
              >
                <Image
                  src={row.image}
                  alt={row.imageAlt}
                  fill
                  className="olive-specialties__image"
                  sizes="(max-width: 767px) 100vw, 500px"
                />
              </motion.div>

              {/* Texte */}
              <motion.div
                className="olive-specialties__text"
                initial={{ opacity: 0, x: textX }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ ...defaultScrollViewport, once: true }}
                transition={{ ...transition, delay: 0.22 }}
              >
                <h3 className="olive-specialties__row-title">{row.title}</h3>
                <p className="olive-specialties__row-description">{row.description}</p>
              </motion.div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
