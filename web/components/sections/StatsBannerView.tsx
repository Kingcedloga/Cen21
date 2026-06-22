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
    <section className="relative bg-ivory px-4 py-16 text-petrol md:px-6 md:py-20 lg:px-8">
      <motion.div
        className="mx-auto grid max-w-5xl grid-cols-2 gap-8 md:grid-cols-4 md:gap-12"
        initial={reduced ? false : "hidden"}
        whileInView={reduced ? undefined : "visible"}
        viewport={defaultScrollViewport}
        variants={reduced ? undefined : statStaggerContainerVariants}
      >
        {items.map((item) => {
          const Icon = statIcons[item.icon];
          return (
            <motion.div
              key={item.label}
              className="text-center"
              variants={reduced ? undefined : fadeUpVariants}
              transition={fadeUpTransition}
            >
              <motion.div
                variants={reduced ? undefined : iconPopVariants}
                transition={iconPopTransition}
              >
                <Icon
                  className="mx-auto mb-3 h-7 w-7 text-petrol"
                  strokeWidth={ICON_STROKE_LIGHT}
                  aria-hidden
                />
              </motion.div>
              <p className="font-[family-name:var(--font-dm-sans)] text-3xl font-bold text-petrol md:text-4xl">
                <StatCountUp value={item.value} />
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-petrol">
                {item.label}
              </p>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
