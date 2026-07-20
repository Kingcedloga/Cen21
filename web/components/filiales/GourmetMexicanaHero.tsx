"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useCallback, useRef, useState } from "react";

import { Link } from "@/i18n/navigation";
import { MexicanMotifs } from "@/components/filiales/MexicanMotifs";
import { ArrowUpRight } from "@/lib/icons";
import { galleryEntrySrc } from "@/lib/gallery-categories";
import { EASE } from "@/lib/motion";
import type { Subsidiary } from "@/lib/types";

import "@/styles/gourmet-mexicana-hero.css";

const EXTRA_DISH_PHOTO =
  "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800&q=80";

export function GourmetMexicanaHero({ subsidiary }: { subsidiary: Subsidiary }) {
  const reduced = useReducedMotion() ?? false;
  const t = useTranslations("subsidiaries");
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(2);

  const thumbnails = [
    subsidiary.coverImage,
    subsidiary.galleryImages[0] ? galleryEntrySrc(subsidiary.galleryImages[0]) : subsidiary.coverImage,
    EXTRA_DISH_PHOTO,
  ];

  const scrollToNext = useCallback(() => {
    sectionRef.current?.nextElementSibling?.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      block: "start",
    });
  }, [reduced]);

  const staggerMotion = (i: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.9, ease: EASE.luxury, delay: i * 0.08 },
        };

  return (
    <section
      ref={sectionRef}
      className="mex-hero"
      aria-label={subsidiary.name}
    >
      <MexicanMotifs variant="hero" />

      <div className="mex-hero__content">
        <div className="mex-hero__text">
          <motion.h1 className="mex-hero__title" {...staggerMotion(0)}>
            <span>{t("gourmetMexicanaHero.titleLine1")}</span>
            <span>{t("gourmetMexicanaHero.titleLine2")}</span>
          </motion.h1>

          <motion.p className="mex-hero__description" {...staggerMotion(1)}>
            {t("gourmetMexicanaHero.description")}
          </motion.p>

          <motion.div className="mex-hero__ctas" {...staggerMotion(2)}>
            <button type="button" className="mex-hero__cta mex-hero__cta--primary" onClick={scrollToNext}>
              {t("gourmetMexicanaHero.ctaPrimaryLabel")}
              <ArrowUpRight size={16} aria-hidden="true" />
            </button>
            <Link href="/contact" className="mex-hero__cta mex-hero__cta--secondary">
              {t("gourmetMexicanaHero.ctaSecondaryLabel")}
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </motion.div>

          <div className="mex-hero__thumbnails">
            {thumbnails.map((src, i) => (
              <motion.button
                key={i}
                type="button"
                className={`mex-hero__thumb${i === activeIndex ? " mex-hero__thumb--active" : ""}`}
                onClick={() => setActiveIndex(i)}
                aria-label={t("gourmetMexicanaHero.thumbnailAlt", { index: i + 1 })}
                aria-pressed={i === activeIndex}
                initial={reduced ? false : { opacity: 0, y: 16 }}
                whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: EASE.luxury, delay: i * 0.1 }}
              >
                <Image src={src} alt="" fill sizes="4rem" className="mex-hero__thumb-photo" />
              </motion.button>
            ))}
          </div>
        </div>

        <div className="mex-hero__visual">
          <div className="mex-hero__circle-wrap">
            <span className="mex-hero__circle-ring" aria-hidden="true" />
            <motion.div
              className="mex-hero__circle-photo-wrap"
              initial={reduced ? false : { opacity: 0, scale: 0.9 }}
              animate={reduced ? undefined : { opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: EASE.luxury, delay: 0.2 }}
            >
              <Image
                src={thumbnails[activeIndex]}
                alt={subsidiary.name}
                fill
                priority
                className="mex-hero__circle-photo"
                sizes="(max-width: 899px) 80vw, 40vw"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
