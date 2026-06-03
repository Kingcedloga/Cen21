"use client";

import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

export type EditorialSlide = {
  src: string;
  alt: string;
};

type Props = {
  slides: EditorialSlide[];
  sizes: string;
  /** Intervalle entre deux photos (ms). */
  intervalMs?: number;
};

export function SubsidiaryEditorialImageSlideshow({
  slides,
  sizes,
  intervalMs = 5500,
}: Props) {
  const list = slides.filter((s) => s.src);
  const len = list.length;
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion() ?? false;
  const safeIndex = len ? index % len : 0;

  const next = useCallback(() => {
    setIndex((i) => (len ? (i + 1) % len : 0));
  }, [len]);

  useEffect(() => {
    if (reduced || len <= 1) return;
    const timer = window.setInterval(next, intervalMs);
    return () => window.clearInterval(timer);
  }, [reduced, len, next, intervalMs]);

  if (len === 0) return null;

  return (
    <div
      className="subsidiary-editorial-about__slideshow"
      aria-live="polite"
      aria-atomic="true"
    >
      {list.map((slide, i) => (
        <div
          key={`${slide.src}-${i}`}
          className={[
            "subsidiary-editorial-about__slide",
            i === safeIndex ? "subsidiary-editorial-about__slide--active" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          aria-hidden={i !== safeIndex}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            className="subsidiary-editorial-about__image"
            sizes={sizes}
            quality={90}
            priority={i === 0}
          />
        </div>
      ))}
    </div>
  );
}
