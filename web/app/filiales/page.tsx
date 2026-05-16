import { PageSection } from "@/components/layout/PageSection";
import { SectionWave } from "@/components/layout/SectionWave";
import { PageHero } from "@/components/sections/PageHero";
import { SubsidiariesBento } from "@/components/filiales/SubsidiariesBento";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { SectionHeading } from "@/components/ui/SectionHeading";
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
        description="Des univers distincts, une même exigence — une vue éditoriale curatée de nos dix adresses."
      />

      <PageSection
        variant="alt"
        spacing="loose"
        id="filiales-bento"
        ariaLabelledby="filiales-bento-title"
        containerClassName="mx-auto max-w-[min(100%,1400px)]"
      >
        <AnimateIn>
          <SectionHeading
            eyebrow="Sélection"
            title="Dix adresses, dix univers"
            subtitle="Une composition magazine"
            titleAs="h2"
            subtitleAs="h3"
            titleId="filiales-bento-title"
            description="Chaque bloc met en vedette une adresse iconique, accompagnée d'une sélection complémentaire — une lecture immédiate, sans filtre, comme un cahier d'adresses signé."
            align="left"
            className="mb-12 max-w-2xl md:mb-16"
          />
        </AnimateIn>

        <SubsidiariesBento subsidiaries={subsidiaries} />
      </PageSection>

      <SectionWave fill="petrol" />
    </>
  );
}
