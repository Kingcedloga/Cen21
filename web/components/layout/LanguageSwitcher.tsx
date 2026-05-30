"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";

import { usePathname, useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { SubsidiaryNavbarTheme } from "@/lib/navbar-theme";

const LOCALE_ORDER: Locale[] = ["en", "fr"];

const BTN_BASE =
  "min-h-[36px] min-w-[40px] rounded-full px-3 text-xs font-semibold uppercase tracking-wider transition-all duration-fine cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60";

export function LanguageSwitcher({
  className = "",
  navbarTheme = null,
}: {
  className?: string;
  navbarTheme?: SubsidiaryNavbarTheme | null;
}) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("language");
  const [pending, startTransition] = useTransition();

  const switchLocale = (next: Locale) => {
    if (next === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  };

  const isBrand = navbarTheme !== null;

  return (
    <div
      className={`inline-flex items-center rounded-full border p-0.5 ${
        isBrand
          ? "border-[color:var(--nav-fg)]/20 bg-black/15 backdrop-blur-sm"
          : "border-white/15 bg-petrol/50 backdrop-blur-sm"
      } ${className}`}
      role="group"
      aria-label={t("label")}
    >
      {LOCALE_ORDER.map((code) => {
        const active = code === locale;
        const label = code === "en" ? t("en") : t("fr");

        if (isBrand) {
          return (
            <button
              key={code}
              type="button"
              onClick={() => switchLocale(code)}
              disabled={pending}
              aria-pressed={active}
              aria-label={t("switchTo", { language: label })}
              className={`${BTN_BASE} focus-visible:outline-[color:var(--nav-accent)] ${
                active
                  ? ""
                  : "hover:text-[color:var(--nav-accent)]"
              }`}
              style={
                active
                  ? {
                      backgroundColor: navbarTheme.accent,
                      color: navbarTheme.background,
                    }
                  : { color: `${navbarTheme.foreground}b3` }
              }
            >
              {code}
            </button>
          );
        }

        return (
          <button
            key={code}
            type="button"
            onClick={() => switchLocale(code)}
            disabled={pending}
            aria-pressed={active}
            aria-label={t("switchTo", { language: label })}
            className={`${BTN_BASE} focus-visible:outline-gold ${
              active
                ? "bg-gold text-petrol shadow-sm"
                : "text-ivory/75 hover:text-gold"
            }`}
          >
            {code}
          </button>
        );
      })}
    </div>
  );
}
