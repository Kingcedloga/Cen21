import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";

import { ContactForm } from "@/components/contact/ContactForm";
import { FaqAccordion, type FaqItem } from "@/components/contact/FaqAccordion";
import { SocialTiles, type SocialTile } from "@/components/contact/SocialTiles";
import { HeroCurtain } from "@/components/layout/HeroCurtain";
import { PageSection } from "@/components/layout/PageSection";
import { InnerHero } from "@/components/sections/InnerHero";
import { PageOutro } from "@/components/sections/PageOutro";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { Icon } from "@/components/ui/Icon";
import { MapEmbed } from "@/components/maps/MapEmbed";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getSiteConfig, getSubsidiaries } from "@/lib/content";
import { resolvePageMetadata } from "@/lib/seo";
import { brandSurface } from "@/lib/subsidiary-brand";
import type { Subsidiary } from "@/lib/types";

type Props = { params: Promise<{ locale: string }> };

/** Tuile réseau d'une filiale : Instagram, Facebook à défaut. */
function socialTile(s: Subsidiary): SocialTile | null {
  const instagram = s.social.instagram;
  const href = instagram ?? s.social.facebook;
  if (!href) return null;
  let handle = s.name;
  if (instagram) {
    try {
      const account = new URL(instagram).pathname.split("/").filter(Boolean)[0];
      if (account) handle = `@${account}`;
    } catch {
      // adresse invalide : on garde le nom de la maison
    }
  }
  return {
    slug: s.slug,
    name: s.name,
    network: instagram ? "Instagram" : "Facebook",
    href,
    handle,
    logo: s.brandLogo,
    logoSurface: brandSurface(s.slug, s.accentColor),
  };
}

/** Balises des réponses de la FAQ (`t.rich`) : lien vers une page, vers le formulaire. */
function pageLink(href: string) {
  return function PageLink(chunks: ReactNode) {
    return <Link href={href}>{chunks}</Link>;
  };
}

function formLink(chunks: ReactNode) {
  return <a href="#contact-form">{chunks}</a>;
}

