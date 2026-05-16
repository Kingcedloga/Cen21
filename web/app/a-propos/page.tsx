import { PageHero } from "@/components/sections/PageHero";
import { PageSection } from "@/components/layout/PageSection";
import { SectionWave } from "@/components/layout/SectionWave";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { ReadingProgress } from "@/components/ui/ReadingProgress";
import { getAboutContent } from "@/lib/content";
import { createPageMetadata } from "@/lib/seo";

const about = getAboutContent();

export const metadata = createPageMetadata({
  title: "À propos",
  description:
    "Histoire, vision et valeurs de Cen21 Hospitality — holding premium de l'hospitalité et du lifestyle.",
  path: "/a-propos",
});

export default function AboutPage() {
  return (
    <>
      <ReadingProgress />
      <PageHero
        eyebrow="À propos"
        title="Notre histoire & notre vision"
        description="Une holding née de la passion pour l'art de recevoir et l'exigence du détail."
      />

      <PageSection variant="default">
        <AnimateIn>
          <SectionHeading
            eyebrow="Origines"
            title="Histoire"
            titleAs="h2"
            align="left"
            className="mb-10 max-w-2xl"
          />
        </AnimateIn>
        <AnimateIn delay={0.1}>
          <p className="max-w-3xl text-lg leading-relaxed text-taupe">{about.history}</p>
        </AnimateIn>
      </PageSection>

      <SectionWave fill="band" flip />

      <PageSection variant="alt">
        <AnimateIn>
          <SectionHeading
            eyebrow="Cap"
            title="Vision"
            titleAs="h2"
            align="left"
            className="mb-10 max-w-2xl"
          />
        </AnimateIn>
        <AnimateIn delay={0.1}>
          <p className="max-w-3xl text-lg leading-relaxed text-taupe">{about.vision}</p>
        </AnimateIn>
      </PageSection>

      <SectionWave fill="petrol" />

      <PageSection variant="default">
        <AnimateIn>
          <SectionHeading
            eyebrow="ADN"
            title="Valeurs"
            titleAs="h2"
            align="left"
            className="mb-10 max-w-2xl"
          />
        </AnimateIn>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {about.values.map((v, i) => (
            <AnimateIn key={v.title} delay={i * 0.05}>
              <article className="glass-panel rounded-xl p-8">
                <h3 className="mb-3 font-[family-name:var(--font-cormorant)] text-xl text-gold">
                  {v.title}
                </h3>
                <p className="leading-relaxed text-taupe">{v.description}</p>
              </article>
            </AnimateIn>
          ))}
        </div>
      </PageSection>

      <SectionWave fill="band" flip />

      <PageSection variant="alt">
        <AnimateIn>
          <SectionHeading
            eyebrow="Marché"
            title="Positionnement"
            titleAs="h2"
            align="left"
            className="mb-10 max-w-2xl"
          />
        </AnimateIn>
        <AnimateIn delay={0.1}>
          <p className="max-w-3xl text-lg leading-relaxed text-taupe">{about.positioning}</p>
        </AnimateIn>
      </PageSection>

      <SectionWave fill="petrol" />
    </>
  );
}
