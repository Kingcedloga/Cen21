"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { SPRING } from "@/lib/motion";
import { FINE_POINTER_QUERY, useMediaQuery, useReducedMotionSafe } from "@/lib/use-media-query";

import "@/styles/filiale-blocks.css";

const ROTATE = [-2.5, 2, -1.5, 2.5, -2, 1.5] as const;

/**
 * Spécialités en pastilles inclinées (manifeste de l'accueil, Orbix :
 * pastilles déplaçables) : à la souris, on les déplace, elles reviennent
 * avec un rebond élastique. Au doigt et en reduced motion : pastilles fixes.
 */
export function FilialeSpecialties({
  items,
  heading,
}: {
  items: { title: string; description?: string }[];
  /** Titre de section, si la maison en a un (sinon la liste seule, étiquetée). */
  heading?: { eyebrow: string; title: string; description?: string };
}) {
  const t = useTranslations("filiale");
  const finePointer = useMediaQuery(FINE_POINTER_QUERY);
  const reduced = useReducedMotionSafe();
  const draggable = finePointer && !reduced;
  if (items.length === 0) return null;

  return (
    <div className="filiale-specialties">
      {heading && (
        <SectionHeading
          look="editorial"
          eyebrow={heading.eyebrow}
          title={heading.title}
          description={heading.description}
          titleAs="h2"
          titleId="filiale-specialties-title"
          align="left"
          className="mb-6! max-w-2xl"
        />
      )}
      <ul aria-label={t("specialtiesLabel")} className="filiale-specialties__list">
        {items.map((item, index) => (
          <li key={item.title}>
            <motion.div
              drag={draggable}
              dragSnapToOrigin
              dragElastic={0.4}
              dragTransition={{ bounceStiffness: SPRING.elastic.stiffness, bounceDamping: SPRING.elastic.damping }}
              whileDrag={{ scale: 1.08 }}
              style={{ rotate: ROTATE[index % ROTATE.length] }}
              className={`filiale-pill ${draggable ? "cursor-grab active:cursor-grabbing" : ""}`}
            >
              <p className="filiale-pill__title title-section">{item.title}</p>
              {item.description && <p className="filiale-pill__text">{item.description}</p>}
            </motion.div>
          </li>
        ))}
      </ul>
      {draggable && (
        <p aria-hidden="true" className="filiale-specialties__hint">
          {t("specialtiesHint")}
        </p>
      )}
    </div>
  );
}
