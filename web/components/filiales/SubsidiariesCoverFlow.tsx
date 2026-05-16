"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

import { SubsidiaryCoverFlowCard } from "@/components/filiales/SubsidiaryCoverFlowCard";
import type { Subsidiary } from "@/lib/types";

const AUTO_MS = 5500;
const VISIBLE_RANGE = 3;

type StageMetrics = {
  spread: number;
  cardW: number;
  cardH: number;
  /** Échelle de la carte active. Conservatrice sur mobile pour rester contenue. */
  activeScale: number;
  /** Hauteur réservée du wrapper, basée sur cardH × activeScale + breathing. */
  wrapperH: number;
};

// Valeurs déterministes utilisées en SSR + 1er render client (mobile-first).
// SSR HTML ≡ premier render client → zéro mismatch d'hydratation.
const SSR_METRICS: StageMetrics = {
  spread: 54,
  cardW: 156,
  cardH: 234,
  activeScale: 1.0,
  wrapperH: 320,
};

/**
 * Calcule les metrics 3D à partir de la LARGEUR RÉELLE rendue du wrapper
 * (mesurée via ResizeObserver), pas window.innerWidth.
 *
 * Pourquoi : window.innerWidth peut diverger du viewport CSS (DevTools
 * mobile simulator, iframes, certains émulateurs), causant un mismatch
 * entre les metrics 3D (mobile attendues) et le min-h Tailwind appliqué
 * (mobile correct via media query). Mesurer l'élément lui-même garantit
 * un alignement parfait avec le layout CSS quel que soit le contexte.
 */
function getStageMetrics(width: number): StageMetrics {
  if (width < 640) {
    // Mobile : carte active scale 1.0 (pas d'agrandissement) →
    // hauteur visible = cardH = 234, contenue dans wrapper 320px
    // (43px de respiration haute + basse).
    return {
      spread: 54,
      cardW: 156,
      cardH: 234,
      activeScale: 1.0,
      wrapperH: 320,
    };
  }
  if (width < 1024) {
    return {
      spread: 118,
      cardW: 220,
      cardH: 330,
      activeScale: 1.06,
      wrapperH: 420,
    };
  }
  return {
    spread: 178,
    cardW: 296,
    cardH: 444,
    activeScale: 1.1,
    wrapperH: 540,
  };
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

  const rotateY = sign * (abs === 1 ? 38 : abs === 2 ? 48 : abs === 3 ? 52 : 0);

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
  const [metrics, setMetrics] = useState<StageMetrics>(SSR_METRICS);
  const [mounted, setMounted] = useState(false);
  const reduced = useReducedMotion();
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const safeActive = len ? ((active % len) + len) % len : 0;

  useEffect(() => {
    if (!wrapperRef.current) return;

    // ResizeObserver mesure la LARGEUR RENDUE du wrapper, qui correspond
    // toujours au viewport CSS. Robuste contre les divergences de
    // window.innerWidth (DevTools, iframes, simulateurs).
    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const width = entry.contentRect.width;
      if (width > 0) {
        setMetrics(getStageMetrics(width));
      }
    });

    ro.observe(wrapperRef.current);
    // Mesure initiale synchrone (au cas où ResizeObserver tarde au mount).
    const initialWidth = wrapperRef.current.getBoundingClientRect().width;
    if (initialWidth > 0) {
      setMetrics(getStageMetrics(initialWidth));
    }
    setMounted(true);

    return () => ro.disconnect();
  }, []);

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
      ref={wrapperRef}
      // Hauteurs Tailwind responsives (CSS-only) cohérentes avec wrapperH par breakpoint :
      // mobile 320px (wrapperH SSR), sm 420px, lg 540px. Réservées AVANT JS → zéro CLS.
      className="relative mx-auto w-full max-w-[min(100%,1400px)] min-h-[320px] sm:min-h-[420px] lg:min-h-[540px]"
      initial={false}
      animate={mounted ? { minHeight: metrics.wrapperH } : undefined}
    >
      {/* Scène (fond sombre + halo) — bleed graduel : doux mobile, plein desktop */}
      <div
        className="absolute inset-x-[-4vw] inset-y-0 z-0 rounded-3xl bg-[#060a0c] shadow-[inset_0_0_120px_rgba(0,0,0,0.85)] ring-1 ring-white/[0.06] sm:inset-x-[-8vw] lg:inset-x-[-12vw]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 z-[1] inset-x-[-4vw] sm:inset-x-[-8vw] lg:inset-x-[-12vw]"
        aria-hidden
      >
        <motion.div
          className="absolute left-1/2 top-1/2 h-[min(520px,70vw)] w-[min(640px,95vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(197,160,89,0.28)_0%,rgba(197,160,89,0.08)_42%,transparent_68%)]"
          animate={mounted && !reduced ? { opacity: [0.85, 1, 0.85] } : { opacity: 0.85 }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <div
          className="absolute inset-y-0 left-0 w-[min(22%,120px)] rounded-l-3xl bg-gradient-to-r from-[#060a0c] via-[#060a0c]/90 to-transparent"
          aria-hidden
        />
        <div
          className="absolute inset-y-0 right-0 w-[min(22%,120px)] rounded-r-3xl bg-gradient-to-l from-[#060a0c] via-[#060a0c]/90 to-transparent"
          aria-hidden
        />
      </div>

      <div
        className="relative z-10 mx-auto h-full w-full min-h-[320px] [perspective:1800px] [perspective-origin:50%_45%] sm:min-h-[420px] lg:min-h-[540px]"
        style={mounted ? { minHeight: metrics.wrapperH } : undefined}
      >
        {!mounted ? (
          // Placeholder SSR-safe : silhouette de carte centrale aux dimensions
          // responsive Tailwind, identique côté SSR et premier render client.
          <div
            aria-hidden
            className="absolute left-1/2 top-1/2 h-[234px] w-[156px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/5 bg-white/[0.02] sm:h-[330px] sm:w-[220px] lg:h-[444px] lg:w-[296px]"
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
