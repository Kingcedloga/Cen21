"use client";

import { motion, useReducedMotion } from "framer-motion";

const SHAPES = ["circle", "dot", "wave"] as const;

const POSITIONS = [
  { x: "4%",  y: "18%" },
  { x: "18%", y: "8%"  },
  { x: "8%",  y: "42%" },
  { x: "40%", y: "6%"  },
  { x: "3%",  y: "68%" },
  { x: "14%", y: "88%" },
  { x: "34%", y: "72%" },
  { x: "51%", y: "18%" },
  { x: "6%",  y: "94%" },
  { x: "25%", y: "58%" },
  { x: "45%", y: "42%" },
  { x: "31%", y: "28%" },
  { x: "56%", y: "68%" },
  { x: "43%", y: "92%" },
  { x: "22%", y: "12%" },
] as const;

/** Motifs décoratifs du hero L'Olive Verte — réutilise les classes CSS existantes. */
export function OliveVerteMotifs() {
  const reduced = useReducedMotion() ?? false;

  return (
    <div className="olive-hero__motifs" aria-hidden="true">
      {POSITIONS.map((pos, i) => {
        const shape = SHAPES[i % SHAPES.length];
        return (
          <motion.span
            key={i}
            className={`olive-hero__motif olive-hero__motif--${shape}`}
            style={{ left: pos.x, top: pos.y }}
            initial={reduced ? false : { opacity: 0, scale: 0.6 }}
            animate={reduced ? undefined : { opacity: 1, scale: 1, y: [0, -6, 0] }}
            transition={{
              opacity: { delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
              scale:   { delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
              y: {
                delay: i * 0.08 + 0.4,
                duration: 3.2 + (i % 4) * 0.3,
                ease: "easeInOut",
                repeat: Infinity,
              },
            }}
          >
            {shape === "wave" && (
              <svg viewBox="0 0 60 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path
                  d="M1 10c5-9 10-9 15 0s10 9 15 0 10-9 15 0 10 9 13 0"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </motion.span>
        );
      })}
    </div>
  );
}
