"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";

import { BLUR_PETROL } from "@/lib/image-blur";
import type { GalleryItem } from "@/lib/types";

import { Lightbox } from "./Lightbox";

export function GalleryGrid({
  items,
  showFilters = true,
}: {
  items: GalleryItem[];
  showFilters?: boolean;
}) {
  const [filter, setFilter] = useState<string>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const tags = useMemo(() => {
    const set = new Set<string>();
    items.forEach((i) => i.tags.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [items]);

  const filtered = useMemo(() => {
    if (filter === "all") return items;
    return items.filter((i) => i.tags.includes(filter));
  }, [items, filter]);

  const openLightbox = useCallback((index: number) => setLightboxIndex(index), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight")
        setLightboxIndex((i) =>
          i === null ? null : (i + 1) % filtered.length,
        );
      if (e.key === "ArrowLeft")
        setLightboxIndex((i) =>
          i === null ? null : (i - 1 + filtered.length) % filtered.length,
        );
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, filtered.length, closeLightbox]);

  return (
    <>
      {showFilters && tags.length > 0 && (
        <div
          className="flex flex-wrap gap-2 mb-10"
          role="tablist"
          aria-label="Filtrer la galerie"
        >
          <FilterPill
            active={filter === "all"}
            onClick={() => setFilter("all")}
            label="Tout"
          />
          {tags.map((tag) => (
            <FilterPill
              key={tag}
              active={filter === tag}
              onClick={() => setFilter(tag)}
              label={tag}
            />
          ))}
        </div>
      )}

      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {filtered.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className="relative block w-full break-inside-avoid overflow-hidden rounded-sm cursor-pointer group focus-visible:outline-2 focus-visible:outline-gold"
            onClick={() => openLightbox(index)}
            aria-label={`Ouvrir : ${item.alt}`}
          >
            <Image
              src={item.src}
              alt={item.alt}
              width={900}
              height={600}
              placeholder="blur"
              blurDataURL={BLUR_PETROL}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </button>
        ))}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          items={filtered}
          index={lightboxIndex}
          onClose={closeLightbox}
          onNavigate={setLightboxIndex}
        />
      )}
    </>
  );
}

function FilterPill({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`min-h-[44px] rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-2 ${
        active
          ? "border-gold bg-gold text-petrol"
          : "border-white/20 text-ivory/85 hover:border-gold hover:text-gold"
      }`}
    >
      {label}
    </button>
  );
}
