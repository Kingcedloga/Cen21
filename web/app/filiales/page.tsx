import { PageHero } from "@/components/sections/PageHero";
import { PageSection } from "@/components/layout/PageSection";
import { SectionWave } from "@/components/layout/SectionWave";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { SubsidiariesCoverFlow } from "@/components/filiales/SubsidiariesCoverFlow";
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
        id="filiales-coverflow"
        ariaLabelledby="filiales-coverflow-title"
        containerClassName="mx-auto max-w-[min(100%,1400px)]"
      >
        <AnimateIn>
          <SectionHeading
            eyebrow="Découverte"
            title="Dix adresses, dix univers"
            subtitle="Sélection en vedette"
            titleAs="h2"
            subtitleAs="h3"
            titleId="filiales-coverflow-title"
            description="Cliquez sur une carte latérale pour la centrer, ou laissez-vous porter par le défilement automatique."
            align="left"
            className="mb-0 max-w-2xl"
          />
        </AnimateIn>
        <div className="relative z-10 mt-20 md:mt-28 lg:mt-32">
          <SubsidiariesCoverFlow subsidiaries={subsidiaries} />
        </div>
      </PageSection>

      <SectionWave fill="petrol" />
    </>
  );
}
