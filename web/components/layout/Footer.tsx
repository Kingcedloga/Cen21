import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Logo } from "@/components/brand/Logo";
import { FooterWave } from "@/components/layout/FooterWave";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import { getSiteConfig } from "@/lib/content";
import { getContentLocale } from "@/lib/locale-server";

import { NAV_PATHS } from "./nav-links";

function SocialRow({
  href,
  label,
}: {
  href?: string;
  label: string;
}) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-between gap-4 py-2 text-sm text-ivory/90 transition-colors hover:text-gold cursor-pointer"
    >
      <span>{label}</span>
      <ArrowUpRight
        className="h-4 w-4 shrink-0 text-gold/70 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        aria-hidden
      />
    </a>
  );
}

export async function Footer() {
  const locale = await getContentLocale();
  const site = getSiteConfig(locale);
  const t = await getTranslations("footer");
  const tNav = await getTranslations("nav");
  const tCommon = await getTranslations("common");

  const quickCol1 = NAV_PATHS.slice(0, 3);
  const quickCol2 = NAV_PATHS.slice(3);

  return (
    <>
      <FooterWave />
      <footer className="relative bg-anthracite text-ivory">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 L35 25 L55 30 L35 35 L30 55 L25 35 L5 30 L25 25 Z' fill='none' stroke='%23C5A059' stroke-width='0.35' opacity='0.5'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative mx-auto max-w-7xl px-6 pb-12 pt-4 md:px-10 md:pb-16">
          <div className="mb-12 flex flex-col items-center text-center md:mb-14">
            <div className="relative -mt-14 mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-gold/40 bg-petrol shadow-lg shadow-black/40 md:-mt-16 md:h-24 md:w-24">
              <Logo size="lg" />
            </div>
            <p className="font-[family-name:var(--font-cormorant)] text-2xl tracking-wide md:text-3xl">
              {site.name}
            </p>
            <p className="mt-2 max-w-md text-sm italic text-taupe">{site.tagline}</p>
          </div>

          <div className="grid grid-cols-1 gap-12 border-t border-white/10 pt-12 md:grid-cols-12 md:gap-10 md:pt-14">
            <div className="md:col-span-4">
              <p className="text-gold text-xs tracking-[0.25em] uppercase mb-5">
                {t("contact")}
              </p>
              <ul className="space-y-4 text-sm text-taupe">
                <li className="flex gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
                  {site.contact.address}
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="h-4 w-4 shrink-0 text-gold" aria-hidden />
                  <a
                    href={`tel:${site.contact.phone.replace(/\s/g, "")}`}
                    className="hover:text-gold transition-colors cursor-pointer"
                  >
                    {site.contact.phone}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="h-4 w-4 shrink-0 text-gold" aria-hidden />
                  <a
                    href={`mailto:${site.contact.email}`}
                    className="hover:text-gold transition-colors cursor-pointer"
                  >
                    {site.contact.email}
                  </a>
                </li>
              </ul>

              <div className="mt-8 max-w-xs border-t border-white/10 pt-6">
                <p className="text-gold text-xs tracking-[0.2em] uppercase mb-3">
                  {t("networks")}
                </p>
                <div className="flex flex-col gap-1">
                  <SocialRow href={site.social.instagram} label="Instagram" />
                  <SocialRow href={site.social.facebook} label="Facebook" />
                  <SocialRow href={site.social.linkedin} label="LinkedIn" />
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start justify-start gap-3 md:col-span-4 md:items-center md:pt-2">
              <Button href="/evenements">
                {t("events")}
                <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              </Button>
              <Button href="/contact" variant="secondary">
                {t("quickContact")}
                <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              </Button>
            </div>

            <div className="md:col-span-4">
              <p className="text-gold text-xs tracking-[0.25em] uppercase mb-5">
                {t("quickAccess")}
              </p>
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                <ul className="space-y-2">
                  {quickCol1.map(({ href, key }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className="text-ivory/75 transition-colors hover:text-gold cursor-pointer"
                      >
                        {tNav(key)}
                      </Link>
                    </li>
                  ))}
                </ul>
                <ul className="space-y-2">
                  {quickCol2.map(({ href, key }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className="text-ivory/75 transition-colors hover:text-gold cursor-pointer"
                      >
                        {tNav(key)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-14 flex flex-col-reverse items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-stone md:flex-row md:pt-10">
            <p>
              © {new Date().getFullYear()} {site.name}. {tCommon("allRights")}
            </p>
            <nav
              aria-label={tCommon("legalNav")}
              className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-white/15 bg-petrol/60 px-4 py-2 backdrop-blur-sm"
            >
              <Link
                href="/mentions-legales"
                className="hover:text-gold transition-colors cursor-pointer"
              >
                {t("legalNotice")}
              </Link>
              <span className="text-white/20" aria-hidden>
                ·
              </span>
              <Link
                href="/confidentialite"
                className="hover:text-gold transition-colors cursor-pointer"
              >
                {t("privacy")}
              </Link>
              <span className="text-white/20" aria-hidden>
                ·
              </span>
              <Link href="/cookies" className="hover:text-gold transition-colors cursor-pointer">
                {t("cookies")}
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </>
  );
}
