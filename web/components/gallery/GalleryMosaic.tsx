"use client";

import { motion, useScroll, useTransform, type MotionStyle } from "framer-motion";
import Image from "next/image";

import { keyframes } from "@/lib/motion";
import { useMediaQuery, useReducedMotionSafe } from "@/lib/use-media-query";

import "@/styles/gallery.css";

/** Les photos s'écartent sur les 60 premiers % d'écran défilés. */
const SPREAD = [0, 0.6] as const;

/**
 * Mosaïque du hero de la galerie (refonte R4, version légère de l'explosion
 * de l'accueil) : cinq photos de maisons différentes, d'abord resserrées en
 * éventail, s'écartent au défilement. Une seule valeur pilote tout
 * (`--spread`, 0 → 1), les écarts et rotations de chaque photo sont en CSS.
 * Mobile et reduced motion : mosaïque fixe, déjà écartée.
 */
export function GalleryMosaic({ photos }: { photos: string[] }) {
  const reduced = useReducedMotionSafe();
  const desktop = useMediaQuery("(min-width: 768px)");
  const animated = desktop && !reduced;
  // Le hero ouvre la page : la progression se lit sur le défilement de la page.
  const { scrollY } = useScroll();
  const spread = useTransform(scrollY, (y) =>
    typeof window === "undefined" ? 0 : keyframes(y / window.innerHeight, SPREAD, [0, 1]),
  );

  return (
    <motion.div
      aria-hidden="true"
      className="gallery-mosaic"
      style={animated ? ({ "--spread": spread } as MotionStyle) : undefined}
    >
      {photos.slice(0, 5).map((src, index) => (
        <div key={src} className={`gallery-mosaic__tile gallery-mosaic__tile--${index}`}>
          <Image
            src={src}
            alt=""
            fill
            sizes="(max-width: 767px) 36vw, 25vw"
            // Photo centrale : élément LCP probable.
            loading="eager"
            fetchPriority={index === 2 ? "high" : "auto"}
            className="object-cover"
          />
        </div>
      ))}
    </motion.div>
  );
}
