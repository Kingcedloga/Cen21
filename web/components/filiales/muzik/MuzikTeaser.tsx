"use client";

import { useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { reveal } from "@/components/motion/Reveal";
import { DURATION_S, EASE } from "@/lib/motion";
import { Pause, Play, Volume2, VolumeX } from "@/lib/icons";
import type { HeroVideo } from "@/lib/types";
import { REDUCED_MOTION_QUERY, useReducedMotionSafe } from "@/lib/use-media-query";

import "@/styles/muzik.css";

/** Lecture automatique : ni reduced motion, ni économiseur de données. */
function autoplayAllowed() {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return !window.matchMedia(REDUCED_MOTION_QUERY).matches && !connection?.saveData;
}

/**
 * L'ambiance du patio en vidéo : le teaser de la maison, vertical, présenté
 * comme un clip (autocollant « Teaser », ligne de lecture rouge). La vidéo
 * ne se charge qu'à l'approche de la section, se lit muette en boucle tant
 * qu'elle est à l'écran ; boutons lecture / pause (WCAG 2.2.2) et son.
 * Reduced motion ou économiseur de données : pas de lecture automatique,
 * première image affichée, le bouton lance la vidéo.
 */
export function MuzikTeaser({ video }: { video: HeroVideo }) {
  const t = useTranslations("muzik");
  const reduced = useReducedMotionSafe();
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  // La vidéo (5 Mo) n'est demandée qu'à l'approche de la section.
  const near = useInView(frameRef, { once: true, margin: "400px 0px" });
  // null : lecture automatique ; true / false : choix du visiteur.
  const [paused, setPaused] = useState<boolean | null>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const element = videoRef.current;
    if (!element || !near) return;
    const wanted = paused === null ? autoplayAllowed() : !paused;
    if (!wanted) {
      element.pause();
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) element.play().catch(() => {});
        else element.pause();
      },
      { threshold: 0.35 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [near, paused, reduced]);

  // Ligne de lecture : mise à jour directe du style (pas de rendu à chaque image).
  const onTime = () => {
    const element = videoRef.current;
    const bar = progressRef.current;
    if (element && bar && element.duration) bar.style.transform = `scaleX(${element.currentTime / element.duration})`;
  };

  const toggleSound = () => {
    const element = videoRef.current;
    if (!element) return;
    element.muted = !muted;
    setMuted(!muted);
    // Activer le son relance la vidéo si elle était arrêtée.
    if (muted && element.paused) setPaused(false);
  };

  return (
    <section aria-labelledby="muzik-covers-title" data-surface="dark" className="muzik-teaser">
      <div className="muzik-teaser__inner">
        <header className="muzik-teaser__head">
          <p className="muzik-eyebrow">{t("coversEyebrow")}</p>
          <h2 id="muzik-covers-title" className="muzik-title">
            {t("coversTitle")}
          </h2>
          <p className="muzik-teaser__caption">{t("teaserCaption")}</p>
          <div className="muzik-teaser__controls">
            <button
              type="button"
              className="muzik-round tap-press"
              aria-label={playing ? t("teaserPause") : t("teaserPlay")}
              onClick={() => setPaused(playing)}
            >
              {playing ? <Pause size={18} aria-hidden="true" /> : <Play size={18} aria-hidden="true" />}
            </button>
            <button
              type="button"
              className="muzik-round tap-press"
              aria-label={muted ? t("teaserSoundOn") : t("teaserSoundOff")}
              aria-pressed={!muted}
              onClick={toggleSound}
            >
              {muted ? <VolumeX size={18} aria-hidden="true" /> : <Volume2 size={18} aria-hidden="true" />}
            </button>
          </div>
        </header>

        {/* Le clip arrive en pivotant et se pose légèrement incliné. */}
        <reveal.div
          ref={frameRef}
          className="muzik-teaser__frame"
          initial={reduced ? false : { opacity: 0, y: 80, rotate: 6 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0, rotate: -2.5 }}
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          transition={{ duration: DURATION_S.grand, ease: EASE.luxury }}
          style={reduced ? { rotate: -2.5 } : undefined}
        >
          <video
            ref={videoRef}
            className="muzik-teaser__video"
            aria-label={t("teaserLabel")}
            muted
            loop
            playsInline
            preload={near ? "metadata" : "none"}
            onPlaying={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onTimeUpdate={onTime}
          >
            {/* `#t=0.1` : la première image s'affiche avant toute lecture. */}
            {near && <source src={`${video.src}#t=0.1`} type="video/mp4" />}
            {near && video.webm && <source src={video.webm} type="video/webm" />}
          </video>
          <span aria-hidden="true" className="muzik-teaser__sticker">
            {t("teaserSticker")}
          </span>
          <span aria-hidden="true" className="muzik-teaser__progress">
            <span ref={progressRef} />
          </span>
        </reveal.div>
      </div>
    </section>
  );
}
