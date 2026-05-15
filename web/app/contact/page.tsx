import { Mail, MapPin, Phone } from "lucide-react";

import { MapEmbed } from "@/components/maps/MapEmbed";
import { ContactForm } from "@/components/contact/ContactForm";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { PageHero } from "@/components/sections/PageHero";
import { getSiteConfig } from "@/lib/content";
import { createPageMetadata } from "@/lib/seo";

const site = getSiteConfig();

export const metadata = createPageMetadata({
  title: "Contact",
  description: "Contactez Cen21 Hospitality — formulaire, coordonnées et réseaux sociaux.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Écrivez-nous"
        description="Une question, une collaboration ou une demande privée — notre équipe vous répond sous 48h."
      />

      <section className="py-16 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="font-[family-name:var(--font-cormorant)] text-2xl text-ivory mb-8">
              Coordonnées
            </h2>
            <ul className="space-y-6 text-taupe">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold shrink-0 mt-0.5" aria-hidden />
                {site.contact.address}
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gold shrink-0" aria-hidden />
                <a
                  href={`tel:${site.contact.phone.replace(/\s/g, "")}`}
                  className="hover:text-gold transition-colors cursor-pointer"
                >
                  {site.contact.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gold shrink-0" aria-hidden />
                <a
                  href={`mailto:${site.contact.email}`}
                  className="hover:text-gold transition-colors cursor-pointer"
                >
                  {site.contact.email}
                </a>
              </li>
            </ul>

            <SocialLinks
              social={site.social}
              label="Réseaux sociaux"
              className="mt-10"
            />
          </div>

          <div className="glass-panel rounded-2xl p-8 md:p-10 ring-1 ring-inset ring-white/[0.06]">
            <h2 className="font-[family-name:var(--font-cormorant)] text-2xl text-ivory mb-6">
              Formulaire
            </h2>
            <ContactForm />
          </div>
        </div>

        <div className="mt-16">
          <h2 className="font-[family-name:var(--font-cormorant)] text-2xl text-ivory mb-3">
            Nous trouver
          </h2>
          <p className="text-taupe text-sm mb-6 max-w-2xl">
            Carte interactive — cliquez sur « Agrandir la carte » pour l&apos;itinéraire dans Google Maps.
          </p>
          <MapEmbed query={site.contact.address} title="Carte — Cen21 Hospitality" />
        </div>
      </section>
    </>
  );
}
