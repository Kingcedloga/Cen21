"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";

import { DURATION_S, EASE, defaultScrollViewport } from "@/lib/motion";

import "@/styles/mexican-motifs.css";

export type MexicanMotifVariant =
  | "hero"
  | "about"
  | "menu"
  | "gallery"
  | "reservation"
  | "events"
  | "categories";

function FadeInMotif({
  className,
  targetOpacity,
  parallax,
  children,
}: {
  className: string;
  targetOpacity: number;
  parallax?: boolean;
  children: ReactNode;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], parallax ? [-18, 18] : [0, 0]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={reduced || !parallax ? undefined : { y }}
      initial={reduced ? false : { opacity: 0 }}
      whileInView={reduced ? undefined : { opacity: targetOpacity }}
      viewport={defaultScrollViewport}
      transition={{ duration: DURATION_S.grand + 0.2, ease: EASE.luxury }}
    >
      {children}
    </motion.div>
  );
}

/** Grecque zapotèque — frise en escalier, inspirée des motifs de Mitla / Monte Albán. */
function GrecqueSvg({ id }: { id: string }) {
  return (
    <svg viewBox="0 0 200 40" fill="none" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id={id} width="20" height="40" patternUnits="userSpaceOnUse">
          <path
            d="M0 32 L0 16 L8 16 L8 24 L16 24 L16 8 L20 8"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
          />
        </pattern>
      </defs>
      <rect width="200" height="40" fill={`url(#${id})`} />
    </svg>
  );
}

/** Feuillage botanique stylisé — feuilles et lianes fines, jamais de cactus. */
function BotanicalSvg({ id }: { id: string }) {
  return (
    <svg viewBox="0 0 240 240" fill="none" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id={id} width="120" height="120" patternUnits="userSpaceOnUse">
          <path
            d="M10 110 Q30 70 20 30 Q40 50 55 20"
            stroke="currentColor"
            strokeWidth="1.25"
            fill="none"
          />
          <path
            d="M20 30 Q28 40 18 52"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
          />
          <path
            d="M85 100 Q100 70 92 35 Q110 55 118 25"
            stroke="currentColor"
            strokeWidth="1.25"
            fill="none"
          />
          <path
            d="M92 35 Q100 44 90 55"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
          />
        </pattern>
      </defs>
      <rect width="240" height="240" fill={`url(#${id})`} />
    </svg>
  );
}

