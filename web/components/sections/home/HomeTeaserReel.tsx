"use client";

import { AnimatePresence, motion, useInView, type PanInfo } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { SpectrumText } from "@/components/motion/SpectrumText";
import { Link } from "@/i18n/navigation";
import { unmuteInGesture } from "@/lib/media-sound";
import { ArrowLeft, ArrowRight, ArrowUpRight, Pause, Play, Volume2, VolumeX } from "@/lib/icons";
import { EASE } from "@/lib/motion";
import type { HeroVideo } from "@/lib/types";
import { useReducedMotionSafe } from "@/lib/use-media-query";
import { teaserAutoplayAllowed } from "@/lib/use-teaser-video";

import "@/styles/home-reel.css";

export type ReelItem = {
  slug: string;
  name: string;
  /** Secteur déjà traduit (« Lounge », « Restaurant »…). */
  sector: string;
  video: HeroVideo;
  poster: string;
};

type Props = {
  eyebrow: string;
  title: string;
  titleSweep?: string;
  caption: string;
  items: ReelItem[];
};

/** Cartes visibles de part et d'autre de la carte active. */
const SIDE = 2;
/** Décalage horizontal d'un rang (en % de la largeur d'une carte). */
const STEP = 74;
const SCALE = [1, 0.8, 0.64];
const OPACITY = [1, 0.6, 0.28];
/** Glissé minimal (px) pour changer de teaser au doigt ou à la souris. */
const SWIPE = 40;
/** Teaser illisible (format non pris en charge) : on passe au suivant après ce délai. */
const FALLBACK_MS = 6000;

/** Écart circulaire de la carte `index` à la carte active (−n/2 … n/2). */
const offsetOf = (index: number, active: number, count: number) => {
  let d = (index - active + count) % count;
  if (d > count / 2) d -= count;
  return d;
};

/**
 * Accueil — les teasers des maisons en diaporama (remplace l'ancienne vidéo
 * YouTube). Les cartes verticales tournent en carrousel : la carte du milieu
 * lit son teaser, ses voisines montrent leur affiche en retrait.
 * - Lecture muette automatique dès que la scène est à l'écran (35 %), y compris
 *   en reduced motion ; seul l'économiseur de données la bloque
 *   (teaserAutoplayAllowed). Le son n'est activé que par le visiteur.
 * - À la fin d'un teaser, le suivant prend le relais ; la pause (WCAG 2.2.2)
 *   arrête tout. Flèches, glissé, clic sur une carte voisine.
 * - Seule la carte active charge sa vidéo ; rien avant l'approche (400 px).
 * - Reduced motion : les cartes changent de place sans glisser.
 */
