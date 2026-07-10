"use client";

import { motion, useReducedMotion } from "framer-motion";

export type OliveSection =
  | "specialties"
  | "gallery"
  | "menu"
  | "establishments"
  | "map";

interface OliveItem {
  x: string;
  y: string;
  size: number;
  rotate: number;
  animated: boolean;
}

const CONFIGS: Record<OliveSection, OliveItem[]> = {
  specialties: [
    { x: "88%", y: "10%", size: 48, rotate: 25,  animated: true  },
    { x: "2%",  y: "78%", size: 38, rotate: -20, animated: false },
    { x: "85%", y: "52%", size: 30, rotate: 50,  animated: true  },
    { x: "4%",  y: "22%", size: 44, rotate: -10, animated: false },
  ],
  gallery: [
    { x: "1%",  y: "12%", size: 44, rotate: 15,  animated: true  },
    { x: "93%", y: "18%", size: 36, rotate: -25, animated: false },
    { x: "2%",  y: "68%", size: 30, rotate: 40,  animated: true  },
    { x: "91%", y: "72%", size: 48, rotate: -10, animated: false },
  ],
  menu: [
    { x: "1%",  y: "8%",  size: 50, rotate: 20,  animated: true  },
    { x: "92%", y: "12%", size: 36, rotate: -30, animated: false },
    { x: "1%",  y: "74%", size: 32, rotate: 45,  animated: true  },
    { x: "90%", y: "78%", size: 44, rotate: -15, animated: false },
    { x: "87%", y: "45%", size: 28, rotate: 10,  animated: true  },
  ],
  establishments: [
    { x: "83%", y: "8%",  size: 46, rotate: 25,  animated: true  },
    { x: "4%",  y: "58%", size: 36, rotate: -20, animated: false },
    { x: "88%", y: "62%", size: 30, rotate: 50,  animated: true  },
    { x: "2%",  y: "28%", size: 40, rotate: -10, animated: false },
  ],
  map: [
    { x: "3%",  y: "18%", size: 44, rotate: 15,  animated: true  },
    { x: "86%", y: "22%", size: 36, rotate: -30, animated: false },
    { x: "4%",  y: "68%", size: 32, rotate: 40,  animated: true  },
  ],
};

function OliveSvg() {
  return (
    <svg
      viewBox="0 0 28 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ display: "block", width: "100%", height: "100%" }}
    >
      {/* Feuille — amande à droite de la tige */}
      <path
        d="M14 12 C20 5 27 9 22 15 C18 20 14 16 14 12Z"
        fill="currentColor"
      />
      {/* Tige */}
      <path
        d="M14 12 L14 20"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Fruit */}
      <ellipse cx="14" cy="31" rx="9" ry="11" fill="currentColor" />
      {/* Reflet */}
      <ellipse cx="11" cy="26" rx="2.5" ry="3.5" fill="white" fillOpacity="0.15" />
    </svg>
  );
}

export function OliveMotifs({ section }: { section: OliveSection }) {
  const reduced = useReducedMotion() ?? false;
  const items = CONFIGS[section];

  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
        color: "#767F34",
      }}
    >
      {items.map((item, i) => (
        /*
         * Deux couches motion imbriquées :
         *  – externe : opacity 0→0.15 via whileInView (scroll fade-in, once)
         *  – interne : rotate oscillation infinie sur les olives animées
         */
        <motion.div
          key={i}
          style={{
            position: "absolute",
            left: item.x,
            top: item.y,
            width: item.size,
            height: Math.round(item.size * 1.5),
            opacity: reduced ? 0.15 : undefined,
          }}
          initial={reduced ? false : { opacity: 0 }}
          whileInView={reduced ? undefined : { opacity: 0.15 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: i * 0.15 }}
        >
          <motion.div
            style={{ rotate: item.rotate, width: "100%", height: "100%" }}
            animate={
              !reduced && item.animated
                ? { rotate: [item.rotate - 6, item.rotate + 6] }
                : undefined
            }
            transition={{
              duration: 4 + i * 0.5,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "mirror",
              delay: 0.8 + i * 0.2,
            }}
          >
            <OliveSvg />
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
