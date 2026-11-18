"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { FilialeOpenStatus } from "@/components/filiales/blocks/FilialeOpenStatus";
import { FilialeHeroLogo, type HeroLogo } from "@/components/filiales/blocks/FilialeHeroLogo";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import { playInGesture } from "@/lib/media-sound";
import { Pause, Phone, Play } from "@/lib/icons";
import type { HeroVideo } from "@/lib/types";
import { useReducedMotionSafe } from "@/lib/use-media-query";
import { teaserAutoplayAllowed } from "@/lib/use-teaser-video";

import "@/styles/olive.css";

/** Reduced motion : valeurs fixes explicites (rien de l'état d'avant hydratation). */
const STILL_OVAL = { rotate: -6, y: 0 };
const STILL_RING = { rotate: 8 };

/**
 * La une de L'Olive Verte : le nom en capitales fines et espacées (l'Art
 * déco du logo) et le teaser de la maison dans un ovale — la forme d'une
 * olive — doublé d'un filet. Au défilement, l'ovale se redresse et remonte,
 * le filet tourne en sens inverse. Vidéo muette, en boucle seulement à
 * l'écran, bouton lecture / pause (WCAG 2.2.2) ; économiseur de données
 * seul : l'affiche, la vidéo se lance au bouton.
 */
export function OliveHero({
  name,
  logo,
  tagline,
  hours,
  phone,
  locale,
  video,
  poster,
  posterAlt,
}: {
  name: string;
  /** Logo de la maison à la place du nom écrit (titre de la une). */
  logo?: HeroLogo;
  tagline: string;
  hours?: string;
  phone?: string;
  locale: string;
  video?: HeroVideo;
  poster: string;
  posterAlt: string;
}) {
  const t = useTranslations("olive");
  const tFiliale = useTranslations("filiale");
  const tCommon = useTranslations("common");
  const tNav = useTranslations("nav");
  const reduced = useReducedMotionSafe();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const ovalRotate = useTransform(scrollYProgress, [0, 1], [-6, 3]);
  const ovalY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const ringRotate = useTransform(scrollYProgress, [0, 1], [8, -14]);

  return (
    <section ref={ref} aria-labelledby="olive-hero-title" data-surface="dark" className="olive-hero">
      <div className="olive-hero__inner">
        <div className="olive-hero__text">
          <nav aria-label={tCommon("breadcrumb")} className="olive-crumbs">
            <ol>
              <li>
                <Link href="/">{tNav("home")}</Link>
              </li>
              <li>
                <Link href="/filiales">{tNav("subsidiaries")}</Link>
              </li>
              <li aria-current="page">{name}</li>
            </ol>
          </nav>

          <p className="olive-eyebrow">{t("heroEyebrow")}</p>
          {logo ? (
            <FilialeHeroLogo id="olive-hero-title" name={name} logo={logo} className="olive-hero__logo" />
          ) : (
            <h1 id="olive-hero-title" className="olive-hero__title">
              {name}
            </h1>
          )}
          <p className="olive-hero__lead">{tagline}</p>
          {hours && (
            <div className="olive-hero__status">
              <FilialeOpenStatus hours={hours} locale={locale} />
            </div>
          )}

          <div className="olive-hero__actions">
            <Button href="#reservation" native magnetic>
              {tFiliale("reserve")}
            </Button>
            <Button href="#carte" native variant="secondary">
              {t("heroMenu")}
            </Button>
            {phone && (
              <Button href={`tel:${phone.replace(/\s/g, "")}`} native variant="ghost">
                <Phone size={16} aria-hidden="true" />
                {tCommon("call")}
              </Button>
            )}
          </div>
        </div>

        <div className="olive-hero__visual">
          <motion.span aria-hidden="true" className="olive-hero__ring" style={reduced ? STILL_RING : { rotate: ringRotate }} />
          <motion.div className="olive-hero__oval" style={reduced ? STILL_OVAL : { rotate: ovalRotate, y: ovalY }}>
            <OliveVideo video={video} poster={poster} posterAlt={posterAlt} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function OliveVideo({ video, poster, posterAlt }: { video?: HeroVideo; poster: string; posterAlt: string }) {
  const tCommon = useTranslations("common");
  const ref = useRef<HTMLVideoElement>(null);
  // null : lecture automatique ; true / false : choix du visiteur.
  const [paused, setPaused] = useState<boolean | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const wanted = paused === null ? teaserAutoplayAllowed() : !paused;
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
  }, [paused]);

  return (
    <>
      <Image src={poster} alt={posterAlt} fill loading="eager" fetchPriority="high" sizes="(min-width: 1024px) 30rem, 80vw" className="object-cover" />
      {video && (
        <>
          <video
            ref={ref}
            aria-hidden="true"
            tabIndex={-1}
            className={`olive-hero__video ${playing ? "is-playing" : ""}`}
            muted
            loop
            playsInline
            preload="none"
            onPlaying={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
          >
            {video.webm && <source src={video.webm} type="video/webm" />}
            <source src={video.src} type="video/mp4" />
          </video>
          <button
            type="button"
            className="olive-hero__toggle tap-press"
            aria-label={playing ? tCommon("videoPause") : tCommon("videoPlay")}
            onClick={() => {
              setPaused(playing);
              if (!playing) playInGesture(ref.current);
            }}
          >
            {playing ? <Pause size={16} weight="fill" aria-hidden="true" /> : <Play size={16} weight="fill" aria-hidden="true" />}
          </button>
        </>
      )}
    </>
  );
}
