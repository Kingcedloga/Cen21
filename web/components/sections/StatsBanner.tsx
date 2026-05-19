import { Award, Globe, TrendingUp, Users } from "lucide-react";

import { getStatsContent } from "@/lib/content";
import { getContentLocale } from "@/lib/locale-server";

const ICONS = {
  award: Award,
  users: Users,
  globe: Globe,
  trending: TrendingUp,
} as const;

export async function StatsBanner() {
  const locale = await getContentLocale();
  const { items } = getStatsContent(locale);

  return (
    <section className="relative bg-anthracite px-4 py-16 md:px-6 md:py-20 lg:px-8">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 md:grid-cols-4 md:gap-12">
        {items.map((item) => {
          const Icon = ICONS[item.icon];
          return (
            <div key={item.label} className="text-center">
              <Icon
                className="mx-auto mb-3 h-7 w-7 text-gold"
                strokeWidth={1.25}
                aria-hidden
              />
              <p className="font-[family-name:var(--font-cormorant)] text-3xl text-ivory md:text-4xl">
                {item.value}
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-taupe">
                {item.label}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
