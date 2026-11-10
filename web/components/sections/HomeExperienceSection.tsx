"use client";

import Image from "next/image";
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";

import { Play, X } from "@/lib/icons";
import { DURATION_S, EASE, defaultScrollViewport, keyframes } from "@/lib/motion";
import { FINE_POINTER_QUERY, useMediaQuery } from "@/lib/use-media-query";
import { youtubeEmbedUrl } from "@/lib/youtube";

import "@/styles/home-experience-section.css";
import { useReducedMotionSafe } from "@/lib/use-media-query";

type Props = {
  backgroundImage: string;
  videoId?: string;
};

/** Showreel (Orbix « showreel-on-scroll ») : l'image passe de 80 % × 90 % à
 *  plein cadre entre l'entrée de la section et son milieu (0 → 50 %). */
const REEL_GROW = [0, 0.5] as const;
/** L'étiquette qui suit le curseur : desktop à la souris seulement. */
const DESKTOP_QUERY = "(min-width: 768px)";

/**
 * Section "Expérience" — home page uniquement.
 * Design repris de la section Vidéo de Moka & More (photo + overlay + watermark
 * + texte circulaire + bouton play), adapté aux couleurs Cen21 et à YouTube.
 * Phase 4 (rapport « Orbix × Cen21 ») : l'image s'agrandit au scroll, l'anneau
 * tourne avec le défilement (plus de rotation infinie) et, à la souris, une
 * étiquette « Voir le film » suit le curseur ; un clic ouvre la vidéo.
 * Phase 4 bis : le zoom joue aussi sur mobile ; au doigt, le bouton play reste
 * la seule commande.
 */
export function HomeExperienceSection({ backgroundImage, videoId }: Props) {
  const reduced = useReducedMotionSafe();
  const tCta = useTranslations("cta");
  const tHero = useTranslations("hero");
  const tHome = useTranslations("home");
  const [isOpen, setIsOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const desktop = useMediaQuery(DESKTOP_QUERY);
  const finePointer = useMediaQuery(FINE_POINTER_QUERY);
  const animated = !reduced;
  const followLabel = animated && desktop && finePointer && Boolean(videoId);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const mediaScaleX = useTransform(scrollYProgress, (v) => keyframes(v, REEL_GROW, [0.8, 1]));
  const mediaScaleY = useTransform(scrollYProgress, (v) => keyframes(v, REEL_GROW, [0.9, 1]));
  const mediaRadius = useTransform(scrollYProgress, (v) => `${keyframes(v, REEL_GROW, [2.5, 0])}rem`);
  // L'anneau tourne avec le défilement : un tour sur la traversée de la section.
  const ringRotate = useTransform(scrollYProgress, (v) => v * 360);

  // Étiquette qui suit le curseur (Orbix : « Showreel Button »).
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const labelX = useSpring(pointerX, { stiffness: 320, damping: 32, mass: 0.6 });
  const labelY = useSpring(pointerY, { stiffness: 320, damping: 32, mass: 0.6 });
  const [labelVisible, setLabelVisible] = useState(false);

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (!followLabel || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    if (!labelVisible) {
      // Première entrée : l'étiquette apparaît sous le curseur, sans glisser depuis l'angle.
      labelX.jump(x);
      labelY.jump(y);
      setLabelVisible(true);
    }
    pointerX.set(x);
    pointerY.set(y);
  };

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
    <section
      ref={sectionRef}
      className={`home-experience ${followLabel ? "home-experience--reel" : ""}`}
      onPointerMove={followLabel ? onPointerMove : undefined}
      onPointerLeave={followLabel ? () => setLabelVisible(false) : undefined}
      // Souris seulement : au clavier et au doigt, le bouton play reste la commande.
      // (Le clic qui ferme la vidéo remonte jusqu'ici : ignoré tant qu'elle est ouverte.)
      onClick={followLabel ? () => !isOpen && setIsOpen(true) : undefined}
    >
      <motion.div
        className="home-experience__media"
        aria-hidden="true"
        style={animated ? { scaleX: mediaScaleX, scaleY: mediaScaleY, borderRadius: mediaRadius } : undefined}
      >
        <Image src={backgroundImage} alt="" fill className="home-experience__image" sizes="100vw" />
        <span className="home-experience__overlay" />
      </motion.div>

      {followLabel && (
        <motion.span
          aria-hidden="true"
          className="home-experience__label"
          style={{ x: labelX, y: labelY }}
          initial={false}
          animate={{ opacity: labelVisible && !isOpen ? 1 : 0, scale: labelVisible && !isOpen ? 1 : 0.6 }}
          transition={{ duration: 0.25, ease: EASE.outSoft }}
        >
          <Play size={14} weight="fill" aria-hidden="true" />
          {tHome("reelLabel")}
        </motion.span>
      )}

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
          style={reduced ? undefined : { rotate: ringRotate }}
          initial={reduced ? false : { opacity: 0 }}
          whileInView={reduced ? undefined : { opacity: 1 }}
          viewport={defaultScrollViewport}
          transition={reduced ? undefined : { duration: DURATION_S.luxe, ease: EASE.luxury }}
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
            onClick={(event) => {
              event.stopPropagation();
              setIsOpen(true);
            }}
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
