"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useRef } from "react";

import { AnimateIn } from "@/components/ui/AnimateIn";
import { ChevronLeft, ChevronRight, Star } from "@/lib/icons";
import { DURATION_S, EASE, defaultScrollViewport } from "@/lib/motion";
import type { SubsidiaryMenuSection } from "@/lib/types";

import "@/styles/pinkberry-menu-section.css";

const CARD_STEP = 260;

export function PinkberryMenuSection({
  content,
  backgroundImage,
}: {
  content: SubsidiaryMenuSection;
  backgroundImage: string;
}) {
  const reduced = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = useCallback(
    (delta: number) => {
      trackRef.current?.scrollBy({
        left: delta,
        behavior: reduced ? "auto" : "smooth",
      });
    },
    [reduced],
  );

  return (
    <section className="pinkberry-menu" aria-labelledby="pinkberry-menu-title">
      <Image
        src={backgroundImage}
        alt=""
        fill
        aria-hidden="true"
        className="pinkberry-menu__bg-photo"
        sizes="100vw"
      />

      <div className="pinkberry-menu__header">
        <AnimateIn>
          <p className="pinkberry-menu__eyebrow">{content.eyebrow}</p>
          <h2 id="pinkberry-menu-title" className="pinkberry-menu__title">
            {content.title}
          </h2>
        </AnimateIn>

        <div className="pinkberry-menu__nav">
          <button
            type="button"
            className="pinkberry-menu__nav-btn"
            aria-label="Previous"
            onClick={() => scroll(-CARD_STEP)}
          >
            <ChevronLeft size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="pinkberry-menu__nav-btn"
            aria-label="Next"
            onClick={() => scroll(CARD_STEP)}
          >
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="pinkberry-menu__track" ref={trackRef}>
        {content.products.map((product, i) => (
          <motion.div
            key={product.name}
            className="pinkberry-menu__card"
            initial={reduced ? false : { opacity: 0, y: 24 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={defaultScrollViewport}
            transition={{
              duration: DURATION_S.luxe,
              ease: EASE.luxury,
              delay: i * 0.07,
            }}
          >
            <div className="pinkberry-menu__photo-wrap">
              <span className="pinkberry-menu__photo-circle" aria-hidden="true" />
              <Image
                src={product.image}
                alt={product.imageAlt}
                fill
                className="pinkberry-menu__photo"
                sizes="10rem"
              />
              <motion.span
                className="pinkberry-menu__price"
                initial={reduced ? false : { opacity: 0, scale: 0.8 }}
                whileInView={reduced ? undefined : { opacity: 1, scale: 1 }}
                viewport={defaultScrollViewport}
                transition={{
                  duration: DURATION_S.base,
                  ease: EASE.spring,
                  delay: i * 0.07 + 0.15,
                }}
              >
                {product.price}
              </motion.span>
            </div>

            <h3 className="pinkberry-menu__name">{product.name}</h3>

            <div className="pinkberry-menu__stars" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, star) => (
                <Star key={star} size={14} weight="fill" />
              ))}
            </div>

            <button type="button" className="pinkberry-menu__cta">
              {content.ctaLabel}
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
