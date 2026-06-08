"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import { Button } from "@/components/ui/Button";
import { cormorant } from "@/lib/fonts";
import { BLUR_PETROL } from "@/lib/image-blur";
import { fadeUpTransition, fadeUpVariants } from "@/lib/motion";
import type { SubsidiarySpotlightSection } from "@/lib/types";

import "@/styles/wabi-sabi-spotlight.css";

type Props = {
  content: SubsidiarySpotlightSection;
};

export function WabiSabiSpotlightSection({ content }: Props) {
  const reduced = useReducedMotion() ?? false;
  const { title, description, cta, image, imageAlt } = content;

  const motionProps = reduced
    ? {}
    : {
        initial: "hidden" as const,
        whileInView: "visible" as const,
        viewport: { once: true, margin: "-8% 0px -6% 0px", amount: 0.35 },
        variants: fadeUpVariants,
        transition: fadeUpTransition,
      };

  const ctaExternal = cta.href.startsWith("http");

  return (
    <section
      className={`wabi-spotlight ${cormorant.variable}`}
      aria-labelledby="wabi-spotlight-title"
    >
      <div className="wabi-spotlight__backdrop" aria-hidden>
        <span className="wabi-spotlight__texture" />
        <span className="wabi-spotlight__grain" />
      </div>

      <div className="wabi-spotlight__inner">
        <div className="wabi-spotlight__grid">
          <motion.div className="wabi-spotlight__content" {...motionProps}>
            <h2 id="wabi-spotlight-title" className="wabi-spotlight__title">
              {title}
            </h2>

            <p className="wabi-spotlight__description">{description}</p>

            <Button
              href={cta.href}
              variant="primary"
              size="lg"
              external={ctaExternal}
              className="wabi-spotlight__cta"
            >
              {cta.label}
            </Button>
          </motion.div>

          <motion.div
            className="wabi-spotlight__visual"
            {...motionProps}
            transition={{ ...fadeUpTransition, delay: reduced ? 0 : 0.1 }}
          >
            <figure className="wabi-spotlight__figure">
              <Image
                src={image}
                alt={imageAlt}
                fill
                className="wabi-spotlight__image"
                sizes="(max-width: 1023px) 92vw, 46vw"
                quality={88}
                placeholder="blur"
                blurDataURL={BLUR_PETROL}
              />
            </figure>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
