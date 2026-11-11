import { getTranslations, setRequestLocale } from "next-intl/server";

import { HeroCurtain } from "@/components/layout/HeroCurtain";
import { PageSection, SECTION_SURFACE } from "@/components/layout/PageSection";
import { SectionBlend } from "@/components/layout/SectionBlend";
import { AboutFigures } from "@/components/sections/about/AboutFigures";
import { AboutPartners, type DistinctionRow, type PartnerCard } from "@/components/sections/about/AboutPartners";
import { AboutStory } from "@/components/sections/about/AboutStory";
import { AboutTeamArc, type TeamMember } from "@/components/sections/about/AboutTeamArc";
import { AboutValues } from "@/components/sections/about/AboutValues";
import { HomeHousesSection, type HouseItem } from "@/components/sections/home/HomeHousesSection";
import { HomeUniversesScrub, type UniverseCard } from "@/components/sections/home/HomeUniversesScrub";
import { InnerHero } from "@/components/sections/InnerHero";
import { PageOutro } from "@/components/sections/PageOutro";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Locale } from "@/i18n/routing";
import { getAboutContent, getStatsContent, getSubsidiaries } from "@/lib/content";
import { galleryEntrySrc } from "@/lib/gallery-categories";
import { resolvePageMetadata } from "@/lib/seo";
import { brandSurface, contrastRatio } from "@/lib/subsidiary-brand";
import { resolveSubsidiaryHeroImage } from "@/lib/subsidiary-hero-layout";
import { placeCities, subsidiaryPlaces } from "@/lib/subsidiary-places";
import type { Subsidiary } from "@/lib/types";

const FALLBACK_HERO =
  "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=2400&q=85";
const FALLBACK_ORIGINS_IMAGE =
  "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=2400&q=85";
const FALLBACK_VISION_IMAGE =
  "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=1200&q=85";

/** Univers comptés dans les chiffres, avec leur message (pluriel ICU). */
const SECTOR_FIGURES = [
  ["restaurant", "figuresRestaurants"],
  ["lounge", "figuresLounges"],
  ["nightclub", "figuresClubs"],
] as const;

