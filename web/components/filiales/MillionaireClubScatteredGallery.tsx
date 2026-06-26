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
  total: number,
  reduced: boolean,
): CSSProperties {
  if (reduced) return {};

  const distance = index - activeIndex;
  const absDistance = Math.abs(distance);
  const maxVisible = Math.min(Math.floor(total / 2), 4);

  const rotateY = distance * -18;
  const scale = absDistance === 0 ? 1.08 : Math.max(0.68, 1 - absDistance * 0.12);
  const translateZ = absDistance === 0 ? 30 : -absDistance * 70;
  const translateX = distance * 6;
  const opacity = absDistance > maxVisible ? 0 : Math.max(0.3, 1 - absDistance * 0.2);

  return {
    "--mc-arc-rotate-y": `${rotateY}deg`,
    "--mc-arc-scale": scale,
    "--mc-arc-translate-z": `${translateZ}px`,
    "--mc-arc-translate-x": `${translateX}px`,
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

  const scrollToIndex = useCallback((index: number) => {
    const card = cardRefs.current[index];
    if (card) {
      card.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
    }
  }, []);

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

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft" && activeIndex > 0) {
        e.preventDefault();
        const next = activeIndex - 1;
        setActiveIndex(next);
        scrollToIndex(next);
      } else if (e.key === "ArrowRight" && activeIndex < items.length - 1) {
        e.preventDefault();
        const next = activeIndex + 1;
        setActiveIndex(next);
        scrollToIndex(next);
      }
    },
    [activeIndex, items.length, scrollToIndex],
  );

  const handleCardClick = useCallback(
    (index: number) => {
      if (index !== activeIndex) {
        setActiveIndex(index);
        scrollToIndex(index);
      }
    },
    [activeIndex, scrollToIndex],
  );

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
        <div className="mc-arc-gallery__floor-reflection" aria-hidden="true" />

        <div
          ref={viewportRef}
          className="mc-arc-gallery__viewport"
          aria-label={title}
          role="listbox"
          tabIndex={0}
          onKeyDown={handleKeyDown}
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
                  style={cardTransformStyle(index, activeIndex, items.length, reduced)}
                  aria-current={isActive ? "true" : undefined}
                  role="option"
                  aria-selected={isActive}
                  onClick={() => handleCardClick(index)}
                >
                  <div className="mc-arc-gallery__card-inner">
                    {isActive && (
                      <>
                        <span className="mc-arc-gallery__shine" aria-hidden="true" />
                        <span className="mc-arc-gallery__edge-glow" aria-hidden="true" />
                      </>
                    )}
                    <div className="mc-arc-gallery__image-wrap">
                      <Image
                        src={item.src}
                        alt={item.alt}
                        fill
                        placeholder="blur"
                        blurDataURL={BLUR_PETROL}
                        className="mc-arc-gallery__image"
                        sizes="(max-width: 639px) 72vw, (max-width: 1023px) 38vw, 18vw"
                      />
                    </div>
                  </div>
                </figure>
              );
            })}
          </div>
        </div>
      </div>

      {items.length > 1 && (
        <nav className="mc-arc-gallery__dots" aria-label="Gallery navigation">
          {items.map((item, index) => (
            <button
              key={item.id}
              className={`mc-arc-gallery__dot${index === activeIndex ? " is-active" : ""}`}
              onClick={() => {
                setActiveIndex(index);
                scrollToIndex(index);
              }}
              aria-label={`Image ${index + 1} of ${items.length}`}
              aria-current={index === activeIndex ? "true" : undefined}
            />
          ))}
        </nav>
      )}
    </section>
  );
}
