"use client";

import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

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

  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const hoverRef = useRef(false);
  const isWheelingRef = useRef(false);
  const wheelTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);
  const [cursorVisible, setCursorVisible] = useState(false);

  const durationSeconds = useMemo(
    () => Math.max(list.length * 5.5, 48),
    [list.length],
  );

  // JS-driven auto-scroll — same speed as CSS animation, but controllable
  useEffect(() => {
    if (reduced) return;
    const track = trackRef.current;
    if (!track) return;

    track.style.animation = "none";

    let halfWidth = 0;
    let speed = 0;

    const tick = () => {
      if (!halfWidth) {
        halfWidth = track.scrollWidth / 2;
        if (halfWidth > 0) speed = halfWidth / (durationSeconds * 60);
      }
      if (!hoverRef.current && !isWheelingRef.current && halfWidth > 0) {
        offsetRef.current = (offsetRef.current + speed) % halfWidth;
      }
      track.style.transform = `translateX(-${offsetRef.current}px)`;
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [reduced, durationSeconds]);

  // Wheel → horizontal scroll through the marquee
  const onWheel = useCallback(
    (e: WheelEvent) => {
      if (reduced) return;
      e.preventDefault();
      const track = trackRef.current;
      if (!track) return;

      const halfWidth = track.scrollWidth / 2;
      if (halfWidth <= 0) return;

      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      offsetRef.current =
        ((offsetRef.current + delta * 0.9) % halfWidth + halfWidth) % halfWidth;

      isWheelingRef.current = true;
      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
      wheelTimerRef.current = setTimeout(() => {
        isWheelingRef.current = false;
      }, 1500);
    },
    [reduced],
  );

  // Hover (cursor + auto-scroll pause) + wheel listener
  useEffect(() => {
    if (reduced) return;
    const viewport = viewportRef.current;
    if (!viewport) return;

    const onEnter = () => {
      hoverRef.current = true;
      setCursorVisible(true);
    };
    const onLeave = () => {
      hoverRef.current = false;
      setCursorVisible(false);
    };

    viewport.addEventListener("mouseenter", onEnter);
    viewport.addEventListener("mouseleave", onLeave);
    viewport.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      viewport.removeEventListener("mouseenter", onEnter);
      viewport.removeEventListener("mouseleave", onLeave);
      viewport.removeEventListener("wheel", onWheel);
      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
    };
  }, [reduced, onWheel]);

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
        ref={viewportRef}
        className="klounge-marquee-gallery__viewport"
        aria-label={title}
        onMouseMove={onMouseMove}
      >
        <div
          ref={trackRef}
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
