"use client";

import Image from "next/image";

import { useReducedMotionSafe } from "@/lib/use-media-query";

type LoaderGraphicProps = {
  className?: string;
  /** Largeur du logo (px). */
  size?: number;
};

/** Dimensions du fichier `public/brand/cen21-wordmark.png` (fond transparent). */
const WORDMARK = { width: 318, height: 125 };

/**
 * Loader du site : le logo CEN21 (mot-symbole et « Hospitality & Lifestyle »)
 * qui respire, un reflet balayant les lettres (globals.css, `.loader-logo`).
 * Le fond reste celui du voile (pétrole, ou la couleur de la maison sur une
 * fiche). Reduced motion : logo fixe.
 */
export function LoaderGraphic({ className = "", size = 220 }: LoaderGraphicProps) {
  // Sûr pour l'hydratation (faux côté serveur et pendant l'hydratation) ; la
  // CSS @media fixe le visuel avant.
  const reduced = useReducedMotionSafe();

  return (
    <div className={`loader-logo ${reduced ? "loader-logo--static" : ""} ${className}`} style={{ width: size }} aria-hidden>
      <Image
        src="/brand/cen21-wordmark.png"
        alt=""
        width={WORDMARK.width}
        height={WORDMARK.height}
        sizes={`${size}px`}
        loading="eager"
        className="loader-logo__img"
      />
      <span className="loader-logo__sheen" />
    </div>
  );
}
