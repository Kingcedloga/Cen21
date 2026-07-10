"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useCallback, useRef } from "react";

import { AnimateIn } from "@/components/ui/AnimateIn";
import { ArrowLeft, ArrowRight, ShoppingCart } from "@/lib/icons";
import { DURATION_S, EASE, defaultScrollViewport } from "@/lib/motion";
import type { SubsidiaryMuzikGallerySection } from "@/lib/types";

import "@/styles/muzik-cafe-gallery-section.css";

const CARD_STEP = 300;

type Props = {
  content: SubsidiaryMuzikGallerySection;
};

export function MuzikCafeGallerySection({ content }: Props) {
  const reduced = useReducedMotion();
  const t = useTranslations("subsidiaries");
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = useCallback(
    (delta: number) => {
      trackRef.current?.scrollBy({ left: delta, behavior: reduced ? "auto" : "smooth" });
    },
    [reduced],
  );

  return (
    <section className="muzik-gallery">
      <AnimateIn className="muzik-gallery__header">
        <h2 className="muzik-gallery__title">{content.title}</h2>
      </AnimateIn>

      <div className="muzik-gallery__row">
        <div className="muzik-gallery__nav muzik-gallery__nav--prev">
          <button
            type="button"
            className="muzik-gallery__nav-btn"
            aria-label={t("muzikCafeGallery.previousDishes")}
            onClick={() => scroll(-CARD_STEP)}
          >
            <ArrowLeft size={18} aria-hidden="true" />
          </button>
          <span className="muzik-gallery__nav-line" aria-hidden="true" />
        </div>

        <div className="muzik-gallery__track" ref={trackRef}>
          {content.items.map((item, i) => (
            <motion.div
              key={item.name}
              className="muzik-gallery__card"
              initial={reduced ? false : { opacity: 0, y: 24 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={defaultScrollViewport}
              transition={{ duration: DURATION_S.luxe, ease: EASE.luxury, delay: i * 0.06 }}
            >
              <Image
                src={item.image}
                alt={item.imageAlt}
                fill
                className="muzik-gallery__photo"
                sizes="(max-width: 767px) 60vw, 18vw"
              />
              <div className="muzik-gallery__overlay" aria-hidden="true">
                <span className="muzik-gallery__name">{item.name}</span>
                <span className="muzik-gallery__price">{item.price}</span>
              </div>
              <button
                type="button"
                className="muzik-gallery__cart"
                aria-label={t("muzikCafeGallery.addToOrder", { name: item.name })}
              >
                <ShoppingCart size={16} weight="fill" aria-hidden="true" />
              </button>
            </motion.div>
          ))}
        </div>

        <div className="muzik-gallery__nav muzik-gallery__nav--next">
          <span className="muzik-gallery__nav-line" aria-hidden="true" />
          <button
            type="button"
            className="muzik-gallery__nav-btn"
            aria-label={t("muzikCafeGallery.nextDishes")}
            onClick={() => scroll(CARD_STEP)}
          >
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
