import type { CSSProperties } from "react";

/**
 * Séparateur fondu entre deux sections (rapport « Orbix × Cen21 ») : l'effet
 * du rideau hero → « Nos maisons » (long fondu adouci, flou), réutilisable.
 *
 * À placer entre deux sections.
 * - `from` + `to` : espace de transition. Dégradé adouci de `from` (bas de la
 *   section précédente) vers `to` (haut de la suivante), qui déborde en fondu
 *   et en flou dans les marges des deux sections. `to` peut être une couleur
 *   ou un dégradé CSS (lisière non unie, ex. « Leader de la restauration »).
 * - `to` seul : recouvrement. La bande se pose sur le bas de la section
 *   précédente, quelle qu'elle soit, et la fond vers `to` (pied de page, dont
 *   la section précédente change selon la page).
 *
 * Décoratif (`aria-hidden`), sans effet sur les clics. Styles : globals.css.
 */
export function SectionBlend({ from, to }: { from?: string; to: string }) {
  return (
    <div
      aria-hidden="true"
      className={from ? "section-blend" : "section-blend section-blend--overlay"}
      style={{ "--blend-from": from, "--blend-to": to } as CSSProperties}
    />
  );
}
