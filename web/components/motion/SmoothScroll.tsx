"use client";

import { cancelFrame, frame, type FrameData } from "framer-motion";
import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";

import { LENIS_OPTIONS } from "@/lib/motion";

/**
 * Défilement lissé (Lenis) — desktop uniquement.
 *
 * Actif seulement si le pointeur principal est fin (souris, trackpad), si la
 * fenêtre fait au moins 768 px et si l'utilisateur n'a pas demandé de réduire
 * les animations. Sur mobile et tablette tactiles, le défilement reste natif.
 *
 * - Lenis tourne sur l'horloge de Framer Motion (`frame.update`) : le scroll et
 *   les animations liées au scroll avancent dans la même frame.
 * - Les modales du projet bloquent le scroll via `body.style.overflow`. Lenis
 *   défile par programme et passerait outre : il est stoppé tant que ce verrou
 *   est posé, et ignore la molette dans les `role="dialog"`.
 * - Les ancres internes (`#…`) défilent via Lenis, respectent le
 *   `scroll-margin-top` de la cible, puis lui donnent le focus si elle peut
 *   le recevoir (lien d'évitement vers #main-content).
 * - Lenis borne le défilement à une limite qu'il ne recalcule que quand
 *   `<html>` change de taille. Ici `<html>` est en `h-full` : sa boîte reste à
 *   la hauteur de l'écran quelle que soit la longueur de la page. La limite
 *   resterait donc celle du premier rendu (fallback `loading.tsx`, page
 *   précédente après une navigation client) et le scroll s'arrêterait en
 *   pleine page. On observe `<body>`, qui grandit avec le contenu.
 *
 * Seul point d'entrée de Lenis dans le projet : lire l'instance avec `useLenis()`.
 */

const ENABLE_QUERY = "(min-width: 768px) and (hover: hover) and (pointer: fine)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

let current: Lenis | null = null;
const listeners = new Set<() => void>();

function setCurrent(next: Lenis | null) {
  current = next;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Instance Lenis active, ou `null` (mobile tactile, reduced motion, rendu serveur). */
export function useLenis(): Lenis | null {
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => null,
  );
}

/** expo.out — même courbe que les ancres d'Orbix. */
function expoOut(t: number) {
  return Math.min(1, 1.001 - Math.pow(2, -10 * t));
}

function isMac() {
  return /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);
}

/** Laisse le défilement natif aux modales (Lightbox, vidéos, galeries). */
function isDialog(node: HTMLElement) {
  return node.getAttribute("role") === "dialog" || node.getAttribute("aria-modal") === "true";
}

function isScrollLocked() {
  return document.body.style.overflow === "hidden";
}

function scrollToAnchor(lenis: Lenis, event: MouseEvent) {
  if (
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return;
  }

  const anchor = event.target instanceof Element ? event.target.closest("a[href^='#']") : null;
  if (!(anchor instanceof HTMLAnchorElement) || anchor.target) return;

  const hash = anchor.getAttribute("href") ?? "";
  if (hash.length < 2) return;

  let target: HTMLElement | null = null;
  try {
    target = document.getElementById(decodeURIComponent(hash.slice(1)));
  } catch {
    return;
  }
  if (!target) return;

  // Écouté en phase de capture : le `Link` de Next voit `defaultPrevented` et
  // n'effectue pas son propre saut, instantané quand Lenis est actif.
  event.preventDefault();
  if (window.location.hash !== hash) {
    window.history.pushState(window.history.state, "", hash);
  }
  const margin = Number.parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
  lenis.scrollTo(target, {
    offset: -margin,
    duration: LENIS_OPTIONS.anchorDuration,
    easing: expoOut,
  });
  if (target.tabIndex >= 0 || target.hasAttribute("tabindex")) {
    target.focus({ preventScroll: true });
  }
}

export function SmoothScroll() {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    const enableQuery = window.matchMedia(ENABLE_QUERY);
    const reducedQuery = window.matchMedia(REDUCED_MOTION_QUERY);
    let instance: Lenis | null = null;
    let lockObserver: MutationObserver | null = null;
    let contentObserver: ResizeObserver | null = null;

    const tick = ({ timestamp }: FrameData) => {
      instance?.raf(timestamp);
    };

    const onClick = (event: MouseEvent) => {
      if (instance) scrollToAnchor(instance, event);
    };

    const syncScrollLock = () => {
      if (!instance) return;
      if (isScrollLocked()) instance.stop();
      else instance.start();
    };

    const start = () => {
      instance = new Lenis({
        lerp: isMac() ? LENIS_OPTIONS.lerp.mac : LENIS_OPTIONS.lerp.other,
        smoothWheel: true,
        syncTouch: false,
        autoRaf: false,
        allowNestedScroll: true,
        prevent: isDialog,
      });
      frame.update(tick, true);
      window.addEventListener("click", onClick, true);
      lockObserver = new MutationObserver(syncScrollLock);
      lockObserver.observe(document.body, { attributes: true, attributeFilter: ["style"] });
      // `dimensions.resize()` et non `resize()` : ce dernier coupe l'inertie en cours.
      contentObserver = new ResizeObserver(() => instance?.dimensions.resize());
      contentObserver.observe(document.body);
      syncScrollLock();
      setCurrent(instance);
    };

    const stop = () => {
      if (!instance) return;
      cancelFrame(tick);
      window.removeEventListener("click", onClick, true);
      lockObserver?.disconnect();
      lockObserver = null;
      contentObserver?.disconnect();
      contentObserver = null;
      instance.destroy();
      instance = null;
      setCurrent(null);
    };

    const update = () => {
      const shouldRun = enableQuery.matches && !reducedQuery.matches;
      if (shouldRun && !instance) start();
      else if (!shouldRun) stop();
    };

    update();
    enableQuery.addEventListener("change", update);
    reducedQuery.addEventListener("change", update);

    return () => {
      enableQuery.removeEventListener("change", update);
      reducedQuery.removeEventListener("change", update);
      stop();
    };
  }, []);

  // Changement de route : Next.js a déjà replacé la fenêtre (haut de page ou
  // ancre). On aligne Lenis sur cette position pour couper l'inertie restante.
  useEffect(() => {
    lenis?.scrollTo(window.scrollY, { immediate: true, force: true });
  }, [lenis, pathname]);

  return null;
}
