"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { MexicanMotifs } from "@/components/filiales/MexicanMotifs";
import { ArrowUpRight, Check } from "@/lib/icons";
import { DURATION_S, EASE, defaultScrollViewport } from "@/lib/motion";
import type { Subsidiary } from "@/lib/types";

import "@/styles/gourmet-mexicana-about.css";

const AMBIANCE_PHOTO =
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=80";
const INGREDIENT_PHOTO =
  "https://images.unsplash.com/photo-1601039641847-7857b994d704?w=500&q=80";
const DISH_PHOTO =
  "https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?w=600&q=80";

const HIGHLIGHT_KEYS = ["tacos", "ceviches", "meats", "salsas", "guacamole", "desserts"] as const;

export function GourmetMexicanaAboutSection({ subsidiary }: { subsidiary: Subsidiary }) {
  const reduced = useReducedMotion();
  const t = useTranslations("subsidiaries");

  const staggerMotion = (i: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          viewport: defaultScrollViewport,
          transition: { duration: DURATION_S.luxe, ease: EASE.luxury, delay: i * 0.08 },
        };

  return (
    <section className="mex-about">
      <MexicanMotifs variant="about" />

      <div className="mex-about__inner">
        <motion.div
          className="mex-about__photo-wrap"
          initial={reduced ? false : { opacity: 0, x: -40 }}
          whileInView={reduced ? undefined : { opacity: 1, x: 0 }}
          viewport={defaultScrollViewport}
          transition={{ duration: 0.9, ease: EASE.luxury }}
        >
          <Image
            src={AMBIANCE_PHOTO}
            alt={subsidiary.name}
            fill
            className="mex-about__photo"
            sizes="(max-width: 1023px) 90vw, 30vw"
          />
        </motion.div>

        <div className="mex-about__content">
          <motion.p className="mex-about__eyebrow" {...staggerMotion(0)}>
            {t("gourmetMexicanaAbout.eyebrow")}
          </motion.p>
          <motion.h2 className="mex-about__title" {...staggerMotion(1)}>
            <span>{t("gourmetMexicanaAbout.titleLine1")}</span>
            <span>{t("gourmetMexicanaAbout.titleLine2")}</span>
            <span>{t("gourmetMexicanaAbout.titleLine3")}</span>
          </motion.h2>
          <motion.p className="mex-about__description" {...staggerMotion(2)}>
            {t("gourmetMexicanaAbout.description")}
          </motion.p>

          <motion.ul className="mex-about__list" {...staggerMotion(3)}>
            {HIGHLIGHT_KEYS.map((key) => (
              <li key={key} className="mex-about__list-item">
                <span className="mex-about__checkbox" aria-hidden="true">
                  <Check size={12} weight="bold" />
                </span>
                <span>{t(`gourmetMexicanaAbout.highlights.${key}`)}</span>
              </li>
            ))}
          </motion.ul>

          <motion.div {...staggerMotion(4)}>
            <Link href="/contact" className="mex-about__cta">
              {t("gourmetMexicanaAbout.ctaLabel")}
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </motion.div>
        </div>

        <div className="mex-about__floating">
          <motion.div
            className="mex-about__ingredient"
            initial={reduced ? false : { opacity: 0, y: -20 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={defaultScrollViewport}
            transition={{ duration: 0.9, ease: EASE.luxury, delay: 0.3 }}
          >
            <div className="mex-about__ingredient-float">
              <Image
                src={INGREDIENT_PHOTO}
                alt=""
                fill
                className="mex-about__ingredient-photo"
                sizes="(max-width: 1023px) 40vw, 12rem"
              />
            </div>
          </motion.div>

          <motion.div
            className="mex-about__circle-wrap"
            initial={reduced ? false : { opacity: 0, scale: 0.9 }}
            whileInView={reduced ? undefined : { opacity: 1, scale: 1 }}
            viewport={defaultScrollViewport}
            transition={{ duration: 0.9, ease: EASE.luxury, delay: 0.4 }}
          >
            <svg className="mex-about__ring" viewBox="0 0 300 300" aria-hidden="true">
              <circle cx="150" cy="150" r="144" fill="none" stroke="#006847" strokeWidth="2.5" strokeDasharray="7 5" />
            </svg>
            <div className="mex-about__circle-photo-wrap">
              <Image
                src={DISH_PHOTO}
                alt=""
                fill
                className="mex-about__circle-photo"
                sizes="(max-width: 1023px) 40vw, 12rem"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
