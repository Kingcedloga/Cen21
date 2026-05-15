import Link from "next/link";

import { LegalArticle, LegalH2, LegalP } from "@/components/legal/LegalArticle";
import { PageHero } from "@/components/sections/PageHero";
import { getSiteConfig } from "@/lib/content";
import { createPageMetadata } from "@/lib/seo";

const site = getSiteConfig();

export const metadata = createPageMetadata({
  title: "Politique de confidentialité",
  description: `Données personnelles et respect de votre vie privée — ${site.name}.`,
  path: "/confidentialite",
});

export default function ConfidentialitePage() {
  return (
    <>
      <PageHero
        eyebrow="Données personnelles"
        title="Politique de confidentialité"
        description="Comment nous traitons vos informations lorsque vous utilisez notre site ou nous contactez."
      />
      <LegalArticle>
        <section className="space-y-4">
          <LegalH2>Responsable du traitement</LegalH2>
          <LegalP>
            Les traitements décrits ci-dessous sont réalisés par{" "}
            <strong className="text-ivory">{site.name}</strong>. Pour exercer vos droits :{" "}
            <a href={`mailto:${site.contact.email}`} className="text-gold hover:text-ivory underline-offset-4 hover:underline">
              {site.contact.email}
            </a>
            .
          </LegalP>
        </section>

        <section className="space-y-4">
          <LegalH2>Données collectées via le formulaire de contact</LegalH2>
          <LegalP>
            Lorsque vous envoyez un message (nom, adresse électronique, objet, contenu), nous utilisons ces
            informations uniquement pour répondre à votre demande et assurer le suivi relationnel légitime.
          </LegalP>
        </section>

        <section className="space-y-4">
          <LegalH2>Navigation et mesure d’audience</LegalH2>
          <LegalP>
            Selon la configuration finale du site, des cookies ou traceurs peuvent être utilisés (voir{" "}
            <Link href="/cookies" className="text-gold hover:text-ivory hover:underline underline-offset-4">
              politique cookies
            </Link>
            ). À adapter avec votre solution d&apos;analytics ou son absence.
          </LegalP>
        </section>

        <section className="space-y-4">
          <LegalH2>Vos droits (RGPD)</LegalH2>
          <LegalP>
            Dans les conditions prévues par la réglementation applicable, vous pouvez demander l&apos;accès,
            la rectification ou l&apos;effacement de vos données, ainsi que la limitation du traitement, la
            portabilité ou vous opposer à certains traitements. Vous pouvez introduire une réclamation auprès
            de la CNIL (<a href="https://www.cnil.fr" className="text-gold hover:text-ivory hover:underline" rel="noopener noreferrer" target="_blank">cnil.fr</a>).
          </LegalP>
        </section>

        <section className="space-y-4">
          <LegalH2>Conservation</LegalH2>
          <LegalP>
            Les messages de contact sont conservés pour la durée nécessaire au traitement des échanges, puis
            archivés ou supprimés selon vos obligations légales et opérationnelles.
          </LegalP>
        </section>
      </LegalArticle>
    </>
  );
}
