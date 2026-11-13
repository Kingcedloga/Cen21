"use client";

import { motion, useTransform } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { FilialeOpenStatus } from "@/components/filiales/blocks/FilialeOpenStatus";
import { StickyTrack, useStickyTrack } from "@/components/motion/StickyTrack";
import { Button } from "@/components/ui/Button";
import { keyframes } from "@/lib/motion";
import { Pause, Play } from "@/lib/icons";
import type { HeroVideo } from "@/lib/types";
import { REDUCED_MOTION_QUERY, useReducedMotionSafe } from "@/lib/use-media-query";

import "@/styles/club.css";

type HeroProps = {
  name: string;
  tagline: string;
  hours?: string;
  locale: string;
  poster: string;
  video?: HeroVideo;
  /** Prochaine soirée à thème (« Neon Saturday · sam. 14 nov. »). */
  next?: string;
};

/**
 * Les portes du club : le nom en lettres géantes sur fond noir, la vidéo de
 * la salle ne se voit qu'à travers les lettres (mélange « multiply »). Au
 * défilement, les lettres grandissent jusqu'à ouvrir l'écran sur la vidéo,
 * puis l'état d'ouverture, la prochaine soirée et les actions apparaissent.
 * Épinglé aussi sur mobile. Reduced motion : le nom ajouré, les infos dessous.
 */
export function ClubHero(props: HeroProps) {
  return (
    <StickyTrack lengthVh={230} mobileLengthVh={190} surface="dark" ariaLabelledby="club-hero-title" className="club-hero">
      <ClubHeroStage {...props} />
    </StickyTrack>
  );
}

function ClubHeroStage({ name, tagline, hours, locale, poster, video, next }: HeroProps) {
  const t = useTranslations("club");
  const tFiliale = useTranslations("filiale");
  const { progress, isStatic } = useStickyTrack();
  const [first, ...rest] = name.toUpperCase().split(" ");

  // 0 → 0,5 : les lettres s'ouvrent ; 0,38 → 0,52 : le noir s'efface ;
  // 0,52 → 0,72 : les infos montent.
  const scale = useTransform(progress, (v) => keyframes(v, [0, 0.5], [1, 16]));
  const maskOpacity = useTransform(progress, (v) => keyframes(v, [0, 0.38, 0.52], [1, 1, 0]));
  const introOpacity = useTransform(progress, (v) => keyframes(v, [0, 0.12], [1, 0]));
  const infoOpacity = useTransform(progress, (v) => keyframes(v, [0.5, 0.68], [0, 1]));
  const infoY = useTransform(progress, (v) => keyframes(v, [0.5, 0.72], [40, 0]));
  const shade = useTransform(progress, (v) => keyframes(v, [0.45, 0.7], [0, 0.62]));

  return (
    <div className={`club-hero__stage ${isStatic ? "is-static" : ""}`}>
      <ClubVideo poster={poster} video={video} />
      <motion.div aria-hidden="true" className="club-hero__shade" style={isStatic ? undefined : { opacity: shade }} data-track-motion />

      {/* Le noir ajouré : seules les lettres laissent voir la vidéo. */}
      <motion.div className="club-hero__mask" style={isStatic ? undefined : { opacity: maskOpacity }} data-track-motion>
        <motion.h1 id="club-hero-title" className="club-hero__word" style={isStatic ? undefined : { scale }} data-track-motion>
          <span className="club-hero__word-main">{first}</span>
          {rest.length > 0 && <span className="club-hero__word-sub">{rest.join(" ")}</span>}
        </motion.h1>
      </motion.div>

      <motion.div className="club-hero__intro" style={isStatic ? undefined : { opacity: introOpacity }} data-track-motion>
        <p>{t("heroPlace")}</p>
        <p aria-hidden="true" className="club-hero__scroll">
          {t("heroScroll")}
        </p>
      </motion.div>

      <motion.div className="club-hero__info" style={isStatic ? undefined : { opacity: infoOpacity, y: infoY }} data-track-motion>
        {hours && <FilialeOpenStatus hours={hours} locale={locale} />}
        <p className="club-hero__tagline">{tagline}</p>
        {next && (
          <p className="club-hero__next">
            <span>{t("heroNext")}</span>
            {next}
          </p>
        )}
        <div className="club-hero__actions">
          <Button href="#reservation" native>
            {tFiliale("reserve")}
          </Button>
          <Button href="#line-up" native variant="secondary">
            {t("heroLineup")}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

/** Lecture automatique : ni reduced motion, ni économiseur de données. */
function autoplayAllowed() {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return !window.matchMedia(REDUCED_MOTION_QUERY).matches && !connection?.saveData;
}

/**
 * Vidéo de la salle (muette, en boucle seulement à l'écran), affiche d'abord.
 * Bouton pause / lecture (WCAG 2.2.2) ; reduced motion : pas de lecture
 * automatique, le bouton la lance à la demande.
 */
function ClubVideo({ poster, video }: { poster: string; video?: HeroVideo }) {
  const t = useTranslations("club");
  const reduced = useReducedMotionSafe();
  const ref = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState<boolean | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const element = ref.current;
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
  }, [paused, reduced]);

  return (
    <>
      <div aria-hidden="true" className="club-hero__media">
        <Image src={poster} alt="" fill loading="eager" fetchPriority="high" sizes="100vw" className="object-cover" />
        {video && (
          <video
            ref={ref}
            className={`club-hero__video ${playing ? "is-playing" : ""}`}
            muted
            loop
            playsInline
            preload="metadata"
            poster={poster}
            onPlaying={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
          >
            {video.webm && <source src={video.webm} type="video/webm" />}
            <source src={video.src} type="video/mp4" />
          </video>
        )}
      </div>
      {video && (
        <button
          type="button"
          className="club-hero__toggle tap-press"
          aria-label={playing ? t("videoPause") : t("videoPlay")}
          onClick={() => setPaused(playing)}
        >
          {playing ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
        </button>
      )}
    </>
  );
}
