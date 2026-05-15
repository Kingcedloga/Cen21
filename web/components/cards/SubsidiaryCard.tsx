import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { SECTOR_LABELS } from "@/lib/content";
import type { Subsidiary } from "@/lib/types";

export function SubsidiaryCard({ subsidiary }: { subsidiary: Subsidiary }) {
  return (
    <article className="group relative overflow-hidden rounded-2xl glass-panel transition-all duration-300 ease-out hover:border-gold/35 hover:shadow-xl hover:shadow-black/35">
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
        <div className="absolute inset-0 bg-gradient-to-t from-petrol from-10% via-petrol/50 to-transparent" />
        <div
          className="absolute top-0 left-0 w-1 h-full opacity-80"
          style={{ backgroundColor: subsidiary.accentColor }}
          aria-hidden
        />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-6 z-10 pointer-events-none">
        <p className="text-gold text-[11px] font-medium tracking-[0.22em] uppercase mb-2">
          {SECTOR_LABELS[subsidiary.sector]}
        </p>
        <h3 className="font-[family-name:var(--font-cormorant)] text-xl md:text-2xl text-ivory mb-1 flex items-center gap-2 tracking-[-0.01em] leading-snug">
          {subsidiary.name}
          <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-gold" />
        </h3>
        <p className="text-taupe text-sm line-clamp-2 mb-3">{subsidiary.tagline}</p> 
      </div>
    </article>
  );
}
