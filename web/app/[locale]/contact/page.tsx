import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";

import { ContactAddresses, type AddressEntry } from "@/components/contact/ContactAddresses";
import { ContactForm, type ContactHouse } from "@/components/contact/ContactForm";
import { FaqAccordion, type FaqItem } from "@/components/contact/FaqAccordion";
import { SocialTiles } from "@/components/contact/SocialTiles";
import { HeroCurtain } from "@/components/layout/HeroCurtain";
import { PageSection, SECTION_SURFACE } from "@/components/layout/PageSection";
import { SectionBlend } from "@/components/layout/SectionBlend";
import { InnerHero } from "@/components/sections/InnerHero";
import { PageOutro } from "@/components/sections/PageOutro";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { ContactNeed } from "@/lib/contact-schema";
import { getSiteConfig, getSubsidiaries } from "@/lib/content";
import { ExternalLink, Mail, MapPin, Phone } from "@/lib/icons";
import { googleMapsExternalUrl } from "@/lib/map";
import { resolvePageMetadata } from "@/lib/seo";
import { brandSurface } from "@/lib/subsidiary-brand";
import { getSubsidiaryHref, isSubsidiaryExternalLink } from "@/lib/subsidiary-links";
import { socialTiles } from "@/lib/social-tiles";
import { subsidiaryPlaces } from "@/lib/subsidiary-places";

type Props = { params: Promise<{ locale: string }> };

/** Balises des réponses de la FAQ (`t.rich`) : lien vers une page, vers le formulaire. */
function pageLink(href: string) {
  return function PageLink(chunks: ReactNode) {
    return <Link href={href}>{chunks}</Link>;
  };
}

