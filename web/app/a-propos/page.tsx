import { PageHero } from "@/components/sections/PageHero";
import { AnimateIn } from "@/components/ui/AnimateIn";
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
      <PageHero
        eyebrow="À propos"
        title="Notre histoire & notre vision"
        description="Une holding née de la passion pour l'art de recevoir et l'exigence du détail."
      />

      <section className="py-16 px-4 md:px-6 max-w-7xl mx-auto">
        <AnimateIn>
          <h2 className="font-[family-name:var(--font-cormorant)] text-3xl text-ivory mb-6">
            Histoire
          </h2>
          <p className="text-taupe text-lg leading-relaxed max-w-3xl">{about.history}</p>
        </AnimateIn>
      </section>

      <section className="py-16 px-4 md:px-6 bg-anthracite/40">
        <div className="max-w-7xl mx-auto">
          <AnimateIn>
            <h2 className="font-[family-name:var(--font-cormorant)] text-3xl text-ivory mb-6">
              Vision
            </h2>
            <p className="text-taupe text-lg leading-relaxed max-w-3xl">{about.vision}</p>
          </AnimateIn>
        </div>
      </section>

      <section className="py-16 px-4 md:px-6 max-w-7xl mx-auto">
        <AnimateIn>
          <h2 className="font-[family-name:var(--font-cormorant)] text-3xl text-ivory mb-10">
            Valeurs
          </h2>
        </AnimateIn>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {about.values.map((v, i) => (
            <AnimateIn key={v.title} delay={i * 0.05}>
              <article className="glass-panel p-8 rounded-xl">
                <h3 className="font-[family-name:var(--font-cormorant)] text-xl text-gold mb-3">
                  {v.title}
                </h3>
                <p className="text-taupe leading-relaxed">{v.description}</p>
              </article>
            </AnimateIn>
          ))}
        </div>
      </section>

      <section className="py-16 px-4 md:px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <AnimateIn>
            <h2 className="font-[family-name:var(--font-cormorant)] text-3xl text-ivory mb-6">
              Positionnement
            </h2>
            <p className="text-taupe text-lg leading-relaxed max-w-3xl">
              {about.positioning}
            </p>
          </AnimateIn>
        </div>
      </section>
    </>
  );
}
