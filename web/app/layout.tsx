import type { Metadata } from "next";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { RouteTransition } from "@/components/layout/RouteTransition";
import { cormorant, inter } from "@/lib/fonts";
import { defaultMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/site-url";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  ...defaultMetadata,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${cormorant.variable} ${inter.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col antialiased leading-relaxed">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-gold focus:px-4 focus:py-2 focus:text-petrol focus:font-semibold focus:shadow-lg focus:shadow-black/40 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-petrol"
        >
          Aller au contenu
        </a>
        <Header />
        <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
          <RouteTransition>{children}</RouteTransition>
        </main>
        <Footer />
      </body>
    </html>
  );
}
