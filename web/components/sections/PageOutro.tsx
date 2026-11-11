import { RollingText } from "@/components/motion/RollingText";
import { SpectrumText } from "@/components/motion/SpectrumText";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight } from "@/lib/icons";

import "@/styles/page-outro.css";

type OutroLink = { href: string; label: string };

/**
 * Bande de clôture des pages intérieures (refonte R0), juste avant le footer :
 * un grand titre révélé au défilement, un appel à l'action, puis un lien
 * pleine largeur vers la page suivante du parcours (lettres roulantes au
 * survol, flèche qui se redresse — boutons et liens d'Orbix).
 *
 * Même fond que le footer : la page s'y fond sans raccord.
 */
export function PageOutro({
  eyebrow,
  title,
  titleSweep,
  primary,
  next,
}: {
  eyebrow: string;
  title: string;
  titleSweep?: string;
  primary?: OutroLink;
  /** `label` : « Page suivante » ; `title` : nom de la page. */
  next: OutroLink & { title: string };
}) {
  return (
    <section data-surface="dark" aria-labelledby="page-outro-title" className="page-outro">
      <div className="page-outro__inner">
        <div className="page-outro__head">
          <div>
            <p className="eyebrow text-xs font-semibold uppercase tracking-[0.2em] text-rose">{eyebrow}</p>
            <SpectrumText
              as="h2"
              id="page-outro-title"
              mode="scroll"
              text={title}
              sweep={titleSweep}
              className="page-outro__title title-section text-h2 text-balance"
            />
          </div>
          {primary && (
            <Button href={primary.href} magnetic className="shrink-0">
              {primary.label}
            </Button>
          )}
        </div>

        <Link href={next.href} className="page-outro__next tap-press">
          <span className="page-outro__next-label">{next.label}</span>
          <span className="page-outro__next-title title-display">
            <RollingText text={next.title} />
          </span>
          <span aria-hidden="true" className="page-outro__next-arrow">
            <ArrowUpRight size={28} />
          </span>
        </Link>
      </div>
    </section>
  );
}
