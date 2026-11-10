"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { ArcSlider, type ArcSliderLabels } from "@/components/motion/ArcSlider";
import { X } from "@/lib/icons";

import "@/styles/about.css";

export type TeamMember = {
  name: string;
  role: string;
  photo: string;
  quote?: string;
  bio?: string;
  /** « {index} sur {total} : {nom} » */
  positionLabel: string;
  /** « Découvrir le parcours de {nom} » */
  discoverLabel: string;
};

type Labels = ArcSliderLabels & { discover: string; close: string };

/**
 * Équipe dirigeante en éventail (refonte R2, slider en arc de l'accueil).
 * « Découvrir le parcours » ouvre une fiche en <dialog> modale : focus
 * piégé, Échap ou clic sur le voile pour fermer, focus rendu au bouton.
 */
export function AboutTeamArc({ members, labels }: { members: TeamMember[]; labels: Labels }) {
  const [open, setOpen] = useState<TeamMember | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // Page figée pendant la lecture (Lenis s'arrête sur `overflow: hidden`).
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <>
      <ArcSlider
        items={members}
        getKey={(member) => member.name}
        getPositionLabel={(member) => member.positionLabel}
        labels={labels}
        renderCard={(member, { active }) => (
          <>
            <Image
              src={member.photo}
              alt=""
              fill
              draggable={false}
              sizes="(max-width: 768px) 76vw, 440px"
              className="object-cover object-top"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-petrol-panel-4 from-15% via-petrol-panel-4/70 via-45% to-transparent to-75%"
            />
            <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-2 px-6 pb-7 text-center md:px-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">{member.role}</p>
              <h3 className="title-section text-2xl text-ivory md:text-[1.75rem]">{member.name}</h3>
              {member.quote && (
                <p className="line-clamp-3 max-w-[22rem] text-sm italic text-ivory/80">« {member.quote} »</p>
              )}
              <button
                type="button"
                tabIndex={active ? 0 : -1}
                aria-label={member.discoverLabel}
                onClick={() => setOpen(member)}
                className="mt-3 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full bg-ivory px-5 text-sm font-medium text-petrol-panel-4 transition-transform duration-fine hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ivory"
              >
                {labels.discover}
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </>
        )}
      />

      <dialog
        ref={dialogRef}
        aria-labelledby="team-dialog-name"
        className="team-dialog"
        onClose={() => setOpen(null)}
        // Clic sur le voile (hors du panneau) : fermeture.
        onClick={(event) => {
          if (event.target === event.currentTarget) setOpen(null);
        }}
      >
        {open && (
          <div className="team-dialog__panel">
            <div className="team-dialog__photo">
              <Image src={open.photo} alt="" fill sizes="(max-width: 767px) 100vw, 22rem" className="object-cover object-top" />
            </div>
            <div className="team-dialog__body">
              <p className="team-dialog__role">{open.role}</p>
              <h3 id="team-dialog-name" className="title-section team-dialog__name">
                {open.name}
              </h3>
              {open.quote && <blockquote className="team-dialog__quote">« {open.quote} »</blockquote>}
              {open.bio && <p className="team-dialog__bio">{open.bio}</p>}
            </div>
            <button type="button" onClick={() => setOpen(null)} className="team-dialog__close" aria-label={labels.close}>
              <X size={20} aria-hidden="true" />
            </button>
          </div>
        )}
      </dialog>
    </>
  );
}
