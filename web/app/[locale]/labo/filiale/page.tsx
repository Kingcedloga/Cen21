import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { contactHouses, filialePhotos, ownHouses } from "@/components/filiales/blocks/data";
import { FilialeBrandStyle } from "@/components/filiales/blocks/FilialeBrandStyle";
import { FilialeEvents, filialeDeckEvents } from "@/components/filiales/blocks/FilialeEvents";
import { FilialeFaq } from "@/components/filiales/blocks/FilialeFaq";
import { FilialeGalleryStrip } from "@/components/filiales/blocks/FilialeGalleryStrip";
import { FilialeHero } from "@/components/filiales/blocks/FilialeHero";
import { FilialeMenu, type MenuCategory } from "@/components/filiales/blocks/FilialeMenu";
import { FilialeOtherHouses } from "@/components/filiales/blocks/FilialeOtherHouses";
import { FilialePractical } from "@/components/filiales/blocks/FilialePractical";
import { FilialeReservation } from "@/components/filiales/blocks/FilialeReservation";
import { FilialeSpecialties } from "@/components/filiales/blocks/FilialeSpecialties";
import { FilialeTestimonials } from "@/components/filiales/blocks/FilialeTestimonials";
import { buildFilialeContext } from "@/components/filiales/pages";
import { PageSection, SECTION_SURFACE } from "@/components/layout/PageSection";
import { SectionBlend } from "@/components/layout/SectionBlend";
import { AboutStory } from "@/components/sections/about/AboutStory";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getSubsidiaryBySlug, getSubsidiaryFaq } from "@/lib/content";
import type { Subsidiary } from "@/lib/types";

/**
 * Labo des fiches filiales (refonte R5) : les blocs du socle assemblés aux
 * couleurs d'une maison (`?maison=filiale-0X`, Wabi Sabi par défaut), avant
 * leur adoption maison par maison (R6 à R12). Page de travail : répond
 * uniquement si le serveur tourne avec MOTION_LAB=1, non indexée.
 */

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const DEFAULT_HOUSE = "filiale-02";

function isLabEnabled() {
  return process.env.MOTION_LAB === "1";
}

function resolveHouse(locale: Locale, requested: string | string[] | undefined): Subsidiary | undefined {
  const slug = typeof requested === "string" ? requested : DEFAULT_HOUSE;
  const house = getSubsidiaryBySlug(locale, slug);
  return house && !house.externalUrl ? house : getSubsidiaryBySlug(locale, DEFAULT_HOUSE);
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { locale } = await params;
  const house = resolveHouse(locale as Locale, (await searchParams).maison);
  const t = await getTranslations({ locale, namespace: "filiale" });
  return { title: t("laboTitle", { name: house?.name ?? "" }), robots: { index: false, follow: false } };
}

/* --- Adaptateurs : contenus actuels des maisons → blocs du socle ----------- */

function specialtiesOf(s: Subsidiary) {
  if (s.specialtiesSection) return s.specialtiesSection.rows.map(({ title, description }) => ({ title, description }));
  if (s.aboutSection?.highlights) return s.aboutSection.highlights.map(({ title, description }) => ({ title, description }));
  if (s.muzikMenuSection) return s.muzikMenuSection.benefits;
  return [];
}

function menuOf(s: Subsidiary): { title: string; intro?: string; categories: MenuCategory[] } | null {
  if (s.menuCategoriesSection) {
    const { title, description, categories } = s.menuCategoriesSection;
    return {
      title,
      intro: description,
      categories: categories.map((category) => ({
        id: category.id,
        label: category.label,
        items: category.dishes.map(({ name, description: text, price, image }) => ({ name, description: text, price, image })),
      })),
    };
  }
  if (s.muzikMenuSection) {
    const { menuTitle, items } = s.muzikMenuSection;
    return {
      title: menuTitle,
      categories: [
        {
          id: "menu",
          label: menuTitle,
          items: items.map(({ name, subtitle, price, image }) => ({ name, description: subtitle, price, image })),
        },
      ],
    };
  }
  return null;
}

