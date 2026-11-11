import { getTranslations, setRequestLocale } from "next-intl/server";

import { SocialTiles } from "@/components/contact/SocialTiles";
import { GalleryMosaic } from "@/components/gallery/GalleryMosaic";
import { GalleryWall, type WallHouse } from "@/components/gallery/GalleryWall";
import { HeroCurtain } from "@/components/layout/HeroCurtain";
import { PageSection, SECTION_SURFACE } from "@/components/layout/PageSection";
import { SectionBlend } from "@/components/layout/SectionBlend";
import { InnerHero } from "@/components/sections/InnerHero";
import { PageOutro } from "@/components/sections/PageOutro";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Locale } from "@/i18n/routing";
import { getGalleryItems, getSubsidiaries } from "@/lib/content";
import { buildGalleryPhotos } from "@/lib/gallery-photos";
import { resolvePageMetadata } from "@/lib/seo";
import { socialTiles } from "@/lib/social-tiles";
import { brandSurface } from "@/lib/subsidiary-brand";
import { getSubsidiaryHref, isSubsidiaryExternalLink } from "@/lib/subsidiary-links";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "gallery" });
  return resolvePageMetadata({
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/galerie",
    locale: locale as Locale,
  });
}

export default async function GalleryPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const l = locale as Locale;
  const subsidiaries = getSubsidiaries(l);
  const t = await getTranslations("gallery");
  const tNav = await getTranslations("nav");
  const tCommon = await getTranslations("common");
  const tContact = await getTranslations("contact");
  const tOutro = await getTranslations("outro");
  const tCta = await getTranslations("cta");

  // Galerie du groupe : la sélection et les photos de toutes les maisons.
  const photos = buildGalleryPhotos(getGalleryItems(l), subsidiaries, (name, n) => t("photoAlt", { name, n }));
  const houses: WallHouse[] = subsidiaries
    .filter((s) => photos.some((photo) => photo.houseSlug === s.slug))
    .map((s) => ({
      slug: s.slug,
      name: s.name,
      logo: s.brandLogo,
      logoSurface: brandSurface(s.slug, s.accentColor),
      href: getSubsidiaryHref(s),
      external: isSubsidiaryExternalLink(s),
    }));

  // Mosaïque du hero : une photo locale de cinq maisons différentes.
  const mosaic: string[] = [];
  const mosaicHouses = new Set<string>();
  for (const photo of photos) {
    if (mosaic.length === 5) break;
    if (!photo.src.startsWith("/") || !photo.houseSlug || mosaicHouses.has(photo.houseSlug)) continue;
    mosaicHouses.add(photo.houseSlug);
    mosaic.push(photo.src);
  }

  return (
    <>
      <HeroCurtain
        surface={SECTION_SURFACE.default}
        hero={
          <InnerHero
            className="hero-curtain__hero"
            eyebrow={t("eyebrow")}
            title={t("title")}
            description={t("description")}
            media={<GalleryMosaic photos={mosaic} />}
            breadcrumb={{ label: tCommon("breadcrumb"), home: tNav("home"), current: tNav("gallery") }}
          />
        }
      >
        <PageSection
          variant="default"
          ariaLabelledby="gallery-photos-title"
          containerClassName="mx-auto max-w-[min(100%,1400px)]"
        >
          <h2 id="gallery-photos-title" className="sr-only">
            {t("photosTitle")}
          </h2>
          <GalleryWall photos={photos} houses={houses} />
        </PageSection>
      </HeroCurtain>

      <SectionBlend from={SECTION_SURFACE.default} to={SECTION_SURFACE.dark} />

      {/* Instagram des maisons (tuiles de /contact). */}
      <PageSection
        variant="dark"
        spacing="default"
        ariaLabelledby="gallery-social-title"
        containerClassName="mx-auto max-w-[min(100%,1400px)]"
      >
        <SectionHeading
          look="editorial"
          eyebrow={t("socialEyebrow")}
          title={t("socialTitle")}
          sweep={t("socialSweep")}
          description={tContact("tilesDescription")}
          titleAs="h2"
          titleId="gallery-social-title"
          align="left"
          className="mb-10 max-w-2xl"
        />
        <SocialTiles tiles={socialTiles(subsidiaries)} label={tContact("tilesLabel")} newTab={tContact("newTab")} />
      </PageSection>

      <PageOutro
        eyebrow={tOutro("eyebrow")}
        title={tOutro("galleryTitle")}
        titleSweep={tOutro("gallerySweep")}
        primary={{ href: "/filiales", label: tCta("subsidiaries") }}
        next={{ href: "/contact", label: tOutro("next"), title: tNav("contact") }}
      />
    </>
  );
}
