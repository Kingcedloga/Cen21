"use client";

import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { DURATION_S, EASE } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/use-media-query";

import "@/styles/filiale-blocks.css";

type ChapterImage = { src: string; alt: string };

export type FilialeChapterItem = {
  id: string;
  titleId: string;
  /** « La table », « Le bar » : étiquette du chapitre, avec son numéro. */
  label: string;
  title: string;
  paragraphs: string[];
  highlights?: string[];
  image: ChapterImage;
  inset?: ChapterImage;
  actions?: ReactNode;
};

const pad = (n: number) => String(n).padStart(2, "0");
const OPEN = "inset(0% 0% 0% 0%)";
const SHUT = "inset(100% 0% 0% 0%)";

/**
 * Chapitres d'une maison en diptyque épinglé (Orbix : récit au défilement) :
 * la photo reste épinglée pendant que les chapitres défilent ; quand un
 * chapitre passe au milieu de l'écran, sa photo monte par-dessus la
 * précédente (rideau), son médaillon suit, le compteur change.
 * Dès 1024 px : photo à gauche, textes à droite. En dessous : photo épinglée
 * en haut de l'écran, les textes glissent dessous (mêmes animations).
 * Reduced motion : les photos changent sans transition.
 */
export function FilialeChapters({ chapters, highlightsLabel }: { chapters: FilialeChapterItem[]; highlightsLabel: string }) {
  const reduced = useReducedMotionSafe();
  const [active, setActive] = useState(0);
  const current = chapters[active];
  const curtain = { duration: reduced ? 0 : DURATION_S.cinematic, ease: EASE.cinematic };

  return (
    <div className="filiale-chapters">
      <div className="filiale-chapters__media">
        <div className="filiale-chapters__sticky">
          <div className="filiale-chapters__stage">
            <div className="filiale-chapters__frame">
              {chapters.map((chapter, index) => (
                <motion.div
                  key={chapter.id}
                  className="filiale-chapters__slide"
                  style={{ zIndex: index }}
                  initial={false}
                  animate={{ clipPath: index <= active ? OPEN : SHUT }}
                  transition={curtain}
                >
                  <motion.div
                    className="absolute inset-0"
                    initial={false}
                    animate={{ scale: index === active || reduced ? 1 : 1.08 }}
                    transition={{ duration: reduced ? 0 : DURATION_S.cinematic * 1.4, ease: EASE.luxury }}
                  >
                    <Image src={chapter.image.src} alt={chapter.image.alt} fill sizes="(min-width: 1024px) 56vw, 92vw" className="object-cover" />
                  </motion.div>
                </motion.div>
              ))}
              <p className="filiale-chapters__counter" aria-hidden="true">
                <span className="filiale-chapters__counter-num">{pad(active + 1)}</span>
                <span className="filiale-chapters__counter-total">/ {pad(chapters.length)}</span>
                <motion.span
                  key={current.id}
                  className="filiale-chapters__counter-label"
                  initial={reduced ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: reduced ? 0 : DURATION_S.base, ease: EASE.luxury }}
                >
                  {current.label}
                </motion.span>
              </p>
            </div>

            {chapters.some((chapter) => chapter.inset) && (
              <div className="filiale-chapters__inset">
                {chapters.map((chapter, index) =>
                  chapter.inset ? (
                    <motion.div
                      key={chapter.id}
                      className="filiale-chapters__slide"
                      style={{ zIndex: index }}
                      initial={false}
                      animate={{ clipPath: index <= active ? OPEN : SHUT }}
                      transition={{ ...curtain, delay: reduced ? 0 : 0.12 }}
                    >
                      <Image src={chapter.inset.src} alt={chapter.inset.alt} fill sizes="(min-width: 1024px) 18vw, 26vw" className="object-cover" />
                    </motion.div>
                  ) : null,
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="filiale-chapters__list">
        {chapters.map((chapter, index) => (
          <ChapterText key={chapter.id} chapter={chapter} index={index} highlightsLabel={highlightsLabel} onActive={setActive} />
        ))}
      </div>
    </div>
  );
}

function ChapterText({
  chapter,
  index,
  highlightsLabel,
  onActive,
}: {
  chapter: FilialeChapterItem;
  index: number;
  highlightsLabel: string;
  onActive: (index: number) => void;
}) {
  const ref = useRef<HTMLElement>(null);
  // Bande au milieu de l'écran : le chapitre qui la traverse est le chapitre courant.
  const centered = useInView(ref, { margin: "-48% 0px -48% 0px" });
  useEffect(() => {
    if (centered) onActive(index);
  }, [centered, index, onActive]);

  const [lead, ...rest] = chapter.paragraphs;

  return (
    <article ref={ref} aria-labelledby={chapter.titleId} className="filiale-chapters__item">
      <p className="filiale-chapters__kicker">
        <span className="filiale-chapters__kicker-num">{pad(index + 1)}</span>
        <span aria-hidden="true" className="filiale-chapters__kicker-line" />
        <span>{chapter.label}</span>
      </p>
      <SectionHeading look="editorial" title={chapter.title} titleAs="h2" titleId={chapter.titleId} align="left" className="mb-6!" />

      {lead && <p className="filiale-chapters__lead">{lead}</p>}
      {rest.map((paragraph) => (
        <p key={paragraph.slice(0, 40)} className="filiale-chapters__paragraph">
          {paragraph}
        </p>
      ))}

      {chapter.highlights && chapter.highlights.length > 0 && (
        <div className="filiale-chapters__highlights">
          <ul aria-label={highlightsLabel}>
            {chapter.highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {chapter.actions && <div className="filiale-chapters__actions">{chapter.actions}</div>}
    </article>
  );
}
