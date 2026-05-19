"use client";

import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { Logo } from "@/components/brand/Logo";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { Link, usePathname } from "@/i18n/navigation";

import { NAV_PATHS } from "./nav-links";

const SCROLL_THRESHOLD = 24;

export function Header() {
  const pathname = usePathname();
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

  const dense = scrolled || open;

  return (
    <header
      className={`fixed left-3 right-3 z-50 transition-[top] duration-300 ease-out md:left-4 md:right-4 ${
        dense ? "top-2 md:top-3" : "top-4"
      }`}
    >
      <div
        className={`relative mx-auto flex max-w-7xl flex-col overflow-hidden rounded-2xl border transition-all duration-300 ease-out ${
          dense
            ? "border-white/12 bg-petrol/85 shadow-[0_18px_40px_-18px_rgba(0,0,0,0.55),0_8px_18px_-10px_rgba(212,173,101,0.18)] backdrop-blur-xl backdrop-saturate-150"
            : "border-white/10 bg-petrol/45 shadow-lg shadow-black/30 backdrop-blur-md backdrop-saturate-125"
        }`}
      >
        <span
          aria-hidden
          className={`pointer-events-none absolute inset-x-0 top-0 h-px transition-opacity duration-300 ${
            dense ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(212,173,101,0.55) 50%, transparent 100%)",
          }}
        />

        <div
          className={`flex items-center justify-between gap-3 px-5 transition-[height,padding] duration-300 ease-out md:px-8 ${
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
                  className={`relative inline-flex items-center text-[13px] font-medium tracking-wide transition-colors duration-300 ease-out cursor-pointer focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-4 focus-visible:rounded-sm after:pointer-events-none after:absolute after:inset-x-0 after:-bottom-1.5 after:h-px after:origin-center after:bg-gold after:transition-transform after:duration-300 ${
                    active
                      ? "text-gold after:scale-x-100"
                      : `${dense ? "text-ivory/90" : "text-ivory/85"} hover:text-gold after:scale-x-0 hover:after:scale-x-100`
                  }`}
                >
                  {t(key)}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSwitcher className="hidden sm:inline-flex" />
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-xl text-ivory transition-colors duration-200 hover:bg-white/5 hover:text-gold focus-visible:outline-2 focus-visible:outline-gold cursor-pointer lg:hidden"
              aria-expanded={open}
              aria-label={open ? tCommon("closeMenu") : tCommon("openMenu")}
              onClick={() => setOpen(!open)}
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {open && (
          <nav
            className="flex flex-col gap-1 border-t border-white/10 px-3 py-3 lg:hidden"
            aria-label={tCommon("mobileNav")}
          >
            <LanguageSwitcher className="mb-2 w-full justify-center sm:hidden" />
            {NAV_PATHS.map(({ href, key }) => {
              const active =
                pathname === href ||
                (href !== "/" && pathname?.startsWith(`${href}/`));
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-[44px] items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors duration-200 cursor-pointer ${
                    active
                      ? "bg-gold/10 text-gold"
                      : "text-ivory/85 hover:bg-white/5 hover:text-gold"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  <span
                    aria-hidden
                    className={`h-1.5 w-1.5 rounded-full transition-all duration-200 ${
                      active ? "bg-gold" : "bg-transparent"
                    }`}
                  />
                  {t(key)}
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </header>
  );
}
