"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

import { SubsidiaryCoverFlowCard } from "@/components/filiales/SubsidiaryCoverFlowCard";
import type { Subsidiary } from "@/lib/types";

const AUTO_MS = 5500;
const VISIBLE_RANGE = 3;

type Breakpoint = "mobile" | "tablet" | "desktop";

type StageMetrics = {
  spread: number;
  cardW: number;
  cardH: number;
  /** Échelle de la carte active. 1.0 sur mobile pour rester strictement contenue. */
  activeScale: number;
  /** Hauteur réservée du wrapper, alignée sur le min-h Tailwind correspondant. */
  wrapperH: number;
  /** Mobile : descend le deck (px) sous le titre de section sans rogner le bas. */
  deckYOffset?: number;
  /** Rotations Y des cartes adjacentes — moins agressives sur mobile pour réduire l'empreinte horizontale. */
  rotateY1: number;
  rotateY2: number;
  rotateY3: number;
};

// SSR + 1er render client (mobile-first) — déterministe, pas de mismatch d'hydratation.
// Buffer wrapper réduit à ~20 px pour compacter la bande sans rogner les cartes.
const SSR_METRICS: StageMetrics = {
  spread: 115,
  cardW: 290,
  cardH: 435,
  activeScale: 1.0,
  wrapperH: 520,
  deckYOffset: 96,
  rotateY1: 36,
  rotateY2: 46,
  rotateY3: 52,
};

const METRICS: Record<Breakpoint, StageMetrics> = {
  mobile: SSR_METRICS,
  tablet: {
    spread: 130,
    cardW: 240,
    cardH: 360,
    activeScale: 1.05,
    wrapperH: 398,
    rotateY1: 36,
    rotateY2: 46,
    rotateY3: 52,
  },
  desktop: {
    spread: 178,
    cardW: 296,
    cardH: 444,
    activeScale: 1.1,
    wrapperH: 508,
    rotateY1: 38,
    rotateY2: 48,
    rotateY3: 52,
  },
};

/**
 * Détection de breakpoint synchrone avec les media queries Tailwind.
 *
 * matchMedia partage EXACTEMENT la même grammaire CSS que Tailwind :
 *   - `(min-width: 640px)` ↔ Tailwind `sm:`
 *   - `(min-width: 1024px)` ↔ Tailwind `lg:`
 *
 * Cela rend impossible toute désynchronisation entre les metrics 3D
 * (JS) et le min-h Tailwind (CSS) — quel que soit le contexte d'exécution
 * (DevTools simulator, iframe, mockup frame, container sans contrainte).
 */
function useBreakpoint(): { bp: Breakpoint; mounted: boolean } {
  const [bp, setBp] = useState<Breakpoint>("mobile");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const mqDesktop = window.matchMedia("(min-width: 1024px)");
    const mqTablet = window.matchMedia("(min-width: 640px)");

    const update = () => {
      if (mqDesktop.matches) setBp("desktop");
      else if (mqTablet.matches) setBp("tablet");
      else setBp("mobile");
    };

    update();
    setMounted(true);

    mqDesktop.addEventListener("change", update);
    mqTablet.addEventListener("change", update);
    return () => {
      mqDesktop.removeEventListener("change", update);
      mqTablet.removeEventListener("change", update);
    };
  }, []);

  return { bp, mounted };
}

function wrapOffset(index: number, active: number, len: number) {
  let diff = index - active;
  if (diff > len / 2) diff -= len;
  if (diff < -len / 2) diff += len;
  return diff;
}

function cardMotion(offset: number, reduced: boolean, m: StageMetrics) {
  const halfW = m.cardW / 2;
  const halfH = m.cardH / 2;

  if (reduced) {
    return {
      x: -halfW,
      y: -halfH + (m.deckYOffset ?? 0),
      scale: offset === 0 ? 1 : 0.92,
      rotateY: 0,
      z: 0,
      opacity: offset === 0 ? 1 : 0,
      zIndex: offset === 0 ? 40 : 0,
    };
  }

  const abs = Math.abs(offset);
  const sign = offset === 0 ? 0 : offset > 0 ? 1 : -1;

  const scale =
    abs === 0
      ? m.activeScale
      : abs === 1
        ? 0.84
        : abs === 2
          ? 0.7
          : abs === 3
            ? 0.58
            : 0.5;

  const rotateY =
    sign * (abs === 1 ? m.rotateY1 : abs === 2 ? m.rotateY2 : abs === 3 ? m.rotateY3 : 0);

  return {
    x: offset * m.spread - halfW,
    y: -halfH + (m.deckYOffset ?? 0),
    scale,
    rotateY,
    z: -abs * 140,
    opacity: abs === 0 ? 1 : abs === 1 ? 0.92 : abs === 2 ? 0.72 : 0.5,
    zIndex: 50 - abs * 10,
  };
}

