"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useRouter } from "next/navigation";
import { ArrowUpRight } from "lucide-react";

import { useSectorLabel } from "@/lib/use-sector-label";
import { BLUR_PETROL } from "@/lib/image-blur";
import type { Subsidiary } from "@/lib/types";

export function SubsidiaryCard({ subsidiary }: { subsidiary: Subsidiary }) {
  const sectorLabel = useSectorLabel(subsidiary.sector);
  const router = useRouter();
  const href = `/filiales/${subsidiary.slug}`;

  const onPrefetch = () => {
    try {
      router.prefetch(href);
    } catch {
      // best effort
    }
  };

  return (
    <article
      onMouseEnter={onPrefetch}
      onFocus={onPrefetch}
      onTouchStart={onPrefetch}
      className="group relative overflow-hidden rounded-2xl border border-white/12 bg-anthracite/45 shadow-[0_18px_40px_-22px_rgba(0,0,0,0.55)] transition-[transform,box-shadow,border-color] duration-500 ease-out hover:-translate-y-1 hover:border-gold/45 hover:shadow-[0_26px_60px_-22px_rgba(197,160,89,0.32),0_18px_40px_-18px_rgba(0,0,0,0.65)]"
    >
      <Link
        href={href}
        prefetch
        className="absolute inset-0 z-20 cursor-pointer rounded-2xl focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-[-3px]"
        aria-label={`Découvrir ${subsidiary.name}`}
      />

      <div className="relative aspect-[4/5] overflow-hidden">
        <Image
          src={subsidiary.coverImage}
          alt={subsidiary.name}
          fill
          placeholder="blur"
          blurDataURL={BLUR_PETROL}
          className="object-cover transition-transform duration-[700ms] ease-out group-hover:scale-[1.06]"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        <div
          className="absolute inset-0 bg-gradient-to-t from-petrol from-[8%] via-petrol/55 to-transparent"
          aria-hidden
        />
        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          aria-hidden
          style={{
            background: `radial-gradient(ellipse at 50% 95%, ${subsidiary.accentColor}33 0%, transparent 60%)`,
          }}
        />

        <span
          aria-hidden
          className="absolute left-0 top-0 h-full w-[3px] origin-top scale-y-100 transition-transform duration-500"
          style={{ backgroundColor: subsidiary.accentColor, opacity: 0.85 }}
        />
        <span
          aria-hidden
          className="absolute left-0 top-0 h-full w-[3px] origin-top scale-y-0 bg-gold opacity-0 transition-all duration-700 group-hover:scale-y-100 group-hover:opacity-90"
        />
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-10 flex flex-col gap-1.5 p-6">
        <p className="text-[10.5px] font-semibold tracking-[0.24em] uppercase text-gold">
          {sectorLabel}
        </p>
        <h3 className="font-[family-name:var(--font-cormorant)] text-[1.55rem] md:text-2xl font-medium leading-[1.15] tracking-[-0.01em] text-ivory">
          <span className="inline-flex items-center gap-2">
            <span>{subsidiary.name}</span>
            <ArrowUpRight
              className="h-4 w-4 -translate-x-1 text-gold opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
              aria-hidden
            />
          </span>
        </h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-ivory/75">
          {subsidiary.tagline}
        </p>
      </div>
    </article>
  );
}
