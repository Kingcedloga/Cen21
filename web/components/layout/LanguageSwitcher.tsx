"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";

import { usePathname, useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

const LOCALE_ORDER: Locale[] = ["en", "fr"];

export function LanguageSwitcher({ className = "" }: { className?: string }) {
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

  return (
    <div
      className={`inline-flex items-center rounded-full border border-white/15 bg-petrol/50 p-0.5 backdrop-blur-sm ${className}`}
      role="group"
      aria-label={t("label")}
    >
      {LOCALE_ORDER.map((code) => {
        const active = code === locale;
        const label = code === "en" ? t("en") : t("fr");
        return (
          <button
            key={code}
            type="button"
            onClick={() => switchLocale(code)}
            disabled={pending}
            aria-pressed={active}
            aria-label={t("switchTo", { language: label })}
            className={`min-h-[36px] min-w-[40px] rounded-full px-3 text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-2 disabled:opacity-60 ${
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
