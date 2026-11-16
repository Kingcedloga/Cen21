"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useId, useRef } from "react";

import { Pause, Play, Volume2, VolumeX } from "@/lib/icons";
import type { HeroVideo } from "@/lib/types";
import { useTeaserVideo } from "@/lib/use-teaser-video";

import "@/styles/moka.css";

/** Reduced motion : valeur fixe explicite. */
const STILL = { rotate: 0 };
/** Rayon du texte circulaire du disque (viewBox 200 × 200). */
const RING = 76;

/**
 * La vidéo de Moka & More, aux motifs de la maison : la vidéo dans une
 * arche doublée d'un filet rouge, et le disque rouge « Regarder la vidéo »
 * — l'ancien badge qui tournait en boucle, devenu le bouton lecture / pause :
 * son texte circulaire tourne avec le défilement. À côté : le titre en
 * capitales rondes et sa suite manuscrite, la légende, le son, et une ligne
 * de lecture rouge sous l'arche. Reduced motion : disque immobile (lecture
 * muette automatique dans tous les cas : lib/use-teaser-video.ts).
 */
export function MokaVideo({ name, video, poster }: { name: string; video: HeroVideo; poster?: string }) {
  const t = useTranslations("moka");
  const tFiliale = useTranslations("filiale");
  const ringId = useId();
  const { reduced, near, playing, muted, frameRef, progressRef, videoProps, togglePlay, toggleSound } = useTeaserVideo();
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const rotate = useTransform(scrollYProgress, [0, 1], [-60, 200]);
  const posterSrc = poster ?? video.poster;
  const circumference = 2 * Math.PI * RING;

  return (
    <div ref={sectionRef} className="moka-video">
      <div className="moka-video__visual">
        <div ref={frameRef} className="moka-video__arch">
          {posterSrc && <Image src={posterSrc} alt="" fill sizes="(min-width: 1024px) 24rem, 80vw" className="object-cover" />}
          <video {...videoProps} className={`moka-video__el ${playing ? "is-playing" : ""}`} aria-label={tFiliale("teaserLabel", { name })}>
            {near && video.webm && <source src={video.webm} type="video/webm" />}
            {near && <source src={video.src} type="video/mp4" />}
          </video>
        </div>
        <span aria-hidden="true" className="moka-video__progress">
          <span ref={progressRef} />
        </span>

        {/* Le disque rouge : bouton lecture / pause. */}
        <button
          type="button"
          className="moka-video__disc"
          aria-label={playing ? tFiliale("teaserPause") : tFiliale("teaserPlay")}
          onClick={togglePlay}
        >
          <motion.svg aria-hidden="true" viewBox="0 0 200 200" className="moka-video__ring" style={reduced ? STILL : { rotate }}>
            <defs>
              <path id={ringId} d={`M 100 100 m -${RING} 0 a ${RING} ${RING} 0 1 1 ${RING * 2} 0 a ${RING} ${RING} 0 1 1 -${RING * 2} 0`} />
            </defs>
            <text className="moka-video__ring-text">
              <textPath href={`#${ringId}`} textLength={Math.floor(circumference) - 6} lengthAdjust="spacing">
                {`${t("videoBadge")} • ${t("videoBadge")} • `}
              </textPath>
            </text>
          </motion.svg>
          <span aria-hidden="true" className="moka-video__icon">
            {playing ? <Pause size={22} weight="fill" /> : <Play size={22} weight="fill" />}
          </span>
        </button>
      </div>

      <div className="moka-video__text">
        <p className="moka-eyebrow">{t("videoEyebrow")}</p>
        <h2 id="filiale-teaser-title" className="moka-title">
          {t("videoTitle")} <span className="moka-title__script moka-script">{t("videoScript")}</span>
        </h2>
        <p className="moka-video__caption">{t("videoCaption")}</p>
        <button
          type="button"
          className="moka-video__sound tap-press"
          aria-label={muted ? tFiliale("teaserSoundOn") : tFiliale("teaserSoundOff")}
          aria-pressed={!muted}
          onClick={toggleSound}
        >
          {muted ? <VolumeX size={18} aria-hidden="true" /> : <Volume2 size={18} aria-hidden="true" />}
          <span aria-hidden="true">{muted ? tFiliale("teaserSoundOn") : tFiliale("teaserSoundOff")}</span>
        </button>
      </div>
    </div>
  );
}
