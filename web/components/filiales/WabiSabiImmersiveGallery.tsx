"use client";

import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { useMemo, type CSSProperties } from "react";

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

  const durationSeconds = useMemo(
    () => Math.max(list.length * 7, 56),
    [list.length],
  );

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
        className="wabi-immersive-gallery__viewport"
        aria-label={title}
      >
        <div
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
