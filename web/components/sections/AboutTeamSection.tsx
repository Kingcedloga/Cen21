"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import { AnimateIn } from "@/components/ui/AnimateIn";
import { IconLinkedin } from "@/components/ui/SocialLinks";
import { BLUR_PETROL } from "@/lib/image-blur";
import { dynalight } from "@/lib/fonts";
import { DURATION_S, EASE, defaultScrollViewport } from "@/lib/motion";
import type { TeamMember } from "@/lib/types";

type Props = {
  eyebrow: string;
  title: string;
  members: TeamMember[];
};

/**
 * Section "Direction / Notre équipe de direction" — page À propos uniquement.
 * Fond blanc, en-tête centré, grille 3 cols de cartes portrait avec overlay hover.
 */
export function AboutTeamSection({ eyebrow, title, members }: Props) {
  if (!members.length) return null;

  return (
    <section
      aria-labelledby="about-team-title"
      className={`bg-white px-4 py-20 md:px-6 md:py-24 ${dynalight.variable}`}
    >
      <div className="mx-auto mb-12 max-w-3xl text-center md:mb-16">
        <AnimateIn>
          <p className="text-2xl italic text-gold-mid [font-family:var(--font-dynalight),cursive]">
            {eyebrow}
          </p>
        </AnimateIn>
        <AnimateIn delay={0.08}>
          <h2
            id="about-team-title"
            className="mt-4 text-3xl font-bold leading-[1.15] text-[#1a1208] md:text-4xl lg:text-5xl"
          >
            {title}
          </h2>
        </AnimateIn>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-7 lg:grid-cols-3 lg:gap-8">
        {members.map((m, i) => (
          <TeamCard key={m.name} member={m} index={i} />
        ))}
      </div>
    </section>
  );
}

function TeamCard({ member, index }: { member: TeamMember; index: number }) {
  const reduced = useReducedMotion();

  return (
    <motion.article
      className="group relative aspect-[4/5] w-full overflow-hidden rounded-xl"
      initial={reduced ? false : { opacity: 0, y: 24, scale: 0.96 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0, scale: 1 }}
      viewport={defaultScrollViewport}
      transition={{ duration: DURATION_S.luxe, ease: EASE.luxury, delay: index * 0.09 }}
    >
      <Image
        src={member.photo}
        alt={`Portrait de ${member.name}`}
        fill
        placeholder="blur"
        blurDataURL={BLUR_PETROL}
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className="object-cover object-center"
      />

      {/* Overlay sombre au survol */}
      <div
        aria-hidden
        className="absolute inset-0 bg-black/0 transition-colors duration-fine ease-luxury group-hover:bg-[rgba(0,0,0,0.55)]"
      />

      {/* Icônes réseaux sociaux — centrées sur la photo, révélées au survol */}
      {member.linkedin && (
        <div className="absolute inset-x-0 bottom-[4.5rem] top-0 flex items-center justify-center">
          <a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Profil LinkedIn de ${member.name}`}
            className="flex h-11 w-11 scale-0 items-center justify-center rounded-full border border-white text-white opacity-0 transition-all duration-fine ease-spring hover:bg-gold-mid hover:border-gold-mid group-hover:scale-100 group-hover:opacity-100"
          >
            <IconLinkedin className="h-4 w-4" />
          </a>
        </div>
      )}

      {/* Bloc info bas — fond blanc, nom + poste */}
      <div className="absolute inset-x-0 bottom-0 bg-white px-4 py-5 text-center">
        <p className="font-[family-name:var(--font-dm-sans)] text-lg font-bold text-[#1a1208]">
          {member.name}
        </p>
        <p className="mt-1 text-sm italic text-gold-mid">{member.role}</p>
      </div>
    </motion.article>
  );
}
