"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { FilialeOpenStatus } from "@/components/filiales/blocks/FilialeOpenStatus";
import { FilialeHeroLogo, type HeroLogo } from "@/components/filiales/blocks/FilialeHeroLogo";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import { ExternalLink, Pause, Play } from "@/lib/icons";
import type { HeroVideo } from "@/lib/types";
import { useReducedMotionSafe } from "@/lib/use-media-query";
import { teaserAutoplayAllowed } from "@/lib/use-teaser-video";

import { MexicanaPapel } from "./MexicanaPapel";

import "@/styles/mexicana.css";

/** Reduced motion : valeurs fixes explicites (rien de l'état d'avant hydratation). */
const STILL_FRAME = { rotate: 3, y: 0 };

/**
 * La une de Gourmet Mexicana : deux guirlandes de papel picado sous la barre
 * de navigation, le nom comme sur le logo (« GOURMET » en capitales,
 * « Mexicana » à la main, en rouge), et le teaser de la maison dans un cadre
 * de carreaux (le motif aux calaveras). Au défilement, le cadre se redresse
 * et remonte. Vidéo muette, en boucle seulement à l'écran, bouton lecture /
 * pause ; économiseur de données seul : l'affiche.
 */
export function MexicanaHero({
  name,
  logo,
  tagline,
  hours,
  locale,
  mapsUrl,
  video,
  poster,
  posterAlt,
}: {
  name: string;
  /** Logo de la maison à la place du nom écrit (titre de la une). */
  logo?: HeroLogo;
  tagline: string;
  hours?: string;
  locale: string;
  mapsUrl: string;
  video?: HeroVideo;
  poster: string;
  posterAlt: string;
}) {
  const t = useTranslations("mexicana");
  const tFiliale = useTranslations("filiale");
  const tCommon = useTranslations("common");
  const tNav = useTranslations("nav");
  const tContact = useTranslations("contact");
  const reduced = useReducedMotionSafe();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const frameRotate = useTransform(scrollYProgress, [0, 1], [3, -2]);
  const frameY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const [first, ...rest] = name.split(" ");

  return (
    <section ref={ref} aria-labelledby="mexicana-hero-title" data-surface="dark" className="mx-hero">
      <MexicanaPapel count={16} className="mx-hero__papel" />
      <MexicanaPapel count={12} className="mx-hero__papel mx-hero__papel--back" />

      <div className="mx-hero__inner">
        <div className="mx-hero__text">
          <nav aria-label={tCommon("breadcrumb")} className="mx-crumbs">
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

          <p className="mx-eyebrow">{t("heroEyebrow")}</p>
          {logo ? (
            <FilialeHeroLogo id="mexicana-hero-title" name={name} logo={logo} className="mx-hero__logo" />
          ) : (
            <h1 id="mexicana-hero-title" className="mx-hero__title">
              <span className="mx-hero__word">{first}</span>{" "}
              {rest.length > 0 && <span className="mx-hero__script mx-script">{rest.join(" ")}</span>}
            </h1>
          )}
          <p className="mx-hero__lead">{tagline}</p>
          {hours && (
            <div className="mx-hero__status">
              <FilialeOpenStatus hours={hours} locale={locale} />
            </div>
          )}

          <div className="mx-hero__actions">
            <Button href="#reservation" native magnetic>
              {tFiliale("reserve")}
            </Button>
            <Button href="#carte" native variant="secondary">
              {t("heroMenu")}
            </Button>
            <Button href={mapsUrl} external variant="ghost">
              {tCommon("directions")}
              <ExternalLink size={16} aria-hidden="true" />
              <span className="sr-only"> ({tContact("newTab")})</span>
            </Button>
          </div>
        </div>

        <motion.div className="mx-hero__frame" style={reduced ? STILL_FRAME : { rotate: frameRotate, y: frameY }}>
          <div className="mx-hero__screen">
            <TeaserVideo video={video} poster={poster} posterAlt={posterAlt} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function TeaserVideo({ video, poster, posterAlt }: { video?: HeroVideo; poster: string; posterAlt: string }) {
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
      <Image src={poster} alt={posterAlt} fill loading="eager" fetchPriority="high" sizes="(min-width: 1024px) 30rem, 92vw" className="object-cover" />
      {video && (
        <>
          <video
            ref={ref}
            aria-hidden="true"
            tabIndex={-1}
            className={`mx-hero__video ${playing ? "is-playing" : ""}`}
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
            className="mx-hero__toggle tap-press"
            aria-label={playing ? tCommon("videoPause") : tCommon("videoPlay")}
            onClick={() => setPaused(playing)}
          >
            {playing ? <Pause size={16} weight="fill" aria-hidden="true" /> : <Play size={16} weight="fill" aria-hidden="true" />}
          </button>
        </>
      )}
    </>
  );
}
