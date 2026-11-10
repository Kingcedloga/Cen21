import { getTranslations, setRequestLocale } from "next-intl/server";

import { HeroCurtain } from "@/components/layout/HeroCurtain";
import { SectionBlend } from "@/components/layout/SectionBlend";
import { AboutOriginsSection } from "@/components/sections/AboutOriginsSection";
import { AboutTeamSection } from "@/components/sections/AboutTeamSection";
import { AboutVisionSection } from "@/components/sections/AboutVisionSection";
import { InnerHero } from "@/components/sections/InnerHero";
import { PageOutro } from "@/components/sections/PageOutro";
import type { Locale } from "@/i18n/routing";
import { getAboutContent, getSubsidiaries } from "@/lib/content";
import { resolvePageMetadata } from "@/lib/seo";

const FALLBACK_HERO =
  "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=2400&q=85";
const FALLBACK_ORIGINS_IMAGE =
  "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=2400&q=85";
const FALLBACK_VISION_IMAGES: [string, string, string] = [
  "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=1200&q=85",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=85",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=85",
];

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return resolvePageMetadata({
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/a-propos",
    locale: locale as Locale,
  });
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const l = locale as Locale;
  const about = getAboutContent(l);
  const t = await getTranslations("about");
  const tNav = await getTranslations("nav");
  const tCommon = await getTranslations("common");
  const tOutro = await getTranslations("outro");
  const tCta = await getTranslations("cta");

  return (
    <>
      {/* La progression de lecture est affichée par la capsule de navigation. */}
      <HeroCurtain
        surface="var(--color-ivory)"
        hero={
          <InnerHero
            className="hero-curtain__hero"
            eyebrow={t("eyebrow")}
            title={t("title")}
            titleSweep={t("titleSweep")}
            description={t("description")}
            image={about.heroImage ?? FALLBACK_HERO}
            imageAlt={t("heroImageAlt")}
            breadcrumb={{ label: tCommon("breadcrumb"), home: tNav("home"), current: tNav("about") }}
          />
        }
      >
        <AboutOriginsSection
          eyebrow={t("originsEyebrow")}
          title={t("originsTitle")}
          description={about.history}
          image={about.originsImage ?? FALLBACK_ORIGINS_IMAGE}
          imageAlt={t("originsImageAlt")}
        />
      </HeroCurtain>

      <AboutVisionSection
        eyebrow={t("visionEyebrow")}
        title={t("visionTitle")}
        description={about.vision}
        cta={t("visionCta")}
        images={[
          about.visionImages?.[0] ?? FALLBACK_VISION_IMAGES[0],
          about.visionImages?.[1] ?? FALLBACK_VISION_IMAGES[1],
          about.visionImages?.[2] ?? FALLBACK_VISION_IMAGES[2],
        ]}
      />

      {about.team && about.team.length > 0 && (
        <AboutTeamSection
          eyebrow={t("teamEyebrow")}
          title={t("teamTitle")}
          description={t("teamDescription")}
          subtitle={t("teamSubtitle")}
          members={about.team}
          locale={locale}
        />
      )}

      <SectionBlend to="var(--color-anthracite)" />

      <PageOutro
        eyebrow={tOutro("eyebrow")}
        title={tOutro("aboutTitle", { count: getSubsidiaries(l).length })}
        titleSweep={tOutro("aboutSweep")}
        primary={{ href: "/contact", label: tCta("contact") }}
        next={{ href: "/filiales", label: tOutro("next"), title: tNav("subsidiaries") }}
      />
    </>
  );
}
