import { getTranslations, setRequestLocale } from "next-intl/server";

import { PageSection } from "@/components/layout/PageSection";
import { SectionWave } from "@/components/layout/SectionWave";
import { AboutHero } from "@/components/sections/AboutHero";
import { TeamGrid } from "@/components/sections/TeamGrid";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { ReadingProgress } from "@/components/ui/ReadingProgress";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Locale } from "@/i18n/routing";
import { getAboutContent } from "@/lib/content";
import { createPageMetadata } from "@/lib/seo";

const FALLBACK_HERO =
  "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=2400&q=85";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return createPageMetadata({
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/a-propos",
    locale: locale as Locale,
  });
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const about = getAboutContent(locale as Locale);
  const t = await getTranslations("about");

  return (
    <>
      <ReadingProgress />

      <AboutHero
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
        image={about.heroImage ?? FALLBACK_HERO}
        imageAlt={t("heroImageAlt")}
      />

      <PageSection variant="default">
        <AnimateIn>
          <SectionHeading
            eyebrow={t("originsEyebrow")}
            title={t("originsTitle")}
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
            eyebrow={t("visionEyebrow")}
            title={t("visionTitle")}
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
                eyebrow={t("teamEyebrow")}
                title={t("teamTitle")}
                subtitle={t("teamSubtitle")}
                titleAs="h2"
                subtitleAs="h3"
                titleId="equipe-dirigeante-title"
                description={t("teamDescription")}
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
            eyebrow={t("dnaEyebrow")}
            title={t("dnaTitle")}
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
            eyebrow={t("marketEyebrow")}
            title={t("marketTitle")}
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
