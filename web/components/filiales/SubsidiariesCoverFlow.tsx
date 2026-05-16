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
  /** Rotations Y des cartes adjacentes — moins agressives sur mobile pour réduire l'empreinte horizontale. */
  rotateY1: number;
  rotateY2: number;
  rotateY3: number;
};

// SSR + 1er render client (mobile-first) — déterministe, pas de mismatch d'hydratation.
const SSR_METRICS: StageMetrics = {
  spread: 50,
  cardW: 144,
  cardH: 216,
  activeScale: 1.0,
  wrapperH: 280,
  rotateY1: 32,
  rotateY2: 42,
  rotateY3: 48,
};

const METRICS: Record<Breakpoint, StageMetrics> = {
  mobile: SSR_METRICS,
  tablet: {
    spread: 110,
    cardW: 200,
    cardH: 300,
    activeScale: 1.05,
    wrapperH: 360,
    rotateY1: 36,
    rotateY2: 46,
    rotateY3: 52,
  },
  desktop: {
    spread: 178,
    cardW: 296,
    cardH: 444,
    activeScale: 1.1,
    wrapperH: 520,
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
      y: -halfH,
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
    y: -halfH,
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
      //   mobile  280px  ↔ METRICS.mobile.wrapperH = 280
      //   tablet  360px  ↔ METRICS.tablet.wrapperH = 360 (sm:min-h-[360px])
      //   desktop 520px  ↔ METRICS.desktop.wrapperH = 520 (lg:min-h-[520px])
      // Tailwind et matchMedia utilisent les mêmes seuils → CSS et JS toujours synchrones.
      className="relative mx-auto w-full max-w-[min(100%,1400px)] min-h-[280px] sm:min-h-[360px] lg:min-h-[520px]"
      initial={false}
      animate={mounted ? { minHeight: metrics.wrapperH } : undefined}
    >
      {/* Scène cinématique — bleed graduel : doux mobile, plein desktop */}
      <div
        className="absolute inset-x-[-3vw] inset-y-0 z-0 rounded-3xl bg-[#060a0c] shadow-[inset_0_0_120px_rgba(0,0,0,0.85)] ring-1 ring-white/[0.06] sm:inset-x-[-8vw] lg:inset-x-[-12vw]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 z-[1] inset-x-[-3vw] sm:inset-x-[-8vw] lg:inset-x-[-12vw]"
        aria-hidden
      >
        <motion.div
          className="absolute left-1/2 top-1/2 h-[min(520px,70vw)] w-[min(640px,95vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(197,160,89,0.28)_0%,rgba(197,160,89,0.08)_42%,transparent_68%)]"
          animate={mounted && !reduced ? { opacity: [0.85, 1, 0.85] } : { opacity: 0.85 }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <div
          className="absolute inset-y-0 left-0 w-[min(20%,110px)] rounded-l-3xl bg-gradient-to-r from-[#060a0c] via-[#060a0c]/90 to-transparent"
          aria-hidden
        />
        <div
          className="absolute inset-y-0 right-0 w-[min(20%,110px)] rounded-r-3xl bg-gradient-to-l from-[#060a0c] via-[#060a0c]/90 to-transparent"
          aria-hidden
        />
      </div>

      <div
        className="relative z-10 mx-auto h-full w-full min-h-[280px] [perspective:1800px] [perspective-origin:50%_45%] sm:min-h-[360px] lg:min-h-[520px]"
        style={mounted ? { minHeight: metrics.wrapperH } : undefined}
      >
        {!mounted ? (
          // Placeholder SSR-safe : silhouette de carte centrale aux dimensions
          // responsive Tailwind, identique côté SSR et premier render client.
          <div
            aria-hidden
            className="absolute left-1/2 top-1/2 h-[216px] w-[144px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/5 bg-white/[0.02] sm:h-[300px] sm:w-[200px] lg:h-[444px] lg:w-[296px]"
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
