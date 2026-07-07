"use client";

import Image from "next/image";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";

import { AnimateIn } from "@/components/ui/AnimateIn";
import { Link } from "@/i18n/navigation";
import { Check } from "@/lib/icons";
import { DURATION_S, EASE, STAGGER, defaultScrollViewport } from "@/lib/motion";
import type { SubsidiaryStorySection as SubsidiaryStorySectionContent } from "@/lib/types";

import "@/styles/pinkberry-story-section.css";

export function PinkberryStorySection({
  content,
  backgroundImage,
  productImage,
  name,
}: {
  content: SubsidiaryStorySectionContent;
  backgroundImage: string;
  productImage: string;
  name: string;
}) {
  const reduced = useReducedMotion();
  const photoFrameRef = useRef<HTMLDivElement>(null);
  const photoInView = useInView(photoFrameRef, { once: true, margin: "-10% 0px" });

  const columnMotion = (i: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          viewport: defaultScrollViewport,
          transition: {
            duration: DURATION_S.luxe,
            ease: EASE.luxury,
            delay: i * STAGGER.max,
          },
        };

  return (
    <section className="pinkberry-story" aria-labelledby="pinkberry-story-title">
      <Image
        src={backgroundImage}
        alt=""
        fill
        aria-hidden="true"
        className="pinkberry-story__bg-photo"
        sizes="100vw"
      />

      <AnimateIn className="pinkberry-story__header">
        <p className="pinkberry-story__eyebrow">{content.eyebrow}</p>
        <h2 id="pinkberry-story-title" className="pinkberry-story__title">
          {content.title}
        </h2>
      </AnimateIn>

      <div className="pinkberry-story__grid">
        <motion.div {...columnMotion(0)}>
          <h3 className="pinkberry-story__col-title">{content.aboutTitle}</h3>
          <p className="pinkberry-story__col-text">{content.aboutText}</p>
          <p className="pinkberry-story__signature">{content.signatureName}</p>
        </motion.div>

        <div className="pinkberry-story__photo-wrap">
          <span className="pinkberry-story__photo-circle" aria-hidden="true" />
          <div className="pinkberry-story__photo-frame" ref={photoFrameRef}>
            <Image
              src={productImage}
              alt={name}
              fill
              className={`pinkberry-story__photo${!reduced && photoInView ? " pinkberry-photo-fadeoutup" : ""}`}
              sizes="(max-width: 899px) 80vw, 24rem"
            />
          </div>
        </div>

        <motion.div {...columnMotion(2)}>
          <h3 className="pinkberry-story__col-title">{content.overviewTitle}</h3>
          <p className="pinkberry-story__col-text">{content.overviewText}</p>
          <ul className="pinkberry-story__list">
            {content.highlights.map((item) => (
              <li key={item} className="pinkberry-story__list-item">
                <Check size={16} className="pinkberry-story__list-icon" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      <div className="pinkberry-story__cta-wrap">
        <Link href="/contact" className="pinkberry-story__cta">
          {content.ctaLabel}
        </Link>
      </div>
    </section>
  );
}
