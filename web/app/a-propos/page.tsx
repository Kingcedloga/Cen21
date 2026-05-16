import { PageSection } from "@/components/layout/PageSection";
import { SectionWave } from "@/components/layout/SectionWave";
import { AboutHero } from "@/components/sections/AboutHero";
import { TeamGrid } from "@/components/sections/TeamGrid";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { ReadingProgress } from "@/components/ui/ReadingProgress";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getAboutContent } from "@/lib/content";
import { createPageMetadata } from "@/lib/seo";

const about = getAboutContent();

const FALLBACK_HERO =
  "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=2400&q=85";

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

      <AboutHero
        eyebrow="À propos"
        title="Notre histoire & notre vision"
        description="Une holding née de la passion pour l'art de recevoir et l'exigence du détail."
        image={about.heroImage ?? FALLBACK_HERO}
        imageAlt="Architecture intérieure d'un établissement Cen21 Hospitality"
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

      {about.team && about.team.length > 0 && (
        <>
          <PageSection
            variant="default"
            spacing="loose"
            id="equipe-dirigeante"
            ariaLabelledby="equipe-dirigeante-title"
          >
            <AnimateIn>
              <SectionHeading
                eyebrow="Direction"
                title="Notre équipe dirigeante"
                subtitle="Les architectes de notre vision"
                titleAs="h2"
                subtitleAs="h3"
                titleId="equipe-dirigeante-title"
                description="Trois leaders complémentaires qui orchestrent la stratégie, l'expansion et l'excellence opérationnelle du groupe."
                align="left"
                className="mb-12 max-w-2xl md:mb-16"
              />
            </AnimateIn>
            <TeamGrid members={about.team} />
          </PageSection>

          <SectionWave fill="band" flip />
        </>
      )}

      <PageSection variant={about.team && about.team.length > 0 ? "alt" : "default"}>
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

      <PageSection variant={about.team && about.team.length > 0 ? "default" : "alt"}>
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
