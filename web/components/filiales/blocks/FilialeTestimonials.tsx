import { getTranslations } from "next-intl/server";

import { RevealCard } from "@/components/motion/RevealCard";
import { SectionHeading } from "@/components/ui/SectionHeading";

import "@/styles/filiale-blocks.css";

export type Testimonial = { id: string; quote: string; author: string; role?: string; rating?: number };

/** Avis de clients en cartes révélées (Orbix : témoignages). */
export async function FilialeTestimonials({
  eyebrow,
  title,
  items,
}: {
  eyebrow: string;
  title: string;
  items: Testimonial[];
}) {
  const t = await getTranslations("filiale");
  if (items.length === 0) return null;
  return (
    <div className="filiale-testimonials">
      <SectionHeading
        look="editorial"
        eyebrow={eyebrow}
        title={title}
        titleAs="h2"
        titleId="filiale-testimonials-title"
        align="left"
        className="mb-10! max-w-2xl"
      />
      <ul aria-label={t("testimonialsList")} className="filiale-testimonials__list" data-count={items.length}>
        {items.map((item, index) => (
          <li key={item.id}>
            <RevealCard index={index} className="filiale-quote">
              {item.rating ? (
                <p className="filiale-quote__rating">
                  <span aria-hidden="true">{"★".repeat(Math.round(item.rating))}</span>
                  <span className="sr-only">{t("rating", { rating: item.rating })}</span>
                </p>
              ) : null}
              <blockquote className="filiale-quote__text">« {item.quote} »</blockquote>
              <p className="filiale-quote__author">
                {item.author}
                {item.role && <span>{item.role}</span>}
              </p>
            </RevealCard>
          </li>
        ))}
      </ul>
    </div>
  );
}