export function HomeTeaserReel({ eyebrow, title, titleSweep, caption, items }: Props) {
  const t = useTranslations("home");
  const tFiliale = useTranslations("filiale");
  const tCta = useTranslations("cta");
  const reduced = useReducedMotionSafe();
  const count = items.length;

  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const near = useInView(stageRef, { once: true, margin: "400px 0px" });
  const inView = useInView(stageRef, { amount: 0.35 });

  const [active, setActive] = useState(0);
  // null : lecture automatique ; "play" / "pause" : choix du visiteur.
  const [choice, setChoice] = useState<"play" | "pause" | null>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [failed, setFailed] = useState<string | null>(null);

  const current = items[active];
  const go = (index: number) => {
    setPlaying(false);
    setActive(((index % count) + count) % count);
  };
  const next = () => go(active + 1);
  const prev = () => go(active - 1);

  // Lecture de la carte active : à l'écran, sauf pause du visiteur.
  useEffect(() => {
    const element = videoRef.current;
    if (progressRef.current) progressRef.current.style.transform = "scaleX(0)";
    if (!element) return;
    const wanted = inView && (choice === null ? teaserAutoplayAllowed() : choice === "play");
    if (!wanted) {
      element.pause();
      return;
    }
    element.muted = muted;
    element.play().catch(() => {
      // Son refusé par le navigateur : on reprend en muet.
      if (!element.muted) {
        element.muted = true;
        setMuted(true);
        element.play().catch(() => {});
      }
    });
    // `muted` est appliqué à part (toggleSound) : pas de relance à chaque bascule.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, inView, choice, near]);

  // Teaser illisible sur ce navigateur : l'affiche reste, puis le suivant.
  useEffect(() => {
    if (!current || failed !== current.slug || !inView || choice === "pause" || count < 2) return;
    const timer = window.setTimeout(() => setActive((index) => (index + 1) % count), FALLBACK_MS);
    return () => window.clearTimeout(timer);
  }, [failed, current, inView, choice, count]);

  if (!current) return null;

  const togglePlay = () => setChoice(playing ? "pause" : "play");

  const toggleSound = () => {
    const element = videoRef.current;
    const nextMuted = !muted;
    setMuted(nextMuted);
    if (!element) return;
    if (nextMuted) {
      element.muted = true;
      return;
    }
    // Son activé et lecture relancée dans le geste même (sinon refusés sur mobile).
    if (element.paused) setChoice("play");
    unmuteInGesture(element, () => setMuted(true));
  };

  const onTimeUpdate = () => {
    const element = videoRef.current;
    if (!element?.duration || !progressRef.current) return;
    progressRef.current.style.transform = `scaleX(${element.currentTime / element.duration})`;
  };

  const onPanEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x <= -SWIPE) next();
    else if (info.offset.x >= SWIPE) prev();
  };

  const transition = reduced ? { duration: 0 } : { duration: 0.8, ease: EASE.luxury };

  return (
    <section className="home-reel" aria-labelledby="home-reel-title">
      {/* Halo : l'affiche du teaser actif, très floutée, en fond. */}
      <div aria-hidden="true" className="home-reel__ambient">
        <AnimatePresence initial={false}>
          <motion.div
            key={current.slug}
            className="home-reel__ambient-layer"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduced ? undefined : { opacity: 0 }}
            transition={{ duration: reduced ? 0 : 1.2, ease: EASE.luxury }}
          >
            <Image src={current.poster} alt="" fill sizes="40vw" className="object-cover" />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="home-reel__head">
        <div>
          <p className="eyebrow text-xs font-semibold uppercase tracking-[0.2em] text-rose">{eyebrow}</p>
          <SpectrumText
            as="h2"
            id="home-reel-title"
            mode="scroll"
            text={title}
            sweep={titleSweep}
            className="title-section mt-4 text-h2 text-ivory text-balance"
          />
        </div>
        <p className="home-reel__caption">{caption}</p>
      </div>

      <motion.div
        ref={stageRef}
        className="home-reel__stage"
        role="region"
        aria-roledescription={t("reelRole")}
        aria-label={tCta("carouselLabel")}
        onPanEnd={count > 1 ? onPanEnd : undefined}
      >
        {items.map((item, index) => {
          const offset = offsetOf(index, active, count);
          const distance = Math.abs(offset);
          const isActive = offset === 0;
          const visible = distance <= SIDE;
          return (
            <motion.div
              key={item.slug}
              className="home-reel__card"
              data-active={isActive ? "" : undefined}
              role="group"
              aria-roledescription={t("reelSlide")}
              aria-label={t("reelSlideLabel", { name: item.name, index: index + 1, total: count })}
              aria-hidden={!isActive}
              initial={false}
              animate={{
                x: `${offset * STEP}%`,
                scale: SCALE[Math.min(distance, SIDE)],
                opacity: visible ? OPACITY[distance] : 0,
              }}
              transition={transition}
              style={{ zIndex: 10 - distance, pointerEvents: visible ? undefined : "none" }}
            >
              <Image
                src={item.poster}
                alt=""
                fill
                sizes="(min-width: 768px) 20rem, 62vw"
                className="object-cover"
                draggable={false}
              />
              {isActive && near && (
                <video
                  key={item.slug}
                  ref={videoRef}
                  className={`home-reel__video ${playing ? "is-playing" : ""}`}
                  aria-label={tFiliale("teaserLabel", { name: item.name })}
                  muted
                  playsInline
                  loop={count < 2}
                  preload="metadata"
                  poster={item.poster}
                  onPlaying={() => setPlaying(true)}
                  onPause={() => setPlaying(false)}
                  onEnded={next}
                  onTimeUpdate={onTimeUpdate}
                >
                  {item.video.webm && <source src={item.video.webm} type="video/webm" />}
                  <source src={item.video.src} type="video/mp4" onError={() => setFailed(item.slug)} />
                </video>
              )}
              {!isActive && visible && (
                <button
                  type="button"
                  className="home-reel__pick"
                  tabIndex={-1}
                  aria-label={t("reelShow", { name: item.name })}
                  onClick={() => go(index)}
                />
              )}
            </motion.div>
          );
        })}
      </motion.div>

      <div className="home-reel__bar">
        <div className="home-reel__now">
          <p className="home-reel__count" aria-hidden="true">
            <span>{String(active + 1).padStart(2, "0")}</span> / {String(count).padStart(2, "0")}
          </p>
          <div>
            <p className="home-reel__sector">{current.sector}</p>
            <h3 className="home-reel__name">{current.name}</h3>
          </div>
          <Link href={`/filiales/${current.slug}`} className="home-reel__link">
            {t("reelDiscover", { name: current.name })}
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>

        <div className="home-reel__controls">
          <span aria-hidden="true" className="home-reel__progress">
            <span ref={progressRef} />
          </span>
          {count > 1 && (
            <button type="button" className="home-reel__button tap-press" aria-label={tCta("prevSlide")} onClick={prev}>
              <ArrowLeft size={18} aria-hidden="true" />
            </button>
          )}
          <button
            type="button"
            className="home-reel__button home-reel__button--main tap-press"
            aria-label={playing ? tFiliale("teaserPause") : tFiliale("teaserPlay")}
            onClick={togglePlay}
          >
            {playing ? <Pause size={20} weight="fill" aria-hidden="true" /> : <Play size={20} weight="fill" aria-hidden="true" />}
          </button>
          <button
            type="button"
            className="home-reel__button tap-press"
            aria-label={muted ? tFiliale("teaserSoundOn") : tFiliale("teaserSoundOff")}
            aria-pressed={!muted}
            onClick={toggleSound}
          >
            {muted ? <VolumeX size={18} aria-hidden="true" /> : <Volume2 size={18} aria-hidden="true" />}
          </button>
          {count > 1 && (
            <button type="button" className="home-reel__button tap-press" aria-label={tCta("nextSlide")} onClick={next}>
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
