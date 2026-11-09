"use client";

import { motion } from "framer-motion";

import { useScrollPercent } from "@/lib/use-scroll-percent";
import { useSurfaceContrast } from "@/lib/use-surface-contrast";

/** Aperçu de la future capsule : % de lecture et inversion selon le fond. */
export function ScrollReadout({ label, dark, light }: { label: string; dark: string; light: string }) {
  const percent = useScrollPercent();
  const surface = useSurfaceContrast(64);
  const onDark = surface === "dark";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 z-40 flex justify-center"
      style={{ bottom: "calc(var(--capsule-offset) + env(safe-area-inset-bottom, 0px))" }}
    >
      <div
        data-readout-surface={surface}
        className={`flex items-center gap-3 rounded-full px-5 py-3 text-sm font-medium shadow-long transition-colors duration-[350ms] ease-luxury ${
          onDark ? "bg-ivory text-petrol-panel-4" : "bg-petrol-panel-4 text-ivory"
        }`}
      >
        <span>{label}</span>
        <span className="tabular-nums">
          <motion.span>{percent}</motion.span> %
        </span>
        <span className="opacity-60">{onDark ? dark : light}</span>
      </div>
    </div>
  );
}