/** Arches hacienda — silhouettes en demi-cercle, outline fin. */
function ArchSvg() {
  return (
    <svg viewBox="0 0 200 200" fill="none" preserveAspectRatio="xMidYMax slice">
      <path d="M10 200 V90 a70 70 0 0 1 140 0 V200" stroke="currentColor" strokeWidth="1.5" />
      <path d="M45 200 V95 a35 35 0 0 1 70 0 V200" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

/** Croix de Talavera — croix géométrique sobre, sans motif floral. */
function TalaveraCrossSvg() {
  return (
    <svg viewBox="0 0 40 40" fill="none">
      <path d="M20 4 V36 M4 20 H36" stroke="currentColor" strokeWidth="2" />
      <rect x="14" y="14" width="12" height="12" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

/** Losange huichol — losanges concentriques minimalistes. */
function LosangeSvg() {
  return (
    <svg viewBox="0 0 60 60" fill="none">
      <path d="M30 4 L56 30 L30 56 L4 30 Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M30 16 L44 30 L30 44 L16 30 Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M30 26 L34 30 L30 34 L26 30 Z" fill="currentColor" />
    </svg>
  );
}

/** Lignes de terrain — traits horizontaux ondulés, paysages d'Oaxaca. */
function TerrainLinesSvg() {
  return (
    <svg viewBox="0 0 400 60" fill="none" preserveAspectRatio="none">
      <path d="M0 10 Q50 0 100 10 T200 10 T300 10 T400 10" stroke="currentColor" strokeWidth="1" />
      <path d="M0 30 Q50 22 100 30 T200 30 T300 30 T400 30" stroke="currentColor" strokeWidth="1" />
      <path d="M0 50 Q50 42 100 50 T200 50 T300 50 T400 50" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

export function MexicanMotifs({ variant }: { variant: MexicanMotifVariant }) {
  switch (variant) {
    case "hero":
      return (
        <>
          <FadeInMotif
            className="mexican-motifs__item mexican-motifs__botanical mexican-motifs__pos--hero-botanical"
            targetOpacity={0.06}
          >
            <BotanicalSvg id="mex-botanical-hero" />
          </FadeInMotif>
          <FadeInMotif
            className="mexican-motifs__item mexican-motifs__grecque mexican-motifs__pos--hero-grecque"
            targetOpacity={0.1}
          >
            <GrecqueSvg id="mex-grecque-hero" />
          </FadeInMotif>
          <FadeInMotif
            className="mexican-motifs__item mexican-motifs__grecque mexican-motifs__pos--hero-grecque-bl"
            targetOpacity={0.1}
            parallax
          >
            <GrecqueSvg id="mex-grecque-hero-bl" />
          </FadeInMotif>
        </>
      );

    case "about":
      return (
        <>
          <FadeInMotif
            className="mexican-motifs__item mexican-motifs__arch mexican-motifs__pos--about-arch"
            targetOpacity={0.06}
            parallax
          >
            <ArchSvg />
          </FadeInMotif>
          <FadeInMotif
            className="mexican-motifs__item mexican-motifs__cross mexican-motifs__pos--about-cross-tl"
            targetOpacity={0.1}
          >
            <TalaveraCrossSvg />
          </FadeInMotif>
          <FadeInMotif
            className="mexican-motifs__item mexican-motifs__cross mexican-motifs__pos--about-cross-br"
            targetOpacity={0.1}
          >
            <TalaveraCrossSvg />
          </FadeInMotif>
        </>
      );

    case "menu":
      return (
        <>
          <FadeInMotif
            className="mexican-motifs__item mexican-motifs__terrain mexican-motifs__pos--menu-terrain"
            targetOpacity={0.08}
          >
            <TerrainLinesSvg />
          </FadeInMotif>
          <FadeInMotif
            className="mexican-motifs__item mexican-motifs__grecque mexican-motifs__pos--menu-grecque"
            targetOpacity={0.12}
            parallax
          >
            <GrecqueSvg id="mex-grecque-menu" />
          </FadeInMotif>
        </>
      );

    case "gallery":
      return (
        <>
          <FadeInMotif
            className="mexican-motifs__item mexican-motifs__losange mexican-motifs__pos--gallery-losange-1"
            targetOpacity={0.08}
          >
            <LosangeSvg />
          </FadeInMotif>
          <FadeInMotif
            className="mexican-motifs__item mexican-motifs__losange mexican-motifs__pos--gallery-losange-2"
            targetOpacity={0.08}
          >
            <LosangeSvg />
          </FadeInMotif>
          <FadeInMotif
            className="mexican-motifs__item mexican-motifs__terrain mexican-motifs__pos--gallery-terrain"
            targetOpacity={0.08}
          >
            <TerrainLinesSvg />
          </FadeInMotif>
        </>
      );

    case "reservation":
      return (
        <>
          <FadeInMotif
            className="mexican-motifs__item mexican-motifs__arch mexican-motifs__pos--reservation-arch"
            targetOpacity={0.06}
            parallax
          >
            <ArchSvg />
          </FadeInMotif>
          <FadeInMotif
            className="mexican-motifs__item mexican-motifs__grecque mexican-motifs__pos--reservation-grecque"
            targetOpacity={0.12}
          >
            <GrecqueSvg id="mex-grecque-reservation" />
          </FadeInMotif>
        </>
      );

    case "events":
      return (
        <>
          <FadeInMotif
            className="mexican-motifs__item mexican-motifs__cross mexican-motifs__pos--events-cross"
            targetOpacity={0.1}
          >
            <TalaveraCrossSvg />
          </FadeInMotif>
          <FadeInMotif
            className="mexican-motifs__item mexican-motifs__losange mexican-motifs__pos--events-losange"
            targetOpacity={0.08}
            parallax
          >
            <LosangeSvg />
          </FadeInMotif>
        </>
      );

    case "categories":
      return (
        <>
          <FadeInMotif
            className="mexican-motifs__item mexican-motifs__grecque mexican-motifs__pos--categories-grecque"
            targetOpacity={0.1}
          >
            <GrecqueSvg id="mex-grecque-categories" />
          </FadeInMotif>
          <FadeInMotif
            className="mexican-motifs__item mexican-motifs__losange mexican-motifs__pos--categories-losange"
            targetOpacity={0.08}
            parallax
          >
            <LosangeSvg />
          </FadeInMotif>
        </>
      );

    default:
      return null;
  }
}
