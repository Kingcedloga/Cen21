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
    <section className="relative bg-ivory px-4 py-16 text-petrol md:px-6 md:py-20 lg:px-8">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 md:grid-cols-4 md:gap-12">
        {items.map((item) => {
          const Icon = ICONS[item.icon];
          return (
            <div key={item.label} className="text-center">
              <Icon
                className="mx-auto mb-3 h-7 w-7 text-petrol"
                strokeWidth={1.25}
                aria-hidden
              />
              <p className="font-[family-name:var(--font-dm-sans)] text-3xl font-bold text-petrol md:text-4xl">
                {item.value}
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-petrol">
                {item.label}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
