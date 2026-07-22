import { notFound, redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { EventCard } from "@/components/cards/EventCard";
import { StickyMobileActions } from "@/components/filiales/StickyMobileActions";
import { KLoungeIntroSection } from "@/components/filiales/KLoungeIntroSection";
import { MillionaireClubIntroSection } from "@/components/filiales/MillionaireClubIntroSection";
import { MillionaireClubScatteredGallery } from "@/components/filiales/MillionaireClubScatteredGallery";
import { KLoungeMarqueeGallery } from "@/components/filiales/KLoungeMarqueeGallery";
import { KLoungeReservationBanner } from "@/components/filiales/KLoungeReservationBanner";
import { MokaMoreAboutSection } from "@/components/filiales/MokaMoreAboutSection";
import { MokaMoreReservationSection } from "@/components/filiales/MokaMoreReservationSection";
import { MokaMoreGallerySection } from "@/components/filiales/MokaMoreGallerySection";
import { MokaMoreVideoSection } from "@/components/filiales/MokaMoreVideoSection";
import { MokaMoreHero } from "@/components/filiales/MokaMoreHero";
import { GourmetMexicanaHero } from "@/components/filiales/GourmetMexicanaHero";
import { GourmetMexicanaCategoriesSection } from "@/components/filiales/GourmetMexicanaCategoriesSection";
import { GourmetMexicanaAboutSection } from "@/components/filiales/GourmetMexicanaAboutSection";
import { MexicanMotifs } from "@/components/filiales/MexicanMotifs";
import { MokaMoreQuoteSection } from "@/components/filiales/MokaMoreQuoteSection";
import { MokaMoreEventsSection } from "@/components/filiales/MokaMoreEventsSection";
import { MuzikCafeContactMapSection } from "@/components/filiales/MuzikCafeContactMapSection";
import { MuzikCafeEventsSection } from "@/components/filiales/MuzikCafeEventsSection";
import { MuzikCafeGallerySection } from "@/components/filiales/MuzikCafeGallerySection";
import { MuzikCafeHero } from "@/components/filiales/MuzikCafeHero";
import { MuzikCafeMenuSection } from "@/components/filiales/MuzikCafeMenuSection";
import { MuzikCafeReservationSection } from "@/components/filiales/MuzikCafeReservationSection";
import { OliveVerteHero } from "@/components/filiales/OliveVerteHero";
import { OliveVerteMenuSection } from "@/components/filiales/OliveVerteMenuSection";
import { OliveVerteReservationSection } from "@/components/filiales/OliveVerteReservationSection";
import { OliveMotifs } from "@/components/filiales/OliveMotifs";
import { OliveVerteMotifs } from "@/components/filiales/OliveVerteMotifs";
import { OliveVerteSpecialties } from "@/components/filiales/OliveVerteSpecialties";
import { PinkberryHero } from "@/components/filiales/PinkberryHero";
import { PinkberryStorySection } from "@/components/filiales/PinkberryStorySection";
import { PinkberryGallerySection } from "@/components/filiales/PinkberryGallerySection";
import { PinkberryEventsSection } from "@/components/filiales/PinkberryEventsSection";
import { PinkberryMenuSection } from "@/components/filiales/PinkberryMenuSection";
import { PinkberryContactSection } from "@/components/filiales/PinkberryContactSection";
import { SubsidiaryContactBand } from "@/components/filiales/SubsidiaryContactBand";
import { SubsidiaryEditorialAbout } from "@/components/filiales/SubsidiaryEditorialAbout";
import { SubsidiaryEventShowcase } from "@/components/filiales/SubsidiaryEventShowcase";
import { SubsidiaryExpandableGallery } from "@/components/filiales/SubsidiaryExpandableGallery";
import { WabiSabiBarShowcase } from "@/components/filiales/WabiSabiBarShowcase";
import { WabiSabiDiningShowcase } from "@/components/filiales/WabiSabiDiningShowcase";
import { WabiSabiHero } from "@/components/filiales/WabiSabiHero";
import { WabiSabiImmersiveGallery } from "@/components/filiales/WabiSabiImmersiveGallery";
import { WabiSabiPhilosophySection } from "@/components/filiales/WabiSabiPhilosophySection";
import { WabiSabiPracticalSection } from "@/components/filiales/WabiSabiPracticalSection";
import { WabiSabiEstablishmentsSection } from "@/components/filiales/WabiSabiEstablishmentsSection";
import { WabiSabiSpotlightSection } from "@/components/filiales/WabiSabiSpotlightSection";
import { SubsidiaryThemeShell } from "@/components/filiales/SubsidiaryThemeShell";
import { MapEmbed } from "@/components/maps/MapEmbed";
import { SubsidiaryHero } from "@/components/sections/SubsidiaryHero";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { ReadingProgress } from "@/components/ui/ReadingProgress";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/i18n/routing";
import { cormorant, nunito } from "@/lib/fonts";

import "@/styles/wabi-sabi-beige-band.css";
import "@/styles/wabi-sabi-events-section.css";
import {
  getAllSubsidiarySlugs,
  getGalleryBySubsidiary,
  getSectorLabel,
  getSiteConfig,
  getSubsidiaries,
  getSubsidiaryBySlug,
  getUpcomingEventsBySubsidiary,
} from "@/lib/content";
import { buildSubsidiaryGalleryItems, galleryEntrySrc } from "@/lib/gallery-categories";
import {
  getSubsidiaryHeroContent,
  getSubsidiaryHeroLayout,
  resolveSubsidiaryHeroImage,
  resolveSubsidiaryHeroVideo,
} from "@/lib/subsidiary-hero-layout";
import { resolvePageMetadata } from "@/lib/seo";
import { getSubsidiaryContactImage } from "@/lib/subsidiary-contact-images";
import { getSubsidiaryEventShowcaseConfig, hasSubsidiaryEventShowcase } from "@/lib/subsidiary-events-showcase";
import { getSubsidiaryPageTheme } from "@/lib/subsidiary-themes";

import "@/styles/subsidiary-contact-band.css";
import "@/styles/wabi-sabi-intro-flow.css";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getAllSubsidiarySlugs(locale).map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const l = locale as Locale;
  const sub = getSubsidiaryBySlug(l, slug);
  if (!sub) return {};
  return resolvePageMetadata({
    title: sub.name,
    description: sub.tagline,
    path: `/filiales/${slug}`,
    locale: l,
  });
}

