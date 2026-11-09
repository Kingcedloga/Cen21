"use client";

import { useEffect, useState } from "react";

export type Surface = "dark" | "light";

function depthOf(element: Element) {
  let depth = 0;
  for (let node = element.parentElement; node; node = node.parentElement) depth += 1;
  return depth;
}

/**
 * Surface (`data-surface="dark" | "light"`) visible sous une ligne horizontale
 * placée à `offsetFromBottom` px du bas de l'écran — la hauteur de la capsule
 * de navigation. Sert à inverser ses couleurs selon le fond.
 *
 * Orbix interroge `elementsFromPoint` environ dix fois par seconde. Ici, un
 * IntersectionObserver surveille une bande de 1 px : aucun calcul pendant le
 * scroll. Si plusieurs surfaces se chevauchent, la plus imbriquée l'emporte.
 * Les sections ajoutées ou retirées (changement de page) sont suivies.
 */
export function useSurfaceContrast(offsetFromBottom = 64, fallback: Surface = "dark"): Surface {
  const [surface, setSurface] = useState<Surface>(fallback);

  useEffect(() => {
    const hits = new Set<Element>();
    const depths = new WeakMap<Element, number>();
    let observer: IntersectionObserver | null = null;
    let builtForHeight = 0;
    let frame = 0;

    const pick = () => {
      let best: Element | null = null;
      let bestDepth = -1;
      hits.forEach((element) => {
        const depth = depths.get(element) ?? 0;
        if (depth > bestDepth) {
          best = element;
          bestDepth = depth;
        }
      });
      const value = (best as Element | null)?.getAttribute("data-surface");
      setSurface(value === "light" ? "light" : value === "dark" ? "dark" : fallback);
    };

    const observeAll = () => {
      document.querySelectorAll("[data-surface]").forEach((element) => {
        if (!depths.has(element)) depths.set(element, depthOf(element));
        observer?.observe(element);
      });
    };

    const build = () => {
      observer?.disconnect();
      hits.clear();
      const viewport = window.innerHeight;
      builtForHeight = viewport;
      const line = Math.max(0, viewport - offsetFromBottom);
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) hits.add(entry.target);
            else hits.delete(entry.target);
          });
          pick();
        },
        { rootMargin: `${-line}px 0px ${-(viewport - line - 1)}px 0px`, threshold: 0 },
      );
      observeAll();
    };

    const mutations = new MutationObserver(() => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        hits.forEach((element) => {
          if (!element.isConnected) {
            hits.delete(element);
            observer?.unobserve(element);
          }
        });
        observeAll();
        pick();
      });
    });

    // La hauteur d'écran peut changer sans événement `resize` (barre d'adresse
    // mobile, fenêtre de mise en page élargie par un débordement) : on la
    // compare à chaque scroll, ce qui ne coûte qu'une lecture.
    const rebuildIfViewportChanged = () => {
      if (window.innerHeight !== builtForHeight) build();
    };

    build();
    mutations.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("resize", build);
    window.addEventListener("scroll", rebuildIfViewportChanged, { passive: true });
    window.visualViewport?.addEventListener("resize", rebuildIfViewportChanged);

    return () => {
      observer?.disconnect();
      mutations.disconnect();
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", build);
      window.removeEventListener("scroll", rebuildIfViewportChanged);
      window.visualViewport?.removeEventListener("resize", rebuildIfViewportChanged);
    };
  }, [offsetFromBottom, fallback]);

  return surface;
}
