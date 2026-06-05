import Image from "next/image";

import { AnimateIn } from "@/components/ui/AnimateIn";
import { Button } from "@/components/ui/Button";
import { cormorant } from "@/lib/fonts";
import type { SubsidiaryAboutSection } from "@/lib/types";

import "@/styles/wabi-sabi-editorial-about.css";

type Props = {
  content: SubsidiaryAboutSection;
};

const MOSAIC_SLOTS = ["--1", "--2", "--3", "--4", "--5", "--6"] as const;

export function WabiSabiEditorialAbout({ content }: Props) {
  const { eyebrow, title, description, ctaLabel, ctaHref = "/contact", mosaicImages } =
    content;

  const images = (mosaicImages ?? []).slice(0, 6);
  if (images.length < 6) return null;

  const ctaIsExternal = ctaHref.startsWith("http");

  return (
    <section
      className={`wabi-editorial-about ${cormorant.variable}`}
      aria-labelledby="wabi-editorial-about-title"
    >
      <div className="wabi-editorial-about__inner">
        <AnimateIn className="wabi-editorial-about__header">
          <p className="wabi-editorial-about__eyebrow">{eyebrow}</p>

          <h2 id="wabi-editorial-about-title" className="wabi-editorial-about__title">
            {title}
          </h2>

          <p className="wabi-editorial-about__description">{description}</p>

          <Button
            href={ctaHref}
            variant="primary"
            external={ctaIsExternal}
            className="wabi-editorial-about__cta"
          >
            {ctaLabel}
          </Button>
        </AnimateIn>

        <div className="wabi-about-mosaic" aria-label={title}>
          {images.map((image, index) => (
            <AnimateIn
              key={image.src}
              delay={0.06 + index * 0.07}
              className={`wabi-about-mosaic__item wabi-about-mosaic__item${MOSAIC_SLOTS[index]}`}
            >
              <figure className="wabi-about-mosaic__figure">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="wabi-about-mosaic__image"
                  sizes="(max-width: 639px) 50vw, (max-width: 1023px) 33vw, 22vw"
                  quality={88}
                />
              </figure>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
