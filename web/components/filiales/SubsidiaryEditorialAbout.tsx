import Image from "next/image";

import { AnimateIn } from "@/components/ui/AnimateIn";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { cormorant } from "@/lib/fonts";
import type { SubsidiaryAboutSection } from "@/lib/types";

import { SubsidiaryEditorialImageSlideshow } from "@/components/filiales/SubsidiaryEditorialImageSlideshow";
import { PresentationDotOrnaments } from "@/components/filiales/PresentationDotOrnaments";

import "@/styles/subsidiary-editorial-about.css";
import "@/styles/subsidiary-luxury-presentation.css";

export type SubsidiaryEditorialAboutVariant = "light" | "luxury-dark";

type Props = {
  content: SubsidiaryAboutSection;
  variant?: SubsidiaryEditorialAboutVariant;
};

export function SubsidiaryEditorialAbout({
  content,
  variant = "light",
}: Props) {
  const {
    eyebrow,
    subtitle,
    title,
    description,
    ctaLabel,
    ctaHref = "/contact",
    image,
    imageAlt,
    slides,
    highlights,
  } = content;

  const isLuxuryDark = variant === "luxury-dark";
  const ctaIsExternal = ctaHref.startsWith("http");
  const imageSlides =
    slides && slides.length > 0
      ? slides
      : image
        ? [{ src: image, alt: imageAlt }]
        : [];
  const useSlideshow = isLuxuryDark && imageSlides.length > 1;
  const imageSizes = isLuxuryDark
    ? "(max-width: 1023px) 92vw, 42vw"
    : "(max-width: 1023px) 100vw, 55vw";

  return (
    <section
      className={[
        "subsidiary-editorial-about",
        cormorant.variable,
        isLuxuryDark ? "subsidiary-editorial-about--luxury-dark" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      aria-labelledby="subsidiary-editorial-about-title"
    >
      <div className="subsidiary-editorial-about__inner">
        <div className="subsidiary-editorial-about__grid">
          <AnimateIn className="subsidiary-editorial-about__content">
            <p className="subsidiary-editorial-about__eyebrow">{eyebrow}</p>

            <h2
              id="subsidiary-editorial-about-title"
              className="subsidiary-editorial-about__title"
            >
              {title}
            </h2>

            {subtitle ? (
              <p className="subsidiary-editorial-about__subtitle">{subtitle}</p>
            ) : null}

            <p className="subsidiary-editorial-about__description">{description}</p>

            {highlights && highlights.length > 0 && (
              <ul className="subsidiary-editorial-about__highlights">
                {highlights.map((item, index) => (
                  <li
                    key={item.title}
                    className="subsidiary-editorial-about__highlight"
                    data-divider={index > 0 ? "" : undefined}
                  >
                    <span className="subsidiary-editorial-about__highlight-icon" aria-hidden>
                      <Icon
                        name={item.icon}
                        size="sm"
                        className={
                          isLuxuryDark
                            ? "text-[var(--lux-pres-accent,var(--sub-gold,#c9a84c))]"
                            : "text-[var(--kl-about-accent)]"
                        }
                        weight="thin"
                      />
                    </span>
                    <span className="subsidiary-editorial-about__highlight-title">
                      {item.title}
                    </span>
                    <span className="subsidiary-editorial-about__highlight-desc">
                      {item.description}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            <Button
              href={ctaHref}
              variant="secondary"
              external={ctaIsExternal}
              className="self-start"
            >
              {ctaLabel}
            </Button>
          </AnimateIn>

          <div className="subsidiary-editorial-about__visual">
            <div className="subsidiary-editorial-about__visual-inner">
              <div
                className={
                  isLuxuryDark ? "subsidiary-editorial-about__image-frame" : undefined
                }
              >
                {isLuxuryDark ? (
                  <>
                    <PresentationDotOrnaments className="presentation-dot-ornament--tl" />
                    <PresentationDotOrnaments className="presentation-dot-ornament--tr" />
                    <PresentationDotOrnaments className="presentation-dot-ornament--bl" />
                    <PresentationDotOrnaments className="presentation-dot-ornament--br" />
                  </>
                ) : null}
                <div className="subsidiary-editorial-about__image-wrap">
                  {useSlideshow ? (
                    <SubsidiaryEditorialImageSlideshow
                      slides={imageSlides}
                      sizes={imageSizes}
                    />
                  ) : (
                    <Image
                      src={imageSlides[0]?.src ?? image}
                      alt={imageSlides[0]?.alt ?? imageAlt}
                      fill
                      className="subsidiary-editorial-about__image"
                      sizes={imageSizes}
                      quality={90}
                      priority={!useSlideshow}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
