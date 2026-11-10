"use client";

import { useTransform } from "framer-motion";

import { SpectrumText } from "@/components/motion/SpectrumText";
import { StickyTrack, useStickyTrack } from "@/components/motion/StickyTrack";

import "@/styles/about.css";

function StoryStage({ eyebrow, title, statement }: { eyebrow: string; title: string; statement: string }) {
  const { progress, isStatic } = useStickyTrack();
  const textProgress = useTransform(progress, [0.06, 0.78], [0, 1]);

  return (
    <div className={`about-story ${isStatic ? "about-story--static" : ""}`}>
      <div className="mx-auto w-full max-w-5xl">
        <p className="about-story__eyebrow">{eyebrow}</p>
        <h2 id="about-story-title" className="about-story__title">
          {title}
        </h2>
        <SpectrumText
          as="p"
          text={statement}
          progress={isStatic ? undefined : textProgress}
          mode="scroll"
          className="about-story__statement title-section"
        />
      </div>
    </div>
  );
}

/**
 * Histoire épinglée (refonte R2, même mécanique que le manifeste de
 * l'accueil, Orbix : section « about » épinglée) : sur fond sable, l'histoire
 * du groupe se révèle lettre à lettre au fil du défilement.
 * Mobile, reduced motion ou écran trop bas : section ordinaire, révélation
 * au défilement (statique en reduced motion).
 */
export function AboutStory(props: { eyebrow: string; title: string; statement: string }) {
  return (
    <StickyTrack
      lengthVh={220}
      staticBelow="md"
      surface="light"
      ariaLabelledby="about-story-title"
      className="bg-ivory"
    >
      <StoryStage {...props} />
    </StickyTrack>
  );
}
