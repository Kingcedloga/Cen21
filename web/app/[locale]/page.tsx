import { getTranslations, setRequestLocale } from "next-intl/server";

import { OrganizationJsonLd } from "@/components/seo/OrganizationJsonLd";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { SubsidiariesArc, type ArcItem } from "@/components/filiales/SubsidiariesArc";
import { HeroCinematic } from "@/components/sections/HeroCinematic";
import { HomeExperienceSection } from "@/components/sections/HomeExperienceSection";
import { HomeHousesSection, type HouseItem } from "@/components/sections/home/HomeHousesSection";
import { HomeEventsDeck, type DeckEvent } from "@/components/sections/home/HomeEventsDeck";
import { HomeManifesto } from "@/components/sections/home/HomeManifesto";
import { HomeUniverseBurst } from "@/components/sections/home/HomeUniverseBurst";
import { HomeUniversesScrub, type UniverseCard } from "@/components/sections/home/HomeUniversesScrub";
import { MarketPositioningSection } from "@/components/sections/MarketPositioningSection";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PageSection } from "@/components/layout/PageSection";
import { SectionBlend } from "@/components/layout/SectionBlend";
import {
  getAboutContent,
  getEvents,
  getExperienceVideoId,
  getPastEvents,
  getSectorLabel,
  getSiteConfig,
  getStatsContent,
  getSubsidiaries,
} from "@/lib/content";
import type { Locale } from "@/i18n/routing";
import { resolvePageMetadata } from "@/lib/seo";
import { brandSurface } from "@/lib/subsidiary-brand";
import type { EventItem, Subsidiary } from "@/lib/types";

/** Cartes de la pile d'événements sur l'accueil. */
const DECK_SIZE = 5;

/** Photo locale de préférence (les photos des filiales plutôt que les images d'illustration). */
function pickImage(candidates: string[], used: Set<string>): string | undefined {
  const fresh = candidates.filter((src) => !used.has(src));
  const image = fresh.find((src) => src.startsWith("/")) ?? fresh[0];
  if (image) used.add(image);
  return image;
}

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
  const tEvents = await getTranslations("events");
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

  // « Nos univers » : trois secteurs d'après les filiales, plus l'agenda.
  const usedImages = new Set<string>();
  const sectorCard = (key: string, sector: Subsidiary["sector"], title: string, text: string): UniverseCard | null => {
    const venues = subsidiaries.filter((s) => s.sector === sector);
    const image = pickImage(venues.map((s) => s.coverImage), usedImages);
    if (!venues.length || !image) return null;
    return {
      key,
      title,
      text,
      image,
      venues: { label: t("universeVenues", { universe: title }), names: venues.map((s) => s.name) },
    };
  };
  const countIn = (sector: Subsidiary["sector"]) => subsidiaries.filter((s) => s.sector === sector).length;

  // Pile d'événements : à venir d'abord, complétée par les plus récents passés.
  const upcomingEvents = getEvents(l);
  const deckSource: { event: EventItem; status: DeckEvent["status"] }[] = [
    ...upcomingEvents.map((event) => ({ event, status: "upcoming" as const })),
    ...getPastEvents(l).map((event) => ({ event, status: "past" as const })),
  ].slice(0, DECK_SIZE);
  const dateFormat = new Intl.DateTimeFormat(l === "fr" ? "fr-FR" : "en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  const deckEvents: DeckEvent[] = deckSource.map(({ event, status }) => ({
    id: event.id,
    title: event.displayTitle ?? event.title,
    dateLabel: dateFormat.format(new Date(event.date)),
    dateTime: event.date,
    location: event.location,
    excerpt: event.excerpt,
    image: event.image,
    status,
  }));
  const hasUpcoming = upcomingEvents.length > 0;

  const universeCards = [
    sectorCard(
      "restaurants",
      "restaurant",
      t("universeRestaurants"),
      t("universeRestaurantsText", { count: countIn("restaurant") }),
    ),
    sectorCard("lounges", "lounge", t("universeLounges"), t("universeLoungesText", { count: countIn("lounge") })),
    sectorCard("nightlife", "nightclub", t("universeNightlife"), t("universeNightlifeText")),
  ].filter((card): card is UniverseCard => card !== null);
  const eventsImage = pickImage(deckSource.map(({ event }) => event.image), usedImages);
  if (eventsImage) {
    universeCards.push({ key: "events", title: t("universeEvents"), text: t("universeEventsText"), image: eventsImage });
  }

  const heroSlides =
    site.heroSlides && site.heroSlides.length > 0
      ? site.heroSlides
      : [{ src: site.heroImage, alt: site.name }];

  // Photo d'ambiance pour la section Expérience (fond du bouton play)
  const experienceImage = heroSlides[2]?.src ?? heroSlides[0]?.src ?? site.heroImage;

  return (
    <>
      <OrganizationJsonLd locale={l} />

      {/* Rideau : le hero reste collé, « Nos maisons » monte par-dessus. */}
      <div className="hero-curtain">
        <HeroCinematic
          slides={heroSlides}
          siteName={site.name}
          pills={heroPills}
          className="hero-curtain__hero"
        />
        {/* Reduced motion : pas de rideau, séparateur fondu. */}
        <SectionBlend from="var(--color-petrol)" to="var(--color-petrol-panel-4)" />
        <HomeHousesSection
          eyebrow={t("housesEyebrow")}
          title={t("housesTitle", { count })}
          titleSweep={t("housesTitleSweep")}
          items={houses}
          className="hero-curtain__cover"
        />
      </div>

      {/* « Un groupe, dix univers » : même fond que « Nos maisons », sans raccord. */}
      <HomeUniverseBurst
        eyebrow={tHero("pillSectors")}
        title={t("burstTitle", { count })}
        titleSweep={t("burstTitleSweep", { count })}
        text={t("burstText")}
        cta={{ href: "/filiales", label: tHero("ctaSubsidiaries") }}
        socialLabel={t("burstSocial")}
        social={site.social}
        images={subsidiaries.map((s) => ({ src: s.coverImage }))}
      />

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

      {/* Même fond que le manifeste : les univers prennent la suite sans raccord. */}
      <HomeUniversesScrub
        badge={t("universesBadge")}
        title={t("universesTitle")}
        titleSweep={t("universesTitleSweep")}
        cards={universeCards}
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

      <SectionBlend from="var(--color-ivory)" to="var(--color-petrol)" />

      <HomeEventsDeck
        eyebrow={tEvents("eyebrow")}
        title={t(hasUpcoming ? "eventsTitleUpcoming" : "eventsTitlePast")}
        titleSweep={t(hasUpcoming ? "eventsTitleUpcomingSweep" : "eventsTitlePastSweep")}
        statusLabels={{ upcoming: t("eventsStatusUpcoming"), past: t("eventsStatusPast") }}
        cta={{ href: "/evenements", label: tEvents("viewAll") }}
        events={deckEvents}
      />

      {/* Section à photo : l'image se fond dans la couleur de la section. */}
      <SectionBlend from="var(--color-petrol)" to="var(--experience-surface)" />

      <HomeExperienceSection backgroundImage={experienceImage} videoId={getExperienceVideoId(l)} />
    </>
  );
}
