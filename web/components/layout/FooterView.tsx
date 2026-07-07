"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Mail, MapPin, Phone } from "@/lib/icons";
import { usePathname } from "@/i18n/navigation";
import {
  footerPatternStyle,
  footerThemeVars,
  getSubsidiaryNavbarTheme,
} from "@/lib/navbar-theme";
import type { SiteConfig } from "@/lib/types";

import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import {
  defaultScrollViewport,
  fadeScaleTransition,
  fadeScaleVariants,
  fadeUpTransition,
  fadeUpVariants,
  footerStaggerContainerVariants,
  ornamentLineTransition,
  ornamentLineVariants,
} from "@/lib/motion";

import { NAV_PATHS } from "./nav-links";

import "@/styles/subsidiary-footer.css";

type FooterLabels = {
  contact: string;
  networks: string;
  events: string;
  quickContact: string;
  quickAccess: string;
  legalNotice: string;
  privacy: string;
  cookies: string;
  allRights: string;
  legalNav: string;
  nav: Record<string, string>;
};

function SocialRow({
  href,
  label,
  themed,
}: {
  href?: string;
  label: string;
  themed: boolean;
}) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`subsidiary-footer__social group flex items-center justify-between gap-4 py-2 text-sm transition-colors cursor-pointer ${
        themed
          ? "subsidiary-footer__link"
          : "text-ivory/90 hover:text-gold"
      }`}
    >
      <span>{label}</span>
      <ArrowUpRight
        className={`subsidiary-footer__social-icon h-4 w-4 shrink-0 ${
          themed ? "" : "text-gold/70 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        }`}
        aria-hidden
      />
    </a>
  );
}

