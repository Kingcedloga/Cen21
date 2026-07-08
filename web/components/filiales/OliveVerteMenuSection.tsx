"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";

import { ChevronLeft, ChevronRight } from "@/lib/icons";
import { defaultScrollViewport, DURATION_S, EASE } from "@/lib/motion";
import { AnimateIn } from "@/components/ui/AnimateIn";
import type { SubsidiaryMenuCategoriesSection } from "@/lib/types";

import "@/styles/olive-verte-menu-section.css";

type Props = {
  content: SubsidiaryMenuCategoriesSection;
};

export function OliveVerteMenuSection({ content }: Props) {
  const t = useTranslations("subsidiaries");
  const [activeCategoryId, setActiveCategoryId] = useState(content.categories[0]?.id);
  const [activeDish, setActiveDish] = useState(0);

  const activeCategory =
    content.categories.find((c) => c.id === activeCategoryId) ?? content.categories[0];
  const dish = activeCategory?.dishes[activeDish];

  const selectCategory = useCallback((id: string) => {
    setActiveCategoryId(id);
    setActiveDish(0);
  }, []);

  const goDish = useCallback(
    (delta: number) => {
      if (!activeCategory) return;
      setActiveDish((i) => (i + delta + activeCategory.dishes.length) % activeCategory.dishes.length);
    },
    [activeCategory],
  );

  if (!activeCategory || !dish) return null;

  return (
    <section className="olive-menu">
      {/* Blob courbe gauche — identique à Nos Spécialités */}
      <div className="olive-menu__blob-left" aria-hidden="true" />

      <div className="olive-menu__container">
        <AnimateIn className="olive-menu__header">
          <h2 className="olive-menu__title">{content.title}</h2>
          <p className="olive-menu__description">{content.description}</p>
        </AnimateIn>

        <div className="olive-menu__grid">
          {/* Colonne gauche : catégories */}
          <nav className="olive-menu__categories" aria-label={content.title}>
            {content.categories.map((category, i) => {
              const isActive = category.id === activeCategory.id;
              return (
                <motion.button
                  key={category.id}
                  type="button"
                  className={`olive-menu__category${isActive ? " olive-menu__category--active" : ""}`}
                  onClick={() => selectCategory(category.id)}
                  aria-pressed={isActive}
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ ...defaultScrollViewport, once: true }}
                  transition={{ duration: DURATION_S.luxe, ease: EASE.luxury, delay: i * 0.06 }}
                >
                  <span>{category.label}</span>
                  <ChevronRight size={16} aria-hidden="true" />
                </motion.button>
              );
            })}
          </nav>

          {/* Colonne droite : plat actif */}
          <div className="olive-menu__content">
            <div className="olive-menu__content-head">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeCategory.id}-${activeDish}-text`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="olive-menu__dish-heading"
                >
                  <h3 className="olive-menu__dish-name">{dish.name}</h3>
                  <p className="olive-menu__dish-description">{dish.description}</p>
                </motion.div>
              </AnimatePresence>

              {activeCategory.dishes.length > 1 && (
                <div className="olive-menu__nav">
                  <button
                    type="button"
                    className="olive-menu__nav-btn"
                    aria-label={t("oliveVerteMenu.previousDish")}
                    onClick={() => goDish(-1)}
                  >
                    <ChevronLeft size={18} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className="olive-menu__nav-btn"
                    aria-label={t("oliveVerteMenu.nextDish")}
                    onClick={() => goDish(1)}
                  >
                    <ChevronRight size={18} aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeCategory.id}-${activeDish}-photo`}
                className="olive-menu__photo-wrap"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Image
                  src={dish.image}
                  alt={dish.imageAlt}
                  fill
                  className="olive-menu__photo"
                  sizes="(max-width: 767px) 100vw, 60vw"
                />
                <motion.span
                  className="olive-menu__price"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: DURATION_S.base, ease: EASE.spring, delay: 0.1 }}
                >
                  {dish.price}
                </motion.span>
              </motion.div>
            </AnimatePresence>

            <button type="button" className="olive-menu__cta">
              {t("oliveVerteMenu.orderNow")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
