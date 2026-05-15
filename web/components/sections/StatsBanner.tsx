import { Award, Globe2, TrendingUp, UsersRound } from "lucide-react";

import { AnimateIn } from "@/components/ui/AnimateIn";
import { getStatsContent } from "@/lib/content";

const ICONS = {
  award: Award,
  users: UsersRound,
  globe: Globe2,
  trending: TrendingUp,
} as const;

export function StatsBanner() {
  const { items } = getStatsContent();

  return (
    <section className="relative overflow-hidden bg-anthracite py-16 md:py-20">
      <div
        className="pointer-events-none absolute inset-0 opacity-90"
        aria-hidden
      >
        <div className="absolute -right-[20%] top-1/2 h-[min(120%,52rem)] w-[min(90vw,52rem)] -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(197,160,89,0.22)_0%,rgba(197,160,89,0.06)_42%,transparent_70%)]" />
      </div>

      <div className="relative mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 md:grid-cols-4 md:gap-6 md:px-10">
        {items.map((item, i) => {
          const Icon = ICONS[item.icon];
          return (
            <AnimateIn key={`${item.label}-${i}`} delay={i * 0.06}>
              <div className="flex h-full flex-col items-center rounded-2xl border border-white/10 bg-[#1e1e1e]/90 px-4 py-8 text-center shadow-lg shadow-black/35 backdrop-blur-sm md:px-6 md:py-10 transition-shadow duration-300 hover:border-white/14">
                {Icon && (
                  <Icon
                    className="mb-4 h-8 w-8 text-gold md:h-9 md:w-9"
                    strokeWidth={1.35}
                    aria-hidden
                  />
                )}
                <p className="font-[family-name:var(--font-inter)] text-3xl font-semibold tracking-tight text-ivory md:text-4xl lg:text-[2.75rem]">
                  {item.value}
                </p>
                <p className="mt-2 max-w-[12rem] text-xs leading-snug text-stone md:text-sm md:leading-relaxed">
                  {item.label}
                </p>
              </div>
            </AnimateIn>
          );
        })}
      </div>
    </section>
  );
}
