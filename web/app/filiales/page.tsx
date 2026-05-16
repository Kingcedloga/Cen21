import { PageHero } from "@/components/sections/PageHero";
import { PageSection } from "@/components/layout/PageSection";
import { SectionWave } from "@/components/layout/SectionWave";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { SubsidiariesExplorer } from "@/components/filiales/SubsidiariesExplorer";
import { getSubsidiaries } from "@/lib/content";
import { createPageMetadata } from "@/lib/seo";

const subsidiaries = getSubsidiaries();

export const metadata = createPageMetadata({
  title: "Filiales",
  description:
    "Découvrez les établissements du groupe Cen21 Hospitality — restaurants, bars, lounges, clubs et espaces événementiels.",
  path: "/filiales",
});

export default function SubsidiariesPage() {
  return (
    <>
      <PageHero
        eyebrow="Portfolio"
        title="Nos filiales"
        description="Des univers distincts, une même exigence — parcourez nos dix adresses dans un flux immersif."
      />

      <PageSection
        variant="alt"
        spacing="loose"
        id="filiales-explorer"
        ariaLabelledby="filiales-explorer-title"
        containerClassName="mx-auto max-w-[min(100%,1400px)]"
      >
        <AnimateIn>
          <SectionHeading
            eyebrow="Découverte"
            title="Dix adresses, dix univers"
            subtitle="Filtrez par secteur, choisissez votre vue"
            titleAs="h2"
            subtitleAs="h3"
            titleId="filiales-explorer-title"
            description="Filtres, toggle d'affichage et défilement immersif — la sélection s'adapte à votre rythme."
            align="left"
            className="mb-12 max-w-2xl md:mb-16"
          />
        </AnimateIn>
        <SubsidiariesExplorer subsidiaries={subsidiaries} />
      </PageSection>

      <SectionWave fill="petrol" />
    </>
  );
}