/** Lien vers le formulaire, qui coche le besoin au passage (ContactForm). */
function formLink(need: ContactNeed) {
  return function FormLink(chunks: ReactNode) {
    return (
      <a href="#contact-form" data-contact-need={need}>
        {chunks}
      </a>
    );
  };
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
      answer: <p>{t.rich("faqBookingA", { link: pageLink("/filiales"), form: formLink("reservation") })}</p>,
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
      answer: <p>{t.rich("faqPrivateA", { form: formLink("privatisation") })}</p>,
    },
    {
      id: "events",
      question: t("faqEventsQ"),
      answer: <p>{t.rich("faqEventsA", { link: pageLink("/evenements") })}</p>,
    },
  ];
  const tiles = socialTiles(subsidiaries);
  const tSub = await getTranslations("subsidiaries");

  // Formulaire : pastilles des maisons.
  const houses: ContactHouse[] = subsidiaries.map((s) => ({
    slug: s.slug,
    name: s.name,
    logo: s.brandLogo,
    logoSurface: brandSurface(s.slug, s.accentColor),
  }));

  // « Nos adresses » : le siège, puis chaque adresse précise des maisons
  // (une par implantation : Kinshasa d'abord, les autres villes ensuite).
  const phoneHref = `tel:${site.contact.phone.replace(/\s/g, "")}`;
  const houseEntries: AddressEntry[] = subsidiaryPlaces(subsidiaries).map(({ subsidiary: s, ...place }) => ({
    id: `${s.slug}-${place.city.toLowerCase()}`,
    name: s.name,
    city: place.main ? undefined : place.city,
    address: place.address,
    phone: place.phone,
    hours: place.main ? s.practicalInfo.hours : undefined,
    logo: s.brandLogo,
    logoSurface: brandSurface(s.slug, s.accentColor),
    page: {
      href: getSubsidiaryHref(s),
      external: isSubsidiaryExternalLink(s),
      label: tCommon("discover", { name: s.name }),
    },
    mapTitle: tSub("mapTitle", { name: s.name }),
  }));
  const addresses: AddressEntry[] = [
    {
      id: "siege",
      name: site.name,
      city: t("officeTag"),
      address: site.contact.address,
      phone: site.contact.phone,
      logo: "/logo.png",
      logoSurface: "var(--color-petrol)",
      mapTitle: tSub("mapTitle", { name: site.name }),
    },
    ...houseEntries,
  ];

  return (
    <>
      <HeroCurtain
        surface={SECTION_SURFACE.light}
        hero={
          <InnerHero
            className="hero-curtain__hero"
            eyebrow={t("eyebrow")}
            title={t("title")}
            description={t("description")}
            image="https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=2400&q=85"
            breadcrumb={{ label: tCommon("breadcrumb"), home: tNav("home"), current: tNav("contact") }}
            actions={
              <>
                <Button href="#contact-form" native magnetic>
                  {t("faqCardCta")}
                </Button>
                <Button href={phoneHref} native variant="secondary">
                  <Phone size={16} aria-hidden="true" />
                  {tCommon("call")}
                </Button>
                <Button href={googleMapsExternalUrl(site.contact.address)} external variant="secondary">
                  {tCommon("directions")}
                  <ExternalLink size={16} aria-hidden="true" />
                  <span className="sr-only"> ({t("newTab")})</span>
                </Button>
              </>
            }
          />
        }
      >
        {/* Carte de contact (Orbix : carte de prise de rendez-vous). Carte
            sombre sur fond sable, comme la carte de la FAQ. */}
        <PageSection variant="light" spacing="loose" containerClassName="mx-auto max-w-[min(100%,1400px)]">
          <AnimateIn>
            {/* Surface sombre dans la section sable : la capsule de navigation
                reste claire au-dessus de la carte (useSurfaceContrast). */}
            <div id="contact-form" className="contact-card" data-surface="dark">
              <div>
                <SectionHeading
                  look="editorial"
                  eyebrow={t("detailsEyebrow")}
                  title={t("detailsTitle")}
                  titleAs="h2"
                  description={t("cardText")}
                  align="left"
                  className="mb-8!"
                />
                <ul className="contact-card__facts">
                  <li>
                    <MapPin size={18} aria-hidden="true" />
                    <span>
                      <span className="contact-card__fact-label">{t("officeLabel")}</span>
                      <span className="contact-card__fact-value">{site.contact.address}</span>
                    </span>
                  </li>
                  <li>
                    <Phone size={18} aria-hidden="true" />
                    <span>
                      <span className="contact-card__fact-label">{t("phoneLabel")}</span>
                      <a href={phoneHref} className="contact-card__fact-value">
                        {site.contact.phone}
                      </a>
                    </span>
                  </li>
                  <li>
                    <Mail size={18} aria-hidden="true" />
                    <span>
                      <span className="contact-card__fact-label">{t("emailLabel")}</span>
                      <a href={`mailto:${site.contact.email}`} className="contact-card__fact-value">
                        {site.contact.email}
                      </a>
                    </span>
                  </li>
                </ul>
                <SocialLinks social={site.social} label={t("socialLabel")} className="mt-8" />
              </div>
              <div className="contact-card__form">
                <ContactForm houses={houses} />
              </div>
            </div>
          </AnimateIn>
        </PageSection>
      </HeroCurtain>

      {/* Séparateurs fondus entre sections de couleurs différentes (comme sur l'accueil). */}
      <SectionBlend from={SECTION_SURFACE.light} to={SECTION_SURFACE.alt} />

      {/* Nos adresses : le siège et les maisons, carte qui se place sur l'adresse choisie. */}
      <PageSection
        variant="alt"
        spacing="loose"
        id="adresses"
        ariaLabelledby="addresses-title"
        containerClassName="mx-auto max-w-[min(100%,1400px)]"
      >
        <SectionHeading
          look="editorial"
          eyebrow={t("locationEyebrow")}
          title={t("addressesTitle")}
          sweep={t("addressesSweep")}
          titleAs="h2"
          titleId="addresses-title"
          description={t("addressesIntro")}
          align="left"
          className="mb-10 max-w-2xl"
        />
        <ContactAddresses
          entries={addresses}
          labels={{
            list: t("addressesList"),
            directions: tCommon("directions"),
            call: tCommon("call"),
            newTab: t("newTab"),
            hours: tSub("hours"),
          }}
        />
      </PageSection>

      <SectionBlend from={SECTION_SURFACE.alt} to={SECTION_SURFACE.light} />

      {/* FAQ (Orbix : colonne gauche collante, accordéon à droite). Chapitre
          sable : casse l'enchaînement de fonds pétrole de la page. */}
      <PageSection variant="light" spacing="loose" id="faq" ariaLabelledby="faq-title">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:sticky lg:top-24 lg:col-span-5">
            <SectionHeading
              look="editorial"
              tone="light"
              eyebrow={t("faqEyebrow")}
              title={t("faqTitle")}
              sweep={t("faqTitleSweep")}
              titleAs="h2"
              titleId="faq-title"
              description={t("faqIntro")}
              align="left"
              className="mb-8"
            />
            {/* Carte pétrole pleine : contraste franc sur le sable. */}
            <div className="rounded-3xl border border-gold/25 bg-petrol p-6 shadow-long md:p-8">
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

      <SectionBlend from={SECTION_SURFACE.light} to={SECTION_SURFACE.dark} />

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
