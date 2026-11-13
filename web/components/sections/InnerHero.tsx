"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef, type ReactNode } from "react";

import { SpectrumText } from "@/components/motion/SpectrumText";
import { Link } from "@/i18n/navigation";
import { BLUR_PETROL } from "@/lib/image-blur";
import { keyframes } from "@/lib/motion";
import type { HeroVideo } from "@/lib/types";
import { useReducedMotionSafe } from "@/lib/use-media-query";
import { useStickyFit } from "@/lib/use-sticky-fit";

import { InnerHeroVideo } from "./InnerHeroVideo";

import "@/styles/inner-hero.css";

/** Le panneau photo s'ouvre jusqu'aux bords sur les 70 premiers % d'écran défilés. */
const MEDIA_OPEN = [0, 0.7] as const;
/** Hero vidéo (plein écran) : le cadre s'ouvre sur la première moitié d'écran. */
const VIDEO_OPEN = [0, 0.5] as const;
/** Panneau fermé : aligné sur la colonne de texte, coins arrondis (--radius-card-xl). */
const CLIP_CLOSED = "inset(0 var(--inner-hero-inset) round var(--inner-hero-radius))";
/** Hero vidéo fermé : un cadre fin tout autour de l'écran. */
const CLIP_FRAMED = "inset(var(--inner-hero-frame) round var(--inner-hero-radius))";

export type InnerHeroBreadcrumb = {
  /** Nom accessible du fil d'Ariane. */
  label: string;
  home: string;
  /** Niveau intermédiaire (ex. Filiales sur une fiche). */
  parent?: { label: string; href: string };
  current: string;
};

/**
 * Hero des pages intérieures (refonte R0, d'après les pages secondaires
 * d'Orbix) : pastille, titre révélé lettre à lettre au chargement, chapô,
 * puis une photo dans un panneau arrondi qui s'ouvre jusqu'aux bords de
 * l'écran au défilement (mécanique du showreel).
 *
 * Dans un <HeroCurtain>, passer `className="hero-curtain__hero"` : le hero
 * reste collé (par son bas s'il dépasse l'écran) et la section suivante monte
 * par-dessus. Sans photo : version texte seule (pages légales).
 *
 * Avec `video` (fiches à vidéo) : la vidéo occupe tout l'écran dans un cadre
 * fin qui s'ouvre jusqu'aux bords au défilement, le texte se pose en bas sur
 * un voile ; `image` sert d'affiche.
 *
 * Reduced motion : panneau fixe aux coins arrondis, titre affiché d'emblée
 * (hero vidéo : l'affiche, la vidéo se lance au bouton).
 */
export function InnerHero({
  eyebrow,
  title,
  titleSweep,
  description,
  image,
  imageAlt = "",
  breadcrumb,
  actions,
  children,
  compact = false,
  media,
  video,
  titleId = "inner-hero-title",
  className = "",
}: {
  eyebrow?: string;
  title: string;
  /** Partie du titre balayée d'or à la fin de la révélation. */
  titleSweep?: string;
  description?: ReactNode;
  image?: string;
  imageAlt?: string;
  breadcrumb?: InnerHeroBreadcrumb;
  /** Boutons ou pastilles sous le chapô. */
  actions?: ReactNode;
  /** Bloc libre sous les actions (compte à rebours, formulaire…). */
  children?: ReactNode;
  /** Bandeau photo moins haut (pages utilitaires : contact). */
  compact?: boolean;
  /** Bloc visuel à la place du panneau photo (mosaïque de la galerie). */
  media?: ReactNode;
  /** Vidéo plein écran (hero immersif), `image` en affiche. */
  video?: HeroVideo;
  titleId?: string;
  className?: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotionSafe();
  useStickyFit(sectionRef);

  // Le hero ouvre la page : la progression se lit sur le défilement de la page.
  const { scrollY } = useScroll();
  const open = useTransform(scrollY, (y) =>
    typeof window === "undefined" ? 0 : keyframes(y / window.innerHeight, video ? VIDEO_OPEN : MEDIA_OPEN, [0, 1]),
  );
  const clipPath = useTransform(open, (k) => {
    const rest = (1 - k).toFixed(4);
    return video
      ? `inset(calc(var(--inner-hero-frame) * ${rest}) round calc(var(--inner-hero-radius) * ${rest}))`
      : `inset(0 calc(var(--inner-hero-inset) * ${rest}) round calc(var(--inner-hero-radius) * ${rest}))`;
  });
  const imageScale = useTransform(open, (k) => 1.08 - 0.08 * k);

  return (
    <section
      ref={sectionRef}
      data-surface="dark"
      aria-labelledby={titleId}
      className={`inner-hero ${video ? "inner-hero--video" : image || media ? "inner-hero--media" : ""} ${compact ? "inner-hero--compact" : ""} ${className}`}
    >
      {video && (
        <InnerHeroVideo
          video={video}
          poster={image}
          clipPath={reduced ? CLIP_FRAMED : clipPath}
          scale={reduced ? 1 : imageScale}
        />
      )}

      <div className="inner-hero__intro">
        {breadcrumb && (
          <nav aria-label={breadcrumb.label} className="inner-hero__crumbs">
            <ol>
              <li>
                <Link href="/">{breadcrumb.home}</Link>
              </li>
              {breadcrumb.parent && (
                <li>
                  <Link href={breadcrumb.parent.href}>{breadcrumb.parent.label}</Link>
                </li>
              )}
              <li aria-current="page">{breadcrumb.current}</li>
            </ol>
          </nav>
        )}

        {eyebrow && <p className="inner-hero__pill">{eyebrow}</p>}

        <SpectrumText
          as="h1"
          mode="load"
          id={titleId}
          text={title}
          sweep={titleSweep}
          className="inner-hero__title title-display text-balance"
        />

        {description && <p className="inner-hero__lead">{description}</p>}
        {actions && <div className="inner-hero__actions">{actions}</div>}
        {children && <div className="inner-hero__extra">{children}</div>}
      </div>

      {media && <div className="inner-hero__custom">{media}</div>}

      {image && !media && !video && (
        <motion.div
          className="inner-hero__media"
          style={{ clipPath: reduced ? CLIP_CLOSED : clipPath }}
        >
          <motion.div className="inner-hero__image" style={{ scale: reduced ? 1 : imageScale }}>
            <Image
              src={image}
              alt={imageAlt}
              fill
              // Image LCP (Next.js 16 : `priority` déprécié au profit de loading / fetchPriority).
              loading="eager"
              fetchPriority="high"
              placeholder="blur"
              blurDataURL={BLUR_PETROL}
              sizes="100vw"
              className="object-cover object-center"
            />
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
