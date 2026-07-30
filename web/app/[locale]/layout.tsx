import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PhosphorProvider } from "@/components/layout/PhosphorProvider";
import { RouteTransition } from "@/components/layout/RouteTransition";
import { SiteLoader } from "@/components/layout/SiteLoader";
import { routing } from "@/i18n/routing";
import { inter } from "@/lib/fonts";
import type { Locale } from "@/i18n/routing";
import { createDefaultMetadata, siteViewport } from "@/lib/seo";

export const viewport = siteViewport;

import "../globals.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return createDefaultMetadata(locale as Locale);
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const t = await getTranslations("common");

  return (
    <html
      lang={locale}
      className={`${inter.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col antialiased leading-relaxed" suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <PhosphorProvider>
          <SiteLoader />
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-gold focus:px-4 focus:py-2 focus:text-petrol focus:font-semibold focus:shadow-lg focus:shadow-black/40 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-petrol"
          >
            {t("skipToContent")}
          </a>
          <Header />
          <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
            <RouteTransition>{children}</RouteTransition>
          </main>
          <Footer />
          </PhosphorProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
