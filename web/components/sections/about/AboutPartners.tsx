import Image from "next/image";
import type { CSSProperties } from "react";

import { AnimateIn } from "@/components/ui/AnimateIn";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArrowUpRight } from "@/lib/icons";

import "@/styles/about.css";

export type PartnerCard = {
  name: string;
  role: string;
  url?: string;
  /** Logo blanc de l'enseigne (posé sur sa couleur de marque). */
  logo?: string;
  brandColor: string;
  /** Couleur de marque trop claire pour le logo blanc (ex. rose Pinkberry) : logo assombri. */
  logoOnLight?: boolean;
  /** « Site officiel de {name} (nouvel onglet) » */
  visitAria: string;
};

export type DistinctionRow = {
  id: string;
  year: string;
  title: string;
  issuer: string;
  /** Maison distinguée, s'il y en a une. */
  house?: string;
  url?: string;
};

/**
 * Partenaires (enseignes internationales opérées par le groupe) et
 * distinctions. Le bloc « Distinctions » n'apparaît que lorsque la liste de
 * about.json est remplie : rien n'est affiché tant qu'elle est vide.
 */
export function AboutPartners({
  heading,
  partners,
  visitLabel,
  distinctions,
}: {
  heading: { eyebrow: string; title: string; sweep: string; intro: string };
  partners: PartnerCard[];
  visitLabel: string;
  distinctions: { title: string; items: DistinctionRow[] };
}) {
  return (
    <section data-surface="light" aria-labelledby="about-partners-title" className="about-partners">
      <div className="mx-auto max-w-[min(100%,1400px)]">
        <SectionHeading
          look="editorial"
          tone="light"
          eyebrow={heading.eyebrow}
          title={heading.title}
          sweep={heading.sweep}
          description={heading.intro}
          titleAs="h2"
          titleId="about-partners-title"
          align="left"
          className="mb-10 md:mb-14"
        />

        {partners.length > 0 && (
          <ul className="partners-grid">
            {partners.map((partner, index) => (
              <li key={partner.name}>
                <AnimateIn delay={index * 0.08} className="h-full">
                  <PartnerTile partner={partner} visitLabel={visitLabel} />
                </AnimateIn>
              </li>
            ))}
          </ul>
        )}

        {distinctions.items.length > 0 && (
          <div className="about-distinctions">
            <h3 id="about-distinctions-title" className="about-distinctions__title title-section">
              {distinctions.title}
            </h3>
            <ul aria-labelledby="about-distinctions-title" className="distinctions-list">
              {distinctions.items.map((item) => (
                <li key={item.id} className="distinction-row">
                  <span className="distinction-row__year">{item.year}</span>
                  <span className="distinction-row__title">
                    {item.url ? (
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="distinction-row__link">
                        {item.title}
                      </a>
                    ) : (
                      item.title
                    )}
                  </span>
                  <span className="distinction-row__meta">
                    {[item.issuer, item.house].filter(Boolean).join(" · ")}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

function PartnerTile({ partner, visitLabel }: { partner: PartnerCard; visitLabel: string }) {
  const content = (
    <>
      <span
        className={`partner-card__logo ${partner.logoOnLight ? "partner-card__logo--on-light" : ""}`}
        style={{ "--partner-brand": partner.brandColor } as CSSProperties}
      >
        {partner.logo ? (
          <Image src={partner.logo} alt="" fill sizes="(max-width: 767px) 7rem, 30vw" className="object-contain p-[12%] md:p-[20%]" />
        ) : (
          <span className="partner-card__monogram">{partner.name}</span>
        )}
      </span>
      <span className="partner-card__body">
        <span className="partner-card__role">{partner.role}</span>
        <span className="partner-card__name title-section">{partner.name}</span>
        {partner.url && (
          <span className="partner-card__visit">
            {visitLabel}
            <ArrowUpRight aria-hidden className="h-4 w-4" />
          </span>
        )}
      </span>
      <span aria-hidden="true" className="partner-card__line" />
    </>
  );

  if (!partner.url) return <div className="partner-card">{content}</div>;

  return (
    <a
      href={partner.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={partner.visitAria}
      className="partner-card partner-card--link tap-press focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-petrol"
    >
      {content}
    </a>
  );
}
