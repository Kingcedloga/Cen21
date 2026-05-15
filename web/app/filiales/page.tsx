import { SubsidiaryCard } from "@/components/cards/SubsidiaryCard";
import { PageHero } from "@/components/sections/PageHero";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { getSubsidiaries } from "@/lib/content";
import { createPageMetadata } from "@/lib/seo";

const subsidiaries = getSubsidiaries();

export const metadata = createPageMetadata({
  title: "Filiales",
  description:
    "Découvrez les dix établissements du groupe Cen21 Hospitality — restaurants, bars, lounges, clubs et espaces événementiels.",
  path: "/filiales",
});

export default function SubsidiariesPage() {
  return (
    <>
      <PageHero
        eyebrow="Portfolio"
        title="Nos filiales"
        description="Dix univers distincts, une exigence commune — chaque adresse cultive son identité au sein du groupe Cen21 Hospitality."
      />

      <section className="py-16 px-4 md:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {subsidiaries.map((sub, i) => (
            <AnimateIn key={sub.slug} delay={i * 0.03}>
              <SubsidiaryCard subsidiary={sub} />
            </AnimateIn>
          ))}
        </div>
      </section>
    </>
  );
}
