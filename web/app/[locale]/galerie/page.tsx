import { getTranslations, setRequestLocale } from "next-intl/server";

import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { HeroCurtain } from "@/components/layout/HeroCurtain";
import { PageSection } from "@/components/layout/PageSection";
import { SectionBlend } from "@/components/layout/SectionBlend";
import { InnerHero } from "@/components/sections/InnerHero";
import { PageOutro } from "@/components/sections/PageOutro";
import type { Locale } from "@/i18n/routing";
import { getGalleryItems } from "@/lib/content";
import { resolvePageMetadata } from "@/lib/seo";

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
  const items = getGalleryItems(locale as Locale);
  const t = await getTranslations("gallery");
  const tNav = await getTranslations("nav");
  const tCommon = await getTranslations("common");
  const tOutro = await getTranslations("outro");
  const tCta = await getTranslations("cta");

  return (
    <>
      <HeroCurtain
        surface="var(--color-petrol)"
        hero={
          <InnerHero
            className="hero-curtain__hero"
            eyebrow={t("eyebrow")}
            title={t("title")}
            description={t("description")}
            image="https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=2400&q=85"
            breadcrumb={{ label: tCommon("breadcrumb"), home: tNav("home"), current: tNav("gallery") }}
          />
        }
      >
        <PageSection variant="default">
          <GalleryGrid items={items} />
        </PageSection>
      </HeroCurtain>

      <SectionBlend from="var(--color-petrol)" to="var(--color-anthracite)" />

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
