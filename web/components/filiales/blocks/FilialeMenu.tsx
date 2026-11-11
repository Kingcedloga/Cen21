"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useId, useRef, useState, type KeyboardEvent } from "react";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { useReducedMotionSafe } from "@/lib/use-media-query";

import "@/styles/filiale-blocks.css";

export type MenuItem = { name: string; description?: string; price?: string; image?: string };
export type MenuCategory = { id: string; label: string; items: MenuItem[] };

/**
 * Carte de la maison en onglets (Orbix : scène à onglets) : une pastille
 * glisse sous l'onglet actif. Onglets ARIA : flèches gauche / droite, Début,
 * Fin ; un seul panneau visible. Une seule catégorie : pas d'onglets.
 */
export function FilialeMenu({
  title,
  intro,
  categories,
}: {
  title: string;
  intro?: string;
  categories: MenuCategory[];
}) {
  const t = useTranslations("filiale");
  const reduced = useReducedMotionSafe();
  const baseId = useId();
  const [active, setActive] = useState(categories[0]?.id);
  const tabsRef = useRef<HTMLDivElement>(null);
  if (categories.length === 0) return null;
  const current = categories.find((category) => category.id === active) ?? categories[0];
  // Une seule catégorie : la liste seule, sans onglet qui répéterait le titre.
  const tabbed = categories.length > 1;

  const focusTab = (index: number) => {
    const next = categories[(index + categories.length) % categories.length];
    setActive(next.id);
    tabsRef.current?.querySelector<HTMLButtonElement>(`[data-tab="${next.id}"]`)?.focus();
  };

  const onKeyDown = (event: KeyboardEvent, index: number) => {
    if (event.key === "ArrowRight") focusTab(index + 1);
    else if (event.key === "ArrowLeft") focusTab(index - 1);
    else if (event.key === "Home") focusTab(0);
    else if (event.key === "End") focusTab(categories.length - 1);
    else return;
    event.preventDefault();
  };

  return (
    <div className="filiale-menu">
      <SectionHeading
        look="editorial"
        eyebrow={t("menuEyebrow")}
        title={title}
        description={intro}
        titleAs="h2"
        titleId="filiale-menu-title"
        align="left"
        className="mb-8! max-w-2xl"
      />

      {tabbed && (
        <div ref={tabsRef} role="tablist" aria-label={t("menuTabs")} className="filiale-menu__tabs">
          {categories.map((category, index) => {
            const selected = category.id === current.id;
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
                onClick={() => setActive(category.id)}
                onKeyDown={(event) => onKeyDown(event, index)}
                className="filiale-menu__tab tap-press"
              >
                {selected && (
                  <motion.span
                    layoutId={`${baseId}-pill`}
                    aria-hidden="true"
                    className="filiale-menu__pill"
                    transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 36 }}
                  />
                )}
                <span className="relative">{category.label}</span>
              </button>
            );
          })}
        </div>
      )}

      <div
        role={tabbed ? "tabpanel" : undefined}
        id={`${baseId}-panel`}
        aria-labelledby={tabbed ? `${baseId}-tab-${current.id}` : undefined}
        tabIndex={tabbed ? 0 : undefined}
        className="filiale-menu__panel"
      >
        <ul className="filiale-menu__items">
          {current.items.map((item) => (
            <li key={item.name} className="filiale-menu__item">
              {item.image && (
                <span className="filiale-menu__image">
                  <Image src={item.image} alt="" fill sizes="96px" className="object-cover" />
                </span>
              )}
              <span className="filiale-menu__text">
                <span className="filiale-menu__line">
                  <span className="filiale-menu__name">{item.name}</span>
                  {item.price && (
                    <>
                      <span aria-hidden="true" className="filiale-menu__leader" />
                      <span className="filiale-menu__price">{item.price}</span>
                    </>
                  )}
                </span>
                {item.description && <span className="filiale-menu__description">{item.description}</span>}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
