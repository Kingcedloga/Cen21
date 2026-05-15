import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

import { Logo } from "@/components/brand/Logo";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { getSiteConfig } from "@/lib/content";

import { NAV_LINKS } from "./nav-links";

const site = getSiteConfig();

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-anthracite mt-auto">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div>
          <Logo size="sm" showWordmark />
          <p className="text-taupe text-sm leading-relaxed mt-4">{site.tagline}</p>
          <SocialLinks social={site.social} size="sm" className="mt-6" />
        </div>

        <div>
          <p className="text-gold text-xs tracking-[0.2em] uppercase mb-4">Navigation</p>
          <ul className="space-y-2">
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-ivory/80 hover:text-gold text-sm transition-colors duration-200 cursor-pointer"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-gold text-xs tracking-[0.2em] uppercase mb-4">Contact</p>
          <ul className="space-y-3 text-sm text-taupe">
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" aria-hidden />
              {site.contact.address}
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gold shrink-0" aria-hidden />
              <a
                href={`tel:${site.contact.phone.replace(/\s/g, "")}`}
                className="hover:text-gold transition-colors cursor-pointer"
              >
                {site.contact.phone}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gold shrink-0" aria-hidden />
              <a
                href={`mailto:${site.contact.email}`}
                className="hover:text-gold transition-colors cursor-pointer"
              >
                {site.contact.email}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-6 text-center text-stone text-xs">
        © {new Date().getFullYear()} {site.name}. Tous droits réservés.
      </div>
    </footer>
  );
}
