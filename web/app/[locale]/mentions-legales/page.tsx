import { getTranslations, setRequestLocale } from "next-intl/server";

import { LegalArticle, LegalH2, LegalP, LegalUl } from "@/components/legal/LegalArticle";
import { PageHero } from "@/components/sections/PageHero";
import { SectionWave } from "@/components/layout/SectionWave";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getSiteConfig } from "@/lib/content";
import { createPageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const site = getSiteConfig(locale as Locale);
  const t = await getTranslations({ locale, namespace: "legal.mentions" });
  return createPageMetadata({
    title: t("metaTitle"),
    description: t("metaDescription", { name: site.name }),
    path: "/mentions-legales",
    locale: locale as Locale,
  });
}

export default async function MentionsLegalesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const site = getSiteConfig(locale as Locale);
  const t = await getTranslations("legal.mentions");

  return (
    <>
      <PageHero eyebrow={t("eyebrow")} title={t("title")} description={t("description")} />
      <LegalArticle>
        <section className="space-y-4">
          <LegalH2>{t("editor")}</LegalH2>
          <LegalP>{t("editorBody", { name: site.name })}</LegalP>
          <LegalUl>
            <li>
              {t("address")} : {site.contact.address}
            </li>
            <li>
              {t("phone")} : {site.contact.phone}
            </li>
            <li>
              {t("email")} : {site.contact.email}
            </li>
          </LegalUl>
        </section>

        <section className="space-y-4">
          <LegalH2>{t("publication")}</LegalH2>
          <LegalP>{t("publicationBody")}</LegalP>
        </section>

        <section className="space-y-4">
          <LegalH2>{t("hosting")}</LegalH2>
          <LegalP>{t("hostingBody")}</LegalP>
        </section>

        <section className="space-y-4">
          <LegalH2>{t("ip")}</LegalH2>
          <LegalP>{t("ipBody", { name: site.name })}</LegalP>
        </section>

        <section className="space-y-4">
          <LegalH2>{t("contact")}</LegalH2>
          <LegalP>
            <Link
              href="/contact"
              className="text-gold underline-offset-4 hover:text-ivory hover:underline cursor-pointer"
            >
              {t("contactForm")}
            </Link>
          </LegalP>
        </section>
      </LegalArticle>
      <SectionWave fill="petrol" />
    </>
  );
}