export default async function FilialeLabPage({ params, searchParams }: Props) {
  if (!isLabEnabled()) notFound();

  const { locale } = await params;
  setRequestLocale(locale);
  const l = locale as Locale;
  const subsidiary = resolveHouse(l, (await searchParams).maison);
  if (!subsidiary) notFound();

  const t = await getTranslations("filiale");
  const ctx = await buildFilialeContext(l, subsidiary);
  const { slug, name } = subsidiary;

  const photos = filialePhotos(subsidiary, (n) => t("photoAlt", { name, n }));
  const houses = contactHouses(l);
  const events = filialeDeckEvents(l, slug);
  const menu = menuOf(subsidiary);
  const specialties = specialtiesOf(subsidiary);
  const testimonials = subsidiary.testimonialsSection;

  return (
    <>
      {ctx.pageTheme && <FilialeBrandStyle theme={ctx.pageTheme} />}

      <FilialeHero
        subsidiary={subsidiary}
        locale={l}
        image={ctx.heroSlides[0]?.src ?? subsidiary.coverImage}
        mapsUrl={ctx.mapsUrl}
      />

      <AboutStory
        tone="dark"
        titleId="filiale-story-title"
        eyebrow={t("storyEyebrow")}
        title={subsidiary.tagline}
        statement={subsidiary.description}
      />

      {(specialties.length > 0 || menu) && (
        <>
          <SectionBlend from={SECTION_SURFACE.dark} to={SECTION_SURFACE.default} />
          <PageSection ariaLabelledby={menu ? "filiale-menu-title" : undefined}>
            <div className="grid gap-16 md:gap-24">
              <FilialeSpecialties items={specialties} heading={subsidiary.specialtiesSection} />
              {menu && <FilialeMenu title={menu.title} intro={menu.intro} categories={menu.categories} />}
            </div>
          </PageSection>
          <SectionBlend from={SECTION_SURFACE.default} to={SECTION_SURFACE.dark} />
        </>
      )}

      <PageSection variant="dark" ariaLabelledby="filiale-gallery-title" overflow="hidden">
        <FilialeGalleryStrip name={name} photos={photos} house={{ slug, name, href: `/filiales/${slug}`, external: false }} />
      </PageSection>

      <SectionBlend from={SECTION_SURFACE.dark} to={SECTION_SURFACE.default} />
      <FilialeEvents slug={slug} name={name} events={events} />

      {testimonials && (
        <PageSection ariaLabelledby="filiale-testimonials-title">
          <FilialeTestimonials eyebrow={testimonials.eyebrow} title={testimonials.title} items={testimonials.items} />
        </PageSection>
      )}

      <SectionBlend from={SECTION_SURFACE.default} to={SECTION_SURFACE.dark} />
      <PageSection variant="dark" ariaLabelledby="filiale-practical-title">
        <FilialePractical subsidiary={subsidiary} locale={l} mapQuery={ctx.mapQuery} mapsUrl={ctx.mapsUrl} />
      </PageSection>

      <PageSection variant="dark" spacing="compact" ariaLabelledby="filiale-faq-title">
        <FilialeFaq name={name} items={getSubsidiaryFaq(l, slug)} />
      </PageSection>

      <SectionBlend from={SECTION_SURFACE.dark} to={SECTION_SURFACE.default} />
      <PageSection ariaLabelledby="filiale-reservation-title">
        <FilialeReservation slug={slug} name={name} houses={houses} />
      </PageSection>

      <SectionBlend from={SECTION_SURFACE.default} to={SECTION_SURFACE.dark} />
      <PageSection variant="dark" ariaLabelledby="filiale-others-title" overflow="hidden">
        <FilialeOtherHouses slug={slug} locale={l} />
      </PageSection>

      <PageSection variant="dark" spacing="compact">
        <aside className="grid gap-4 border-t border-ivory/10 pt-8 text-sm text-ivory/70">
          <p>{t("laboNote", { name })}</p>
          <nav aria-label={t("laboSwitch")} className="flex flex-wrap items-center gap-2">
            <span>{t("laboSwitch")}</span>
            {ownHouses(l).map((s) => (
              <Link
                key={s.slug}
                href={`/labo/filiale?maison=${s.slug}`}
                aria-current={s.slug === slug ? "page" : undefined}
                className="rounded-full border border-ivory/20 px-3 py-1.5 text-ivory hover:border-rose aria-[current=page]:border-transparent aria-[current=page]:bg-[var(--brand-fill,var(--color-rose))] aria-[current=page]:text-[var(--brand-on-accent,var(--color-petrol-panel-4))]"
              >
                {s.name}
              </Link>
            ))}
          </nav>
        </aside>
      </PageSection>
    </>
  );
}
