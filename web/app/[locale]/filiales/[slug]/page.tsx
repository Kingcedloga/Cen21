import { notFound, redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { buildFilialeContext, hasFilialePage, renderFilialePage } from "@/components/filiales/pages";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/i18n/routing";
import { getAllSubsidiarySlugs, getSectorLabel, getSubsidiaryBySlug, normalizeSubsidiarySlug } from "@/lib/content";
import { filialeCities, filialeJsonLd, filialeShareImage, truncateDescription } from "@/lib/filiale-seo";
import { resolvePageMetadata } from "@/lib/seo";
import { getSiteOrigin } from "@/lib/site-url";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getAllSubsidiarySlugs(locale).map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const l = locale as Locale;
  const canonicalSlug = normalizeSubsidiarySlug(slug);
  const sub = getSubsidiaryBySlug(l, canonicalSlug);
  if (!sub) return {};
  const t = await getTranslations({ locale: l, namespace: "filiale" });
  const cities = new Intl.ListFormat(l, { type: "conjunction" }).format(filialeCities(sub));
  // « Wabi Sabi · Restaurant à Kinshasa et Lubumbashi » : le nom, le type
  // d'établissement et la ville, les mots que l'on cherche.
  return resolvePageMetadata({
    title: t("seoTitle", { name: sub.name, sector: getSectorLabel(l, sub.sector), cities }),
    description: truncateDescription(sub.description),
    path: `/filiales/${sub.slug}`,
    locale: l,
    image: { url: filialeShareImage(sub), alt: `${sub.name} — ${sub.tagline}` },
  });
}

/**
 * Fiche d'une filiale. Chaque maison a sa composition
 * (components/filiales/pages), qui pose elle-même sa charte
 * (FilialeBrandStyle) sous la navigation du groupe. Les franchises dotées
 * d'un site officiel (`externalUrl`) y redirigent.
 */
export default async function SubsidiaryPage({ params }: Props) {
  const { locale, slug } = await params;
  const l = locale as Locale;
  setRequestLocale(locale);

  const canonicalSlug = normalizeSubsidiarySlug(slug);
  if (canonicalSlug !== slug) {
    redirect(`/${locale}/filiales/${canonicalSlug}`);
  }

  const subsidiary = getSubsidiaryBySlug(l, canonicalSlug);
  if (!subsidiary) notFound();
  if (subsidiary.externalUrl) redirect(subsidiary.externalUrl);

  if (!hasFilialePage(canonicalSlug)) notFound();

  const ctx = await buildFilialeContext(l, subsidiary);
  const tNav = await getTranslations({ locale: l, namespace: "nav" });
  const jsonLd = filialeJsonLd({
    locale: l,
    subsidiary,
    origin: await getSiteOrigin(),
    labels: { home: tNav("home"), subsidiaries: tNav("subsidiaries") },
  });

  return (
    <>
      {/* Données structurées : établissement(s), horaires, adresse, fil d'Ariane. */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      {await renderFilialePage(ctx)}
    </>
  );
}