/** Photo locale de préférence (photos des filiales plutôt qu'images d'illustration). */
function pickImage(candidates: string[], used: Set<string>, fallback: string): string {
  const fresh = candidates.filter((src) => !used.has(src));
  const image = fresh.find((src) => src.startsWith("/")) ?? fresh[0] ?? fallback;
  used.add(image);
  return image;
}

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
  const subsidiaries = getSubsidiaries(l);
  const stats = getStatsContent(l).items;
  const t = await getTranslations("about");
  const tNav = await getTranslations("nav");
  const tCommon = await getTranslations("common");
  const tHome = await getTranslations("home");
  const tOutro = await getTranslations("outro");
  const tCta = await getTranslations("cta");

  const count = subsidiaries.length;
  const places = subsidiaryPlaces(subsidiaries);
  const cities = placeCities(places);
  const list = new Intl.ListFormat(l, { style: "long", type: "conjunction" });
  const countIn = (sector: Subsidiary["sector"]) => subsidiaries.filter((s) => s.sector === sector).length;
  const bySlug = new Map(subsidiaries.map((s) => [s.slug, s]));
  const housesOf = (slugs: string[] = []) =>
    slugs.map((slug) => bySlug.get(slug)).filter((s): s is Subsidiary => s != null);

  // Frise « Notre parcours » : les jalons d'about.json. L'année s'ajoute à
  // l'étiquette dès qu'elle est renseignée ; les pastilles nomment les maisons.
  const used = new Set<string>();
  const milestones: UniverseCard[] = (about.milestones ?? []).map((milestone, index) => {
    const houses = housesOf(milestone.subsidiarySlugs);
    const label = t("milestoneLabel", { n: String(index + 1).padStart(2, "0") });
    // Photo d'une maison du jalon (visuel hero d'abord, puis galeries) ; sinon visuel du groupe.
    const candidates = houses.length
      ? [
          ...houses.map((s) => resolveSubsidiaryHeroImage(s.slug, s.coverImage)),
          ...houses.flatMap((s) => s.galleryImages.map(galleryEntrySrc)),
          ...houses.map((s) => s.coverImage),
        ]
      : [about.visionImages?.[0] ?? FALLBACK_VISION_IMAGE, about.originsImage ?? FALLBACK_ORIGINS_IMAGE];
    return {
      key: milestone.id,
      eyebrow: milestone.year ? t("milestoneWithYear", { label, year: milestone.year }) : label,
      title: milestone.title,
      text: milestone.description,
      image: pickImage(candidates, used, FALLBACK_ORIGINS_IMAGE),
      venues: houses.length ? { label: t("milestoneHouses"), names: houses.map((s) => s.name) } : undefined,
    };
  });

  // Partenaires : logo et couleur repris de la filiale qui opère la marque.
  const partners: PartnerCard[] = (about.partners ?? []).map((partner) => {
    const house = partner.subsidiarySlug ? bySlug.get(partner.subsidiarySlug) : undefined;
    const brandColor = house ? brandSurface(house.slug, house.accentColor) : "var(--color-petrol)";
    return {
      name: partner.name,
      role: partner.role,
      url: partner.url,
      logo: house?.brandLogo,
      brandColor,
      // Logos blancs : contraste 3:1 minimum (élément graphique), sinon logo sombre.
      logoOnLight: house != null && contrastRatio("#FFFFFF", brandColor) < 3,
      visitAria: t("partnersVisitAria", { name: partner.name }),
    };
  });
  // Distinctions : affichées dès que la liste d'about.json est remplie.
  const distinctions: DistinctionRow[] = (about.distinctions ?? []).map((item) => ({
    id: item.id,
    year: item.year,
    title: item.title,
    issuer: item.issuer,
    house: item.subsidiarySlug ? bySlug.get(item.subsidiarySlug)?.name : undefined,
    url: item.url,
  }));
  const showPartners = partners.length > 0 || distinctions.length > 0;

  const team: TeamMember[] = (about.team ?? []).map((member, index, all) => ({
    name: member.name,
    role: member.role,
    photo: member.photo,
    quote: member.quote,
    bio: member.bio,
    positionLabel: t("teamPosition", { index: index + 1, total: all.length, name: member.name }),
    discoverLabel: t("teamDiscoverAria", { name: member.name }),
  }));

  const houses: HouseItem[] = subsidiaries
    .filter((s) => s.brandLogo)
    .map((s) => ({
      slug: s.slug,
      name: s.name,
      logo: s.brandLogo as string,
      brandColor: brandSurface(s.slug, s.accentColor),
      ariaLabel: tCommon("discover", { name: s.name }),
    }));

  return (
    <>
      <HeroCurtain
        surface={SECTION_SURFACE.light}
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
        {/* La progression de lecture est affichée par la capsule de navigation. */}
        <AboutStory eyebrow={t("originsEyebrow")} title={t("originsTitle")} statement={about.history} />
      </HeroCurtain>

      {/* Séparateurs fondus entre sections de couleurs différentes. */}
      <SectionBlend from={SECTION_SURFACE.light} to={SECTION_SURFACE.dark} />

      {milestones.length > 0 && (
        <HomeUniversesScrub
          titleId="about-journey-title"
          badge={t("parcoursBadge")}
          title={t("parcoursTitle", { count: milestones.length })}
          titleSweep={t("parcoursSweep")}
          cards={milestones}
        />
      )}

      {team.length > 0 && (
        <>
          <SectionBlend from={SECTION_SURFACE.dark} to={SECTION_SURFACE.light} />
          <PageSection
            variant="light"
            spacing="default"
            // Retient l'éventail, qui déborde jusqu'aux bords de l'écran.
            overflow="hidden"
            id="equipe"
            ariaLabelledby="about-team-title"
            containerClassName="mx-auto max-w-[min(100%,1400px)]"
          >
            <SectionHeading
              look="editorial"
              tone="light"
              eyebrow={t("teamEyebrow")}
              title={t("teamTitle")}
              sweep={t("teamTitleSweep")}
              description={t("teamDescription")}
              titleAs="h2"
              titleId="about-team-title"
              align="left"
              className="mb-0! max-w-2xl"
            />
            <div className="relative z-10 mt-12 w-full md:mt-16">
              <AboutTeamArc
                members={team}
                labels={{
                  region: t("teamRegion"),
                  roledescription: tHome("arcRoledescription"),
                  prev: t("teamPrev"),
                  next: t("teamNext"),
                  drag: tHome("arcDrag"),
                  discover: t("teamDiscover"),
                  close: t("teamClose"),
                }}
              />
            </div>
          </PageSection>
          <SectionBlend from={SECTION_SURFACE.light} to={SECTION_SURFACE.default} />
        </>
      )}
      {team.length === 0 && <SectionBlend from={SECTION_SURFACE.dark} to={SECTION_SURFACE.default} />}

      <AboutFigures
        heading={{ eyebrow: t("figuresEyebrow"), title: t("figuresTitle"), sweep: t("figuresSweep") }}
        houses={{
          label: t("figuresHousesLabel"),
          count,
          text: t("figuresHousesText"),
          sectorsLabel: t("figuresSectors"),
          sectors: SECTOR_FIGURES.filter(([sector]) => countIn(sector) > 0).map(([sector, key]) =>
            t(key, { count: countIn(sector) }),
          ),
        }}
        stats={{ label: t("figuresStats"), items: stats.map(({ value, label }) => ({ value, label })) }}
        addresses={{
          label: t("figuresAddressesLabel"),
          count: places.length,
          text: t("figuresAddressesText", { cities: list.format(cities) }),
          cta: { href: "/contact#adresses", label: t("figuresMapCta") },
        }}
      />

      <SectionBlend from={SECTION_SURFACE.default} to={SECTION_SURFACE.light} />

      <AboutValues
        heading={{ eyebrow: t("dnaEyebrow"), title: t("dnaTitle"), sweep: t("valuesTitleSweep"), intro: t("valuesIntro") }}
        values={about.values}
      />

      <SectionBlend from={SECTION_SURFACE.light} to={SECTION_SURFACE.dark} />

      <HomeHousesSection
        titleId="about-houses-title"
        eyebrow={tHome("housesEyebrow")}
        title={t("housesTitle")}
        titleSweep={t("housesSweep")}
        items={houses}
        className="bg-petrol-panel-4"
      />

      {showPartners && (
        <>
          <SectionBlend from={SECTION_SURFACE.dark} to={SECTION_SURFACE.light} />
          <AboutPartners
            heading={{
              eyebrow: t("partnersEyebrow"),
              title: t("partnersTitle"),
              sweep: t("partnersSweep"),
              intro: t("partnersIntro"),
            }}
            partners={partners}
            visitLabel={t("partnersVisit")}
            distinctions={{ title: t("distinctionsTitle"), items: distinctions }}
          />
          <SectionBlend from={SECTION_SURFACE.light} to="var(--color-anthracite)" />
        </>
      )}

      <PageOutro
        eyebrow={tOutro("eyebrow")}
        title={tOutro("aboutTitle", { count })}
        titleSweep={tOutro("aboutSweep")}
        primary={{ href: "/contact", label: tCta("contact") }}
        next={{ href: "/filiales", label: tOutro("next"), title: tNav("subsidiaries") }}
      />
    </>
  );
}
