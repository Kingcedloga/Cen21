import Link from "next/link";

import { LegalArticle, LegalH2, LegalP, LegalUl } from "@/components/legal/LegalArticle";
import { PageHero } from "@/components/sections/PageHero";
import { getSiteConfig } from "@/lib/content";
import { createPageMetadata } from "@/lib/seo";

const site = getSiteConfig();

export const metadata = createPageMetadata({
  title: "Mentions légales",
  description: `Informations légales concernant le site ${site.name}.`,
  path: "/mentions-legales",
});

export default function MentionsLegalesPage() {
  return (
    <>
      <PageHero
        eyebrow="Informations"
        title="Mentions légales"
        description="Transparence sur l’éditeur du site, l’hébergement et les droits afférents."
      />
      <LegalArticle>
        <section className="space-y-4">
          <LegalH2>Éditeur du site</LegalH2>
          <LegalP>
            Le site <strong className="text-ivory">{site.name}</strong> est édité par :{" "}
            <strong className="text-ivory">{site.name}</strong>, société ou entité à préciser (forme
            juridique, capital, immatriculation RCS, adresse du siège social).
          </LegalP>
          <LegalUl>
            <li>Adresse : {site.contact.address}</li>
            <li>Téléphone : {site.contact.phone}</li>
            <li>Courriel : {site.contact.email}</li>
          </LegalUl>
        </section>

        <section className="space-y-4">
          <LegalH2>Directeur de la publication</LegalH2>
          <LegalP>À renseigner (représentant légal ou personne désignée).</LegalP>
        </section>

        <section className="space-y-4">
          <LegalH2>Hébergement</LegalH2>
          <LegalP>
            À compléter : nom du prestataire d’hébergement, adresse et coordonnées (conformément à
            l’article 6-III de la LCEN lorsque applicable).
          </LegalP>
        </section>

        <section className="space-y-4">
          <LegalH2>Propriété intellectuelle</LegalH2>
          <LegalP>
            Les éléments du site (textes, images, arborescence, marques, logos) sont la propriété de{" "}
            {site.name} ou sont utilisés sous licence. Toute exploitation non autorisée est prohibée.
          </LegalP>
        </section>

        <section className="space-y-4">
          <LegalH2>Nous écrire</LegalH2>
          <LegalP>
            <Link
              href="/contact"
              className="text-gold underline-offset-4 hover:text-ivory hover:underline cursor-pointer"
            >
              Formulaire de contact
            </Link>
          </LegalP>
        </section>
      </LegalArticle>
    </>
  );
}
