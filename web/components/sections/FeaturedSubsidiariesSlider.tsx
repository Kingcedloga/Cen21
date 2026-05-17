"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { SubsidiariesCoverFlow } from "@/components/filiales/SubsidiariesCoverFlow";
import type { Subsidiary } from "@/lib/types";

/**
 * Showcase carousel — Stage sombre compact, CTA intégré.
 *
 * Panneau anthracite-pétrole arrondi plus bas que la version « écrin » initiale ;
 * colonne verticale : zone carrousel poussée vers le bas du bloc flex au-dessus
 * du CTA (« Voir plus »), pour qu’elle ne flotte pas visuellement à hauteur de titre.
 *
 * Hauteurs Stage : mobile 664px (dont ~64px réservés au soufflé haut avant le deck),
 * sinon justify-end reste invisible (anciens réglages : ~3 px de jeu).
 */
export function FeaturedSubsidiariesSlider({
  subsidiaries,
}: {
  subsidiaries: Subsidiary[];
}) {
  return (
    <div className="w-full max-sm:overflow-x-clip">
      <div className="relative flex h-[664px] w-full flex-col sm:h-[530px] lg:h-[660px]">
        {/* Fond du Stage — occupe tout le rectangle arrondi */}
        <div
          aria-hidden
          className="absolute inset-0 z-0 rounded-3xl"
          style={{
            background:
              "linear-gradient(180deg, #16262b 0%, #0d1d22 55%, #091a1f 100%)",
            boxShadow: `
              inset 0 1px 0 rgba(255,255,255,0.06),
              inset 0 0 0 1px rgba(197,160,89,0.12),
              0 18px 50px -18px rgba(0,0,0,0.45)
            `,
          }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-10 top-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(197,160,89,0.45) 50%, transparent 100%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-3xl"
            style={{
              background:
                "radial-gradient(ellipse 52% 42% at 50% 42%, rgba(197,160,89,0.09) 0%, transparent 68%)",
            }}
          />
        </div>

        {/* Contenu : carrousel + CTA dans le Stage */}
        <div className="relative z-10 flex min-h-0 flex-1 flex-col">
          <div className="flex min-h-0 flex-1 flex-col justify-end px-1 pb-3 pt-2 max-sm:pt-16 sm:px-2 sm:pb-4 sm:pt-3">
            <div className="w-full">
              <SubsidiariesCoverFlow subsidiaries={subsidiaries} />
            </div>
          </div>

          <div className="flex shrink-0 justify-center px-4 pb-5 pt-1 sm:pb-6 sm:pt-2">
            <Link
              href="/filiales"
              aria-label="Voir l'ensemble de nos filiales"
              className="group/cta-btn relative inline-flex min-h-[44px] items-center gap-2.5 rounded-full border border-gold/45 bg-white/8 px-6 py-2.5 font-[family-name:var(--font-cormorant)] text-base font-medium tracking-wide text-ivory backdrop-blur-sm transition-all duration-300 ease-out hover:border-gold hover:bg-white/15 hover:text-gold focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-2 cursor-pointer sm:px-7 sm:py-3 sm:text-[17px]"
              style={{
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.10), inset 0 -1px 0 rgba(197,160,89,0.20), 0 4px 14px -4px rgba(0,0,0,0.30)",
              }}
            >
              Voir plus
              <ArrowRight
                className="h-4 w-4 text-gold transition-transform duration-300 ease-out group-hover/cta-btn:translate-x-1"
                strokeWidth={1.5}
                aria-hidden
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
