import { StatsBannerView } from "@/components/sections/StatsBannerView";
import { getStatsContent } from "@/lib/content";
import { getContentLocale } from "@/lib/locale-server";

export async function StatsBanner() {
  const locale = await getContentLocale();
  const { items } = getStatsContent(locale);

  return <StatsBannerView items={items} />;
}
