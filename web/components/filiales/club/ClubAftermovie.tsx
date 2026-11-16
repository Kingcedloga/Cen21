"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRef } from "react";

import { FilialeMark } from "@/components/filiales/blocks/FilialeMark";
import { ExternalLink, Play, Volume2, VolumeX } from "@/lib/icons";
import type { HeroVideo } from "@/lib/types";
import { useTeaserVideo } from "@/lib/use-teaser-video";

import "@/styles/club.css";

/** Segments de la story (la vidéo est découpée en trois au fil de la lecture). */
const SEGMENTS = 3;

/**
 * L'aftermovie du club, présenté comme une story : la vidéo dans un
 * téléphone incliné, les segments de progression en haut, le compte du club
 * (logo en pastille, @pseudo Instagram). Appuyer sur la story la met en
 * pause, comme sur un téléphone ; bouton du son en bas. À côté : le titre en
 * capitales du club, l'indicateur « Rec » allumé pendant la lecture, la
 * légende et le lien vers le compte. Lecture muette automatique à l'écran
 * (lib/use-teaser-video.ts).
 */
export function ClubAftermovie({
  name,
  video,
  poster,
  logo,
  logoRatio,
  instagram,
}: {
  name: string;
  video: HeroVideo;
  poster?: string;
  logo?: string;
  logoRatio: number;
  instagram?: string;
}) {
  const t = useTranslations("club");
  const tFiliale = useTranslations("filiale");
  const tContact = useTranslations("contact");
  const bars = useRef<(HTMLSpanElement | null)[]>([]);
  const { near, playing, muted, frameRef, videoProps, togglePlay, toggleSound } = useTeaserVideo({
    onProgress: (ratio) => {
      bars.current.forEach((bar, index) => {
        if (bar) bar.style.transform = `scaleX(${Math.min(1, Math.max(0, ratio * SEGMENTS - index))})`;
      });
    },
  });
  const handle = instagram?.match(/instagram\.com\/([^/?#]+)/)?.[1];
  const posterSrc = poster ?? video.poster;

  return (
    <div className="club-aftermovie">
      <div>
        <p className="club-eyebrow">{t("aftermovieEyebrow")}</p>
        <h2 id="filiale-teaser-title" className="club-aftermovie__title">
          {t("aftermovieTitle")}
        </h2>
        <p className="club-aftermovie__rec" data-on={playing ? "" : undefined}>
          {t("aftermovieRec")}
        </p>
        <p className="club-aftermovie__caption">{t("aftermovieCaption")}</p>
        {instagram && (
          <a href={instagram} target="_blank" rel="noopener noreferrer" className="club-aftermovie__follow">
            {t("aftermovieFollow")}
            <ExternalLink size={16} aria-hidden="true" />
            <span className="sr-only"> ({tContact("newTab")})</span>
          </a>
        )}
      </div>

      <div>
        <div ref={frameRef} className="club-story">
          {posterSrc && <Image src={posterSrc} alt="" fill sizes="(min-width: 1024px) 22rem, 80vw" className="object-cover" />}
          <video {...videoProps} className={`club-story__video ${playing ? "is-playing" : ""}`} aria-label={tFiliale("teaserLabel", { name })}>
            {near && video.webm && <source src={video.webm} type="video/webm" />}
            {near && <source src={video.src} type="video/mp4" />}
          </video>

          <div aria-hidden="true" className="club-story__top">
            <div className="club-story__bars">
              {Array.from({ length: SEGMENTS }, (_, index) => (
                <span key={index} className="club-story__bar">
                  <span
                    ref={(element) => {
                      bars.current[index] = element;
                    }}
                  />
                </span>
              ))}
            </div>
            <div className="club-story__account">
              {logo && (
                <span className="club-story__avatar">
                  <FilialeMark src={logo} ratio={logoRatio} width="100%" />
                </span>
              )}
              {handle ?? name}
            </div>
          </div>

          <button
            type="button"
            className="club-story__tap"
            aria-label={playing ? tFiliale("teaserPause") : tFiliale("teaserPlay")}
            onClick={togglePlay}
          >
            {!playing && (
              <span aria-hidden="true" className="club-story__paused">
                <Play size={22} weight="fill" />
              </span>
            )}
          </button>
          <button
            type="button"
            className="club-story__sound tap-press"
            aria-label={muted ? tFiliale("teaserSoundOn") : tFiliale("teaserSoundOff")}
            aria-pressed={!muted}
            onClick={toggleSound}
          >
            {muted ? <VolumeX size={18} aria-hidden="true" /> : <Volume2 size={18} aria-hidden="true" />}
          </button>
        </div>
        <p aria-hidden="true" className="club-aftermovie__hint">
          {t("aftermovieTap")}
        </p>
      </div>
    </div>
  );
}
