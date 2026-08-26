import { getTranslations, setRequestLocale } from "next-intl/server";

import { OrganizationJsonLd } from "@/components/seo/OrganizationJsonLd";
import { FeaturedSubsidiariesSlider } from "@/components/sections/FeaturedSubsidiariesSlider";
import { HeroCinematic } from "@/components/sections/HeroCinematic";
import { HomeExperienceSection } from "@/components/sections/HomeExperienceSection";
import { MarketPositioningSection } from "@/components/sections/MarketPositioningSection";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StatsBanner } from "@/components/sections/StatsBanner";
import { PageSection } from "@/components/layout/PageSection";
import { getSubsidiaries, getSiteConfig, getExperienceVideoId, getAboutContent } from "@/lib/content";
import type { Locale } from "@/i18n/routing";
import { resolvePageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const site = getSiteConfig(locale as Locale);
  const t = await getTranslations({ locale, namespace: "home" });
  return resolvePageMetadata({
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/",
    locale: locale as Locale,
  });
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const l = locale as Locale;
  const site = getSiteConfig(l);
  const subsidiaries = getSubsidiaries(l);
  const about = getAboutContent(l);
  const t = await getTranslations("home");

  const heroSlides =
    site.heroSlides && site.heroSlides.length > 0
      ? site.heroSlides
      : [{ src: site.heroImage, alt: site.name }];

  // Photo d'ambiance pour la section Expérience (fond du bouton play)
  const experienceImage = heroSlides[2]?.src ?? heroSlides[0]?.src ?? site.heroImage;

  return (
    <>
      <OrganizationJsonLd locale={l} />

      <HeroCinematic slides={heroSlides} siteName={site.name} />

      <PageSection
        id="home-group"
        variant="default"
        spacing="default"
        containerClassName="mx-auto max-w-[min(100%,1400px)]"
      >
        <AnimateIn>
          <SectionHeading
            eyebrow={t("groupEyebrow")}
            title={t("groupTitle")}
            description={t("groupDescription")}
            align="left"
            className="mb-6 md:mb-8 max-w-2xl"
          />
        </AnimateIn>
      </PageSection>

      <MarketPositioningSection
        eyebrow={t("marketEyebrow")}
        title={t("marketTitle")}
        description={about.positioning}
        team={about.team ?? []}
      />

      <PageSection
        variant="light"
        spacing="default"
        id="nos-filiales"
        ariaLabelledby="nos-filiales-title"
        containerClassName="mx-auto max-w-[min(100%,1400px)]"
        className="!pb-0"
      >
        <div className="relative isolate flex flex-col items-stretch gap-0">
          <div className="relative z-[60] shrink-0 max-w-2xl pr-6 md:pr-8">
            <AnimateIn>
              <SectionHeading
                eyebrow={t("addressesEyebrow")}
                title={t("addressesTitle")}
                titleAs="h2"
                subtitleAs="h3"
                titleId="nos-filiales-title"
                align="left"
                tone="light"
                className="mb-0 max-w-2xl"
              />
            </AnimateIn>
          </div>

          <div className="relative z-10 mt-14 w-full max-sm:mt-32 sm:mt-16 md:mt-20 lg:mt-24 xl:mt-28">
            <FeaturedSubsidiariesSlider subsidiaries={subsidiaries} />
          </div>
        </div>
      </PageSection>

      <StatsBanner />

      <HomeExperienceSection backgroundImage={experienceImage} videoId={getExperienceVideoId(l)} />
    </>
  );
}
