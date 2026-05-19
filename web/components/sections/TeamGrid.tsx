import Image from "next/image";

import { AnimateIn } from "@/components/ui/AnimateIn";
import { BLUR_PETROL } from "@/lib/image-blur";
import type { TeamMember } from "@/lib/types";

function LinkedInIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.27 2.38 4.27 5.47v6.27ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}

/**
 * Grille équipe dirigeante — design éditorial premium :
 * 1 col mobile, 2 col tablet (avec dernier item plein), 3 col desktop.
 * Chaque carte : portrait ratio 4/5, voile dégradé bas, accent doré au survol.
 */
export function TeamGrid({ members }: { members: TeamMember[] }) {
  if (!members.length) return null;

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-7 lg:grid-cols-3 lg:gap-8">
      {members.map((m, i) => (
        <AnimateIn
          key={m.name}
          delay={i * 0.08}
          className={
            // Sur tablet (2 cols) : si nombre impair, le dernier prend les 2 colonnes
            // pour garder un layout équilibré sans carte orpheline.
            members.length % 2 === 1 && i === members.length - 1
              ? "sm:col-span-2 lg:col-span-1"
              : ""
          }
        >
          <TeamCard member={m} />
        </AnimateIn>
      ))}
    </div>
  );
}

function TeamCard({ member }: { member: TeamMember }) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-white/10 bg-petrol/40 backdrop-blur-sm transition-all duration-500 ease-out hover:-translate-y-1 hover:border-gold/40 hover:bg-petrol/55 hover:shadow-[0_24px_60px_-20px_rgba(197,160,89,0.35),0_12px_32px_-12px_rgba(0,0,0,0.55)]">
      {/* Portrait — ratio éditorial 4/5 */}
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        <Image
          src={member.photo}
          alt={`Portrait de ${member.name}`}
          fill
          placeholder="blur"
          blurDataURL={BLUR_PETROL}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        {/* Voile bas pour transition élégante vers le bloc texte */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-petrol via-petrol/60 to-transparent"
        />
        {/* Liseré doré activé au survol */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-center scale-x-0 bg-gradient-to-r from-transparent via-gold/80 to-transparent transition-transform duration-500 group-hover:scale-x-100"
        />
      </div>

      <div className="relative px-6 pb-7 pt-5 md:px-7 md:pb-8 md:pt-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">
          {member.role}
        </p>
        <h3 className="mt-2 font-[family-name:var(--font-dm-sans)] text-2xl font-bold leading-tight text-ivory md:text-[1.7rem]">
          {member.name}
        </h3>
        {member.bio && (
          <p className="mt-3 text-sm leading-[1.65] text-ivory/75">{member.bio}</p>
        )}
        {member.linkedin && (
          <a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Profil LinkedIn de ${member.name}`}
            className="mt-5 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-ivory/80 transition-all duration-200 hover:border-gold/60 hover:bg-gold/10 hover:text-gold focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-2 cursor-pointer"
          >
            <LinkedInIcon className="h-4 w-4" />
          </a>
        )}
      </div>
    </article>
  );
}
