import { SubsidiaryCard } from "@/components/cards/SubsidiaryCard";
import { OrganizationJsonLd } from "@/components/seo/OrganizationJsonLd";
import { CtaBand } from "@/components/sections/CtaBand";
import { HeroCinematic } from "@/components/sections/HeroCinematic";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getFeaturedSubsidiaries, getSiteConfig } from "@/lib/content";
import { createPageMetadata } from "@/lib/seo";

const site = getSiteConfig();
const featured = getFeaturedSubsidiaries();

export const metadata = createPageMetadata({
  title: site.name,
  description: site.description,
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <OrganizationJsonLd />
      <HeroCinematic />

      <section className="py-24 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <AnimateIn>
            <SectionHeading
              eyebrow="Le groupe"
              title="Cen21 Hospitality"
              description="Une holding dédiée à l'hospitalité, au divertissement et aux expériences lifestyle haut de gamme. Dix adresses distinctes, une même exigence d'excellence."
              align="left"
            />
          </AnimateIn>
          <AnimateIn delay={0.1}>
            <p className="text-taupe text-lg leading-relaxed max-w-3xl">
              Restaurants d&apos;exception, bars à cocktails, lounges feutrés,
              clubs nocturnes et espaces événementiels premium : chaque filiale
              cultive son univers tout en partageant une vision commune — créer
              des moments mémorables, élégants et authentiques.
            </p>
          </AnimateIn>
        </div>
      </section>

      <section className="py-24 px-4 md:px-6 bg-anthracite/50">
        <div className="max-w-7xl mx-auto">
          <AnimateIn>
            <SectionHeading
              eyebrow="Nos adresses"
              title="Filiales en vedette"
              description="Découvrez une sélection de nos établissements. L'ensemble du portefeuille est accessible sur la page Filiales."
            />
          </AnimateIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((sub, i) => (
              <AnimateIn key={sub.slug} delay={i * 0.05}>
                <SubsidiaryCard subsidiary={sub} />
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
