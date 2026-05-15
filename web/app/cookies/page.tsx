import Link from "next/link";

import { LegalArticle, LegalH2, LegalP, LegalUl } from "@/components/legal/LegalArticle";
import { PageHero } from "@/components/sections/PageHero";
import { getSiteConfig } from "@/lib/content";
import { createPageMetadata } from "@/lib/seo";

const site = getSiteConfig();

export const metadata = createPageMetadata({
  title: "Politique cookies",
  description: `Informations sur les cookies et traceurs — ${site.name}.`,
  path: "/cookies",
});

export default function CookiesPage() {
  return (
    <>
      <PageHero
        eyebrow="Cookies"
        title="Politique relative aux cookies"
        description="Ce que vous devez savoir sur les traceurs éventuellement déposés lors de votre visite."
      />
      <LegalArticle>
        <section className="space-y-4">
          <LegalH2>Qu’est-ce qu’un cookie ?</LegalH2>
          <LegalP>
            Un cookie est un petit fichier enregistré sur votre terminal lors de la visite d’un site. Il peut
            avoir une finalité technique (sécurité, préférences) ou de mesure d’audience selon la mise en
            œuvre réelle du site.
          </LegalP>
        </section>

        <section className="space-y-4">
          <LegalH2>Cookies susceptibles d’être utilisés</LegalH2>
          <LegalP>
            Le site vitrine actuel utilise principalement les cookies nécessaires au fonctionnement technique
            (par exemple équivalent session / préférences lorsque votre hébergement ou CMS en dépose).
            À mettre à jour si vous ajoutez : réseaux sociaux tiers, carte Google Maps interactive (iframe),
            bannières publicitaires, matomo / GA4, HubSpot, etc.
          </LegalP>
          <LegalUl>
            <li>
              <strong className="text-ivory">Nécessaires</strong> : bon fonctionnement du site (ex. équilibrage
              charge, préférences linguistiques).
            </li>
            <li>
              <strong className="text-ivory">Mesure d’audience</strong> : uniquement après configuration et,
              sauf exemption, consentement (à documenter précisément).
            </li>
          </LegalUl>
        </section>

        <section className="space-y-4">
          <LegalH2>Vos choix</LegalH2>
          <LegalP>
            Vous pouvez configurer votre navigateur pour refuser tout ou partie des cookies. Pour une bannière
            de consentement conforme à votre stack (Tarteaucitron, Axeptio, etc.), prévoyez une intégration
            dédiée.
          </LegalP>
        </section>

        <section className="space-y-4">
          <LegalH2>Contact</LegalH2>
          <LegalP>
            Questions sur cette politique :{" "}
            <Link href="/contact" className="text-gold hover:text-ivory hover:underline underline-offset-4">
              nous contacter
            </Link>{" "}
            ou{" "}
            <a
              href={`mailto:${site.contact.email}`}
              className="text-gold hover:text-ivory hover:underline underline-offset-4"
            >
              {site.contact.email}
            </a>
            .
          </LegalP>
        </section>
      </LegalArticle>
    </>
  );
}
