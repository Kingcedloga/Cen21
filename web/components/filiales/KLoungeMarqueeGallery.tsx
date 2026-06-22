"use client";

import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { useCallback, useMemo, useRef, useState, type CSSProperties } from "react";

import { AnimateIn } from "@/components/ui/AnimateIn";
import { cormorant } from "@/lib/fonts";
import type { GalleryItem } from "@/lib/types";

import "@/styles/k-lounge-marquee-gallery.css";

const BLUR_BLACK =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAxNiAxNic+PHJlY3Qgd2lkdGg9JzE2JyBoZWlnaHQ9JzE2JyBmaWxsPScjMDAwMDAwJy8+PC9zdmc+";

type Props = {
  items: GalleryItem[];
  title: string;
  description: string;
};

function PanelFigure({ item }: { item: GalleryItem }) {
  return (
    <figure className="klounge-marquee-gallery__panel">
      <Image
        src={item.src}
        alt={item.alt}
        fill
        className="klounge-marquee-gallery__image"
        sizes="(max-width: 767px) 42vw, 16vw"
        quality={88}
        placeholder="blur"
        blurDataURL={BLUR_BLACK}
      />
    </figure>
  );
}

export function KLoungeMarqueeGallery({ items, title, description }: Props) {
  const reduced = useReducedMotion() ?? false;
  const list = items.filter((item) => item.src);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [cursorVisible, setCursorVisible] = useState(false);

  const durationSeconds = useMemo(
    () => Math.max(list.length * 5.5, 48),
    [list.length],
  );

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (cursorRef.current) {
      cursorRef.current.style.left = `${e.clientX}px`;
      cursorRef.current.style.top = `${e.clientY}px`;
    }
  }, []);

  if (list.length === 0) return null;

  const loop = [...list, ...list];

  return (
    <section
      id="k-lounge-gallery"
      className={`klounge-marquee-gallery ${cormorant.variable}`}
      aria-labelledby="klounge-marquee-gallery-title"
      style={{ "--kl-gallery-duration": `${durationSeconds}s` } as CSSProperties}
    >
      <div className="klounge-marquee-gallery__header">
        <AnimateIn>
          <h2 id="klounge-marquee-gallery-title" className="klounge-marquee-gallery__title">
            {title}
          </h2>
          <p className="klounge-marquee-gallery__description">{description}</p>
        </AnimateIn>
      </div>

      <div
        className="klounge-marquee-gallery__viewport"
        aria-label={title}
        onMouseMove={onMouseMove}
        onMouseEnter={() => setCursorVisible(true)}
        onMouseLeave={() => setCursorVisible(false)}
      >
        <div
          className={`klounge-marquee-gallery__track${reduced ? " klounge-marquee-gallery__track--static" : ""}`}
        >
          {loop.map((item, index) => (
            <PanelFigure key={`${item.id}-${index}`} item={item} />
          ))}
        </div>
      </div>

      <div
        ref={cursorRef}
        className={`klounge-marquee-gallery__cursor${cursorVisible ? " klounge-marquee-gallery__cursor--visible" : ""}`}
        aria-hidden
      >
        Voir
      </div>
    </section>
  );
}