const FAQ_CTA =
  "btn-primary tap-press inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-medium";

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
  const l = locale as Locale;
  const site = getSiteConfig(l);
  const subsidiaries = getSubsidiaries(l);
  const t = await getTranslations("contact");
  const tNav = await getTranslations("nav");
  const tCommon = await getTranslations("common");
  const tOutro = await getTranslations("outro");
  const tCta = await getTranslations("cta");

  // FAQ : réponses tirées des données du site (horaires, villes, pages).
  const otherCities = new Map<string, string[]>();
  for (const s of subsidiaries) {
    for (const location of s.practicalInfo?.locations ?? []) {
      if (location.city === "Kinshasa") continue;
      otherCities.set(location.city, [...(otherCities.get(location.city) ?? []), s.name]);
    }
  }
  const list = new Intl.ListFormat(l, { style: "long", type: "conjunction" });
  const faqItems: FaqItem[] = [
    {
      id: "booking",
      question: t("faqBookingQ"),
      answer: <p>{t.rich("faqBookingA", { link: pageLink("/filiales"), form: formLink })}</p>,
    },
    {
      id: "hours",
      question: t("faqHoursQ"),
      answer: (
        <>
          <p>{t("faqHoursA")}</p>
          <ul className="faq-hours">
            {subsidiaries
              .filter((s) => s.practicalInfo?.hours)
              .map((s) => (
                <li key={s.slug}>
                  <span>{s.name}</span>
                  <span>{s.practicalInfo.hours}</span>
                </li>
              ))}
          </ul>
        </>
      ),
    },
    {
      id: "cities",
      question: t("faqCitiesQ"),
      answer: (
        <p>
          {t("faqCitiesA", { count: subsidiaries.length })}
          {[...otherCities].map(([city, names]) => (
            <span key={city}> {t("faqCitiesExtra", { names: list.format(names), n: names.length, city })}</span>
          ))}{" "}
          {t.rich("faqCitiesLink", { link: pageLink("/filiales") })}
        </p>
      ),
    },
    {
      id: "private",
      question: t("faqPrivateQ"),
      answer: <p>{t.rich("faqPrivateA", { form: formLink })}</p>,
    },
    {
      id: "events",
      question: t("faqEventsQ"),
      answer: <p>{t.rich("faqEventsA", { link: pageLink("/evenements") })}</p>,
    },
  ];
  const tiles = subsidiaries.map(socialTile).filter((tile): tile is SocialTile => tile !== null);

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
            image="https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=2400&q=85"
            breadcrumb={{ label: tCommon("breadcrumb"), home: tNav("home"), current: tNav("contact") }}
          />
        }
      >
        <PageSection variant="default" spacing="loose">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-16 items-start">
            {/* Colonne Coordonnées (5 cols) */}
            <div className="lg:col-span-5">
              <AnimateIn>
                <SectionHeading
                  look="editorial"
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
                <div id="contact-form" className="relative scroll-mt-8 overflow-hidden rounded-3xl border border-gold/25 bg-gradient-to-br from-petrol/90 via-petrol/70 to-petrol/85 p-8 sm:p-10 md:p-12 shadow-[0_24px_60px_-16px_rgba(0,0,0,0.6)] backdrop-blur-xl">
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
      </HeroCurtain>

      <PageSection variant="alt" spacing="loose">
        <AnimateIn>
          <SectionHeading
            look="editorial"
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

      {/* FAQ (Orbix : colonne gauche collante, accordéon à droite). */}
      <PageSection variant="default" spacing="loose" id="faq" ariaLabelledby="faq-title">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:sticky lg:top-24 lg:col-span-5">
            <SectionHeading
              look="editorial"
              eyebrow={t("faqEyebrow")}
              title={t("faqTitle")}
              sweep={t("faqTitleSweep")}
              titleAs="h2"
              titleId="faq-title"
              description={t("faqIntro")}
              align="left"
              className="mb-8"
            />
            <div className="rounded-3xl border border-gold/25 bg-petrol-panel-3/60 p-6 md:p-8">
              <p className="font-[family-name:var(--font-dm-sans)] text-lg font-semibold text-ivory">
                {t("faqCardTitle")}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ivory/75">{t("faqCardText")}</p>
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
                <a href="#contact-form" className={FAQ_CTA}>
                  {t("faqCardCta")}
                </a>
                <a
                  href={`tel:${site.contact.phone.replace(/\s/g, "")}`}
                  className="text-sm font-medium text-gold underline decoration-gold/40 underline-offset-4 hover:decoration-gold"
                >
                  {tCommon("call")} · {site.contact.phone}
                </a>
              </div>
            </div>
          </div>
          <div className="lg:col-span-7">
            <FaqAccordion items={faqItems} />
          </div>
        </div>
      </PageSection>

      {/* Réseaux des maisons (Orbix : tuiles « plateformes »). */}
      <PageSection variant="dark" spacing="default" id="reseaux" ariaLabelledby="tiles-title">
        <SectionHeading
          look="editorial"
          eyebrow={t("tilesEyebrow")}
          title={t("tilesTitle")}
          sweep={t("tilesTitleSweep")}
          titleAs="h2"
          titleId="tiles-title"
          description={t("tilesDescription")}
          align="left"
          className="mb-10 max-w-2xl"
        />
        <SocialTiles tiles={tiles} label={t("tilesLabel")} newTab={t("newTab")} />
      </PageSection>

      <PageOutro
        eyebrow={tOutro("eyebrow")}
        title={tOutro("contactTitle")}
        titleSweep={tOutro("contactSweep")}
        primary={{ href: "/filiales", label: tCta("subsidiaries") }}
        next={{ href: "/a-propos", label: tOutro("next"), title: tNav("about") }}
      />
    </>
  );
}
