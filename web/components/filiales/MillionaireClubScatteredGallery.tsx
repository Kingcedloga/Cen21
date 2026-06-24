"use client";

import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";

import { BLUR_PETROL } from "@/lib/image-blur";
import type { GalleryItem } from "@/lib/types";

import "@/styles/millionaire-club-scattered-gallery.css";

type Props = {
  items: GalleryItem[];
  title: string;
  description?: string;
};

function cardTransformStyle(
  index: number,
  activeIndex: number,
  reduced: boolean,
): CSSProperties {
  if (reduced) {
    return {};
  }

  const distance = index - activeIndex;
  const absDistance = Math.abs(distance);
  const rotateY = distance * -22;
  const scale = Math.max(0.72, 1 - absDistance * 0.1);
  const translateZ = -absDistance * 55;
  const opacity = Math.max(0.38, 1 - absDistance * 0.17);

  return {
    "--mc-arc-rotate-y": `${rotateY}deg`,
    "--mc-arc-scale": scale,
    "--mc-arc-translate-z": `${translateZ}px`,
    "--mc-arc-opacity": opacity,
  } as CSSProperties;
}

export function MillionaireClubScatteredGallery({ items, title, description }: Props) {
  const reduced = useReducedMotion() ?? false;
  const viewportRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(() =>
    Math.min(Math.floor(items.length / 2), Math.max(items.length - 1, 0)),
  );

  const updateActiveFromScroll = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const centerX = viewport.getBoundingClientRect().left + viewport.clientWidth / 2;
    let closest = 0;
    let minDistance = Infinity;

    cardRefs.current.forEach((element, index) => {
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const cardCenter = rect.left + rect.width / 2;
      const distance = Math.abs(cardCenter - centerX);
      if (distance < minDistance) {
        minDistance = distance;
        closest = index;
      }
    });

    setActiveIndex(closest);
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || items.length === 0) return;

    const middleIndex = Math.min(Math.floor(items.length / 2), items.length - 1);

    requestAnimationFrame(() => {
      const initial = cardRefs.current[middleIndex];
      if (initial) {
        initial.scrollIntoView({ inline: "center", block: "nearest", behavior: "auto" });
      }
      updateActiveFromScroll();
    });

    viewport.addEventListener("scroll", updateActiveFromScroll, { passive: true });
    window.addEventListener("resize", updateActiveFromScroll);

    return () => {
      viewport.removeEventListener("scroll", updateActiveFromScroll);
      window.removeEventListener("resize", updateActiveFromScroll);
    };
  }, [items.length, updateActiveFromScroll]);

  if (items.length === 0) return null;

  return (
    <section
      className="mc-arc-gallery"
      aria-labelledby="mc-arc-gallery-title"
    >
      <div className="mc-arc-gallery__header">
        <h2 id="mc-arc-gallery-title" className="mc-arc-gallery__title">
          {title}
        </h2>
        {description ? (
          <p className="mc-arc-gallery__description">{description}</p>
        ) : null}
      </div>

      <div className="mc-arc-gallery__stage">
        <div className="mc-arc-gallery__glow" aria-hidden="true" />

        <div
          ref={viewportRef}
          className="mc-arc-gallery__viewport"
          aria-label={title}
        >
          <div className="mc-arc-gallery__track">
            {items.map((item, index) => {
              const isActive = index === activeIndex;

              return (
                <figure
                  key={item.id}
                  ref={(element) => {
                    cardRefs.current[index] = element;
                  }}
                  className={`mc-arc-gallery__card${isActive ? " is-active" : ""}`}
                  style={cardTransformStyle(index, activeIndex, reduced)}
                  aria-current={isActive ? "true" : undefined}
                >
                  <div className="mc-arc-gallery__card-inner">
                    {isActive ? (
                      <span className="mc-arc-gallery__shine" aria-hidden="true" />
                    ) : null}
                    <div className="mc-arc-gallery__image-wrap">
                      <Image
                        src={item.src}
                        alt={item.alt}
                        fill
                        placeholder="blur"
                        blurDataURL={BLUR_PETROL}
                        className="mc-arc-gallery__image"
                        sizes="(max-width: 639px) 72vw, (max-width: 1023px) 38vw, 16vw"
                      />
                    </div>
                  </div>
                </figure>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
