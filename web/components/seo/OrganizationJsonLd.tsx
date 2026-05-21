import type { Locale } from "@/i18n/routing";
import { getSiteConfig } from "@/lib/content";
import { getSiteOrigin } from "@/lib/site-url";

export async function OrganizationJsonLd({ locale }: { locale: Locale }) {
  const site = getSiteConfig(locale);
  const origin = await getSiteOrigin();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    description: site.description,
    url: origin,
    email: site.contact.email,
    telephone: site.contact.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: site.contact.address,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
