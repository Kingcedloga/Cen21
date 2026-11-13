"use client";

import { motion, type MotionValue } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { Pause, Play } from "@/lib/icons";
import { BLUR_PETROL } from "@/lib/image-blur";
import type { HeroVideo } from "@/lib/types";
import { REDUCED_MOTION_QUERY, useReducedMotionSafe } from "@/lib/use-media-query";

/** Lecture automatique : ni reduced motion, ni économiseur de données. */
function autoplayAllowed() {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return !window.matchMedia(REDUCED_MOTION_QUERY).matches && !connection?.saveData;
}

/**
 * Vidéo plein cadre du hero (InnerHero, prop `video`) : la photo d'affiche
 * s'affiche d'emblée (image LCP), la vidéo muette la remplace en fondu dès
 * sa première image. Lecture en boucle seulement quand le hero est à l'écran.
 *
 * Bouton pause / lecture (WCAG 2.2.2). Reduced motion ou économiseur de
 * données : pas de lecture automatique, la photo reste ; le bouton lance la
 * vidéo à la demande.
 */
export function InnerHeroVideo({
  video,
  poster,
  clipPath,
  scale,
}: {
  video: HeroVideo;
  poster?: string;
  clipPath: MotionValue<string> | string;
  scale: MotionValue<number> | number;
}) {
  const t = useTranslations("common");
  const reduced = useReducedMotionSafe();
  const videoRef = useRef<HTMLVideoElement>(null);
  // null : lecture automatique ; true / false : choix du visiteur.
  const [paused, setPaused] = useState<boolean | null>(null);
  const [playing, setPlaying] = useState(false);
  const [shown, setShown] = useState(false);
  const posterSrc = poster ?? video.poster;

  useEffect(() => {
    const element = videoRef.current;
    if (!element) return;
    const wanted = paused === null ? autoplayAllowed() : !paused;
    if (!wanted) {
      element.pause();
      return;
    }
    element.muted = true;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) element.play().catch(() => {});
      else element.pause();
    });
    observer.observe(element);
    return () => observer.disconnect();
    // `reduced` : relancer la décision si la préférence change.
  }, [paused, reduced]);

  return (
    <>
      <motion.div aria-hidden="true" className="inner-hero__video" style={{ clipPath }}>
        <motion.div className="inner-hero__video-media" style={{ scale }}>
          {posterSrc && (
            <Image
              src={posterSrc}
              alt=""
              fill
              loading="eager"
              fetchPriority="high"
              placeholder="blur"
              blurDataURL={BLUR_PETROL}
              sizes="100vw"
              className="object-cover object-center"
            />
          )}
          <video
            ref={videoRef}
            className={`inner-hero__video-el ${shown ? "is-shown" : ""}`}
            muted
            loop
            playsInline
            preload="none"
            tabIndex={-1}
            onPlaying={() => {
              setPlaying(true);
              setShown(true);
            }}
            onPause={() => setPlaying(false)}
          >
            {video.webm && <source src={video.webm} type="video/webm" />}
            <source src={video.src} type="video/mp4" />
          </video>
        </motion.div>
      </motion.div>

      <button
        type="button"
        onClick={() => setPaused(playing)}
        aria-label={playing ? t("videoPause") : t("videoPlay")}
        className="inner-hero__video-toggle tap-press"
      >
        {playing ? <Pause size={16} weight="fill" aria-hidden="true" /> : <Play size={16} weight="fill" aria-hidden="true" />}
      </button>
    </>
  );
}
