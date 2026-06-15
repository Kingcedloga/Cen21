"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";

import { Button } from "@/components/ui/Button";
import { cormorant } from "@/lib/fonts";
import {
  DURATION_S,
  EASE,
  fadeUpTransition,
  fadeUpVariants,
} from "@/lib/motion";
import type { SubsidiaryIntroSection } from "@/lib/types";

import "@/styles/k-lounge-intro-section.css";

type Props = {
  content: SubsidiaryIntroSection;
};

const slideFromLeftVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -72,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: DURATION_S.grand,
      ease: EASE.luxury,
      delay: 0.12,
    },
  },
};

const slideFromRightVariants: Variants = {
  hidden: {
    opacity: 0,
    x: 72,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: DURATION_S.grand,
      ease: EASE.luxury,
    },
  },
};

const viewport = {
  once: true,
  margin: "-8% 0px -6% 0px",
  amount: 0.3,
} as const;

export function KLoungeIntroSection({ content }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion() ?? false;
  const { title, paragraphs, cta, primaryImage, secondaryImage } = content;
  const ctaExternal = cta.href.startsWith("http");

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const primaryParallaxY = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? ["0%", "0%"] : ["-6%", "6%"],
  );

  const insetParallaxY = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? ["0%", "0%"] : ["4%", "-4%"],
  );

  const contentMotion = reduced
    ? {}
    : {
        initial: "hidden" as const,
        whileInView: "visible" as const,
        viewport,
        variants: fadeUpVariants,
        transition: fadeUpTransition,
      };

  const primaryFrameMotion = reduced
    ? {}
    : {
        initial: "hidden" as const,
        whileInView: "visible" as const,
        viewport,
        variants: slideFromRightVariants,
      };

  const insetMotion = reduced
    ? {}
    : {
        initial: "hidden" as const,
        whileInView: "visible" as const,
        viewport,
        variants: slideFromLeftVariants,
      };

  return (
    <section
      ref={sectionRef}
      className={`klounge-intro ${cormorant.variable}`}
      aria-labelledby="klounge-intro-title"
    >
      <div className="klounge-intro__inner">
        <div className="klounge-intro__grid">
          <div className="klounge-intro__content">
            <motion.div className="klounge-intro__copy" {...contentMotion}>
              <h2 id="klounge-intro-title" className="klounge-intro__title">
                {title}
              </h2>

              <div className="klounge-intro__body">
                {paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              <Button
                href={cta.href}
                variant="secondary"
                size="lg"
                external={ctaExternal}
                className="klounge-intro__cta"
              >
                {cta.label}
              </Button>
            </motion.div>

            <motion.div
              className="klounge-intro__inset"
              {...insetMotion}
              style={reduced ? undefined : { y: insetParallaxY }}
            >
              <div className="klounge-intro__inset-inner">
                <Image
                  src={secondaryImage.src}
                  alt={secondaryImage.alt}
                  width={640}
                  height={400}
                  className="klounge-intro__inset-image"
                  sizes="(max-width: 1023px) 88vw, 28vw"
                />
              </div>
            </motion.div>
          </div>

          <motion.div className="klounge-intro__visual" {...primaryFrameMotion}>
            <div className="klounge-intro__primary-frame">
              <motion.div
                className="klounge-intro__primary-parallax"
                style={reduced ? undefined : { y: primaryParallaxY }}
              >
                <div className="klounge-intro__primary-zoom">
                  <Image
                    src={primaryImage.src}
                    alt={primaryImage.alt}
                    fill
                    className="klounge-intro__primary-image"
                    sizes="(max-width: 1023px) 92vw, 46vw"
                    priority
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
