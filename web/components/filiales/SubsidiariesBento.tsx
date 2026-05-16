import { CompactSubsidiaryCard } from "@/components/cards/CompactSubsidiaryCard";
import { FeatureSubsidiaryCard } from "@/components/cards/FeatureSubsidiaryCard";
import { AnimateIn } from "@/components/ui/AnimateIn";
import type { Subsidiary } from "@/lib/types";

const FEATURE_PER_BLOCK = 1;
const COMPACT_PER_BLOCK = 4;
const BLOCK_SIZE = FEATURE_PER_BLOCK + COMPACT_PER_BLOCK;

/**
 * Bento Grid magazine — vue éditoriale curatée des filiales.
 *
 * Structure :
 *   Bloc N (10 filiales = 2 blocs) :
 *     - 1 carte « Feature » (col-span 7 sur lg) — premier niveau
 *     - 4 cartes « Compact » empilées (col-span 5 sur lg) — second niveau
 *   L'ordre s'inverse à chaque bloc pour un rythme magazine alterné.
 *
 * Mobile : feature en haut, compactes empilées en dessous.
 */
export function SubsidiariesBento({ subsidiaries }: { subsidiaries: Subsidiary[] }) {
  if (!subsidiaries.length) return null;

  // Découpage en blocs de 5 (1 feature + 4 compactes).
  // Si le dernier bloc a moins de 5 éléments, il garde sa proportion.
  const blocks: Subsidiary[][] = [];
  for (let i = 0; i < subsidiaries.length; i += BLOCK_SIZE) {
    blocks.push(subsidiaries.slice(i, i + BLOCK_SIZE));
  }

  return (
    <div className="space-y-14 md:space-y-20">
      {blocks.map((block, blockIndex) => {
        if (block.length === 0) return null;
        const featureFirst = blockIndex % 2 === 0;
        return (
          <BentoBlock
            key={blockIndex}
            subsidiaries={block}
            featureFirst={featureFirst}
            blockIndex={blockIndex}
          />
        );
      })}
    </div>
  );
}

function BentoBlock({
  subsidiaries,
  featureFirst,
  blockIndex,
}: {
  subsidiaries: Subsidiary[];
  /** Si true, la feature est à gauche (cas par défaut). Sinon à droite. */
  featureFirst: boolean;
  blockIndex: number;
}) {
  const [feature, ...compactes] = subsidiaries;
  if (!feature) return null;

  // Si moins de cartes compactes (dernier bloc partiel), on rééquilibre :
  // une seule feature pleine largeur en flow naturel + grid pour le reste.
  if (compactes.length === 0) {
    return (
      <AnimateIn>
        <FeatureSubsidiaryCard subsidiary={feature} />
      </AnimateIn>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:gap-7 lg:grid-cols-12 lg:gap-8">
      <AnimateIn
        delay={0.05}
        className={`relative ${
          featureFirst ? "lg:col-span-7 lg:col-start-1" : "lg:col-span-7 lg:col-start-6"
        } lg:row-start-1`}
      >
        <FeatureSubsidiaryCard subsidiary={feature} />
      </AnimateIn>

      <div
        className={`flex flex-col gap-4 md:gap-5 ${
          featureFirst ? "lg:col-span-5 lg:col-start-8" : "lg:col-span-5 lg:col-start-1"
        } lg:row-start-1`}
      >
        {compactes.map((sub, i) => (
          <AnimateIn
            key={sub.slug}
            delay={0.08 + i * 0.06}
            className="h-full"
          >
            <CompactSubsidiaryCard subsidiary={sub} />
          </AnimateIn>
        ))}
      </div>

      {/* Séparateur visuel discret entre les blocs (sauf après le dernier) */}
      {blockIndex >= 0 && (
        <span aria-hidden className="hidden" />
      )}
    </div>
  );
}
