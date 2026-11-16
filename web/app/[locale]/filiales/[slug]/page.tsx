import { notFound, redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { buildFilialeContext, hasFilialePage, renderFilialePage } from "@/components/filiales/pages";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/i18n/routing";
import { getAllSubsidiarySlugs, getSubsidiaryBySlug, normalizeSubsidiarySlug } from "@/lib/content";
import { resolvePageMetadata } from "@/lib/seo";

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
  return resolvePageMetadata({
    title: sub.name,
    description: sub.tagline,
    path: `/filiales/${sub.slug}`,
    locale: l,
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
  return renderFilialePage(ctx);
}
