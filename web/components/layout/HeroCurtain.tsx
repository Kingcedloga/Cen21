import type { CSSProperties, ReactNode } from "react";

import { SectionBlend } from "@/components/layout/SectionBlend";

import "@/styles/hero-curtain.css";

/**
 * Rideau des pages intérieures : le hero reste collé, la section suivante
 * monte par-dessus avec un bord en fondu (même effet que sur l'accueil).
 *
 * - `hero` : un hero portant la classe `hero-curtain__hero` (InnerHero avec
 *   `className="hero-curtain__hero"`), qui mesure son `--hero-fit-top`.
 * - `surface` : couleur de fond de la section qui recouvre (`children`) ;
 *   le bord en fondu part du transparent vers cette couleur.
 * - `heroSurface` : couleur du bas du hero, pour le séparateur fondu affiché
 *   en reduced motion (sans rideau).
 */
export function HeroCurtain({
  hero,
  surface,
  heroSurface = "var(--color-petrol-panel-4)",
  children,
}: {
  hero: ReactNode;
  surface: string;
  heroSurface?: string;
  children: ReactNode;
}) {
  return (
    <div className="hero-curtain" style={{ "--curtain-surface": surface } as CSSProperties}>
      {hero}
      <SectionBlend from={heroSurface} to={surface} />
      <div className="hero-curtain__cover">{children}</div>
    </div>
  );
}
