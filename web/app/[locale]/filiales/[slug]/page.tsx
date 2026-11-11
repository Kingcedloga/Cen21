import { notFound, redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

// Ordre d'import conservé : les compositions (et la CSS de leurs sections)
// avant le conteneur de thème, comme dans l'ancienne page unique — la
// cascade entre styles de section et styles de thème en dépend.
import { buildFilialeContext, renderFilialePage } from "@/components/filiales/pages";
import { SubsidiaryThemeShell } from "@/components/filiales/SubsidiaryThemeShell";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/i18n/routing";
import { getAllSubsidiarySlugs, getSubsidiaryBySlug } from "@/lib/content";
import { dynalight, nunito } from "@/lib/fonts";
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
  const sub = getSubsidiaryBySlug(l, slug);
  if (!sub) return {};
  return resolvePageMetadata({
    title: sub.name,
    description: sub.tagline,
    path: `/filiales/${slug}`,
    locale: l,
  });
}

/**
 * Fiche d'une filiale. Le contenu est composé maison par maison
 * (components/filiales/pages) dans le thème de la filiale. Les franchises
 * dotées d'un site officiel (`externalUrl`) y redirigent.
 */
export default async function SubsidiaryPage({ params }: Props) {
  const { locale, slug } = await params;
  const l = locale as Locale;
  setRequestLocale(locale);

  const subsidiary = getSubsidiaryBySlug(l, slug);
  if (!subsidiary) notFound();
  if (subsidiary.externalUrl) redirect(subsidiary.externalUrl);

  const ctx = await buildFilialeContext(l, subsidiary);
  const content = renderFilialePage(ctx);

  if (ctx.pageTheme) {
    return (
      <SubsidiaryThemeShell
        theme={ctx.pageTheme}
        className={slug === "filiale-09" ? nunito.variable : slug === "filiale-07" ? dynalight.variable : undefined}
      >
        {content}
      </SubsidiaryThemeShell>
    );
  }

  return content;
}
