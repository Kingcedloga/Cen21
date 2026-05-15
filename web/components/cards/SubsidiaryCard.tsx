import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { SocialLinks } from "@/components/ui/SocialLinks";
import { SECTOR_LABELS } from "@/lib/content";
import type { Subsidiary } from "@/lib/types";

export function SubsidiaryCard({ subsidiary }: { subsidiary: Subsidiary }) {
  return (
    <article className="group relative overflow-hidden rounded-xl glass-panel transition-colors duration-200 hover:border-gold/40">
      <Link
        href={`/filiales/${subsidiary.slug}`}
        className="absolute inset-0 z-0 cursor-pointer"
        aria-label={`Découvrir ${subsidiary.name}`}
      />
      <div className="relative aspect-[4/5] pointer-events-none">
        <Image
          src={subsidiary.coverImage}
          alt={subsidiary.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-petrol via-petrol/40 to-transparent" />
        <div
          className="absolute top-0 left-0 w-1 h-full opacity-80"
          style={{ backgroundColor: subsidiary.accentColor }}
          aria-hidden
        />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-6 z-10 pointer-events-none">
        <p className="text-gold text-xs tracking-[0.15em] uppercase mb-2">
          {SECTOR_LABELS[subsidiary.sector]}
        </p>
        <h3 className="font-[family-name:var(--font-cormorant)] text-2xl text-ivory mb-1 flex items-center gap-2">
          {subsidiary.name}
          <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-gold" />
        </h3>
        <p className="text-taupe text-sm line-clamp-2 mb-3">{subsidiary.tagline}</p>
      </div>
      <div className="absolute bottom-6 right-6 z-20 pointer-events-auto">
        <SocialLinks social={subsidiary.social} size="sm" />
      </div>
    </article>
  );
}
