"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";

import { BLUR_PETROL } from "@/lib/image-blur";
import {
  categoriesPresentInItems,
} from "@/lib/gallery-categories";
import {
  defaultScrollViewport,
  fadeUpTransition,
  fadeUpVariants,
} from "@/lib/motion";
import type { GalleryItem } from "@/lib/types";

import { Lightbox } from "./Lightbox";

export function GalleryGrid({
  items,
  showFilters = true,
  categoryLabels,
  emptyFilterLabel = "Aucun contenu dans cette catégorie.",
}: {
  items: GalleryItem[];
  showFilters?: boolean;
  /** Labels i18n — clés : `all` + slugs de catégories */
  categoryLabels?: Record<string, string>;
  emptyFilterLabel?: string;
}) {
  const [filter, setFilter] = useState<string>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const reduced = useReducedMotion();

  const useCategoryFilters = Boolean(categoryLabels);

  const filterOptions = useMemo(() => {
    if (!showFilters) return [];
    if (useCategoryFilters) {
      const present = categoriesPresentInItems(items);
      return present.map((slug) => ({
        slug,
        label: categoryLabels![slug] ?? slug,
      }));
    }
    const set = new Set<string>();
    items.forEach((i) => i.tags.forEach((t) => set.add(t)));
    return Array.from(set)
      .sort()
      .map((slug) => ({ slug, label: slug }));
  }, [items, showFilters, useCategoryFilters, categoryLabels]);

  const filtered = useMemo(() => {
    if (filter === "all") return items;
    return items.filter((i) => i.tags.includes(filter));
  }, [items, filter]);

  const openLightbox = useCallback((index: number) => setLightboxIndex(index), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  useEffect(() => {
    setLightboxIndex(null);
  }, [filter]);

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

  const allLabel = categoryLabels?.all ?? "Tout";

  return (
    <>
      {showFilters && filterOptions.length > 0 && (
        <div
          className="-mx-1 mb-8 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mb-10"
          role="tablist"
          aria-label="Filtrer la galerie par catégorie"
        >
          <div className="flex min-w-min gap-2">
            <FilterPill
              active={filter === "all"}
              onClick={() => setFilter("all")}
              label={allLabel}
            />
            {filterOptions.map(({ slug, label }) => (
              <FilterPill
                key={slug}
                active={filter === slug}
                onClick={() => setFilter(slug)}
                label={label}
              />
            ))}
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-sm text-taupe">{emptyFilterLabel}</p>
      ) : (
        <div key={filter} className="columns-1 gap-4 space-y-4 sm:columns-2 lg:columns-3">
          {filtered.map((item, index) => (
            <motion.button
              key={item.id}
              type="button"
              initial={reduced ? false : "hidden"}
              whileInView={reduced ? undefined : "visible"}
              viewport={defaultScrollViewport}
              variants={reduced ? undefined : fadeUpVariants}
              transition={{ ...fadeUpTransition, delay: index * 0.05 }}
              className="relative block w-full break-inside-avoid overflow-hidden rounded-2xl border border-white/10 bg-petrol/40 cursor-pointer group transition-all duration-luxe hover:border-gold/50 hover:shadow-[0_20px_45px_-12px_rgba(212,173,101,0.25)] hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-gold active:scale-[0.99]"
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
                className="w-full h-auto object-cover transition-transform duration-grand ease-out group-hover:scale-105"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-0 transition-opacity duration-base group-hover:opacity-100 flex items-end p-5 pointer-events-none"
              >
                <span className="text-xs font-medium text-white/95 line-clamp-1">
                  {item.alt}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {lightboxIndex !== null && filtered.length > 0 && (
          <Lightbox
            key="gallery-lightbox"
            items={filtered}
            index={lightboxIndex}
            onClose={closeLightbox}
            onNavigate={setLightboxIndex}
          />
        )}
      </AnimatePresence>
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
      className={`shrink-0 min-h-[42px] rounded-full border px-5 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition-all duration-fine ease-out cursor-pointer focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-2 active:scale-[0.97] ${
        active
          ? "border-gold bg-gold text-petrol shadow-[0_4px_20px_-4px_rgba(212,173,101,0.5)] font-bold"
          : "border-white/15 bg-white/5 text-ivory/80 hover:border-gold/40 hover:text-gold hover:bg-white/10"
      }`}
    >
      {label}
    </button>
  );
}
