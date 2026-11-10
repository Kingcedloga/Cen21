import { getTranslations, setRequestLocale } from "next-intl/server";

import { SubsidiariesStack, type StackItem } from "@/components/filiales/SubsidiariesStack";
import { HeroCurtain } from "@/components/layout/HeroCurtain";
import { PageSection } from "@/components/layout/PageSection";
import { SectionBlend } from "@/components/layout/SectionBlend";
import { RollingText } from "@/components/motion/RollingText";
import { InnerHero } from "@/components/sections/InnerHero";
import { PageOutro } from "@/components/sections/PageOutro";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getSectorLabel, getSubsidiaries } from "@/lib/content";
import { galleryEntrySrc } from "@/lib/gallery-categories";
import { resolvePageMetadata } from "@/lib/seo";
import { brandCardPalette, brandSurface } from "@/lib/subsidiary-brand";
import { resolveSubsidiaryHeroImage } from "@/lib/subsidiary-hero-layout";
import { getSubsidiaryHref, isSubsidiaryExternalLink } from "@/lib/subsidiary-links";
import { getSubsidiaryPageTheme } from "@/lib/subsidiary-themes";
import type { Subsidiary } from "@/lib/types";

type Props = { params: Promise<{ locale: string }> };

/** Photo de la carte : de préférence une photo locale de la filiale. */
function stackImage(s: Subsidiary): string {
  const candidates = [
    resolveSubsidiaryHeroImage(s.slug, s.coverImage),
    ...s.galleryImages.map(galleryEntrySrc),
    s.coverImage,
  ];
  return candidates.find((src) => src.startsWith("/")) ?? s.coverImage;
}

const INDEX_LINK =
  "tap-press inline-flex min-h-[2.75rem] items-center gap-2 rounded-full border border-ivory/15 px-4 text-sm text-ivory/85 transition-colors duration-fine hover:border-gold/50 hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold";

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "subsidiaries" });
  return resolvePageMetadata({
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
  const tNav = await getTranslations("nav");
  const tCommon = await getTranslations("common");
  const tOutro = await getTranslations("outro");
  const tCta = await getTranslations("cta");

  const stackItems: StackItem[] = subsidiaries.map((s) => ({
    slug: s.slug,
    name: s.name,
    sector: getSectorLabel(l, s.sector),
    tagline: s.tagline,
    hours: s.practicalInfo?.hours,
    address: s.practicalInfo?.address,
    image: stackImage(s),
    logo: s.brandLogo,
    logoSurface: brandSurface(s.slug, s.accentColor),
    href: getSubsidiaryHref(s),
    external: isSubsidiaryExternalLink(s),
    ctaLabel: tCommon("discover", { name: s.name }),
    palette: brandCardPalette(
      getSubsidiaryPageTheme(s.slug)?.colors ?? null,
      brandSurface(s.slug, s.accentColor),
    ),
  }));

  return (
    <>
      <HeroCurtain
        surface="var(--color-petrol-panel-4)"
        hero={
          <InnerHero
            className="hero-curtain__hero"
            eyebrow={t("eyebrow")}
            title={t("title")}
            titleSweep={t("titleSweep")}
            description={t("description")}
            image="https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=2400&q=85"
            breadcrumb={{ label: tCommon("breadcrumb"), home: tNav("home"), current: tNav("subsidiaries") }}
          />
        }
      >
        <PageSection
          variant="dark"
          spacing="default"
          id="filiales-stack"
          ariaLabelledby="filiales-stack-title"
          className="pb-14! md:pb-20!"
          containerClassName="mx-auto max-w-[min(100%,1400px)]"
        >
          <AnimateIn>
            <SectionHeading
              look="editorial"
              eyebrow={t("selectionEyebrow")}
              title={t("selectionTitle")}
              sweep={t("selectionTitleSweep")}
              titleAs="h2"
              subtitleAs="h3"
              titleId="filiales-stack-title"
              description={t("selectionDescription")}
              align="left"
              className="max-w-2xl"
            />
          </AnimateIn>

          {/* Accès direct : la pile fait dix écrans de haut. */}
          <nav aria-label={t("indexLabel")} className="mt-10 md:mt-12">
            <ul className="flex flex-wrap gap-2">
              {stackItems.map((item) => (
                <li key={item.slug}>
                  {item.external ? (
                    <a href={item.href} target="_blank" rel="noopener noreferrer" className={INDEX_LINK}>
                      <RollingText text={item.name} />
                      <span className="sr-only"> ({t("newTab")})</span>
                    </a>
                  ) : (
                    <Link href={item.href} className={INDEX_LINK}>
                      <RollingText text={item.name} />
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </PageSection>
      </HeroCurtain>

      <SubsidiariesStack
        items={stackItems}
        labels={{ list: t("stackLabel"), hours: t("hours"), address: t("address"), newTab: t("newTab") }}
      />

      {/* La dernière carte (charte de la maison) se fond dans la bande de clôture. */}
      <SectionBlend to="var(--color-anthracite)" />

      <PageOutro
        eyebrow={tOutro("eyebrow")}
        title={tOutro("subsidiariesTitle")}
        titleSweep={tOutro("subsidiariesSweep")}
        primary={{ href: "/contact", label: tCta("contact") }}
        next={{ href: "/evenements", label: tOutro("next"), title: tNav("events") }}
      />
    </>
  );
}
