"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { useCapsuleSlot } from "@/lib/capsule-slot";

import "@/styles/filiale-blocks.css";

/**
 * « Réserver » dans la capsule de navigation (même emplacement que Grille /
 * Liste sur /evenements) : présent une fois le hero quitté, retiré quand le
 * formulaire de réservation est à l'écran. Remplace la barre d'actions
 * mobile des anciennes fiches.
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
  const [heroVisible, setHeroVisible] = useState(true);
  const [targetVisible, setTargetVisible] = useState(false);

  useEffect(() => {
    const hero = document.querySelector(heroSelector);
    const target = href.startsWith("#") ? document.getElementById(href.slice(1)) : null;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === hero) setHeroVisible(entry.isIntersecting);
        if (entry.target === target) setTargetVisible(entry.isIntersecting);
      }
    });
    if (hero) observer.observe(hero);
    if (target) observer.observe(target);
    return () => observer.disconnect();
  }, [heroSelector, href]);

  if (!slot || heroVisible || targetVisible) return null;
  return createPortal(
    <a href={href} className="filiale-capsule-action">
      {label}
    </a>,
    slot,
  );
}
