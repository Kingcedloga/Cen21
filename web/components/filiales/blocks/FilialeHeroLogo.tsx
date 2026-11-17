import type { CSSProperties } from "react";

import "@/styles/filiale-blocks.css";

export type HeroLogo = {
  /** Logo clair sur transparent (public/filiales/logos). */
  src: string;
  /** Dimensions du fichier, en pixels. */
  size: readonly [number, number];
  /**
   * Zone visible du logo dans le fichier (gauche, haut, droite, bas, en
   * pixels) : les marges transparentes sont rognées, le logo s'aligne sur
   * la colonne de texte.
   */
  box: readonly [number, number, number, number];
  /** Largeur affichée de la zone visible, ex. « clamp(14rem, 30vw, 26rem) ». */
  width: string;
  /** Couleurs d'origine du fichier au lieu de la teinte ivoire (logo en couleurs). */
  colored?: boolean;
};

const pct = (value: number) => `${(value * 100).toFixed(3)}%`;

/**
 * Le logo rogné à sa zone visible et teinté à la couleur du texte (masque
 * CSS, comme FilialeMark). Décoratif : le nom est porté par le titre.
 */
export function HeroLogoMark({ logo }: { logo: HeroLogo }) {
  const [fileW, fileH] = logo.size;
  const [left, top, right, bottom] = logo.box;
  const boxW = right - left;
  const boxH = bottom - top;
  // Position en % : p · (cadre − image) = −décalage  →  p = décalage / (image − cadre).
  const posX = fileW === boxW ? 0 : left / (fileW - boxW);
  const posY = fileH === boxH ? 0 : top / (fileH - boxH);
  return (
    <span
      aria-hidden="true"
      className={`filiale-hero-logo__mark ${logo.colored ? "filiale-hero-logo__mark--colored" : ""}`}
      style={
        {
          "--mark-src": `url("${encodeURI(logo.src)}")`,
          "--mark-ratio": String(boxW / boxH),
          "--mark-width": logo.width,
          "--mark-size": `${pct(fileW / boxW)} ${pct(fileH / boxH)}`,
          "--mark-pos": `${pct(posX)} ${pct(posY)}`,
        } as CSSProperties
      }
    />
  );
}

/**
 * Titre d'une fiche sous forme de logo : le logo de la maison en grand,
 * teinté à la couleur du titre, et son nom en texte réservé aux lecteurs
 * d'écran et aux moteurs de recherche (le <h1> garde son contenu).
 */
export function FilialeHeroLogo({
  id,
  name,
  logo,
  className = "",
}: {
  id: string;
  name: string;
  logo: HeroLogo;
  className?: string;
}) {
  return (
    <h1 id={id} className={`filiale-hero-logo ${className}`}>
      <span className="sr-only">{name}</span>
      <HeroLogoMark logo={logo} />
    </h1>
  );
}
