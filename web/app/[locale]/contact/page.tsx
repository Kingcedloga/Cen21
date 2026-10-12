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

      <PageSection variant="default" spacing="loose">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-16 items-start">
          {/* Colonne Coordonnées (5 cols) */}
          <div className="lg:col-span-5">
            <AnimateIn>
              <SectionHeading
                eyebrow={t("detailsEyebrow")}
                title={t("detailsTitle")}
                titleAs="h2"
                align="left"
                className="mb-8"
              />

              <div className="space-y-5">
                {/* Adresse */}
                <div className="group flex items-start gap-4 rounded-2xl border border-white/10 bg-petrol/50 p-5 backdrop-blur-md transition-all duration-base hover:border-gold/40 hover:bg-petrol/70 hover:-translate-y-1">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-gold/30 bg-gold/10 text-gold shadow-[0_4px_16px_-4px_rgba(212,173,101,0.25)]">
                    <Icon name="location" size="md" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
                      {locale === "fr" ? "Notre Siège" : "Headquarters"}
                    </p>
                    <p className="mt-1 text-sm sm:text-base font-medium text-ivory/90 leading-relaxed">
                      {site.contact.address}
                    </p>
                  </div>
                </div>

                {/* Téléphone */}
                <div className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-petrol/50 p-5 backdrop-blur-md transition-all duration-base hover:border-gold/40 hover:bg-petrol/70 hover:-translate-y-1">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-gold/30 bg-gold/10 text-gold shadow-[0_4px_16px_-4px_rgba(212,173,101,0.25)]">
                    <Icon name="phone" size="md" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
                      {locale === "fr" ? "Ligne Directe" : "Direct Line"}
                    </p>
                    <a
                      href={`tel:${site.contact.phone.replace(/\s/g, "")}`}
                      className="mt-1 block text-sm sm:text-base font-medium text-ivory/90 hover:text-gold transition-colors"
                    >
                      {site.contact.phone}
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-petrol/50 p-5 backdrop-blur-md transition-all duration-base hover:border-gold/40 hover:bg-petrol/70 hover:-translate-y-1">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-gold/30 bg-gold/10 text-gold shadow-[0_4px_16px_-4px_rgba(212,173,101,0.25)]">
                    <Icon name="mail" size="md" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
                      {locale === "fr" ? "Correspondance" : "Inquiries"}
                    </p>
                    <a
                      href={`mailto:${site.contact.email}`}
                      className="mt-1 block text-sm sm:text-base font-medium text-ivory/90 hover:text-gold transition-colors"
                    >
                      {site.contact.email}
                    </a>
                  </div>
                </div>
              </div>

              <SocialLinks social={site.social} label={t("socialLabel")} className="mt-10" />
            </AnimateIn>
          </div>

          {/* Colonne Formulaire (7 cols) */}
          <div className="lg:col-span-7">
            <AnimateIn delay={0.1}>
              <div className="relative overflow-hidden rounded-3xl border border-gold/25 bg-gradient-to-br from-petrol/90 via-petrol/70 to-petrol/85 p-8 sm:p-10 md:p-12 shadow-[0_24px_60px_-16px_rgba(0,0,0,0.6)] backdrop-blur-xl">
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gold/10 blur-3xl"
                />
                <h2 className="mb-2 font-[family-name:var(--font-dm-sans)] text-2xl sm:text-3xl font-bold tracking-tight text-ivory">
                  {t("formTitle")}
                </h2>
                <p className="mb-8 text-sm text-ivory/70">
                  {locale === "fr"
                    ? "Transmettez-nous votre demande et nos équipes vous répondront dans les plus brefs délais."
                    : "Send us your request and our team will get back to you promptly."}
                </p>
                <ContactForm />
              </div>
            </AnimateIn>
          </div>
        </div>
      </PageSection>

      <PageSection variant="alt" spacing="loose">
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
          <div className="overflow-hidden rounded-3xl border border-gold/25 shadow-[0_24px_50px_-12px_rgba(0,0,0,0.35)]">
            <MapEmbed query={site.contact.address} title={`${site.name}`} variant="banner" />
          </div>
        </AnimateIn>
      </PageSection>
    </>
  );
}
