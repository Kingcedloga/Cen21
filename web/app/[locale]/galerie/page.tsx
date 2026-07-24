import { getTranslations, setRequestLocale } from "next-intl/server";

import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { PageHero } from "@/components/sections/PageHero";
import { PageSection } from "@/components/layout/PageSection";
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

  return (
    <>
      <PageHero
        title={t("title")}
        homeLabel={tNav("home")}
        currentPageLabel={tNav("gallery")}
        image="https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=2400&q=85"
      />
      <PageSection variant="default">
        <GalleryGrid items={items} />
      </PageSection>
    </>
  );
}