export default async function SubsidiaryPage({ params }: Props) {
  const { locale, slug } = await params;
  const l = locale as Locale;
  setRequestLocale(locale);

  const subsidiary = getSubsidiaryBySlug(l, slug);
  if (!subsidiary) notFound();
  if (subsidiary.externalUrl) redirect(subsidiary.externalUrl);

  const pageTheme = getSubsidiaryPageTheme(slug);
  const isThemed = Boolean(pageTheme);

  const t = await getTranslations("subsidiaries");

  const events = getUpcomingEventsBySubsidiary(l, slug);
  const galleryItems = buildSubsidiaryGalleryItems(
    subsidiary,
    getGalleryBySubsidiary(l, slug),
  );

  const sisterSubsidiaries =
    slug === "filiale-01" ||
    slug === "filiale-02" ||
    slug === "filiale-03" ||
    slug === "filiale-04" ||
    slug === "filiale-05" ||
    slug === "filiale-06" ||
    slug === "filiale-07" ||
    slug === "filiale-09"
      ? getSubsidiaries(l)
          .filter((s) => s.slug !== slug && s.brandLogo)
          .map((s) => ({
            slug: s.slug,
            name: s.name,
            brandLogo: s.brandLogo!,
            externalUrl: s.externalUrl,
          }))
      : [];

  const heroVideo = resolveSubsidiaryHeroVideo(slug, subsidiary.heroVideo);

  const heroSlides =
    slug === "filiale-02" || heroVideo
      ? [
          {
            src:
              heroVideo?.poster ??
              resolveSubsidiaryHeroImage(slug, subsidiary.coverImage),
            alt: subsidiary.name,
          },
        ]
      : dedupeSlides([
          { src: subsidiary.coverImage, alt: subsidiary.name },
          ...subsidiary.galleryImages.slice(0, 5).map((entry, i) => ({
            src: galleryEntrySrc(entry),
            alt: `${subsidiary.name} — ${i + 1}`,
          })),
        ]);

  const mapQuery =
    subsidiary.practicalInfo.address?.trim() ||
    subsidiary.practicalInfo.phone?.trim() ||
    subsidiary.name;

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;

  const headingClass = isThemed
    ? "sub-themed-heading font-[family-name:var(--font-dm-sans)] text-3xl mb-4"
    : "font-[family-name:var(--font-dm-sans)] text-3xl text-ivory mb-4";

  const sectionHeadingClass = isThemed
    ? "sub-themed-heading font-[family-name:var(--font-dm-sans)] text-3xl mb-8"
    : "font-[family-name:var(--font-dm-sans)] text-3xl text-ivory mb-8";

  const useEventShowcase = hasSubsidiaryEventShowcase(slug);
  const eventShowcaseConfig = getSubsidiaryEventShowcaseConfig(slug);
  const showcaseEvents =
    eventShowcaseConfig && useEventShowcase
      ? events.slice(0, eventShowcaseConfig.maxEvents)
      : events;

  const eventShowcaseLabels = {
    bookNow: t("eventShowcase.bookNow"),
    eventInfo: t("eventShowcase.eventInfo"),
    viewAllEvents: t("eventShowcase.viewAllEvents"),
    statusUpcoming: t("eventShowcase.statusUpcoming"),
    statusSoldOut: t("eventShowcase.statusSoldOut"),
    statusVip: t("eventShowcase.statusVip"),
  };

  const breadcrumbItems = [
    { label: t("breadcrumbHome"), href: "/" },
    { label: t("breadcrumbSubsidiaries"), href: "/filiales" },
    { label: subsidiary.name },
  ];

  const breadcrumbSection = (
    <section className="px-4 pt-8 md:px-6 md:pt-10 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Breadcrumb animate items={breadcrumbItems} />
      </div>
    </section>
  );

  const standardEventsSection = (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
      <AnimateIn>
        <h2 className={sectionHeadingClass}>{t("upcomingEvents")}</h2>
      </AnimateIn>
      {events.length === 0 ? (
        <AnimateIn delay={0.05}>
          <p className="mb-8 text-taupe">{t("noEventsScheduled")}</p>
        </AnimateIn>
      ) : (
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event, index) => (
            <AnimateIn key={event.id} delay={index * 0.05}>
              <EventCard event={event} />
            </AnimateIn>
          ))}
        </div>
      )}
      <Button href="/evenements" variant="secondary">
        {t("allEvents")}
      </Button>
    </section>
  );

  const wabiEventsSection = (
    <section
      className={`wabi-sabi-beige-band wabi-sabi-events-section ${cormorant.variable}`}
      aria-labelledby="wabi-sabi-events-title"
    >
      <div className="wabi-sabi-events-section__inner">
        <AnimateIn>
          <h2
            id="wabi-sabi-events-title"
            className="wabi-sabi-beige-band__title wabi-sabi-events-section__title"
          >
            {t("upcomingEvents")}
          </h2>
        </AnimateIn>
        {events.length === 0 ? (
          <AnimateIn delay={0.05}>
            <p className="wabi-sabi-events-section__empty">{t("noEventsScheduled")}</p>
          </AnimateIn>
        ) : (
          <div className="wabi-sabi-events-section__grid">
            {events.map((event, index) => (
              <AnimateIn key={event.id} delay={index * 0.05}>
                <EventCard event={event} />
              </AnimateIn>
            ))}
          </div>
        )}
        <Button href="/evenements" variant="secondary">
          {t("allEvents")}
        </Button>
      </div>
    </section>
  );

  const standardGallerySection =
    galleryItems.length > 0 ? (
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <AnimateIn>
          <h2 className={sectionHeadingClass}>{t("gallery")}</h2>
          <p className="-mt-4 mb-8 max-w-2xl text-sm text-taupe md:mb-10">
            {t("galleryDescription")}
          </p>
        </AnimateIn>
        <SubsidiaryExpandableGallery
          items={galleryItems}
          subsidiaryName={subsidiary.name}
          sectorLabel={getSectorLabel(l, subsidiary.sector)}
          accentColor={pageTheme?.colors.gold ?? subsidiary.accentColor}
          backgroundColor={pageTheme?.colors.surface}
          themed={isThemed}
        />
      </section>
    ) : null;

  const content = (
    <>
      <ReadingProgress
        barClassName={
          isThemed
            ? "sub-reading-progress fixed left-0 right-0 top-0 z-[55] h-[3px] origin-left"
            : undefined
        }
      />
      {slug === "filiale-02" && subsidiary.heroSection ? (
        <div className="wabi-sabi-intro-flow">
          <span className="wabi-sabi-intro-flow__atmosphere" aria-hidden />
          <WabiSabiHero
            name={subsidiary.name}
            hero={subsidiary.heroSection}
            backgroundVideo={heroVideo}
          />
          {subsidiary.philosophySection && (
            <WabiSabiPhilosophySection
              name={subsidiary.name}
              brandLogo={subsidiary.brandLogo}
              content={subsidiary.philosophySection}
              sectionLabel={t("wabiPhilosophy.sectionLabel")}
            />
          )}
          {subsidiary.diningSection && (
            <WabiSabiDiningShowcase content={subsidiary.diningSection} />
          )}
        </div>
      ) : slug === "filiale-09" ? (
        <PinkberryHero subsidiary={subsidiary} />
      ) : slug === "filiale-01" ? (
        <>
          <OliveVerteHero subsidiary={subsidiary} />
          {subsidiary.specialtiesSection && (
            <OliveVerteSpecialties content={subsidiary.specialtiesSection} />
          )}
          {galleryItems.length > 0 && (
            <div style={{ position: "relative", overflow: "hidden" }}>
              <OliveMotifs section="gallery" />
              <KLoungeMarqueeGallery
                items={galleryItems}
                title={t("gallery")}
                description={t("oliveVerteGallery.description")}
              />
            </div>
          )}
          {subsidiary.menuCategoriesSection && (
            <OliveVerteMenuSection content={subsidiary.menuCategoriesSection} />
          )}
          <OliveVerteReservationSection
            backgroundImage={getSubsidiaryContactImage(slug, subsidiary.coverImage)}
          />
          {sisterSubsidiaries.length > 0 && (
            <WabiSabiEstablishmentsSection
              subsidiaries={sisterSubsidiaries}
              title={t("wabiEstablishments.title")}
              description={t("wabiEstablishments.description")}
              variant="olive-verte"
              decorativeSlot={<><OliveVerteMotifs /><OliveMotifs section="establishments" /></>}
            />
          )}
        </>
      ) : slug === "filiale-05" ? (
        <>
          <MuzikCafeHero subsidiary={subsidiary} />
          {subsidiary.muzikMenuSection && (
            <MuzikCafeMenuSection content={subsidiary.muzikMenuSection} />
          )}
          {subsidiary.muzikGallerySection && (
            <MuzikCafeGallerySection content={subsidiary.muzikGallerySection} />
          )}
          {sisterSubsidiaries.length > 0 && (
            <WabiSabiEstablishmentsSection
              subsidiaries={sisterSubsidiaries}
              title={t("wabiEstablishments.title")}
              description={t("wabiEstablishments.description")}
              variant="muzik-cafe"
            />
          )}
          <MuzikCafeReservationSection
            backgroundImage={getSubsidiaryContactImage(slug, subsidiary.coverImage)}
          />
        </>
      ) : slug === "filiale-06" ? (
        <>
          <MokaMoreHero subsidiary={subsidiary} />
          <MokaMoreQuoteSection
            leftImage={subsidiary.coverImage}
            rightImage={galleryEntrySrc(subsidiary.galleryImages[0])}
          />
          <MokaMoreAboutSection subsidiary={subsidiary} />
          <MokaMoreReservationSection subsidiary={subsidiary} />
          <MokaMoreVideoSection
            backgroundImage={galleryEntrySrc(subsidiary.galleryImages[1] ?? subsidiary.coverImage)}
          />
          <MokaMoreGallerySection
            photos={[
              subsidiary.coverImage,
              galleryEntrySrc(subsidiary.galleryImages[0]),
              galleryEntrySrc(subsidiary.galleryImages[1] ?? subsidiary.coverImage),
              "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80",
            ]}
          />
          {sisterSubsidiaries.length > 0 && (
            <WabiSabiEstablishmentsSection
              subsidiaries={sisterSubsidiaries}
              title={t("wabiEstablishments.title")}
              description={t("wabiEstablishments.description")}
              variant="moka-more"
            />
          )}
        </>
      ) : slug === "filiale-07" ? (
        <>
          <GourmetMexicanaHero subsidiary={subsidiary} />
          <GourmetMexicanaCategoriesSection />
          <GourmetMexicanaAboutSection subsidiary={subsidiary} />
          {sisterSubsidiaries.length > 0 && (
            <WabiSabiEstablishmentsSection
              subsidiaries={sisterSubsidiaries}
              title={t("wabiEstablishments.title")}
              description={t("wabiEstablishments.description")}
              variant="gourmet-mexicana"
              decorativeSlot={<MexicanMotifs variant="establishments" />}
            />
          )}
        </>
      ) : (
        <SubsidiaryHero
          slides={heroSlides}
          sectorLabel={getSectorLabel(l, subsidiary.sector)}
          name={subsidiary.name}
          tagline={subsidiary.tagline}
          social={subsidiary.social}
          brandLogo={subsidiary.brandLogo}
          accentColor={subsidiary.accentColor}
          theme={pageTheme ?? undefined}
          backgroundVideo={heroVideo}
          layout={getSubsidiaryHeroLayout(slug)}
          contentConfig={getSubsidiaryHeroContent(slug)}
        />
      )}

      {slug === "filiale-09" && subsidiary.storySection && (
        <PinkberryStorySection
          content={subsidiary.storySection}
          backgroundImage={galleryEntrySrc(subsidiary.galleryImages[0])}
          productImage="/filiales/photos/filiale-09/strawberry-cream-cutout.png"
          name={subsidiary.name}
        />
      )}

      {slug === "filiale-09" && subsidiary.menuSection && (
        <PinkberryMenuSection
          content={subsidiary.menuSection}
          backgroundImage={galleryEntrySrc(subsidiary.galleryImages[1])}
        />
      )}

      {slug === "filiale-02" && subsidiary.barSection && (
        <WabiSabiBarShowcase content={subsidiary.barSection} />
      )}

      {slug === "filiale-02" && subsidiary.spotlightSection && (
        <WabiSabiSpotlightSection content={subsidiary.spotlightSection} />
      )}

      {slug === "filiale-04" && (
        <MillionaireClubIntroSection
          name={subsidiary.name}
          brandLogo={subsidiary.brandLogo}
          tagline={subsidiary.tagline}
          social={subsidiary.social}
          accentColor={subsidiary.accentColor}
        />
      )}

      {slug !== "filiale-01" && slug !== "filiale-02" && slug !== "filiale-04" && slug !== "filiale-05" && slug !== "filiale-06" && slug !== "filiale-07" && slug !== "filiale-09" && breadcrumbSection}

      {slug === "filiale-03" && subsidiary.introSection && (
        <KLoungeIntroSection content={subsidiary.introSection} />
      )}

      {useEventShowcase && showcaseEvents.length > 0 && (
        <SubsidiaryEventShowcase
          events={showcaseEvents}
          labels={eventShowcaseLabels}
          desktopColumns={eventShowcaseConfig?.desktopColumns}
        />
      )}

      {slug === "filiale-09" && sisterSubsidiaries.length > 0 ? (
        <WabiSabiEstablishmentsSection
          subsidiaries={sisterSubsidiaries}
          title={t("wabiEstablishments.title")}
          description={t("wabiEstablishments.description")}
          variant="pinkberry"
        />
      ) : (
        slug !== "filiale-01" &&
        slug !== "filiale-02" &&
        slug !== "filiale-03" &&
        slug !== "filiale-04" &&
        slug !== "filiale-05" &&
        slug !== "filiale-06" &&
        slug !== "filiale-07" && (
          <section className="px-4 py-12 md:px-6 md:py-16 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <AnimateIn>
                <p className="max-w-3xl text-lg leading-relaxed text-taupe">
                  {subsidiary.description}
                </p>
              </AnimateIn>
            </div>
          </section>
        )
      )}

      {slug === "filiale-03" ? (
        <KLoungeReservationBanner
          backgroundImage={getSubsidiaryContactImage(slug, subsidiary.coverImage)}
          eyebrow={t("kLoungeReservation.eyebrow")}
          title={t("kLoungeReservation.title")}
          ctaLabel={t("kLoungeReservation.cta")}
          ctaHref="/contact"
        />
      ) : (
        slug !== "filiale-01" &&
        slug !== "filiale-04" &&
        slug !== "filiale-02" &&
        slug !== "filiale-05" &&
        slug !== "filiale-06" &&
        slug !== "filiale-07" &&
        slug !== "filiale-09" && (
          <SubsidiaryContactBand
            backgroundImage={getSubsidiaryContactImage(slug, subsidiary.coverImage)}
            hoursLabel={t("contactBand.hours")}
            findUsLabel={t("contactBand.findUs")}
            callUsLabel={t("contactBand.callUs")}
            hours={subsidiary.practicalInfo.hours}
            address={subsidiary.practicalInfo.address}
            phone={subsidiary.practicalInfo.phone}
            mapsUrl={subsidiary.practicalInfo.address ? mapsUrl : undefined}
            themed={isThemed}
          />
        )
      )}

      {slug === "filiale-02" ? (
        <div className={`wabi-sabi-beige-flow ${cormorant.variable}`}>
          {sisterSubsidiaries.length > 0 && (
            <WabiSabiEstablishmentsSection
              subsidiaries={sisterSubsidiaries}
              title={t("wabiEstablishments.title")}
              description={t("wabiEstablishments.description")}
            />
          )}

          {galleryItems.length > 0 && (
            <WabiSabiImmersiveGallery
              items={galleryItems}
              title={t("gallery")}
              description={t("wabiGallery.description")}
            />
          )}

          {!useEventShowcase && wabiEventsSection}
        </div>
      ) : (
        slug === "filiale-03" &&
        sisterSubsidiaries.length > 0 && (
          <WabiSabiEstablishmentsSection
            subsidiaries={sisterSubsidiaries}
            title={t("wabiEstablishments.title")}
            description={t("wabiEstablishments.description")}
            variant="k-lounge"
          />
        )
      )}

      {subsidiary.aboutSection && slug === "filiale-04" && (
        <section className="subsidiary-about-after-band mx-auto max-w-7xl px-4 pb-16 md:px-6 md:pb-20">
          <SubsidiaryEditorialAbout
            content={subsidiary.aboutSection}
            variant="luxury-dark"
          />
        </section>
      )}

      {galleryItems.length > 0 && slug === "filiale-04" ? (
        <MillionaireClubScatteredGallery
          items={galleryItems}
          title={t("gallery")}
          description={t("galleryDescription")}
        />
      ) : galleryItems.length > 0 && slug === "filiale-03" ? (
        <KLoungeMarqueeGallery
          items={galleryItems}
          title={t("gallery")}
          description={t("kLoungeGallery.description")}
        />
      ) : slug === "filiale-09" && subsidiary.productGallerySection ? (
        <PinkberryGallerySection
          content={subsidiary.productGallerySection}
        />
      ) : (
        slug !== "filiale-01" &&
        slug !== "filiale-02" &&
        slug !== "filiale-03" &&
        slug !== "filiale-04" &&
        slug !== "filiale-05" &&
        slug !== "filiale-06" &&
        slug !== "filiale-07" &&
        slug !== "filiale-09" &&
        standardGallerySection
      )}

      {slug === "filiale-04" && sisterSubsidiaries.length > 0 && (
        <WabiSabiEstablishmentsSection
          subsidiaries={sisterSubsidiaries}
          title={t("wabiEstablishments.title")}
          description={t("wabiEstablishments.description")}
          variant="millionaire-club"
        />
      )}

      {subsidiary.aboutSection && slug === "filiale-03" && (
        <SubsidiaryEditorialAbout content={subsidiary.aboutSection} />
      )}

      {subsidiary.aboutSection && slug !== "filiale-04" && slug !== "filiale-02" && slug !== "filiale-03" && (
        <SubsidiaryEditorialAbout content={subsidiary.aboutSection} />
      )}

      {slug === "filiale-09" && subsidiary.newsSection ? (
        <PinkberryEventsSection
          content={subsidiary.newsSection}
          backgroundImage={galleryEntrySrc(subsidiary.galleryImages[0])}
        />
      ) : slug === "filiale-05" ? (
        <MuzikCafeEventsSection
          events={events}
          title={t("muzikCafeEvents.title")}
          ctaLabel={t("muzikCafeEvents.ctaLabel")}
          fallbackImage={subsidiary.coverImage}
        />
      ) : slug === "filiale-06" ? (
        <MokaMoreEventsSection events={events} fallbackImage={subsidiary.coverImage} />
      ) : (
        slug !== "filiale-01" &&
        slug !== "filiale-02" &&
        slug !== "filiale-07" &&
        !useEventShowcase &&
        standardEventsSection
      )}

      {slug === "filiale-02" ? (
        <WabiSabiPracticalSection
          hours={subsidiary.practicalInfo.hours}
          address={subsidiary.practicalInfo.address}
          mapQuery={mapQuery}
          mapsUrl={subsidiary.practicalInfo.address ? mapsUrl : undefined}
          social={subsidiary.social}
          labels={{
            hoursTitle: t("wabiPractical.hoursTitle"),
            locationTitle: t("wabiPractical.locationTitle"),
            bookTable: t("wabiPractical.bookTable"),
            getDirections: t("wabiPractical.getDirections"),
            closed: t("wabiPractical.closed"),
            socialLabel: t("wabiPractical.socialLabel"),
            mapTitle: t("mapTitle", { name: subsidiary.name }),
          }}
        />
      ) : slug === "filiale-09" && subsidiary.contactSection ? (
        <PinkberryContactSection
          content={subsidiary.contactSection}
          hours={subsidiary.practicalInfo.hours}
          address={subsidiary.practicalInfo.address}
          phone={subsidiary.practicalInfo.phone}
          email={getSiteConfig(l).contact.email}
          social={subsidiary.social}
          backgroundImage="/filiales/photos/filiale-09/contact-bg.jpg"
        />
      ) : slug === "filiale-01" ? (
        <section className="relative overflow-hidden mx-auto max-w-7xl px-4 pb-16 md:px-6 md:pb-20 flex justify-center">
          <OliveVerteMotifs />
          <OliveMotifs section="map" />
          <MapEmbed
            query={mapQuery}
            title={t("mapTitle", { name: subsidiary.name })}
            variant="compact"
          />
        </section>
      ) : slug === "filiale-05" || slug === "filiale-06" ? (
        <MuzikCafeContactMapSection
          mapQuery={mapQuery}
          subsidiaryName={subsidiary.name}
        />
      ) : slug === "filiale-07" ? null : (
        <section className="mx-auto max-w-7xl px-4 pb-16 md:px-6 md:pb-20">
          <AnimateIn>
            <h2 className={headingClass}>{t("mapAccess")}</h2>
            <p className="mb-6 max-w-xl text-sm text-taupe">{t("mapDescription")}</p>
          </AnimateIn>
          <MapEmbed
            query={mapQuery}
            title={t("mapTitle", { name: subsidiary.name })}
            variant="compact"
          />
        </section>
      )}

      <div className="h-20 lg:hidden" aria-hidden />

      <StickyMobileActions
        phone={subsidiary.practicalInfo.phone}
        mapsUrl={subsidiary.practicalInfo.address ? mapsUrl : undefined}
        subsidiaryName={subsidiary.name}
        themed={isThemed}
      />
    </>
  );

  if (pageTheme) {
    return (
      <SubsidiaryThemeShell
        theme={pageTheme}
        className={slug === "filiale-09" ? nunito.variable : undefined}
      >
        {content}
      </SubsidiaryThemeShell>
    );
  }

  return content;
}

function dedupeSlides(slides: { src: string; alt: string }[]) {
  const seen = new Set<string>();
  return slides.filter((s) => {
    if (seen.has(s.src)) return false;
    seen.add(s.src);
    return true;
  });
}
