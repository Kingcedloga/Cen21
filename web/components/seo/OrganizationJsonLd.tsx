import type { Locale } from "@/i18n/routing";
import { getSiteConfig } from "@/lib/content";
import { getSiteOrigin } from "@/lib/site-url";

export async function OrganizationJsonLd({ locale }: { locale: Locale }) {
  const site = getSiteConfig(locale);
  const origin = await getSiteOrigin();
  // Profils officiels du groupe (Instagram, LinkedIn…) : rattachés à l'organisation.
  const sameAs = [site.social.instagram, site.social.facebook, site.social.linkedin].filter(Boolean);
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
      streetAddress: site.contact.address,
      addressLocality: "Kinshasa",
      addressCountry: "CD",
    },
    sameAs: sameAs.length > 0 ? sameAs : undefined,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
