import type { CSSProperties } from "react";

import "@/styles/filiale-blocks.css";

/**
 * Logo de la maison teinté à la couleur du texte courant (masque CSS) : le
 * même fichier (logo clair sur transparent) sert sur fond sombre et sur fond
 * clair. Décoratif : le nom de la maison est écrit à côté.
 */
export function FilialeMark({ src, ratio, width = "8rem" }: { src: string; ratio: number; width?: string }) {
  return (
    <span
      aria-hidden="true"
      className="filiale-mark"
      style={{ "--mark-src": `url("${src}")`, "--mark-ratio": String(ratio), "--mark-width": width } as CSSProperties}
    />
  );
}
