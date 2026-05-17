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
        spacing="default"
        id="nos-filiales"
        ariaLabelledby="nos-filiales-title"
        containerClassName="mx-auto max-w-[min(100%,1400px)]"
      >
        {/* Bloc vertical strict : titre d’abord, carrousel toujours en dessous
            (pas de lecture sur la même ligne / même bande horizontaire). */}
        <div className="relative isolate flex flex-col items-stretch gap-0">
          {/* Bloc titre au-dessus du carrousel (z élevé vs deck 3D). */}
          <div className="relative z-[60] shrink-0 max-w-2xl pr-6 md:pr-8">
            <AnimateIn>
              <SectionHeading
                eyebrow="Nos adresses"
                title="Nos filiales"
                titleAs="h2"
                subtitleAs="h3"
                titleId="nos-filiales-title"
                align="left"
                className="mb-0 max-w-2xl"
              />
            </AnimateIn>
          </div>

          <div className="relative z-10 mt-14 w-full max-sm:mt-32 sm:mt-16 md:mt-20 lg:mt-24 xl:mt-28">
            <FeaturedSubsidiariesSlider subsidiaries={subsidiaries} />
          </div>
        </div>
      </PageSection>

      <SectionWave fill="anthracite" />

      <StatsBanner />

      <SectionWave fill="petrol" flip />

      <CtaBand />
    </>
  );
}
