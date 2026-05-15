import { PageHero } from "@/components/sections/PageHero";
import { AnimateIn } from "@/components/ui/AnimateIn";
import {
  SubsidiaryShowcaseBlock,
  chunkSubsidiaries,
} from "@/components/filiales/SubsidiaryShowcase";
import { getSubsidiaries } from "@/lib/content";
import { createPageMetadata } from "@/lib/seo";

const subsidiaries = getSubsidiaries();
const blocks = chunkSubsidiaries(subsidiaries);

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
        description="Des univers distincts, une même exigence — chaque adresse cultive son identité au sein du groupe Cen21 Hospitality."
      />

      <section className="py-16 px-4 md:px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-14 md:gap-16 lg:gap-20">
          {blocks.map(({ hero, side }, blockIndex) => (
            <AnimateIn key={hero.slug} delay={blockIndex * 0.05}>
              <SubsidiaryShowcaseBlock hero={hero} side={side} />
            </AnimateIn>
          ))}
        </div>
      </section>
    </>
  );
}
