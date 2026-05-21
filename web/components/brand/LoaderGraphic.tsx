"use client";

import Image from "next/image";
import { useReducedMotion } from "framer-motion";

/** Wordmark loader — `/public/brand/cen21-loader.png` (1024×576). */
const LOGO_ASPECT = 1024 / 576;

type LoaderGraphicProps = {
  className?: string;
  /** Largeur max du visuel (px). */
  maxWidth?: number;
};

export function LoaderGraphic({ className = "", maxWidth = 320 }: LoaderGraphicProps) {
  const reduced = useReducedMotion();
  const width = maxWidth;
  const height = Math.round(width / LOGO_ASPECT);

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {!reduced && (
        <>
          <span
            className="pointer-events-none absolute -inset-4 rounded-xl border-2 border-gold/20 md:-inset-5"
            aria-hidden
          />
          <span
            className="pointer-events-none absolute -inset-4 rounded-xl border-2 border-transparent border-t-gold border-r-gold/45 animate-site-loader-spin md:-inset-5"
            aria-hidden
          />
        </>
      )}
      <Image
        src="/brand/cen21-loader.png"
        alt=""
        width={width}
        height={height}
        priority
        className={`relative z-10 h-auto w-full max-w-[min(72vw,20rem)] object-contain md:max-w-[20rem] ${
          reduced ? "" : "animate-site-loader-pulse"
        }`}
        style={{ maxWidth }}
      />
    </div>
  );
}
