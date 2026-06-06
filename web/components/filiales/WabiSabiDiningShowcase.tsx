"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import { Button } from "@/components/ui/Button";
import { cormorant } from "@/lib/fonts";
import { fadeUpTransition, fadeUpVariants } from "@/lib/motion";
import type { SubsidiaryDiningSection } from "@/lib/types";

import "@/styles/wabi-sabi-dining-showcase.css";

type Props = {
  content: SubsidiaryDiningSection;
};

export function WabiSabiDiningShowcase({ content }: Props) {
  const reduced = useReducedMotion() ?? false;
  const { title, paragraphs, primaryCta, secondaryCta, images } = content;

  const motionProps = reduced
    ? {}
    : {
        initial: "hidden" as const,
        whileInView: "visible" as const,
        viewport: { once: true, margin: "-8% 0px -6% 0px", amount: 0.35 },
        variants: fadeUpVariants,
        transition: fadeUpTransition,
      };

  const primaryExternal = primaryCta.href.startsWith("http");
  const secondaryExternal = secondaryCta.href.startsWith("http");

  return (
    <section
      className={`wabi-dining-showcase ${cormorant.variable}`}
      aria-labelledby="wabi-dining-showcase-title"
    >
      <div className="wabi-dining-showcase__backdrop" aria-hidden>
        <span className="wabi-dining-showcase__texture" />
        <span className="wabi-dining-showcase__grain" />
        <span className="wabi-dining-showcase__glow wabi-dining-showcase__glow--tr" />
      </div>

      <div className="wabi-dining-showcase__inner">
        <div className="wabi-dining-showcase__grid">
          <motion.div className="wabi-dining-showcase__content" {...motionProps}>
            <h2 id="wabi-dining-showcase-title" className="wabi-dining-showcase__title">
              {title}
            </h2>

            <div className="wabi-dining-showcase__body">
              {paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            <div className="wabi-dining-showcase__actions">
              <Button
                href={secondaryCta.href}
                variant="secondary"
                size="lg"
                external={secondaryExternal}
                className="wabi-dining-showcase__cta wabi-dining-showcase__cta--secondary"
              >
                {secondaryCta.label}
              </Button>
              <Button
                href={primaryCta.href}
                variant="primary"
                size="lg"
                external={primaryExternal}
                className="wabi-dining-showcase__cta wabi-dining-showcase__cta--primary"
              >
                {primaryCta.label}
              </Button>
            </div>
          </motion.div>

          <motion.div
            className="wabi-dining-showcase__visual"
            {...motionProps}
            transition={{ ...fadeUpTransition, delay: reduced ? 0 : 0.12 }}
          >
            <figure className="wabi-dining-showcase__photo wabi-dining-showcase__photo--back">
              <Image
                src={images.back.src}
                alt={images.back.alt}
                fill
                className="wabi-dining-showcase__image"
                sizes="(max-width: 1023px) 88vw, 46vw"
                quality={88}
              />
            </figure>

            <figure className="wabi-dining-showcase__photo wabi-dining-showcase__photo--front">
              <Image
                src={images.front.src}
                alt={images.front.alt}
                fill
                className="wabi-dining-showcase__image"
                sizes="(max-width: 1023px) 42vw, 20vw"
                quality={88}
              />
            </figure>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
