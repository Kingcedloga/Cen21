import { getTranslations, setRequestLocale } from "next-intl/server";

import { ContactForm } from "@/components/contact/ContactForm";
import { PageSection } from "@/components/layout/PageSection";
import { PageHero } from "@/components/sections/PageHero";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { Icon } from "@/components/ui/Icon";
import { MapEmbed } from "@/components/maps/MapEmbed";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SocialLinks } from "@/components/ui/SocialLinks";
import type { Locale } from "@/i18n/routing";
import { getSiteConfig } from "@/lib/content";
import { resolvePageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return resolvePageMetadata({
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/contact",
    locale: locale as Locale,
  });
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const site = getSiteConfig(locale as Locale);
  const t = await getTranslations("contact");
  const tNav = await getTranslations("nav");

  return (
    <>
      <PageHero
        title={t("title")}
        homeLabel={tNav("home")}
        currentPageLabel={tNav("contact")}
        image="https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=2400&q=85"
      />

      <PageSection variant="default">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <AnimateIn>
            <SectionHeading
              eyebrow={t("detailsEyebrow")}
              title={t("detailsTitle")}
              titleAs="h2"
              align="left"
              className="mb-8 max-w-md"
            />
            <ul className="space-y-6 text-taupe">
              <li className="flex items-start gap-3">
                <Icon name="location" size="md" className="mt-0.5 text-gold" />
                {site.contact.address}
              </li>
              <li className="flex items-center gap-3">
                <Icon name="phone" size="md" />
                <a
                  href={`tel:${site.contact.phone.replace(/\s/g, "")}`}
                  className="cursor-pointer transition-colors hover:text-gold"
                >
                  {site.contact.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Icon name="mail" size="md" />
                <a
                  href={`mailto:${site.contact.email}`}
                  className="cursor-pointer transition-colors hover:text-gold"
                >
                  {site.contact.email}
                </a>
              </li>
            </ul>

            <SocialLinks social={site.social} label={t("socialLabel")} className="mt-10" />
          </AnimateIn>

          <AnimateIn delay={0.1}>
            <div className="glass-panel rounded-2xl p-8 ring-1 ring-inset ring-white/[0.06] md:p-10">
              <h2 className="mb-6 font-[family-name:var(--font-dm-sans)] text-2xl text-ivory">
                {t("formTitle")}
              </h2>
              <ContactForm />
            </div>
          </AnimateIn>
        </div>
      </PageSection>

      <PageSection variant="alt">
        <AnimateIn>
          <SectionHeading
            eyebrow={t("locationEyebrow")}
            title={t("locationTitle")}
            titleAs="h2"
            description={t("locationDescription")}
            align="left"
            className="mb-10 max-w-2xl"
          />
        </AnimateIn>
        <AnimateIn delay={0.1}>
          <MapEmbed query={site.contact.address} title={`${site.name}`} variant="banner" />
        </AnimateIn>
      </PageSection>
    </>
  );
}
