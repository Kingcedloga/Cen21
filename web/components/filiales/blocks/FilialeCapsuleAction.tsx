"use client";

import { useEffect, useState } from "react";
import { createPortal, flushSync } from "react-dom";

import { useCapsuleSlot } from "@/lib/capsule-slot";

import "@/styles/filiale-blocks.css";

const inViewport = (element: Element) => {
  const rect = element.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < window.innerHeight;
};

/**
 * « Réserver » dans la capsule de navigation (même emplacement que Grille /
 * Liste sur /evenements) : présent une fois le hero quitté, retiré quand le
 * formulaire de réservation est à l'écran. Remplace la barre d'actions
 * mobile des anciennes fiches.
 *
 * Un seul bouton « Réserver » à l'écran : la capsule s'efface aussi tant
 * qu'un autre lien vers la même cible est visible dans la page (CTA d'une
 * section, carte d'événement…).
 *
 * La visibilité est recalculée à chaque image de défilement, de façon
 * synchrone : un IntersectionObserver répond avec du retard pendant un
 * défilement rapide, et les deux boutons restaient affichés ensemble.
 */
export function FilialeCapsuleAction({
  label,
  href = "#reservation",
  heroSelector,
}: {
  label: string;
  href?: string;
  /** Section dont la sortie fait apparaître le bouton (le hero de la fiche). */
  heroSelector: string;
}) {
  const slot = useCapsuleSlot();
  const [shown, setShown] = useState(false);

  useEffect(() => {
    let frame = 0;
    let current = false;

    const update = () => {
      frame = 0;
      const hero = document.querySelector(heroSelector);
      const target = href.startsWith("#") ? document.getElementById(href.slice(1)) : null;
      const peers = Array.from(document.querySelectorAll<HTMLAnchorElement>(`a[href="${href}"]`)).filter(
        (link) => !link.closest("[data-capsule-nav]"),
      );
      const covered = (hero ? inViewport(hero) : true) || (target ? inViewport(target) : false) || peers.some(inViewport);
      const next = !covered;
      if (next === current) return;
      current = next;
      // Rendu immédiat, dans la même image que le défilement : sans cela, React
      // peint un cycle plus tard et les deux boutons restent affichés ensemble.
      flushSync(() => setShown(next));
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [heroSelector, href]);

  if (!slot || !shown) return null;
  return createPortal(
    <a href={href} className="filiale-capsule-action">
      {label}
    </a>,
    slot,
  );
}
