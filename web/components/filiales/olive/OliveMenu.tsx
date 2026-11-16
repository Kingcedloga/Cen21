"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useId, useRef, useState, type KeyboardEvent } from "react";

import { DURATION_S, EASE } from "@/lib/motion";
import type { SubsidiaryMenuCategory } from "@/lib/types";
import { useReducedMotionSafe } from "@/lib/use-media-query";

import "@/styles/olive.css";

/**
 * La carte, sur l'olive de la charte, en cadre Art déco : les catégories en
 * onglets (flèches, Début, Fin), les plats avec points de conduite et prix,
 * et la photo de la catégorie dans un cadre à pans coupés (fondu au
 * changement). Catégorie sans photo : le cadre garde la précédente.
 * Reduced motion : changements sans fondu.
 */
export function OliveMenu({
  title,
  description,
  categories,
}: {
  title: string;
  description: string;
  categories: SubsidiaryMenuCategory[];
}) {
  const t = useTranslations("olive");
  const tFiliale = useTranslations("filiale");
  const reduced = useReducedMotionSafe();
  const baseId = useId();
  const tabsRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  // Dernière photo affichée : une catégorie sans photo garde la précédente.
  const [photoIndex, setPhotoIndex] = useState(() => categories.findIndex((category) => category.image));
  if (categories.length === 0) return null;
  const current = categories[active];
  const photo = categories[photoIndex]?.image;

  const select = (index: number) => {
    const next = (index + categories.length) % categories.length;
    setActive(next);
    if (categories[next].image) setPhotoIndex(next);
    return next;
  };

  const onKeyDown = (event: KeyboardEvent, index: number) => {
    let next: number | null = null;
    if (event.key === "ArrowRight") next = select(index + 1);
    else if (event.key === "ArrowLeft") next = select(index - 1);
    else if (event.key === "Home") next = select(0);
    else if (event.key === "End") next = select(categories.length - 1);
    if (next === null) return;
    event.preventDefault();
    tabsRef.current?.querySelector<HTMLButtonElement>(`[data-tab="${categories[next].id}"]`)?.focus();
  };

  return (
    <section id="carte" aria-labelledby="olive-menu-title" data-surface="light" className="olive-menu scroll-mt-6">
      <div className="olive-menu__inner">
        <header className="olive-menu__head">
          <p className="olive-eyebrow">{t("menuEyebrow")}</p>
          <h2 id="olive-menu-title" className="olive-title">
            {title}
          </h2>
          <p className="olive-menu__lead">{description}</p>
        </header>

        <div className="olive-menu__grid">
          <div className="olive-menu__frame" aria-hidden="true">
            <AnimatePresence initial={false}>
              {photo && (
                <motion.div
                  key={photo.src}
                  className="absolute inset-0"
                  initial={reduced ? false : { opacity: 0, scale: 1.06 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduced ? 0 : DURATION_S.luxe, ease: EASE.luxury }}
                >
                  <Image src={photo.src} alt="" fill sizes="(min-width: 1024px) 34vw, 90vw" className="object-cover" />
                </motion.div>
              )}
            </AnimatePresence>
            <span className="olive-menu__frame-label">{current.image ? current.label : t("menuNoPhoto")}</span>
          </div>

          <div className="olive-menu__card">
            <div ref={tabsRef} role="tablist" aria-label={tFiliale("menuTabs")} className="olive-menu__tabs">
              {categories.map((category, index) => {
                const selected = index === active;
                return (
                  <button
                    key={category.id}
                    type="button"
                    role="tab"
                    id={`${baseId}-tab-${category.id}`}
                    data-tab={category.id}
                    aria-selected={selected}
                    aria-controls={`${baseId}-panel`}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => select(index)}
                    onKeyDown={(event) => onKeyDown(event, index)}
                    className="olive-menu__tab"
                  >
                    {category.label}
                    {selected && (
                      <motion.span
                        layoutId={`${baseId}-rule`}
                        aria-hidden="true"
                        className="olive-menu__tab-rule"
                        transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 38 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <div
              role="tabpanel"
              id={`${baseId}-panel`}
              aria-labelledby={`${baseId}-tab-${current.id}`}
              tabIndex={0}
              className="olive-menu__panel"
            >
              <ul className="olive-menu__dishes">
                {current.dishes.map((dish) => (
                  <li key={dish.name} className="olive-dish">
                    <span className="olive-dish__line">
                      <span className="olive-dish__name">{dish.name}</span>
                      <span aria-hidden="true" className="olive-dish__leader" />
                      <span className="olive-dish__price">{dish.price}</span>
                    </span>
                    {dish.description && <span className="olive-dish__description">{dish.description}</span>}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
