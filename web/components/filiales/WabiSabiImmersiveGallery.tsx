"use client";

import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, type CSSProperties } from "react";

import { AnimateIn } from "@/components/ui/AnimateIn";
import { cormorant } from "@/lib/fonts";
import { BLUR_PETROL } from "@/lib/image-blur";
import type { GalleryCategory } from "@/lib/gallery-categories";
import { GALLERY_CATEGORIES } from "@/lib/gallery-categories";
import type { GalleryItem } from "@/lib/types";

import "@/styles/wabi-sabi-beige-band.css";
import "@/styles/wabi-sabi-immersive-gallery.css";

type Props = {
  items: GalleryItem[];
  title: string;
  description: string;
};

type StripVariant = "panorama" | "standard" | "detail";

function itemCategory(item: GalleryItem): GalleryCategory {
  const tag = item.tags[0];
  return (GALLERY_CATEGORIES as readonly string[]).includes(tag ?? "")
    ? (tag as GalleryCategory)
    : "vibes";
}

function stripVariant(item: GalleryItem): StripVariant {
  const category = itemCategory(item);
  if (category === "interior" || category === "ambiance" || category === "vibes") {
    return "panorama";
  }
  if (category === "food" || category === "drinks") {
    return "detail";
  }
  return "standard";
}

function StripFigure({ item }: { item: GalleryItem }) {
  const variant = stripVariant(item);

  return (
    <figure
      className={`wabi-immersive-gallery__item wabi-immersive-gallery__item--${variant}`}
    >
      <Image
        src={item.src}
        alt={item.alt}
        fill
        className="wabi-immersive-gallery__image"
        sizes="(max-width: 767px) 46vw, 28vw"
        quality={88}
        placeholder="blur"
        blurDataURL={BLUR_PETROL}
      />
    </figure>
  );
}

export function WabiSabiImmersiveGallery({ items, title, description }: Props) {
  const reduced = useReducedMotion() ?? false;
  const list = items.filter((item) => item.src);

  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const hoverRef = useRef(false);
  const isWheelingRef = useRef(false);
  const wheelTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);

  const durationSeconds = useMemo(
    () => Math.max(list.length * 7, 56),
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

  // Hover pauses auto-scroll; wheel listener converts vertical → horizontal
  useEffect(() => {
    if (reduced) return;
    const viewport = viewportRef.current;
    if (!viewport) return;

    const onEnter = () => { hoverRef.current = true; };
    const onLeave = () => { hoverRef.current = false; };

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

  if (list.length === 0) return null;

  const loop = [...list, ...list];

  return (
    <section
      id="wabi-sabi-gallery"
      className={`wabi-immersive-gallery wabi-sabi-beige-band ${cormorant.variable}`}
      aria-labelledby="wabi-immersive-gallery-title"
      style={{ "--wabi-gallery-duration": `${durationSeconds}s` } as CSSProperties}
    >
      <div className="wabi-immersive-gallery__header">
        <AnimateIn>
          <h2 id="wabi-immersive-gallery-title" className="wabi-immersive-gallery__title">
            {title}
          </h2>
          <p className="wabi-immersive-gallery__description">{description}</p>
        </AnimateIn>
      </div>

      <div
        ref={viewportRef}
        className="wabi-immersive-gallery__viewport"
        aria-label={title}
      >
        <div
          ref={trackRef}
          className={`wabi-immersive-gallery__track${reduced ? " wabi-immersive-gallery__track--static" : ""}`}
        >
          {loop.map((item, index) => (
            <StripFigure key={`${item.id}-${index}`} item={item} />
          ))}
        </div>
        <span className="wabi-immersive-gallery__fade wabi-immersive-gallery__fade--left" aria-hidden />
        <span className="wabi-immersive-gallery__fade wabi-immersive-gallery__fade--right" aria-hidden />
      </div>
    </section>
  );
}
