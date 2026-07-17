"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";

import { Check } from "@/lib/icons";
import { DURATION_S, EASE, defaultScrollViewport } from "@/lib/motion";
import type { Subsidiary } from "@/lib/types";

import "@/styles/moka-more-about-section.css";

const MAIN_PHOTO = "/filiales/photos/filiale-06/about-mokomore1.png";
const SECONDARY_PHOTO = "/filiales/photos/filiale-06/aboutpicture.png";

const FEATURE_KEYS = [1, 2, 3, 4] as const;

export function MokaMoreAboutSection({ subsidiary }: { subsidiary: Subsidiary }) {
  const reduced = useReducedMotion();
  const t = useTranslations("subsidiaries");

  return (
    <section className="moka-about">
      <motion.span
        className="moka-about__watermark"
        aria-hidden="true"
        initial={reduced ? false : { opacity: 0 }}
        whileInView={reduced ? undefined : { opacity: 0.08 }}
        viewport={defaultScrollViewport}
        transition={{ duration: DURATION_S.grand, ease: EASE.luxury, delay: 0.1 }}
      >
        {t("mokaMoreAbout.watermark")}
      </motion.span>

      <div className="moka-about__grid">
        <div className="moka-about__collage">
          <motion.div
            className="moka-about__main-photo-wrap"
            initial={reduced ? false : { opacity: 0, x: -40 }}
            whileInView={reduced ? undefined : { opacity: 1, x: 0 }}
            viewport={defaultScrollViewport}
            transition={{ duration: DURATION_S.grand, ease: EASE.luxury }}
          >
            <Image
              src={MAIN_PHOTO}
              alt={subsidiary.name}
              fill
              className="moka-about__main-photo"
              sizes="(max-width: 899px) 90vw, 30vw"
            />
          </motion.div>

          <motion.div
            className="moka-about__secondary-photo-wrap"
            initial={reduced ? false : { opacity: 0, y: 20 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={defaultScrollViewport}
            transition={{ duration: DURATION_S.luxe, ease: EASE.luxury, delay: 0.15 }}
          >
            <Image
              src={SECONDARY_PHOTO}
              alt=""
              fill
              className="moka-about__secondary-photo"
              sizes="(max-width: 899px) 40vw, 12rem"
            />
          </motion.div>
        </div>

        <motion.div
          className="moka-about__center"
          initial={reduced ? false : { opacity: 0, y: 24 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={defaultScrollViewport}
          transition={{ duration: DURATION_S.luxe, ease: EASE.luxury, delay: 0.2 }}
        >
          <h2 className="moka-about__title">
            {t("mokaMoreAbout.titlePrefix")}{" "}
            <span className="moka-about__title-script">{t("mokaMoreAbout.titleScript")}</span>
          </h2>
          <p className="moka-about__description">{t("mokaMoreAbout.description")}</p>
        </motion.div>

        <div className="moka-about__features">
          <h3 className="moka-about__features-title">
            <span>{t("mokaMoreAbout.featuresTitleLine1")}</span>
            <span>{t("mokaMoreAbout.featuresTitleLine2")}</span>
          </h3>
          <p className="moka-about__features-description">
            {t("mokaMoreAbout.featuresDescription")}
          </p>

          <ul className="moka-about__list">
            {FEATURE_KEYS.map((n, i) => (
              <motion.li
                key={n}
                className="moka-about__list-item"
                initial={reduced ? false : { opacity: 0, y: 20 }}
                whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                viewport={defaultScrollViewport}
                transition={{ duration: DURATION_S.luxe, ease: EASE.luxury, delay: i * 0.08 }}
              >
                <span className="moka-about__checkbox" aria-hidden="true">
                  <Check size={12} weight="bold" />
                </span>
                <span className="moka-about__list-text">
                  <strong>{t(`mokaMoreAbout.feature${n}Label`)}</strong>{" "}
                  <em>{t(`mokaMoreAbout.feature${n}Detail`)}</em>
                </span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
