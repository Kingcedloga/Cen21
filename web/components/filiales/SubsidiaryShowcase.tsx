import Image from "next/image";
import Link from "next/link";
import {
  Armchair,
  ArrowUpRight,
  Building2,
  Sparkles,
  UtensilsCrossed,
  Wine,
} from "lucide-react";

import { SECTOR_LABELS } from "@/lib/content";
import type { Sector, Subsidiary } from "@/lib/types";

const SECTOR_ICON: Record<Sector, typeof UtensilsCrossed> = {
  restaurant: UtensilsCrossed,
  bar: Wine,
  lounge: Armchair,
  nightclub: Sparkles,
  evenementiel: Building2,
};

/** Grande carte pleine hauteur — colonne gauche */
export function SubsidiaryShowcaseFeatured({ subsidiary }: { subsidiary: Subsidiary }) {
  const Icon = SECTOR_ICON[subsidiary.sector];

  return (
    <article className="group relative h-full min-h-[min(88vw,26rem)] overflow-hidden rounded-2xl border border-white/10 bg-anthracite shadow-xl shadow-black/30 lg:min-h-[32rem]">
      <div className="absolute inset-0">
        <Image
          src={subsidiary.coverImage}
          alt=""
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-petrol via-petrol/55 to-petrol/15" />
      <div className="relative z-10 flex h-full min-h-[inherit] flex-col justify-end p-6 md:p-8 lg:p-10">
        <div
          className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg shadow-lg"
          style={{ backgroundColor: subsidiary.accentColor }}
        >
          <Icon className="h-5 w-5 text-white" strokeWidth={1.5} aria-hidden />
        </div>
        <p className="mb-1 text-xs font-medium uppercase tracking-[0.12em] text-gold/90">
          {SECTOR_LABELS[subsidiary.sector]}
        </p>
        <h2 className="font-[family-name:var(--font-cormorant)] text-3xl font-light text-ivory md:text-4xl">
          {subsidiary.name}
        </h2>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-ivory/85 md:text-base">
          {subsidiary.tagline}
        </p>
        <Link
          href={`/filiales/${subsidiary.slug}`}
          className="mt-6 inline-flex w-fit items-center gap-2 text-sm font-medium text-ivory transition-colors hover:text-gold cursor-pointer"
        >
          Découvrir
          <span aria-hidden>→</span>
        </Link>
      </div>
    </article>
  );
}

/** Carte compacte — colonne droite */
export function SubsidiaryShowcaseCompact({ subsidiary }: { subsidiary: Subsidiary }) {
  const Icon = SECTOR_ICON[subsidiary.sector];

  return (
    <article className="group relative flex min-h-[8.5rem] overflow-hidden rounded-2xl border border-white/12 bg-ivory/[0.07] shadow-lg shadow-black/25 transition-colors duration-200 hover:border-gold/35 md:min-h-0 md:h-full md:min-h-[8.25rem]">
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-3 p-4 pl-5 md:flex-row md:items-center md:gap-4 md:py-4 md:pl-5 md:pr-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg md:h-11 md:w-11"
          style={{ backgroundColor: subsidiary.accentColor }}
        >
          <Icon className="h-5 w-5 text-white" strokeWidth={1.5} aria-hidden />
        </div>
        <div className="min-w-0 flex-1 pr-12 md:pr-0">
          <h3 className="font-[family-name:var(--font-cormorant)] text-lg font-medium text-ivory md:text-xl">
            {subsidiary.name}
          </h3>
          <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-taupe md:text-sm">
            {subsidiary.tagline}
          </p>
        </div>
        <Link
          href={`/filiales/${subsidiary.slug}`}
          className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-petrol/90 text-ivory shadow-md backdrop-blur-sm transition-all hover:border-gold/60 hover:bg-gold hover:text-petrol md:hidden cursor-pointer"
          aria-label={`Découvrir ${subsidiary.name}`}
        >
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="relative hidden w-[34%] max-w-[11rem] shrink-0 md:block lg:max-w-[13rem]">
        <Image
          src={subsidiary.coverImage}
          alt=""
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="200px"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ivory/[0.12] to-transparent" />
        <Link
          href={`/filiales/${subsidiary.slug}`}
          className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-petrol/85 text-ivory shadow-lg backdrop-blur-sm transition-all hover:border-gold/50 hover:bg-gold hover:text-petrol cursor-pointer"
          aria-label={`Découvrir ${subsidiary.name}`}
        >
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}

/** Bloc 1 grande + jusqu’à 3 compactes, hauteurs équilibrées */
export function SubsidiaryShowcaseBlock({
  hero,
  side,
}: {
  hero: Subsidiary;
  side: Subsidiary[];
}) {
  if (side.length === 0) {
    return (
      <div className="max-w-3xl lg:max-w-none">
        <SubsidiaryShowcaseFeatured subsidiary={hero} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:gap-5 lg:grid-cols-2 lg:items-stretch lg:gap-6">
      <div className="min-h-0 lg:flex lg:flex-col">
        <SubsidiaryShowcaseFeatured subsidiary={hero} />
      </div>
      <div className="flex min-h-0 flex-col gap-4 md:gap-5 lg:flex-1 lg:justify-stretch">
        {side.map((sub) => (
          <div key={sub.slug} className="min-h-0 flex-1">
            <SubsidiaryShowcaseCompact subsidiary={sub} />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Ordre conservé : chaque ligne = 4 entrées (1 hero + 3 à droite) */
export function chunkSubsidiaries(subsidiaries: Subsidiary[]) {
  const blocks: { hero: Subsidiary; side: Subsidiary[] }[] = [];
  for (let i = 0; i < subsidiaries.length; i += 4) {
    const slice = subsidiaries.slice(i, i + 4);
    const hero = slice[0];
    if (!hero) break;
    blocks.push({
      hero,
      side: slice.slice(1, 4),
    });
  }
  return blocks;
}
