"use client";

import Image from "next/image";
import { motion, AnimatePresence, useInView, useReducedMotion } from "framer-motion";
import { useRef, useState, useCallback } from "react";

import { dynalight } from "@/lib/fonts";
import { DURATION_S, EASE } from "@/lib/motion";
import type { TeamMember } from "@/lib/types";

import "@/styles/market-positioning.css";

type Props = {
  eyebrow: string;
  title: string;
  description?: string;
  team: TeamMember[];
};

export function MarketPositioningSection({ eyebrow, title, description, team }: Props) {
  const reduced = useReducedMotion() ?? false;
  const sectionRef = useRef<HTMLElement>(null);
  const trackOuterRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px 0px" });
  const [hovered, setHovered] = useState<number | null>(null);

  const scrollBy = useCallback((dir: 1 | -1) => {
    if (!trackOuterRef.current) return;
    trackOuterRef.current.scrollBy({ left: dir * 360, behavior: "smooth" });
  }, []);

  return (
    <section className={`mp-section ${dynalight.variable}`} ref={sectionRef}>
      <div className="mp-header">
        <motion.span
          className="mp-eyebrow"
          initial={reduced ? false : { opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: DURATION_S.luxe, ease: EASE.luxury }}
        >
          {eyebrow}
        </motion.span>

        <motion.h2
          className="mp-title"
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
          transition={{ duration: DURATION_S.luxe, ease: EASE.luxury, delay: 0.06 }}
        >
          {title}
        </motion.h2>

        {description && (
          <motion.p
            className="mp-description"
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: DURATION_S.luxe, ease: EASE.luxury, delay: 0.12 }}
          >
            {description}
          </motion.p>
        )}
      </div>

      <div className="mp-carousel-wrapper">
        <button
          className="mp-nav mp-nav--prev"
          onClick={() => scrollBy(-1)}
          aria-label="Précédent"
          type="button"
        >
          ‹
        </button>

        <div className="mp-track-outer" ref={trackOuterRef}>
          <div className="mp-track">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                className="mp-card"
                initial={reduced ? false : { opacity: 0, y: 40, scale: 0.96 }}
                animate={inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: 0.96 }}
                transition={{ duration: DURATION_S.luxe, ease: EASE.luxury, delay: 0.12 + i * 0.1 }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Portrait photo */}
                <div className="mp-card__photo">
                  {member.photo ? (
                    <Image
                      src={member.photo}
                      alt={member.name}
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 767px) 72vw, 340px"
                    />
                  ) : (
                    <div className="mp-card__photo-placeholder" />
                  )}
                </div>

                {/* Dark gradient overlay */}
                <div className="mp-card__gradient" aria-hidden />

                {/* Base info — always visible */}
                <div className="mp-card__info">
                  {member.quote && (
                    <p className="mp-card__quote">&#8220;{member.quote}&#8221;</p>
                  )}
                  <span className="mp-card__name">{member.name}</span>
                  <span className="mp-card__role">{member.role}</span>
                </div>

                {/* Hover floating card */}
                <AnimatePresence>
                  {hovered === i && (member.bio ?? member.quote) && (
                    <motion.div
                      className="mp-card__hover"
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 16 }}
                      transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
                    >
                      <div className="mp-card__stars" aria-hidden>
                        ★★★★★
                      </div>
                      <span className="mp-card__hover-name">{member.name}</span>
                      <span className="mp-card__hover-role">{member.role}</span>
                      {member.bio && (
                        <p className="mp-card__hover-bio">{member.bio}</p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>

        <button
          className="mp-nav mp-nav--next"
          onClick={() => scrollBy(1)}
          aria-label="Suivant"
          type="button"
        >
          ›
        </button>
      </div>
    </section>
  );
}
