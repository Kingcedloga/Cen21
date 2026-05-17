import { ArrowUpRight, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { AnimateIn } from "@/components/ui/AnimateIn";

export function CtaBand() {
  return (
    <section className="relative px-4 py-24 md:px-6 md:py-28 lg:px-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 mx-auto h-[480px] max-w-5xl -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgba(197,160,89,0.18)_0%,rgba(197,160,89,0.04)_45%,transparent_70%)]"
      />

      <AnimateIn>
        <div className="relative mx-auto max-w-5xl">
          <div className="luxury-grain relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0c272e]/90 px-8 py-14 text-center shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7),0_0_0_1px_rgba(197,160,89,0.16)] md:px-14 md:py-20 lg:px-20">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.55]"
              style={{
                background:
                  "radial-gradient(ellipse at 50% -10%, rgba(197,160,89,0.18) 0%, transparent 55%), radial-gradient(ellipse at 50% 120%, rgba(197,160,89,0.12) 0%, transparent 60%)",
              }}
            />

            <span
              aria-hidden
              className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-gold/[0.06] blur-3xl"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-gold/[0.05] blur-3xl"
            />

            <div className="relative z-10 flex flex-col items-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-gold/35 bg-petrol/60 px-4 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.28em] text-gold backdrop-blur-sm">
                Expériences sur mesure
              </span>

              <h2 className="mt-6 font-[family-name:var(--font-cormorant)] text-[2.25rem] md:text-5xl lg:text-[3.4rem] font-light leading-[1.08] tracking-[-0.02em] text-ivory [text-shadow:0_2px_24px_rgba(0,0,0,0.45)]">
                Prêt à vivre{" "}
                <span className="text-gradient-gold  font-light">
                  l&apos;exception
                </span>{" "}
                ?
              </h2>

              <span aria-hidden className="my-7 divider-gold max-w-[180px]" />

              <p className="max-w-xl text-base md:text-lg leading-[1.7] text-ivory/80">
                Explorez nos adresses, nos événements à venir, ou contactez-nous
                pour une expérience privée à votre image.
              </p>

              <div className="mt-9 flex flex-wrap items-center justify-center gap-3 md:gap-4">
                <Button href="/evenements">
                  Voir les événements
                  <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                </Button>
                <Button href="/contact" variant="secondary">
                  Prendre contact
                </Button>
              </div>
            </div>
          </div>
        </div>
      </AnimateIn>
    </section>
  );
}
