"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useRef, useState } from "react";

import { AnimateIn } from "@/components/ui/AnimateIn";
import { ChevronLeft, ChevronRight } from "@/lib/icons";
import { DURATION_S, EASE } from "@/lib/motion";
import type { SubsidiaryProductGallerySection } from "@/lib/types";

import "@/styles/pinkberry-gallery-section.css";

const CARD_STEP = 260;

export function PinkberryGallerySection({
  content,
}: {
  content: SubsidiaryProductGallerySection;
}) {
  const reduced = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState(
    content.categories[0]?.id ?? "",
  );

  const photos = content.photos.filter((photo) =>
    photo.categoryIds.includes(activeCategory),
  );

  const scroll = useCallback((delta: number) => {
    trackRef.current?.scrollBy({
      left: delta,
      behavior: reduced ? "auto" : "smooth",
    });
  }, [reduced]);

  return (
    <section className="pinkberry-gallery" aria-labelledby="pinkberry-gallery-title">
      <div className="pinkberry-gallery__grid">
        <p className="pinkberry-gallery__eyebrow">{content.eyebrow}</p>

        <div className="pinkberry-gallery__filters" role="tablist">
          {content.categories.map((category) => (
            <button
              key={category.id}
              type="button"
              role="tab"
              aria-selected={category.id === activeCategory}
              className={`pinkberry-gallery__filter${
                category.id === activeCategory ? " pinkberry-gallery__filter--active" : ""
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.label}
            </button>
          ))}
        </div>

        <AnimateIn className="pinkberry-gallery__text">
          <h2 id="pinkberry-gallery-title" className="pinkberry-gallery__title">
            {content.title}
          </h2>
          <p className="pinkberry-gallery__description">{content.description}</p>
          <div className="pinkberry-gallery__nav">
            <button
              type="button"
              className="pinkberry-gallery__nav-btn"
              aria-label="Previous"
              onClick={() => scroll(-CARD_STEP)}
            >
              <ChevronLeft size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              className="pinkberry-gallery__nav-btn"
              aria-label="Next"
              onClick={() => scroll(CARD_STEP)}
            >
              <ChevronRight size={18} aria-hidden="true" />
            </button>
          </div>
        </AnimateIn>

        <div className="pinkberry-gallery__carousel">
          <div className="pinkberry-gallery__track" ref={trackRef}>
            {photos.map((photo, i) => (
              <motion.div
                key={`${activeCategory}-${photo.src}`}
                className="pinkberry-gallery__card"
                initial={reduced ? false : { opacity: 0, x: -16 }}
                animate={reduced ? undefined : { opacity: 1, x: 0 }}
                transition={{
                  duration: DURATION_S.base,
                  ease: EASE.luxury,
                  delay: i * 0.07,
                }}
              >
                <div className="pinkberry-gallery__card-image-wrap">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    className="pinkberry-gallery__card-image"
                    sizes="(max-width: 899px) 60vw, 15rem"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
