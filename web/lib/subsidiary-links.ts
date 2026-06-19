import type { Subsidiary } from "@/lib/types";

export type SubsidiaryLinkTarget = Pick<Subsidiary, "slug" | "externalUrl">;

export function getSubsidiaryHref(subsidiary: SubsidiaryLinkTarget): string {
  return subsidiary.externalUrl ?? `/filiales/${subsidiary.slug}`;
}

export function isSubsidiaryExternalLink(subsidiary: SubsidiaryLinkTarget): boolean {
  return Boolean(subsidiary.externalUrl);
}

export function prefetchSubsidiaryRoute(
  router: { prefetch: (href: string) => void },
  subsidiary: SubsidiaryLinkTarget,
) {
  if (isSubsidiaryExternalLink(subsidiary)) return;
  try {
    router.prefetch(getSubsidiaryHref(subsidiary));
  } catch {
    // best effort
  }
}
