import { getTranslations, setRequestLocale } from "next-intl/server";

import { OrganizationJsonLd } from "@/components/seo/OrganizationJsonLd";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { FeaturedSubsidiariesSlider } from "@/components/sections/FeaturedSubsidiariesSlider";
import { HeroCinematic } from "@/components/sections/HeroCinematic";
import { HomeExperienceSection } from "@/components/sections/HomeExperienceSection";
import { HomePhilosophySection } from "@/components/sections/HomePhilosophySection";
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
        spacing="loose"
        containerClassName="mx-auto max-w-[min(100%,1400px)]"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-7">
            <AnimateIn>
              <SectionHeading
                eyebrow={t("groupEyebrow")}
                title={t("groupTitle")}
                description={t("groupDescription")}
                align="left"
                className="mb-8"
              />
              <div className="mt-8 flex flex-wrap gap-4">
                <Button href="/a-propos">
                  {l === "fr" ? "Découvrir notre histoire" : "Discover our history"}
                </Button>
                <Button href="/filiales" variant="secondary">
                  {t("viewMore")}
                </Button>
              </div>
            </AnimateIn>
          </div>

          <div className="lg:col-span-5 relative">
            <AnimateIn variant="fadeScale" delay={0.15}>
              <div className="relative aspect-[4/5] w-full rounded-3xl overflow-hidden border border-gold/25 shadow-[0_24px_50px_-12px_rgba(0,0,0,0.6)] group">
                <Image
                  src={about.originsImage || heroSlides[0]?.src || site.heroImage}
                  alt={site.name}
                  fill
                  className="object-cover transition-transform duration-grand ease-out group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-petrol/90 via-petrol/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/10 bg-petrol/60 p-5 backdrop-blur-md">
                  <p className="text-xs font-semibold uppercase tracking-widest text-gold">
                    Kinshasa · RDC
                  </p>
                  <p className="mt-1 text-sm text-ivory/90 font-medium">
                    {l === "fr"
                      ? "L'art de l'hospitalité & de la haute gastronomie"
                      : "The art of hospitality & fine dining"}
                  </p>
                </div>
              </div>
            </AnimateIn>
          </div>
        </div>
      </PageSection>

      <MarketPositioningSection
        eyebrow={t("marketEyebrow")}
        title={t("marketTitle")}
        team={about.team ?? []}
      />

      <HomePhilosophySection
        eyebrow={t("philosophyEyebrow")}
        statement={about.positioning}
        values={about.values}
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
