"use client";

import { motion, type Variants } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef } from "react";

import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { NAV_PATHS } from "@/components/layout/nav-links";
import { RollingText } from "@/components/motion/RollingText";
import { Link, usePathname } from "@/i18n/navigation";
import { EASE } from "@/lib/motion";

export type CapsuleMenuProps = {
  contact: { email: string; phone: string };
  social: Partial<Record<SocialKey, string>>;
  subsidiariesCount: number;
};

type SocialKey = "instagram" | "facebook" | "linkedin";

const SOCIAL_LABELS: Record<SocialKey, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  linkedin: "LinkedIn",
};

/** Carte : monte depuis la capsule (Orbix : 400 ms), sortie plus rapide. */
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 12, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: EASE.luxury, staggerChildren: 0.04, delayChildren: 0.06 },
  },
  exit: { opacity: 0, y: 8, scale: 0.98, transition: { duration: 0.22, ease: EASE.outSoft } },
};

/** Contenu : opacité 0 / y 10 px → en place, en cascade. */
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE.luxury } },
};

const MUTED_LABEL = "text-xs font-medium uppercase tracking-[0.14em] text-petrol/60";
const SMALL_LINK =
  "inline-flex min-h-8 items-center rounded-sm text-petrol-panel-4 hover:text-petrol focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-petrol";

/**
 * Carte du menu de la capsule : liens du site, contact, réseaux, langue.
 * Fenêtre modale (`role="dialog"`) : le focus va au premier lien à
 * l'ouverture ; Échap, le voile et les liens la referment (BottomCapsuleNav).
 */
export function CapsuleMenu({
  id,
  contact,
  social,
  subsidiariesCount,
  onNavigate,
}: CapsuleMenuProps & { id: string; onNavigate: () => void }) {
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const tFooter = useTranslations("footer");
  const tCta = useTranslations("cta");
  const locale = useLocale();
  const pathname = usePathname();
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const titleId = `${id}-title`;

  useEffect(() => {
    firstLinkRef.current?.focus({ preventScroll: true });
  }, []);

  const links = NAV_PATHS.filter(({ key }) => key !== "contact");
  const socialKeys = (Object.keys(SOCIAL_LABELS) as SocialKey[]).filter((key) => social[key]);
  const count = new Intl.NumberFormat(locale).format(subsidiariesCount);

  return (
    <motion.div
      id={id}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      style={{ transformOrigin: "50% 100%" }}
      className="absolute inset-x-0 bottom-[-8px] max-h-[calc(100svh-var(--capsule-offset)-24px)] overflow-y-auto overscroll-contain rounded-card-lg border border-petrol/10 bg-neutral px-5 pt-5 pb-[84px] text-petrol-panel-4 shadow-[var(--shadow-deep)] max-md:pb-[92px]"
    >
      <motion.p variants={itemVariants} id={titleId} className={MUTED_LABEL}>
        {t("menu")}
      </motion.p>

      <nav aria-label={tCommon("mainNav")} className="mt-3">
        <ul className="flex flex-col">
          {links.map(({ href, key }, index) => {
            const active = pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
            return (
              <motion.li key={href} variants={itemVariants}>
                <Link
                  ref={index === 0 ? firstLinkRef : undefined}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  onClick={onNavigate}
                  className="title-section flex min-h-11 items-center gap-3 rounded-sm text-[1.375rem] leading-tight text-petrol-panel-4 hover:text-petrol focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-petrol"
                >
                  <span
                    aria-hidden="true"
                    className={`h-1.5 w-1.5 shrink-0 rounded-full ${active ? "bg-rose-deep" : "bg-transparent"}`}
                  />
                  <RollingText text={t(key)} />
                  {key === "subsidiaries" && (
                    <sup aria-hidden="true" className="text-xs font-medium tracking-normal text-petrol/60">
                      ({count})
                    </sup>
                  )}
                </Link>
              </motion.li>
            );
          })}
        </ul>
      </nav>

      <motion.div variants={itemVariants} className="mt-5">
        <Link
          href="/contact"
          onClick={onNavigate}
          className="btn-primary inline-flex min-h-11 items-center rounded-full px-6 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-petrol"
        >
          {tCta("contact")}
        </Link>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="mt-6 grid grid-cols-2 gap-5 border-t border-petrol/15 pt-5 text-sm"
      >
        {socialKeys.length > 0 && (
          <div>
            <p className={MUTED_LABEL}>{tFooter("networks")}</p>
            <ul className="mt-2 flex flex-col">
              {socialKeys.map((key) => (
                <li key={key}>
                  <a href={social[key]} target="_blank" rel="noopener noreferrer" className={SMALL_LINK}>
                    <RollingText text={SOCIAL_LABELS[key]} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="min-w-0">
          <p className={MUTED_LABEL}>{tFooter("quickContact")}</p>
          <ul className="mt-2 flex flex-col">
            <li>
              <a href={`mailto:${contact.email}`} className={`${SMALL_LINK} break-all`}>
                {contact.email}
              </a>
            </li>
            <li>
              <a href={`tel:${contact.phone.replace(/\s+/g, "")}`} className={`${SMALL_LINK} whitespace-nowrap`}>
                {contact.phone}
              </a>
            </li>
          </ul>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="mt-5">
        <LanguageSwitcher />
      </motion.div>
    </motion.div>
  );
}
