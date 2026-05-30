"use client";

import { Menu, X } from "@/lib/icons";
import {
  getSubsidiaryNavbarTheme,
  navbarThemeVars,
  type SubsidiaryNavbarTheme,
} from "@/lib/navbar-theme";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useState, type CSSProperties } from "react";

import { Logo } from "@/components/brand/Logo";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { Link, usePathname } from "@/i18n/navigation";
import { mobileNavItemVariants, mobileNavPanelVariants } from "@/lib/motion";

import { NAV_PATHS } from "./nav-links";

const SCROLL_THRESHOLD = 24;

export function Header() {
  const pathname = usePathname();
  const subsidiaryTheme = getSubsidiaryNavbarTheme(pathname);
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > SCROLL_THRESHOLD);
    };
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const dense = scrolled || open;
  const isBrand = subsidiaryTheme !== null;

  return (
    <header
      className={`fixed left-3 right-3 z-50 transition-[top] duration-base ease-out md:left-4 md:right-4 ${
        dense ? "top-2 md:top-3" : "top-4"
      }`}
    >
      <div
        className={`relative mx-auto flex max-w-7xl flex-col overflow-hidden rounded-2xl border transition-all duration-base ease-out ${
          isBrand
            ? dense
              ? "shadow-[0_18px_40px_-18px_rgba(0,0,0,0.5)]"
              : "shadow-lg shadow-black/25"
            : dense
              ? "border-white/12 bg-petrol/85 shadow-[0_18px_40px_-18px_rgba(0,0,0,0.55),0_8px_18px_-10px_rgba(212,173,101,0.18)] backdrop-blur-xl backdrop-saturate-150"
              : "border-white/10 bg-petrol/45 shadow-lg shadow-black/30 backdrop-blur-md backdrop-saturate-125"
        }`}
        style={
          isBrand
            ? {
                ...navbarThemeVars(subsidiaryTheme),
                backgroundColor: subsidiaryTheme.background,
                borderColor: `${subsidiaryTheme.foreground}22`,
              }
            : undefined
        }
      >
        <span
          aria-hidden
          className={`pointer-events-none absolute inset-x-0 top-0 h-px transition-opacity duration-base ${
            dense ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background: isBrand
              ? `linear-gradient(90deg, transparent 0%, ${subsidiaryTheme.accent}99 50%, transparent 100%)`
              : "linear-gradient(90deg, transparent 0%, rgba(212,173,101,0.55) 50%, transparent 100%)",
          }}
        />

        <div
          className={`flex items-center justify-between gap-3 px-5 transition-[height,padding] duration-base ease-out md:px-8 ${
            dense
              ? "h-[3.85rem] md:h-[4.25rem]"
              : "h-[4.25rem] md:h-[4.75rem]"
          }`}
        >
          <Logo size="xl" variant="header" />

          <nav
            className="hidden lg:flex items-center gap-7 xl:gap-9"
            aria-label={tCommon("mainNav")}
          >
            {NAV_PATHS.map(({ href, key }) => {
              const active =
                pathname === href ||
                (href !== "/" && pathname?.startsWith(`${href}/`));
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={desktopNavLinkClass(active, dense, isBrand)}
                >
                  {t(key)}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSwitcher
              className="hidden sm:inline-flex"
              navbarTheme={subsidiaryTheme}
            />
            <button
              type="button"
              className={menuButtonClass(isBrand)}
              aria-expanded={open}
              aria-label={open ? tCommon("closeMenu") : tCommon("openMenu")}
              onClick={() => setOpen(!open)}
            >
              {open ? (
                <X className="h-6 w-6" style={isBrand ? iconStyle(subsidiaryTheme) : undefined} />
              ) : (
                <Menu className="h-6 w-6" style={isBrand ? iconStyle(subsidiaryTheme) : undefined} />
              )}
            </button>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {open && (
            <motion.nav
              key="mobile-nav"
              className={`flex flex-col gap-1 border-t px-3 py-3 lg:hidden ${
                isBrand ? "border-[color:var(--nav-fg)]/15" : "border-white/10"
              }`}
              aria-label={tCommon("mobileNav")}
              initial={reduced ? false : "hidden"}
              animate={reduced ? undefined : "visible"}
              exit={reduced ? undefined : "exit"}
              variants={reduced ? undefined : mobileNavPanelVariants}
            >
              <motion.div variants={reduced ? undefined : mobileNavItemVariants}>
                <LanguageSwitcher
                  className="mb-2 w-full justify-center sm:hidden"
                  navbarTheme={subsidiaryTheme}
                />
              </motion.div>
              {NAV_PATHS.map(({ href, key }) => {
                const active =
                  pathname === href ||
                  (href !== "/" && pathname?.startsWith(`${href}/`));
                return (
                  <motion.div
                    key={href}
                    variants={reduced ? undefined : mobileNavItemVariants}
                  >
                    <Link
                      href={href}
                      aria-current={active ? "page" : undefined}
                      className={mobileNavLinkClass(active, isBrand)}
                      style={isBrand ? mobileNavLinkStyle(active, subsidiaryTheme) : undefined}
                      onClick={() => setOpen(false)}
                    >
                    <span
                      aria-hidden
                      className={`h-1.5 w-1.5 rounded-full transition-all duration-fine ${
                        isBrand ? "" : active ? "bg-gold" : "bg-transparent"
                      }`}
                      style={
                        isBrand
                          ? {
                              backgroundColor: active
                                ? subsidiaryTheme.accent
                                : "transparent",
                            }
                          : undefined
                      }
                    />
                    {t(key)}
                    </Link>
                  </motion.div>
                );
              })}
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

function desktopNavLinkClass(
  active: boolean,
  dense: boolean,
  isBrand: boolean,
): string {
  const base =
    "relative inline-flex items-center text-[13px] font-medium tracking-wide transition-colors duration-base ease-out cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:rounded-sm after:pointer-events-none after:absolute after:inset-x-0 after:-bottom-1.5 after:h-px after:origin-center after:transition-transform after:duration-base";

  if (isBrand) {
    return `${base} focus-visible:outline-[color:var(--nav-accent)] after:bg-[color:var(--nav-accent)] ${
      active
        ? "text-[color:var(--nav-accent)] after:scale-x-100"
        : "text-[color:var(--nav-fg)]/85 hover:text-[color:var(--nav-accent)] after:scale-x-0 hover:after:scale-x-100"
    }`;
  }

  return `${base} focus-visible:outline-gold after:bg-gold ${
    active
      ? "text-gold after:scale-x-100"
      : `${dense ? "text-ivory/90" : "text-ivory/85"} hover:text-gold after:scale-x-0 hover:after:scale-x-100`
  }`;
}

function mobileNavLinkClass(active: boolean, isBrand: boolean): string {
  const base =
    "flex min-h-[44px] items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors duration-fine cursor-pointer";

  if (isBrand) {
    return `${base} hover:bg-white/8`;
  }

  return `${base} ${
    active
      ? "bg-gold/10 text-gold"
      : "text-ivory/85 hover:bg-white/5 hover:text-gold"
  }`;
}

function mobileNavLinkStyle(
  active: boolean,
  theme: SubsidiaryNavbarTheme,
): CSSProperties {
  return active
    ? {
        color: theme.accent,
        backgroundColor: `${theme.accent}18`,
      }
    : {
        color: `${theme.foreground}d9`,
      };
}

function menuButtonClass(isBrand: boolean): string {
  const base =
    "flex h-11 w-11 items-center justify-center rounded-xl transition-colors duration-fine cursor-pointer lg:hidden focus-visible:outline-2 focus-visible:outline-offset-2";

  if (isBrand) {
    return `${base} text-[color:var(--nav-fg)] hover:bg-white/10 hover:text-[color:var(--nav-accent)] focus-visible:outline-[color:var(--nav-accent)]`;
  }

  return `${base} text-ivory hover:bg-white/5 hover:text-gold focus-visible:outline-gold`;
}

function iconStyle(theme: SubsidiaryNavbarTheme): CSSProperties {
  return { color: theme.foreground };
}
