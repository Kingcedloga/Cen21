"use client";

import { useReducedMotion } from "framer-motion";

type LoaderGraphicProps = {
  className?: string;
  /** Taille du visuel (px). */
  size?: number;
};

const FILTER_ID = "cen21-loader-goo";

export function LoaderGraphic({ className = "", size = 88 }: LoaderGraphicProps) {
  const reduced = useReducedMotion();

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <svg className="absolute h-0 w-0" aria-hidden>
        <defs>
          <filter id={FILTER_ID}>
            <feGaussianBlur in="SourceGraphic" stdDeviation="9" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      <div
        className={`loader-blobs relative h-full w-full ${reduced ? "loader-blobs--static" : ""}`}
        style={{ filter: `url(#${FILTER_ID})` }}
      >
        <span className="loader-blob loader-blob--gold" />
        <span className="loader-blob loader-blob--cyan" />
        <span className="loader-blob loader-blob--magenta" />
      </div>
    </div>
  );
}
