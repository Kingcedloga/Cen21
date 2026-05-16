import { OrganizationJsonLd } from "@/components/seo/OrganizationJsonLd";
import { FeaturedSubsidiariesSlider } from "@/components/sections/FeaturedSubsidiariesSlider";
import { CtaBand } from "@/components/sections/CtaBand";
import { HeroCinematic } from "@/components/sections/HeroCinematic";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StatsBanner } from "@/components/sections/StatsBanner";
import { PageSection } from "@/components/layout/PageSection";
import { SectionWave } from "@/components/layout/SectionWave";
import { getSubsidiaries, getSiteConfig } from "@/lib/content";
import { createPageMetadata } from "@/lib/seo";

const site = getSiteConfig();
const subsidiaries = getSubsidiaries();

const heroSlides =
  site.heroSlides && site.heroSlides.length > 0
    ? site.heroSlides
    : [{ src: site.heroImage, alt: `Visuel ${site.name}` }];

export const metadata = createPageMetadata({
  title: site.name,
  description: site.description,
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <OrganizationJsonLd />
      <HeroCinematic
        slides={heroSlides}
        tagline={site.tagline}
        description={site.description}
      />

      <SectionWave fill="petrol" />

      <PageSection variant="default">
        <AnimateIn>
          <SectionHeading
            eyebrow="Le groupe"
            title="Cen21 Hospitality"
            description="Une holding dédiée à l'hospitalité, au divertissement et aux expériences lifestyle haut de gamme. Dix adresses distinctes, une même exigence d'excellence."
            align="left"
          />
        </AnimateIn>
        <AnimateIn delay={0.1}>
          <p className="max-w-3xl text-lg leading-relaxed text-taupe">
            Restaurants d&apos;exception, bars à cocktails, lounges feutrés,
            clubs nocturnes et espaces événementiels premium : chaque filiale
            cultive son univers tout en partageant une vision commune — créer
            des moments mémorables, élégants et authentiques.
          </p>
        </AnimateIn>
      </PageSection>

      <SectionWave fill="band" flip />

      <PageSection
        variant="alt"
        spacing="loose"
        id="nos-filiales"
        ariaLabelledby="nos-filiales-title"
        containerClassName="mx-auto max-w-[min(100%,1400px)]"
      >
        <AnimateIn>
          <SectionHeading
            eyebrow="Nos adresses"
            title="Nos filiales"
            subtitle="Filiales en vedette"
            titleAs="h2"
            subtitleAs="h3"
            titleId="nos-filiales-title"
            align="left"
            className="mb-0 max-w-2xl"
          />
        </AnimateIn>
        <div className="relative z-10 mt-20 md:mt-28 lg:mt-32">
          <FeaturedSubsidiariesSlider subsidiaries={subsidiaries} />
        </div>
      </PageSection>

      <SectionWave fill="petrol" />

      <StatsBanner />

      <SectionWave fill="petrol" flip />

      <CtaBand />
    </>
  );
}
