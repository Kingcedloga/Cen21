import type { CSSProperties } from "react";

import "@/styles/motion-primitives.css";

/**
 * Texte à lettres roulantes (liens du footer d'Orbix) : au survol ou au focus
 * clavier du lien / bouton parent, chaque lettre monte d'une ligne et une copie
 * identique prend sa place, avec 15 ms de décalage par lettre (0,26 s,
 * power2.inOut). Pur CSS, sans JavaScript ; inactif sur écran tactile et en
 * reduced motion.
 *
 * Accessibilité : le texte lisible est une copie masquée visuellement (`sr-only`),
 * les lettres sont `aria-hidden`. Un `aria-label` sur un <span> n'étant pas
 * annoncé par les lecteurs d'écran, la copie masquée est le choix robuste quel
 * que soit le parent (Link, <a>, <button>).
 */
export function RollingText({ text, className = "" }: { text: string; className?: string }) {
  const characters = Array.from(text.normalize("NFC"));

  const line = (key: string) => (
    <span key={key} className="rolling-text__line">
      {characters.map((character, index) => (
        <span
          key={index}
          className="rolling-text__char"
          style={{ "--i": index } as CSSProperties}
        >
          {character === " " ? " " : character}
        </span>
      ))}
    </span>
  );

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span className="rolling-text" aria-hidden="true">
        {line("primary")}
        {line("clone")}
      </span>
    </span>
  );
}
