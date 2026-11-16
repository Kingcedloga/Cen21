"use client";

import { useScroll } from "framer-motion";
import { useRef } from "react";

import { useReducedMotionSafe } from "@/lib/use-media-query";

import { OliveBranch } from "./OliveBranch";

import "@/styles/olive.css";

/**
 * La maison en une phrase, sur la crème de la charte, et le rameau
 * d'olivier qui se compose à côté au fil du défilement : la tige se trace,
 * les feuilles tombent du haut de la section et se posent sur elle.
 * Reduced motion : rameau complet.
 */
export function OliveManifesto({ label, title, text }: { label: string; title: string; text: string }) {
  const reduced = useReducedMotionSafe();
  // Progression liée au rameau lui-même (et non à la section) : sur mobile,
  // où il passe sous le texte, la chute des feuilles reste à l'écran.
  const branchRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: branchRef, offset: ["start 0.95", "end 0.55"] });

  return (
    <section aria-labelledby="olive-manifesto-title" data-surface="dark" className="olive-manifesto">
      <div className="olive-manifesto__inner">
        <div className="olive-manifesto__text">
          <p className="olive-eyebrow">{label}</p>
          <h2 id="olive-manifesto-title" className="olive-title">
            {title}
          </h2>
          <p className="olive-manifesto__statement">{text}</p>
        </div>
        <div ref={branchRef} className="olive-manifesto__branch">
          <OliveBranch progress={scrollYProgress} still={reduced} />
        </div>
      </div>
    </section>
  );
}
