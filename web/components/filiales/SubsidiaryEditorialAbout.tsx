import Image from "next/image";

import { AnimateIn } from "@/components/ui/AnimateIn";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { cormorant } from "@/lib/fonts";
import type { SubsidiaryAboutSection } from "@/lib/types";

import "@/styles/subsidiary-editorial-about.css";

type Props = {
  content: SubsidiaryAboutSection;
};

export function SubsidiaryEditorialAbout({ content }: Props) {
  const { eyebrow, title, description, ctaLabel, ctaHref = "/contact", image, imageAlt, highlights } =
    content;

  const ctaIsExternal = ctaHref.startsWith("http");

  return (
    <section
      className={`subsidiary-editorial-about ${cormorant.variable}`}
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
                        className="text-[var(--kl-about-accent)]"
                        strokeWidth={1.25}
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
            <AnimateIn delay={0.08} className="subsidiary-editorial-about__visual-inner">
              <div className="subsidiary-editorial-about__image-wrap">
                <Image
                  src={image}
                  alt={imageAlt}
                  fill
                  className="subsidiary-editorial-about__image"
                  sizes="(max-width: 1023px) 100vw, 55vw"
                  quality={90}
                  priority
                />
              </div>
            </AnimateIn>
          </div>
        </div>
      </div>
    </section>
  );
}
