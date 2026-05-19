import { getTranslations, setRequestLocale } from "next-intl/server";

import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { PageHero } from "@/components/sections/PageHero";
import { PageSection } from "@/components/layout/PageSection";
import type { Locale } from "@/i18n/routing";
import { getGalleryItems } from "@/lib/content";
import { createPageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "gallery" });
  return createPageMetadata({
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

  return (
    <>
      <PageHero eyebrow={t("eyebrow")} title={t("title")} description={t("description")} />
      <PageSection variant="default">
        <GalleryGrid items={items} />
      </PageSection>
    </>
  );
}
