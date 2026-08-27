"use client";

import Image from "next/image";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

import { dynalight } from "@/lib/fonts";
import { EASE } from "@/lib/motion";
import type { TeamMember } from "@/lib/types";

import "@/styles/market-positioning.css";

const GAP_PX = 24;

type Props = {
  eyebrow: string;
  title: string;
  team: TeamMember[];
};

export function MarketPositioningSection({ eyebrow, title, team }: Props) {
  const reduced = useReducedMotion() ?? false;
  const sectionRef = useRef<HTMLElement>(null);
  const trackOuterRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px 0px" });

  const [mounted, setMounted] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const el = trackOuterRef.current;
    if (!el) return;
    const update = () => setContainerWidth(el.offsetWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const visibleCount = !mounted ? 3 : containerWidth < 768 ? 1 : 3;
  const cardWidth = mounted && containerWidth > 0
    ? (containerWidth - GAP_PX * (visibleCount - 1)) / visibleCount
    : 0;
  const maxIndex = Math.max(team.length - visibleCount, 0);
  const numDots = maxIndex + 1;

  // Re-scroll when card dimensions change (resize)
  useEffect(() => {
    if (!trackOuterRef.current || cardWidth <= 0) return;
    const clamped = Math.min(currentIndex, maxIndex);
    if (clamped !== currentIndex) setCurrentIndex(clamped);
    trackOuterRef.current.scrollLeft = clamped * (cardWidth + GAP_PX);
  }, [cardWidth, maxIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync dots with native scroll position
  useEffect(() => {
    const el = trackOuterRef.current;
    if (!el) return;
    const onScroll = () => {
      if (cardWidth <= 0) return;
      const idx = Math.min(Math.round(el.scrollLeft / (cardWidth + GAP_PX)), maxIndex);
      setCurrentIndex(idx);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [cardWidth, maxIndex]);

  const goTo = useCallback(
    (i: number) => {
      const clamped = Math.min(Math.max(i, 0), maxIndex);
      setCurrentIndex(clamped);
      trackOuterRef.current?.scrollTo({
        left: clamped * (cardWidth + GAP_PX),
        behavior: "smooth",
      });
    },
    [maxIndex, cardWidth],
  );

  return (
    <section className={`mp-section ${dynalight.variable}`} ref={sectionRef}>

      {/* ── Header ── */}
      <div className="mp-header">
        <motion.span
          className="mp-eyebrow"
          initial={reduced ? false : { opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.7, ease: EASE.luxury }}
        >
          {eyebrow}
        </motion.span>

        <motion.h2
          className="mp-title"
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.7, ease: EASE.luxury, delay: 0.07 }}
        >
          {title}
        </motion.h2>
      </div>

      {/* ── Carousel ── */}
      <div className="mp-carousel-outer">
        <div className="mp-track-outer" ref={trackOuterRef}>
          <div className="mp-track">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                className="mp-card"
                style={cardWidth > 0 ? { width: cardWidth } : undefined}
                initial={reduced ? false : { opacity: 0, y: 28, scale: 0.97 }}
                animate={inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 28, scale: 0.97 }}
                transition={{ duration: 0.7, ease: EASE.luxury, delay: 0.14 + i * 0.09 }}
              >
                {/* Rounded card box — quote mark + message */}
                <div className="mp-card__box">
                  <motion.div
                    className="mp-card__quote-mark"
                    aria-hidden
                    initial={reduced ? false : { opacity: 0 }}
                    animate={inView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 0.6, ease: EASE.luxury, delay: 0.2 + i * 0.09 }}
                  >
                    &#8220;
                  </motion.div>

                  <p className="mp-card__message">
                    {member.bio ?? member.quote ?? "—"}
                  </p>
                </div>

                {/* Identity — hors de la carte, flotte en dessous */}
                <div className="mp-card__identity">
                  <div className="mp-card__avatar">
                    {member.photo ? (
                      <Image
                        src={member.photo}
                        alt={member.name}
                        fill
                        className="object-cover object-top"
                        sizes="56px"
                      />
                    ) : (
                      <div className="mp-card__avatar-placeholder" />
                    )}
                  </div>
                  <div className="mp-card__id-text">
                    <span className="mp-card__name">{member.name}</span>
                    <span className="mp-card__role">{member.role}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Pagination dots ── */}
        {mounted && numDots > 1 && (
          <div className="mp-dots" role="tablist" aria-label="Navigation carrousel">
            {Array.from({ length: numDots }, (_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === currentIndex}
                aria-label={`Slide ${i + 1}`}
                className={`mp-dot${i === currentIndex ? " mp-dot--active" : ""}`}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
        )}
      </div>

    </section>
  );
}
