"use client";

import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/Button";
import { AnimateIn } from "@/components/ui/AnimateIn";

export function CtaBand() {
  const t = useTranslations("cta");

  return (
    <section className="relative bg-petrol px-4 py-24 md:px-6 md:py-28 lg:px-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 mx-auto h-[520px] max-w-4xl -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgba(212,173,101,0.2)_0%,rgba(212,173,101,0.05)_42%,transparent_68%)]"
      />

      <AnimateIn>
        <div className="relative mx-auto max-w-4xl">
          <div className="luxury-grain cta-card relative overflow-hidden rounded-[2rem] border border-white/[0.08] px-8 py-14 text-center md:px-14 md:py-20 lg:px-16 lg:py-20">
            <div className="relative z-10 flex flex-col items-center">
              <span className="inline-flex items-center rounded-full border border-gold/45 px-5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.32em] text-gold">
                {t("eyebrow")}
              </span>

              <h2 className="mt-7 max-w-2xl font-[family-name:var(--font-dm-sans)] text-[2rem] font-bold leading-[1.12] tracking-[-0.02em] text-gradient-gold-vertical sm:text-[2.35rem] md:mt-8 md:text-[2.75rem] lg:text-[3.25rem]">
                {t("title")} {t("titleAccent")}
              </h2>

              <span aria-hidden className="my-7 cta-card-divider md:my-8" />

              <p className="max-w-md text-[15px] leading-[1.75] text-ivory/75 md:text-base">
                {t("description")}
              </p>

              <div className="mt-9 flex flex-wrap items-center justify-center gap-3 md:mt-10 md:gap-4">
                <Button href="/filiales">
                  {t("subsidiaries")}
                  <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                </Button>
                <Button href="/contact" variant="secondary">
                  {t("contact")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </AnimateIn>
    </section>
  );
}
