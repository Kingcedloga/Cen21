"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { LoaderGraphic } from "@/components/brand/LoaderGraphic";
import { markNavigated, markSiteReady } from "@/lib/site-ready";
import { useReducedMotionSafe } from "@/lib/use-media-query";

/**
 * Refonte R0 : le loader s'efface dès que la page est utilisable — composant
 * monté, donc page hydratée — et que les polices sont prêtes, sans attendre
 * le chargement de toutes les images (`window.load`). Attente des polices
 * plafonnée à 1 s ; présence minimale de 350 ms depuis le début de la
 * navigation, pour éviter un flash sur une page déjà en cache.
 *
 * Plafond CSS (globals.css, `[data-site-loader]`) : si le JavaScript tarde
 * (réseau lent, téléphone modeste), le voile s'efface seul environ une
 * seconde après son affichage. Le JavaScript, s'il arrive avant, annule ce
 * fondu (`data-js`) et prend la main.
 */
const FONTS_MAX_WAIT_MS = 1000;
const MIN_VISIBLE_MS = 350;
const CONVERGE_MS = 240;
const FADE_MS = 400;

type Phase = "visible" | "converging" | "fading" | "hidden";

function wait(ms: number) {
  return new Promise<void>((resolve) => window.setTimeout(resolve, Math.max(0, ms)));
}

export function SiteLoader() {
  const t = useTranslations("common");
  const reduced = useReducedMotionSafe();
  const [phase, setPhase] = useState<Phase>("visible");
  const loaderRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const arrivalPath = useRef(pathname);

  // Navigation interne : les titres des pages suivantes rejouent leur révélation.
  useEffect(() => {
    if (pathname !== arrivalPath.current) markNavigated();
  }, [pathname]);

  useEffect(() => {
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const loader = loaderRef.current;

    // Le plafond CSS a déjà commencé à effacer le voile : on le retire.
    if (loader && !loader.hasAttribute("data-js") && parseFloat(getComputedStyle(loader).opacity) < 0.98) {
      void Promise.resolve().then(() => {
        if (cancelled) return;
        setPhase("hidden");
        markSiteReady();
      });
      return () => {
        cancelled = true;
      };
    }
    // Sinon, le JavaScript prend la main sur le fondu CSS.
    if (loader) {
      loader.setAttribute("data-js", "");
      loader.getAnimations().forEach((animation) => animation.cancel());
    }

    const fonts = document.fonts?.ready ?? Promise.resolve();
    void Promise.race([fonts, wait(FONTS_MAX_WAIT_MS)])
      .then(() => wait(MIN_VISIBLE_MS - performance.now()))
      .then(() => {
        if (cancelled) return;
        if (reduced) {
          setPhase("hidden");
          markSiteReady();
          return;
        }
        setPhase("converging");
        timers.push(
          setTimeout(() => {
            setPhase("fading");
            markSiteReady();
            timers.push(setTimeout(() => setPhase("hidden"), FADE_MS));
          }, CONVERGE_MS),
        );
      });

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [reduced]);

  if (phase === "hidden") return null;

  const isExiting = phase === "converging" || phase === "fading";

  return (
    <motion.div
      ref={loaderRef}
      data-site-loader=""
      initial={false}
      animate={{
        opacity: phase === "fading" ? 0 : 1,
      }}
      transition={{
        duration: reduced ? 0 : FADE_MS / 1000,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`fixed inset-0 z-[300] flex items-center justify-center bg-petrol ${
        isExiting ? "pointer-events-none" : ""
      }`}
      role="status"
      aria-live="polite"
      aria-busy={phase === "visible"}
      aria-label={t("loadingSite")}
    >
      <motion.div
        animate={{
          scale: phase === "converging" ? 0.6 : phase === "fading" ? 0.3 : 1,
          opacity: phase === "fading" ? 0 : 1,
        }}
        transition={{
          duration: CONVERGE_MS / 1000,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <LoaderGraphic />
      </motion.div>
    </motion.div>
  );
}