export function FooterView({
  site,
  labels,
}: {
  site: SiteConfig;
  labels: FooterLabels;
}) {
  const pathname = usePathname();
  const subsidiaryTheme = getSubsidiaryNavbarTheme(pathname);
  const isThemed = subsidiaryTheme !== null;

  const reduced = useReducedMotion();
  const quickCol1 = NAV_PATHS.slice(0, 3);
  const quickCol2 = NAV_PATHS.slice(3);

  const defaultPattern = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 L35 25 L55 30 L35 35 L30 55 L25 35 L5 30 L25 25 Z' fill='none' stroke='%23D4AD65' stroke-width='0.35' opacity='0.5'/%3E%3C/svg%3E")`;

  return (
    <footer
      data-subsidiary-footer={isThemed ? "" : undefined}
      className={
        isThemed
          ? "subsidiary-footer relative"
          : "relative bg-anthracite text-ivory"
      }
      style={isThemed ? footerThemeVars(subsidiaryTheme) : undefined}
    >
      <div
        aria-hidden
        className={`subsidiary-footer__pattern pointer-events-none absolute inset-0 ${
          isThemed ? "" : "opacity-[0.12]"
        }`}
        style={{
          backgroundImage: isThemed
            ? footerPatternStyle(subsidiaryTheme.accent)
            : defaultPattern,
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 pb-12 pt-6 md:px-10 md:pb-16 md:pt-8">
        <motion.div
          className="subsidiary-footer__brand mb-12 text-center md:mb-14"
          initial={reduced ? false : "hidden"}
          whileInView={reduced ? undefined : "visible"}
          viewport={defaultScrollViewport}
          variants={reduced ? undefined : footerStaggerContainerVariants}
        >
          <div className="subsidiary-footer__crest relative flex w-full items-center">
            <motion.span
              className={`subsidiary-footer__rule subsidiary-footer__rule--left h-px min-h-px flex-1 ${
                isThemed ? "" : "subsidiary-footer__rule--default"
              }`}
              aria-hidden
              style={{ transformOrigin: "right center" }}
              variants={reduced ? undefined : ornamentLineVariants}
              transition={ornamentLineTransition}
            />
            <motion.div
              className={`subsidiary-footer__logo-badge relative z-[2] mx-6 flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border p-2 shadow-lg md:mx-8 md:h-24 md:w-24 md:p-2.5 ${
                isThemed ? "" : "border-gold/40 bg-anthracite shadow-black/40"
              }`}
              variants={reduced ? undefined : fadeScaleVariants}
              transition={fadeScaleTransition}
            >
              <Logo variant="footer" />
            </motion.div>
            <motion.span
              className={`subsidiary-footer__rule subsidiary-footer__rule--right h-px min-h-px flex-1 ${
                isThemed ? "" : "subsidiary-footer__rule--default"
              }`}
              aria-hidden
              style={{ transformOrigin: "left center" }}
              variants={reduced ? undefined : ornamentLineVariants}
              transition={ornamentLineTransition}
            />
          </div>
          <motion.p
            className={`mt-6 font-[family-name:var(--font-dm-sans)] text-2xl font-bold tracking-wide md:mt-7 md:text-3xl ${
              isThemed ? "subsidiary-footer__brand-title" : ""
            }`}
            variants={reduced ? undefined : fadeUpVariants}
            transition={fadeUpTransition}
          >
            {site.name}
          </motion.p>
          <motion.p
            className={`mx-auto mt-2 max-w-md text-sm italic ${
              isThemed ? "subsidiary-footer__brand-tagline" : "text-taupe"
            }`}
            variants={reduced ? undefined : fadeUpVariants}
            transition={fadeUpTransition}
          >
            {site.tagline}
          </motion.p>
        </motion.div>

        <motion.div
          className={`grid grid-cols-1 gap-12 border-t pt-12 md:grid-cols-12 md:gap-10 md:pt-14 ${
            isThemed ? "subsidiary-footer__divider" : "border-white/10"
          }`}
          initial={reduced ? false : "hidden"}
          whileInView={reduced ? undefined : "visible"}
          viewport={defaultScrollViewport}
          variants={reduced ? undefined : footerStaggerContainerVariants}
        >
          <motion.div
            className="md:col-span-4"
            variants={reduced ? undefined : fadeUpVariants}
            transition={fadeUpTransition}
          >
            <p
              className={`mb-5 text-xs tracking-[0.25em] uppercase ${
                isThemed ? "subsidiary-footer__heading" : "text-gold"
              }`}
            >
              {labels.contact}
            </p>
            <ul
              className={`space-y-4 text-sm ${
                isThemed ? "subsidiary-footer__body" : "text-taupe"
              }`}
            >
              <li className="flex gap-3">
                <MapPin
                  className={`mt-0.5 h-4 w-4 shrink-0 ${
                    isThemed ? "subsidiary-footer__icon" : "text-gold"
                  }`}
                  aria-hidden
                />
                {site.contact.address}
              </li>
              <li className="flex items-center gap-3">
                <Phone
                  className={`h-4 w-4 shrink-0 ${
                    isThemed ? "subsidiary-footer__icon" : "text-gold"
                  }`}
                  aria-hidden
                />
                <a
                  href={`tel:${site.contact.phone.replace(/\s/g, "")}`}
                  className={`transition-colors cursor-pointer ${
                    isThemed
                      ? "subsidiary-footer__link"
                      : "hover:text-gold"
                  }`}
                >
                  {site.contact.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail
                  className={`h-4 w-4 shrink-0 ${
                    isThemed ? "subsidiary-footer__icon" : "text-gold"
                  }`}
                  aria-hidden
                />
                <a
                  href={`mailto:${site.contact.email}`}
                  className={`transition-colors cursor-pointer ${
                    isThemed
                      ? "subsidiary-footer__link"
                      : "hover:text-gold"
                  }`}
                >
                  {site.contact.email}
                </a>
              </li>
            </ul>

            <div
              className={`mt-8 max-w-xs border-t pt-6 ${
                isThemed ? "subsidiary-footer__divider" : "border-white/10"
              }`}
            >
              <p
                className={`mb-3 text-xs tracking-[0.2em] uppercase ${
                  isThemed ? "subsidiary-footer__heading" : "text-gold"
                }`}
              >
                {labels.networks}
              </p>
              <div className="flex flex-col gap-1">
                <SocialRow
                  href={site.social.instagram}
                  label="Instagram"
                  themed={isThemed}
                />
                <SocialRow
                  href={site.social.facebook}
                  label="Facebook"
                  themed={isThemed}
                />
                <SocialRow
                  href={site.social.linkedin}
                  label="LinkedIn"
                  themed={isThemed}
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="flex flex-col items-start justify-start gap-3 md:col-span-4 md:items-center md:pt-2"
            variants={reduced ? undefined : fadeUpVariants}
            transition={fadeUpTransition}
          >
            <Button href="/evenements">
              {labels.events}
              <ArrowUpRight className="h-4 w-4" weight="light" aria-hidden />
            </Button>
            <Button href="/contact" variant="secondary">
              {labels.quickContact}
              <ArrowUpRight className="h-4 w-4" weight="light" aria-hidden />
            </Button>
          </motion.div>

          <motion.div
            className="md:col-span-4"
            variants={reduced ? undefined : fadeUpVariants}
            transition={fadeUpTransition}
          >
            <p
              className={`mb-5 text-xs tracking-[0.25em] uppercase ${
                isThemed ? "subsidiary-footer__heading" : "text-gold"
              }`}
            >
              {labels.quickAccess}
            </p>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
              <ul className="space-y-2">
                {quickCol1.map(({ href, key }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className={`cursor-pointer transition-colors ${
                        isThemed
                          ? "subsidiary-footer__link"
                          : "text-ivory/75 hover:text-gold"
                      }`}
                    >
                      {labels.nav[key]}
                    </Link>
                  </li>
                ))}
              </ul>
              <ul className="space-y-2">
                {quickCol2.map(({ href, key }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className={`cursor-pointer transition-colors ${
                        isThemed
                          ? "subsidiary-footer__link"
                          : "text-ivory/75 hover:text-gold"
                      }`}
                    >
                      {labels.nav[key]}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </motion.div>

        <div
          className={`mt-14 flex flex-col-reverse items-center justify-between gap-4 border-t pt-8 text-xs md:flex-row md:pt-10 ${
            isThemed
              ? "subsidiary-footer__divider subsidiary-footer__legal-muted"
              : "border-white/10 text-stone"
          }`}
        >
          <p>
            © {new Date().getFullYear()} {site.name}. {labels.allRights}
          </p>
          <nav
            aria-label={labels.legalNav}
            className={`inline-flex flex-wrap items-center justify-center gap-2 rounded-full border px-4 py-2 backdrop-blur-sm ${
              isThemed
                ? "subsidiary-footer__legal-pill"
                : "border-white/15 bg-petrol/60"
            }`}
          >
            <Link
              href="/mentions-legales"
              className={`cursor-pointer transition-colors ${
                isThemed
                  ? "subsidiary-footer__link"
                  : "hover:text-gold"
              }`}
            >
              {labels.legalNotice}
            </Link>
            <span
              className={isThemed ? "subsidiary-footer__legal-sep" : "text-white/20"}
              aria-hidden
            >
              ·
            </span>
            <Link
              href="/confidentialite"
              className={`cursor-pointer transition-colors ${
                isThemed
                  ? "subsidiary-footer__link"
                  : "hover:text-gold"
              }`}
            >
              {labels.privacy}
            </Link>
            <span
              className={isThemed ? "subsidiary-footer__legal-sep" : "text-white/20"}
              aria-hidden
            >
              ·
            </span>
            <Link
              href="/cookies"
              className={`cursor-pointer transition-colors ${
                isThemed
                  ? "subsidiary-footer__link"
                  : "hover:text-gold"
              }`}
            >
              {labels.cookies}
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
