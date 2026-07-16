"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";

import { Play, X } from "@/lib/icons";
import { DURATION_S, EASE, defaultScrollViewport } from "@/lib/motion";

import "@/styles/moka-more-video-section.css";

const VIDEO_EMBED_URL = "https://www.instagram.com/reel/DUIuuJwjZmW/embed";

type Props = {
  backgroundImage: string;
};

export function MokaMoreVideoSection({ backgroundImage }: Props) {
  const reduced = useReducedMotion();
  const t = useTranslations("subsidiaries");
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

  const circularText = t("mokaMoreVideo.circularText");
  const repeatedText = `${circularText} ★ ${circularText} ★ `;

  return (
    <section className="moka-video">
      <div className="moka-video__media" aria-hidden="true">
        <Image src={backgroundImage} alt="" fill className="moka-video__image" sizes="100vw" />
        <span className="moka-video__overlay" />
      </div>

      <motion.span
        className="moka-video__watermark"
        aria-hidden="true"
        initial={reduced ? false : { opacity: 0 }}
        whileInView={reduced ? undefined : { opacity: 0.1 }}
        viewport={defaultScrollViewport}
        transition={{ duration: DURATION_S.grand, ease: EASE.luxury }}
      >
        {t("mokaMoreVideo.watermark")}
      </motion.span>

      <div className="moka-video__center">
        <motion.svg
          className="moka-video__ring"
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
            id="moka-video-circle-path"
            d="M 110,110 m -90,0 a 90,90 0 1,1 180,0 a 90,90 0 1,1 -180,0"
            fill="none"
          />
          <text className="moka-video__ring-text">
            <textPath href="#moka-video-circle-path" startOffset="0%">
              {repeatedText}
            </textPath>
          </text>
        </motion.svg>

        <motion.button
          type="button"
          className="moka-video__play"
          aria-label={t("mokaMoreVideo.playAria")}
          onClick={() => setIsOpen(true)}
          initial={reduced ? false : { opacity: 0, scale: 0.9 }}
          whileInView={reduced ? undefined : { opacity: 1, scale: 1 }}
          viewport={defaultScrollViewport}
          whileHover={reduced ? undefined : { scale: 1.08 }}
          transition={{ duration: DURATION_S.base, ease: EASE.spring, delay: 0.2 }}
        >
          <Play size={22} weight="fill" aria-hidden="true" />
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="moka-video__lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.3, ease: EASE.luxury }}
            onClick={close}
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              className="moka-video__frame"
              initial={reduced ? false : { scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={reduced ? undefined : { scale: 0.92, opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.4, ease: EASE.luxury }}
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                src={VIDEO_EMBED_URL}
                title="Moka & More"
                className="moka-video__iframe"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
              <button
                type="button"
                className="moka-video__close"
                onClick={close}
                aria-label={t("mokaMoreVideo.closeAria")}
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
