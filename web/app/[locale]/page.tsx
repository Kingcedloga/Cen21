import { getTranslations, setRequestLocale } from "next-intl/server";

import { OrganizationJsonLd } from "@/components/seo/OrganizationJsonLd";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { SubsidiariesArc, type ArcItem } from "@/components/filiales/SubsidiariesArc";
import { HeroCinematic } from "@/components/sections/HeroCinematic";
import { HomeExperienceSection } from "@/components/sections/HomeExperienceSection";
import { HomeHousesSection, type HouseItem } from "@/components/sections/home/HomeHousesSection";
import { HomeManifesto } from "@/components/sections/home/HomeManifesto";
import { MarketPositioningSection } from "@/components/sections/MarketPositioningSection";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PageSection } from "@/components/layout/PageSection";
import { SectionBlend } from "@/components/layout/SectionBlend";
import {
  getAboutContent,
  getExperienceVideoId,
  getSectorLabel,
  getSiteConfig,
  getStatsContent,
  getSubsidiaries,
} from "@/lib/content";
import type { Locale } from "@/i18n/routing";
import { resolvePageMetadata } from "@/lib/seo";
import { brandSurface } from "@/lib/subsidiary-brand";

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
  const stats = getStatsContent(l).items.map(({ value, label }) => ({ value, label }));
  const t = await getTranslations("home");
  const tHero = await getTranslations("hero");
  const tCommon = await getTranslations("common");
  const count = subsidiaries.length;

  // Pastille rotative du hero : un message par diapositive.
  const heroPills = [
    tHero("tagline"),
    tHero("pillHouses", { count }),
    tHero("pillSectors"),
    tHero("pillCity"),
  ];

  const houses: HouseItem[] = subsidiaries
    .filter((s) => s.brandLogo)
    .map((s) => ({
      slug: s.slug,
      name: s.name,
      logo: s.brandLogo as string,
      brandColor: brandSurface(s.slug, s.accentColor),
      ariaLabel: tCommon("discover", { name: s.name }),
    }));

  const arcItems: ArcItem[] = subsidiaries.map((s, index) => ({
    slug: s.slug,
    name: s.name,
    sector: getSectorLabel(l, s.sector),
    tagline: s.tagline,
    cover: s.coverImage,
    logo: s.brandLogo,
    brandColor: brandSurface(s.slug, s.accentColor),
    ariaLabel: tCommon("discover", { name: s.name }),
    positionLabel: t("arcPosition", { index: index + 1, total: count, name: s.name }),
  }));

  const heroSlides =
    site.heroSlides && site.heroSlides.length > 0
      ? site.heroSlides
      : [{ src: site.heroImage, alt: site.name }];

  // Photo d'ambiance pour la section Expérience (fond du bouton play)
  const experienceImage = heroSlides[2]?.src ?? heroSlides[0]?.src ?? site.heroImage;

  return (
    <>
      <OrganizationJsonLd locale={l} />

      {/* Rideau (desktop) : le hero reste collé, « Nos maisons » monte par-dessus. */}
      <div className="hero-curtain">
        <HeroCinematic
          slides={heroSlides}
          siteName={site.name}
          pills={heroPills}
          className="hero-curtain__hero"
        />
        {/* Mobile, tablette, reduced motion : pas de rideau, séparateur fondu. */}
        <SectionBlend from="var(--color-petrol)" to="var(--color-petrol-panel-4)" />
        <HomeHousesSection
          eyebrow={t("housesEyebrow")}
          title={t("housesTitle", { count })}
          titleSweep={t("housesTitleSweep")}
          items={houses}
          className="hero-curtain__cover"
        />
      </div>

      {/* Séparateurs fondus : du bas de la section précédente (from) au haut de la suivante (to). */}
      <SectionBlend from="var(--color-petrol-panel-4)" to="var(--color-petrol)" />

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

      <SectionBlend from="var(--color-petrol)" to="var(--market-top-field)" />

      <MarketPositioningSection
        eyebrow={t("marketEyebrow")}
        title={t("marketTitle")}
        team={about.team ?? []}
      />

      <SectionBlend from="var(--market-bottom-edge)" to="var(--color-petrol-panel-4)" />

      <HomeManifesto
        eyebrow={t("philosophyEyebrow")}
        statement={about.positioning}
        values={about.values}
        stats={stats}
        valuesLabel={t("manifestoValues")}
        statsLabel={t("manifestoStats")}
      />

      <SectionBlend from="var(--color-petrol-panel-4)" to="var(--color-ivory)" />

      <PageSection
        variant="light"
        spacing="default"
        id="nos-filiales"
        ariaLabelledby="nos-filiales-title"
        containerClassName="mx-auto max-w-[min(100%,1400px)]"
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

          <div className="relative z-10 mt-12 w-full md:mt-16">
            <SubsidiariesArc
              items={arcItems}
              labels={{
                region: t("arcRegion"),
                roledescription: t("arcRoledescription"),
                prev: t("arcPrev"),
                next: t("arcNext"),
                drag: t("arcDrag"),
                discover: t("arcDiscover"),
              }}
            />
          </div>
        </div>
      </PageSection>

      {/* Section à photo : le débord fondu et flouté couvre la lisière de l'image. */}
      <SectionBlend from="var(--color-ivory)" to="var(--experience-surface)" />

      <HomeExperienceSection backgroundImage={experienceImage} videoId={getExperienceVideoId(l)} />
    </>
  );
}
