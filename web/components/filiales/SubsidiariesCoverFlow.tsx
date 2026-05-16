"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

import { SubsidiaryCoverFlowCard } from "@/components/filiales/SubsidiaryCoverFlowCard";
import type { Subsidiary } from "@/lib/types";

const AUTO_MS = 5500;
const VISIBLE_RANGE = 3;

type StageMetrics = { spread: number; cardW: number; cardH: number };

function getStageMetrics(width: number): StageMetrics {
  if (width < 640) {
    return { spread: 62, cardW: 172, cardH: 258 };
  }
  if (width < 1024) {
    return { spread: 118, cardW: 228, cardH: 342 };
  }
  return { spread: 178, cardW: 300, cardH: 450 };
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
    abs === 0 ? 1.1 : abs === 1 ? 0.84 : abs === 2 ? 0.7 : abs === 3 ? 0.58 : 0.5;

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
  const [metrics, setMetrics] = useState<StageMetrics>(() =>
    typeof window !== "undefined" ? getStageMetrics(window.innerWidth) : getStageMetrics(1280),
  );
  const reduced = useReducedMotion();

  const safeActive = len ? ((active % len) + len) % len : 0;

  useEffect(() => {
    const update = () => setMetrics(getStageMetrics(window.innerWidth));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const go = useCallback(
    (delta: number) => {
      if (!len) return;
      setActive((i) => (i + delta + len) % len);
    },
    [len],
  );

  useEffect(() => {
    if (reduced || len <= 1) return;
    const t = window.setInterval(() => go(1), AUTO_MS);
    return () => window.clearInterval(t);
  }, [reduced, len, go]);

  if (!len) return null;

  const visible = subsidiaries
    .map((sub, i) => ({ sub, i, offset: wrapOffset(i, safeActive, len) }))
    .filter(({ offset }) => Math.abs(offset) <= VISIBLE_RANGE)
    .sort((a, b) => Math.abs(a.offset) - Math.abs(b.offset));

  const stageMinH = metrics.cardH + 48;

  return (
    <motion.div
      className="relative mx-auto w-full max-w-[min(100%,1400px)]"
      initial={false}
      animate={{ minHeight: stageMinH }}
    >
      {/* Scène type Netflix — fond sombre + vignettes latérales */}
      <motion.div
        className="absolute inset-x-[-12vw] top-1/2 z-0 -translate-y-1/2 rounded-3xl bg-[#060a0c] shadow-[inset_0_0_120px_rgba(0,0,0,0.85)] ring-1 ring-white/[0.06]"
        style={{ height: stageMinH + 80 }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-1/2 z-[1] -translate-y-1/2"
        style={{ height: stageMinH + 40 }}
        aria-hidden
      >
        <motion.div
          className="absolute left-1/2 top-1/2 h-[min(520px,70vw)] w-[min(640px,95vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(197,160,89,0.28)_0%,rgba(197,160,89,0.08)_42%,transparent_68%)]"
          animate={{ opacity: [0.85, 1, 0.85] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute inset-y-0 left-0 w-[min(28%,140px)] bg-gradient-to-r from-[#060a0c] via-[#060a0c]/90 to-transparent"
          aria-hidden
        />
        <motion.div
          className="absolute inset-y-0 right-0 w-[min(28%,140px)] bg-gradient-to-l from-[#060a0c] via-[#060a0c]/90 to-transparent"
          aria-hidden
        />
      </div>

      <motion.div
        className="relative z-10 mx-auto w-full [perspective:1800px] [perspective-origin:50%_45%]"
        style={{ minHeight: stageMinH }}
      >
        <div className="relative h-full w-full [transform-style:preserve-3d]">
          {visible.map(({ sub, i, offset }) => {
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
      </motion.div>

      {len > 1 && (
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {subsidiaries[safeActive]?.name}
        </p>
      )}
    </motion.div>
  );
}
