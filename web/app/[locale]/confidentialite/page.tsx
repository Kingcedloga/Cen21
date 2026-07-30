import { getTranslations, setRequestLocale } from "next-intl/server";

import { LegalArticle, LegalH2, LegalP } from "@/components/legal/LegalArticle";
import { PageHero } from "@/components/sections/PageHero";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getSiteConfig } from "@/lib/content";
import { resolvePageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const site = getSiteConfig(locale as Locale);
  const t = await getTranslations({ locale, namespace: "legal.privacy" });
  return resolvePageMetadata({
    title: t("metaTitle"),
    description: t("metaDescription", { name: site.name }),
    path: "/confidentialite",
    locale: locale as Locale,
  });
}

export default async function ConfidentialitePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const site = getSiteConfig(locale as Locale);
  const t = await getTranslations("legal.privacy");

  return (
    <>
      <PageHero eyebrow={t("eyebrow")} title={t("title")} description={t("description")} />
      <LegalArticle>
        <AnimateIn delay={0 * 0.08}>
          <section className="space-y-4">
            <LegalH2>{t("controller")}</LegalH2>
            <LegalP>
              {t("controllerBody", { name: site.name })}{" "}
              <a
                href={`mailto:${site.contact.email}`}
                className="text-gold hover:text-ivory underline-offset-4 hover:underline"
              >
                {site.contact.email}
              </a>
              .
            </LegalP>
          </section>
        </AnimateIn>

        <AnimateIn delay={1 * 0.08}>
          <section className="space-y-4">
            <LegalH2>{t("collected")}</LegalH2>
            <LegalP>{t("collectedBody")}</LegalP>
          </section>
        </AnimateIn>

        <AnimateIn delay={2 * 0.08}>
          <section className="space-y-4">
            <LegalH2>{t("analytics")}</LegalH2>
            <LegalP>
              {t("analyticsBody")}{" "}
              <Link href="/cookies" className="text-gold hover:text-ivory hover:underline underline-offset-4">
                {t("cookieLink")}
              </Link>
              .
            </LegalP>
          </section>
        </AnimateIn>

        <AnimateIn delay={3 * 0.08}>
          <section className="space-y-4">
            <LegalH2>{t("rights")}</LegalH2>
            <LegalP>{t("rightsBody")}</LegalP>
          </section>
        </AnimateIn>

        <AnimateIn delay={4 * 0.08}>
          <section className="space-y-4">
            <LegalH2>{t("retention")}</LegalH2>
            <LegalP>{t("retentionBody")}</LegalP>
          </section>
        </AnimateIn>
      </LegalArticle>
    </>
  );
}
