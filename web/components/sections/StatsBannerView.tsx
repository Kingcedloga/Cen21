"use client";

import { motion, useReducedMotion } from "framer-motion";

import { StatCountUp } from "@/components/sections/StatCountUp";
import { ICON_STROKE_LIGHT, statIcons } from "@/lib/icons";
import {
  defaultScrollViewport,
  fadeUpTransition,
  fadeUpVariants,
  iconPopTransition,
  iconPopVariants,
  statStaggerContainerVariants,
} from "@/lib/motion";
import type { StatIconId } from "@/lib/types";

type StatItemData = {
  icon: StatIconId;
  value: string;
  label: string;
};

export function StatsBannerView({ items }: { items: StatItemData[] }) {
  const reduced = useReducedMotion();

  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-br from-[#002f3e] via-petrol to-[#002430] py-20 md:py-28 text-ivory border-y border-gold/25">
      {/* Texture de fond & lueur dorée ambiante */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-64 w-[40rem] rounded-full bg-gold/10 blur-3xl"
      />
      <div aria-hidden className="noise-overlay" />

      <motion.div
        className="relative z-10 mx-auto grid max-w-6xl grid-cols-2 gap-8 md:grid-cols-4 md:gap-0"
        initial={reduced ? false : "hidden"}
        whileInView={reduced ? undefined : "visible"}
        viewport={defaultScrollViewport}
        variants={reduced ? undefined : statStaggerContainerVariants}
      >
        {items.map((item, idx) => {
          const Icon = statIcons[item.icon];
          return (
            <motion.div
              key={item.label}
              className={`flex flex-col items-center justify-center text-center px-4 md:px-8 py-4 ${
                idx < items.length - 1 ? "md:border-r md:border-gold/20" : ""
              }`}
              variants={reduced ? undefined : fadeUpVariants}
              transition={fadeUpTransition}
            >
              <motion.div
                className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 border border-gold/25 shadow-[0_4px_20px_-4px_rgba(212,173,101,0.2)] backdrop-blur-sm"
                variants={reduced ? undefined : iconPopVariants}
                transition={iconPopTransition}
              >
                <Icon
                  className="h-6 w-6 text-gold"
                  weight={ICON_STROKE_LIGHT}
                  aria-hidden
                />
              </motion.div>
              <p className="font-[family-name:var(--font-dm-sans)] text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-bold tracking-tight text-ivory">
                <StatCountUp value={item.value} />
              </p>
              <p className="mt-3 text-[11px] sm:text-xs uppercase tracking-[0.24em] font-semibold text-gold/90">
                {item.label}
              </p>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