export function SubsidiariesCoverFlow({
  subsidiaries,
}: {
  subsidiaries: Subsidiary[];
}) {
  const len = subsidiaries.length;
  const [active, setActive] = useState(0);
  const { bp, mounted } = useBreakpoint();
  const reduced = useReducedMotion();

  const metrics = METRICS[bp];
  const safeActive = len ? ((active % len) + len) % len : 0;

  const go = useCallback(
    (delta: number) => {
      if (!len) return;
      setActive((i) => (i + delta + len) % len);
    },
    [len],
  );

  useEffect(() => {
    if (!mounted || reduced || len <= 1) return;
    const t = window.setInterval(() => go(1), AUTO_MS);
    return () => window.clearInterval(t);
  }, [mounted, reduced, len, go]);

  if (!len) return null;

  return (
    <motion.div
      // Hauteurs Tailwind responsives (CSS-only) STRICTEMENT alignées sur METRICS.wrapperH :
      // mobile  520px  ↔ METRICS.mobile.wrapperH + deckYOffset (deck abaissé sous le titre)
      //   tablet  398px  ↔ METRICS.tablet.wrapperH = 398 (card 378px + 20px buffer)
      //   desktop 508px  ↔ METRICS.desktop.wrapperH = 508 (card 488px + 20px buffer)
      // Tailwind et matchMedia utilisent les mêmes seuils → CSS et JS toujours synchrones.
      className="relative mx-auto w-full max-w-[min(100%,1400px)] min-h-[520px] sm:min-h-[398px] lg:min-h-[508px]"
      initial={false}
      animate={mounted ? { minHeight: metrics.wrapperH } : undefined}
    >
      {/* Halo doré central — accent lumineux sur le marbre, sans fond opaque */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden
      >
        <motion.div
          className="absolute left-1/2 top-1/2 h-[min(420px,60vw)] w-[min(560px,82vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(212,173,101,0.22)_0%,rgba(212,173,101,0.06)_45%,transparent_72%)] max-sm:h-[min(240px,45vw)] max-sm:w-[min(300px,78vw)] max-sm:opacity-60"
          animate={mounted && !reduced ? { opacity: [0.8, 1, 0.8] } : { opacity: 0.8 }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div
        className="relative z-10 mx-auto h-full w-full min-h-[520px] [perspective:1800px] [perspective-origin:50%_58%] max-sm:[perspective-origin:50%_72%] sm:min-h-[398px] sm:[perspective-origin:50%_45%] lg:min-h-[508px]"
        style={mounted ? { minHeight: metrics.wrapperH } : undefined}
      >
        {!mounted ? (
          // Placeholder SSR-safe : silhouette de carte centrale aux dimensions
          // responsive Tailwind, identique côté SSR et premier render client.
          <div
            aria-hidden
            className="absolute left-1/2 top-1/2 h-[435px] w-[290px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-petrol/10 bg-white/30 max-sm:top-[calc(50%+96px)] sm:h-[360px] sm:w-[240px] lg:h-[444px] lg:w-[296px]"
          />
        ) : (
          <div className="relative h-full w-full [transform-style:preserve-3d]">
            {subsidiaries
              .map((sub, i) => ({ sub, i, offset: wrapOffset(i, safeActive, len) }))
              .filter(({ offset }) => Math.abs(offset) <= VISIBLE_RANGE)
              .sort((a, b) => Math.abs(a.offset) - Math.abs(b.offset))
              .map(({ sub, i, offset }) => {
                const target = cardMotion(offset, !!reduced, metrics);
                const isCenter = i === safeActive;

                return (
                  <motion.div
                    key={sub.slug}
                    className="absolute left-1/2 top-1/2 will-change-transform"
                    initial={false}
                    animate={target}
                    transition={{
                      duration: reduced ? 0.2 : 0.48,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    style={{
                      transformStyle: "preserve-3d",
                      width: metrics.cardW,
                      pointerEvents: Math.abs(offset) > 2 && !reduced ? "none" : "auto",
                    }}
                  >
                    <SubsidiaryCoverFlowCard
                      subsidiary={sub}
                      isActive={isCenter}
                      width={metrics.cardW}
                      onFocus={() => setActive(i)}
                    />
                  </motion.div>
                );
              })}
          </div>
        )}
      </div>

      {len > 1 && mounted && (
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {subsidiaries[safeActive]?.name}
        </p>
      )}
    </motion.div>
  );
}
