"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";

import { Play, X } from "@/lib/icons";
import { DURATION_S, EASE, defaultScrollViewport } from "@/lib/motion";
import { youtubeEmbedUrl } from "@/lib/youtube";

import "@/styles/home-experience-section.css";

type Props = {
  backgroundImage: string;
  videoId?: string;
};

/**
 * Section "Expérience" — home page uniquement.
 * Design repris de la section Vidéo de Moka & More (photo + overlay + watermark
 * + texte circulaire rotatif + bouton play), adapté aux couleurs Cen21 et à YouTube.
 */
export function HomeExperienceSection({ backgroundImage, videoId }: Props) {
  const reduced = useReducedMotion();
  const tCta = useTranslations("cta");
  const tHero = useTranslations("hero");
  const [isOpen, setIsOpen] = useState(false);

  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  const circularText = tHero("tagline");
  const repeatedText = `${circularText} ★ ${circularText} ★ `;

  return (
    <section className="home-experience">
      <div className="home-experience__media" aria-hidden="true">
        <Image src={backgroundImage} alt="" fill className="home-experience__image" sizes="100vw" />
        <span className="home-experience__overlay" />
      </div>

      <motion.span
        className="home-experience__watermark"
        aria-hidden="true"
        initial={reduced ? false : { opacity: 0 }}
        whileInView={reduced ? undefined : { opacity: 0.1 }}
        viewport={defaultScrollViewport}
        transition={{ duration: DURATION_S.grand, ease: EASE.luxury }}
      >
        {tCta("videoWatermark")}
      </motion.span>

      <div className="home-experience__center">
        <motion.svg
          className="home-experience__ring"
          viewBox="0 0 220 220"
          aria-hidden="true"
          initial={reduced ? false : { opacity: 0, rotate: 0 }}
          whileInView={reduced ? undefined : { opacity: 1 }}
          viewport={defaultScrollViewport}
          animate={reduced ? undefined : { rotate: 360 }}
          transition={
            reduced
              ? undefined
              : {
                  opacity: { duration: DURATION_S.luxe, ease: EASE.luxury },
                  rotate: { duration: 12, ease: "linear", repeat: Infinity },
                }
          }
        >
          <path
            id="home-experience-circle-path"
            d="M 110,110 m -90,0 a 90,90 0 1,1 180,0 a 90,90 0 1,1 -180,0"
            fill="none"
          />
          <text className="home-experience__ring-text">
            <textPath href="#home-experience-circle-path" startOffset="0%">
              {repeatedText}
            </textPath>
          </text>
        </motion.svg>

        {videoId && (
          <motion.button
            type="button"
            className="home-experience__play"
            aria-label={tCta("playVideoAria")}
            onClick={() => setIsOpen(true)}
            initial={reduced ? false : { opacity: 0, scale: 0.9 }}
            whileInView={reduced ? undefined : { opacity: 1, scale: 1 }}
            viewport={defaultScrollViewport}
            whileHover={reduced ? undefined : { scale: 1.08 }}
            transition={{ duration: DURATION_S.base, ease: EASE.spring, delay: 0.2 }}
          >
            <Play size={22} weight="fill" aria-hidden="true" />
          </motion.button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && videoId && (
          <motion.div
            className="home-experience__lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.3, ease: EASE.luxury }}
            onClick={close}
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              className="home-experience__frame"
              initial={reduced ? false : { scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={reduced ? undefined : { scale: 0.92, opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.4, ease: EASE.luxury }}
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                src={youtubeEmbedUrl(videoId)}
                title={tCta("videoTitle")}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
              <button
                type="button"
                className="home-experience__close"
                onClick={close}
                aria-label={tCta("closeVideoAria")}
              >
                <X size={20} aria-hidden="true" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
