"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { SubsidiarySpecialtiesSection } from "@/lib/types";
import { defaultScrollViewport, DURATION_S, EASE } from "@/lib/motion";
import "@/styles/olive-verte-specialties.css";

const MOTIFS = [
  { symbol: "+", x: "4%",  y: "8%"  },
  { symbol: "●", x: "9%",  y: "68%" },
  { symbol: "+", x: "18%", y: "30%" },
  { symbol: "●", x: "2%",  y: "48%" },
  { symbol: "+", x: "26%", y: "82%" },
  { symbol: "●", x: "47%", y: "5%"  },
  { symbol: "+", x: "55%", y: "92%" },
  { symbol: "●", x: "63%", y: "18%" },
  { symbol: "+", x: "74%", y: "72%" },
  { symbol: "●", x: "82%", y: "38%" },
  { symbol: "+", x: "91%", y: "14%" },
  { symbol: "●", x: "96%", y: "60%" },
  { symbol: "+", x: "38%", y: "55%" },
  { symbol: "●", x: "88%", y: "86%" },
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
      {/* Blobs décoratifs */}
      <div className="olive-specialties__blobs" aria-hidden="true">
        <span className="olive-specialties__blob olive-specialties__blob--left" />
        <span className="olive-specialties__blob olive-specialties__blob--right" />
      </div>

      {/* Motifs dispersés */}
      <div className="olive-specialties__motifs" aria-hidden="true">
        {MOTIFS.map((m, i) => (
          <motion.span
            key={i}
            className="olive-specialties__motif"
            style={{ left: m.x, top: m.y }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={defaultScrollViewport}
            transition={{ ...transition, delay: i * 0.04 }}
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
        viewport={defaultScrollViewport}
        transition={transition}
      >
        <p className="olive-specialties__eyebrow">{content.eyebrow}</p>
        <h2 className="olive-specialties__title">{content.title}</h2>
        <p className="olive-specialties__description">{content.description}</p>
      </motion.div>

      {/* Rangées alternées */}
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
                viewport={defaultScrollViewport}
                transition={{ ...transition, delay: 0.1 }}
              >
                <Image
                  src={row.image}
                  alt={row.imageAlt}
                  fill
                  className="olive-specialties__image"
                  sizes="(max-width: 767px) 100vw, 60vw"
                />
              </motion.div>

              {/* Texte */}
              <motion.div
                className="olive-specialties__text"
                initial={{ opacity: 0, x: textX }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={defaultScrollViewport}
                transition={{ ...transition, delay: 0.2 }}
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
