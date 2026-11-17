import type { CSSProperties, ReactNode } from "react";

import "@/styles/hero-curtain.css";

/**
 * Rideau des pages intérieures : le hero reste collé, la section suivante
 * monte par-dessus avec un bord en fondu (même effet que sur l'accueil).
 *
 * - `hero` : un hero portant la classe `hero-curtain__hero` (InnerHero avec
 *   `className="hero-curtain__hero"`), qui mesure son `--hero-fit-top`.
 * - `surface` : couleur de fond de la section qui recouvre (`children`) ;
 *   le bord en fondu part du transparent vers cette couleur.
 *
 * Pages intérieures : bord net, sans fondu ni flou (seul l'accueil garde le
 * bord en fondu).
 */
export function HeroCurtain({
  hero,
  surface,
  children,
}: {
  hero: ReactNode;
  surface: string;
  children: ReactNode;
}) {
  return (
    <div className="hero-curtain hero-curtain--hard" style={{ "--curtain-surface": surface } as CSSProperties}>
      {hero}
      <div className="hero-curtain__cover">{children}</div>
    </div>
  );
}
