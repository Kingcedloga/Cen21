"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRef } from "react";

import { Pause, Play, Volume2, VolumeX } from "@/lib/icons";
import type { HeroVideo } from "@/lib/types";
import { useTeaserVideo } from "@/lib/use-teaser-video";

import "@/styles/klounge.css";

/** Reduced motion : valeurs fixes explicites (rien de l'état d'avant hydratation). */
const STILL_FRAME = { filter: "none" };
const STILL_WORD = { x: "0%" };

/** « 7.4 » → « 00:07 ». */
const clock = (seconds: number) => {
  const s = Math.max(0, Math.floor(seconds));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
};

/**
 * Le teaser de K Lounge, « after dark » : la vidéo verticale au centre, dans
 * un filet blanc, posée sur deux mots géants en contour qui glissent en sens
 * contraire au défilement ; elle arrive en noir et blanc et s'allume en
 * couleur en atteignant le milieu de l'écran (comme le triptyque de la
 * maison). Compteur de temps façon caméra, boutons lecture / pause et son.
 * Reduced motion : couleur d'emblée, mots fixes, pas de lecture automatique.
 */
export function KLoungeTeaser({ name, video, poster }: { name: string; video: HeroVideo; poster?: string }) {
  const t = useTranslations("klounge");
  const tFiliale = useTranslations("filiale");
  const timeRef = useRef<HTMLSpanElement>(null);
  const { reduced, near, playing, muted, frameRef, videoRef, videoProps, togglePlay, toggleSound } = useTeaserVideo({
    onProgress: () => {
      const element = videoRef.current;
      if (element && timeRef.current) timeRef.current.textContent = `${clock(element.currentTime)} / ${clock(element.duration)}`;
    },
  });
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  // Noir et blanc à l'entrée, couleur pleine au milieu de l'écran.
  const filter = useTransform(scrollYProgress, (v) => {
    const k = Math.min(1, Math.max(0, (v - 0.18) / 0.27));
    return `grayscale(${(1 - k).toFixed(3)}) brightness(${(0.7 + 0.3 * k).toFixed(3)})`;
  });
  const left = useTransform(scrollYProgress, [0, 1], ["12%", "-12%"]);
  const right = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  const [first, ...rest] = t("teaserWords").split(" ");
  const posterSrc = poster ?? video.poster;

  return (
    <div ref={sectionRef} className="kl-teaser">
      <header className="kl-teaser__head">
        <p className="kl-teaser__eyebrow">{t("teaserEyebrow")}</p>
        <h2 id="filiale-teaser-title" className="title-section kl-teaser__title">
          {t("teaserTitle")}
        </h2>
      </header>

      <div className="kl-teaser__stage">
        <div aria-hidden="true" className="kl-teaser__words">
          <motion.span style={reduced ? STILL_WORD : { x: left }}>{first}</motion.span>
          <motion.span style={reduced ? STILL_WORD : { x: right }}>{rest.join(" ")}</motion.span>
        </div>

        <motion.div ref={frameRef} className="kl-teaser__frame" style={reduced ? STILL_FRAME : { filter }}>
          {posterSrc && <Image src={posterSrc} alt="" fill sizes="(min-width: 1024px) 22rem, 70vw" className="object-cover" />}
          <video {...videoProps} className={`kl-teaser__video ${playing ? "is-playing" : ""}`} aria-label={tFiliale("teaserLabel", { name })}>
            {near && video.webm && <source src={video.webm} type="video/webm" />}
            {near && <source src={video.src} type="video/mp4" />}
          </video>
        </motion.div>
      </div>

      <div className="kl-teaser__foot">
        <p className="kl-teaser__caption">{t("teaserCaption")}</p>
        <div className="kl-teaser__controls">
          <span ref={timeRef} aria-hidden="true" className="kl-teaser__time">
            00:00
          </span>
          <button type="button" className="kl-teaser__button tap-press" aria-label={playing ? tFiliale("teaserPause") : tFiliale("teaserPlay")} onClick={togglePlay}>
            {playing ? <Pause size={18} aria-hidden="true" /> : <Play size={18} aria-hidden="true" />}
          </button>
          <button
            type="button"
            className="kl-teaser__button tap-press"
            aria-label={muted ? tFiliale("teaserSoundOn") : tFiliale("teaserSoundOff")}
            aria-pressed={!muted}
            onClick={toggleSound}
          >
            {muted ? <VolumeX size={18} aria-hidden="true" /> : <Volume2 size={18} aria-hidden="true" />}
          </button>
        </div>
      </div>
    </div>
  );
}
