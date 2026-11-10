"use client";

import { motion } from "framer-motion";
import { useId, useState, type ReactNode } from "react";

import { EASE } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/use-media-query";

import "@/styles/contact-extras.css";

export type FaqItem = { id: string; question: string; answer: ReactNode };

/**
 * Accordéon de la FAQ (Orbix : première question ouverte, hauteur animée en
 * 400 ms). Une seule réponse ouverte à la fois. Chaque réponse reste dans le
 * DOM : repliée, elle est `inert` (ni focus, ni lecture d'écran).
 */
export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<string | null>(items[0]?.id ?? null);
  const reduced = useReducedMotionSafe();
  const baseId = useId();

  return (
    <ul className="faq-list">
      {items.map((item) => {
        const expanded = open === item.id;
        const questionId = `${baseId}-${item.id}-q`;
        const answerId = `${baseId}-${item.id}-a`;
        return (
          <li key={item.id} className="faq-item">
            <h3>
              <button
                type="button"
                id={questionId}
                aria-expanded={expanded}
                aria-controls={answerId}
                onClick={() => setOpen(expanded ? null : item.id)}
                className="faq-item__question"
              >
                <span>{item.question}</span>
                <span aria-hidden="true" className="faq-item__icon" />
              </button>
            </h3>
            <motion.div
              id={answerId}
              role="region"
              aria-labelledby={questionId}
              inert={!expanded}
              className="faq-item__panel"
              initial={false}
              animate={{ height: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }}
              transition={{ duration: reduced ? 0 : 0.4, ease: EASE.luxury }}
            >
              <div className="faq-item__answer">{item.answer}</div>
            </motion.div>
          </li>
        );
      })}
    </ul>
  );
}
