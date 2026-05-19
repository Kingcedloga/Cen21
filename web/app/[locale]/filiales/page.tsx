import { getTranslations, setRequestLocale } from "next-intl/server";

import { PageSection } from "@/components/layout/PageSection";
import { PageHero } from "@/components/sections/PageHero";
import { SubsidiariesBento } from "@/components/filiales/SubsidiariesBento";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Locale } from "@/i18n/routing";
import { getSubsidiaries } from "@/lib/content";
import { createPageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "subsidiaries" });
  return createPageMetadata({
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/filiales",
    locale: locale as Locale,
  });
}

export default async function SubsidiariesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const l = locale as Locale;
  const subsidiaries = getSubsidiaries(l);
  const t = await getTranslations("subsidiaries");

  return (
    <>
      <PageHero
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      />

      <PageSection
        variant="alt"
        spacing="loose"
        id="filiales-bento"
        ariaLabelledby="filiales-bento-title"
        containerClassName="mx-auto max-w-[min(100%,1400px)]"
      >
        <AnimateIn>
          <SectionHeading
            eyebrow={t("selectionEyebrow")}
            title={t("selectionTitle")}
            titleAs="h2"
            subtitleAs="h3"
            titleId="filiales-bento-title"
            description={t("selectionDescription")}
            align="left"
            className="mb-12 max-w-2xl md:mb-16"
          />
        </AnimateIn>

        <SubsidiariesBento subsidiaries={subsidiaries} />
      </PageSection>
    </>
  );
}
