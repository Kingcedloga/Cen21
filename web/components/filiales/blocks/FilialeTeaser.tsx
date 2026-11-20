"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRef, type ReactNode } from "react";

import { Pause, Play, Volume2, VolumeX } from "@/lib/icons";
import type { HeroVideo } from "@/lib/types";
import { useTeaserVideo } from "@/lib/use-teaser-video";

import "@/styles/filiale-blocks.css";

/** Reduced motion : valeur fixe explicite (rien de l'état d'avant hydratation). */
const STILL = { y: 0 };

/**
 * Teaser d'une maison en cadre à passe-partout (Wabi Sabi) : la vidéo
 * verticale à droite, le surtitre, le titre et la légende à gauche, avec les
 * boutons lecture / pause et son et une ligne de lecture. Le cadre glisse
 * légèrement à contre-sens au défilement. Lecture : lib/use-teaser-video.ts.
 * Options (ex. la livraison de Wabi Sabi) : `titleId` (deux blocs sur une
 * page), `details` (pastilles sous la légende), `actions` (boutons),
 * `reverse` (vidéo à gauche sur grand écran).
 */
export function FilialeTeaser({
  name,
  video,
  poster,
  eyebrow,
  title,
  caption,
  titleId = "filiale-teaser-title",
  details,
  actions,
  reverse = false,
}: {
  name: string;
  video: HeroVideo;
  poster?: string;
  eyebrow: string;
  title: string;
  caption: string;
  titleId?: string;
  details?: ReactNode;
  actions?: ReactNode;
  reverse?: boolean;
}) {
  const t = useTranslations("filiale");
  const { reduced, near, playing, muted, frameRef, progressRef, videoProps, togglePlay, toggleSound } = useTeaserVideo();
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const posterSrc = poster ?? video.poster;

  return (
    <div ref={sectionRef} className={`filiale-teaser ${reverse ? "filiale-teaser--reverse" : ""}`}>
      <header className="filiale-teaser__head">
        <p className="filiale-teaser__eyebrow">{eyebrow}</p>
        <h2 id={titleId} className="title-section filiale-teaser__title">
          {title}
        </h2>
        <p className="filiale-teaser__caption">{caption}</p>
        {details && <div className="filiale-teaser__details">{details}</div>}
        {actions && <div className="filiale-teaser__actions">{actions}</div>}
        <div className="filiale-teaser__controls">
          <button type="button" className="filiale-round tap-press" aria-label={playing ? t("teaserPause") : t("teaserPlay")} onClick={togglePlay}>
            {playing ? <Pause size={18} aria-hidden="true" /> : <Play size={18} aria-hidden="true" />}
          </button>
          <button
            type="button"
            className="filiale-round tap-press"
            aria-label={muted ? t("teaserSoundOn") : t("teaserSoundOff")}
            aria-pressed={!muted}
            onClick={toggleSound}
          >
            {muted ? <VolumeX size={18} aria-hidden="true" /> : <Volume2 size={18} aria-hidden="true" />}
          </button>
        </div>
      </header>

      <motion.div ref={frameRef} className="filiale-teaser__frame" style={reduced ? STILL : { y }}>
        {posterSrc && <Image src={posterSrc} alt="" fill sizes="(min-width: 1024px) 26rem, 80vw" className="object-cover" />}
        <video {...videoProps} className={`filiale-teaser__video ${playing ? "is-playing" : ""}`} aria-label={t("teaserLabel", { name })}>
          {near && video.webm && <source src={video.webm} type="video/webm" />}
          {near && <source src={video.src} type="video/mp4" />}
        </video>
        <span aria-hidden="true" className="filiale-teaser__progress">
          <span ref={progressRef} />
        </span>
      </motion.div>
    </div>
  );
}
