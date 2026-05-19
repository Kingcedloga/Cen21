import { getTranslations, setRequestLocale } from "next-intl/server";

import { LegalArticle, LegalH2, LegalP, LegalUl } from "@/components/legal/LegalArticle";
import { PageHero } from "@/components/sections/PageHero";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getSiteConfig } from "@/lib/content";
import { createPageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const site = getSiteConfig(locale as Locale);
  const t = await getTranslations({ locale, namespace: "legal.cookies" });
  return createPageMetadata({
    title: t("metaTitle"),
    description: t("metaDescription", { name: site.name }),
    path: "/cookies",
    locale: locale as Locale,
  });
}

export default async function CookiesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const site = getSiteConfig(locale as Locale);
  const t = await getTranslations("legal.cookies");

  return (
    <>
      <PageHero eyebrow={t("eyebrow")} title={t("title")} description={t("description")} />
      <LegalArticle>
        <section className="space-y-4">
          <LegalH2>{t("what")}</LegalH2>
          <LegalP>{t("whatBody")}</LegalP>
        </section>

        <section className="space-y-4">
          <LegalH2>{t("used")}</LegalH2>
          <LegalP>{t("usedBody")}</LegalP>
          <LegalUl>
            <li>
              <strong className="text-ivory">{t("necessary")}</strong> : {t("necessaryBody")}
            </li>
            <li>
              <strong className="text-ivory">{t("analytics")}</strong> : {t("analyticsBody")}
            </li>
          </LegalUl>
        </section>

        <section className="space-y-4">
          <LegalH2>{t("choices")}</LegalH2>
          <LegalP>{t("choicesBody")}</LegalP>
        </section>

        <section className="space-y-4">
          <LegalH2>{t("contact")}</LegalH2>
          <LegalP>
            {t("contactBody")}{" "}
            <Link href="/contact" className="text-gold hover:text-ivory hover:underline underline-offset-4">
              {t("contactUs")}
            </Link>{" "}
            {locale === "fr" ? "ou" : "or"}{" "}
            <a
              href={`mailto:${site.contact.email}`}
              className="text-gold hover:text-ivory hover:underline underline-offset-4"
            >
              {site.contact.email}
            </a>
            .
          </LegalP>
        </section>
      </LegalArticle>
    </>
  );
}
