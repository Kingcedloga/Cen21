import { StatCountUp } from "@/components/sections/StatCountUp";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";

import "@/styles/about.css";

/**
 * Le groupe en chiffres (refonte R2, bento d'Orbix : trois cartes à grands
 * rayons, compteurs). Maisons et répartition par univers, chiffres clés,
 * adresses avec un lien vers la carte de /contact.
 */
export function AboutFigures({
  heading,
  houses,
  stats,
  addresses,
}: {
  heading: { eyebrow: string; title: string; sweep: string };
  houses: { label: string; count: number; text: string; sectors: string[]; sectorsLabel: string };
  stats: { label: string; items: { value: string; label: string }[] };
  addresses: { label: string; count: number; text: string; cta: { href: string; label: string } };
}) {
  return (
    <section data-surface="dark" aria-labelledby="about-figures-title" className="about-figures">
      <div className="mx-auto max-w-[min(100%,1400px)]">
        <SectionHeading
          look="editorial"
          eyebrow={heading.eyebrow}
          title={heading.title}
          sweep={heading.sweep}
          titleAs="h2"
          titleId="about-figures-title"
          align="left"
          className="mb-10 md:mb-14"
        />

        <div className="about-bento">
          <article className="bento-card bento-card--sand bento-card--houses">
            <h3 className="bento-card__label">{houses.label}</h3>
            <p className="bento-card__figure title-display">
              <StatCountUp value={String(houses.count)} />
            </p>
            <p className="bento-card__text">{houses.text}</p>
            <ul aria-label={houses.sectorsLabel} className="bento-card__chips">
              {houses.sectors.map((sector) => (
                <li key={sector}>{sector}</li>
              ))}
            </ul>
          </article>

          <article className="bento-card bento-card--dark bento-card--stats">
            <h3 className="sr-only">{stats.label}</h3>
            <dl className="bento-card__stats">
              {stats.items.map((stat) => (
                <div key={stat.label}>
                  <dt>{stat.label}</dt>
                  <dd className="title-section">
                    <StatCountUp value={stat.value} />
                  </dd>
                </div>
              ))}
            </dl>
          </article>

          <article className="bento-card bento-card--petrol bento-card--addresses">
            <h3 className="bento-card__label">{addresses.label}</h3>
            <p className="bento-card__figure title-display">
              <StatCountUp value={String(addresses.count)} />
            </p>
            <p className="bento-card__text">{addresses.text}</p>
            <Button href={addresses.cta.href} variant="secondary" className="mt-auto self-start">
              {addresses.cta.label}
              <span aria-hidden="true">→</span>
            </Button>
          </article>
        </div>
      </div>
    </section>
  );
}
