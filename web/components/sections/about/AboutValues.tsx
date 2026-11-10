import { AnimateIn } from "@/components/ui/AnimateIn";
import { SectionHeading } from "@/components/ui/SectionHeading";

import "@/styles/about.css";

/**
 * Valeurs du groupe (refonte R2, d'après les cartes « avantages » d'Orbix) :
 * une carte par valeur, numérotée /01 à /06. Au survol (souris), le contenu
 * monte légèrement et un filet or se déroule ; tout reste lisible au doigt
 * et au clavier.
 */
export function AboutValues({
  heading,
  values,
}: {
  heading: { eyebrow: string; title: string; sweep: string; intro: string };
  values: { title: string; description: string }[];
}) {
  return (
    <section data-surface="light" aria-labelledby="about-values-title" className="about-values">
      <div className="mx-auto max-w-[min(100%,1400px)]">
        <SectionHeading
          look="editorial"
          tone="light"
          eyebrow={heading.eyebrow}
          title={heading.title}
          sweep={heading.sweep}
          description={heading.intro}
          titleAs="h2"
          titleId="about-values-title"
          align="left"
          className="mb-10 md:mb-14"
        />

        <ul className="values-grid">
          {values.map((value, index) => (
            <li key={value.title}>
              <AnimateIn delay={(index % 3) * 0.08} className="h-full">
                <div className="value-card">
                  <div className="value-card__inner">
                    <span aria-hidden="true" className="value-card__index">
                      /{String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="value-card__title title-section">{value.title}</h3>
                    <p className="value-card__text">{value.description}</p>
                  </div>
                  <span aria-hidden="true" className="value-card__line" />
                </div>
              </AnimateIn>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
