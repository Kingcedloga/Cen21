"use client";

import { motion, useTransform } from "framer-motion";

import { StickyTrack, useStickyTrack } from "@/components/motion/StickyTrack";

function TrackStage({ title, body, cardLabel }: { title: string; body: string; cardLabel: string }) {
  const { progress, isStatic } = useStickyTrack();
  const x = useTransform(progress, [0, 1], ["0vw", "-50vw"]);
  const percent = useTransform(progress, (value) => Math.round(value * 100));

  return (
    <div className="flex h-full flex-col justify-center gap-12 px-4 py-20 md:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <h2 className="title-section text-h2 text-ivory">{title}</h2>
        <p className="mt-4 max-w-xl text-ivory/70">{body}</p>
        <div className="mt-8 h-1 w-full overflow-hidden rounded-full bg-ivory/15">
          <motion.div
            data-track-motion=""
            className="h-full origin-left bg-gold"
            style={isStatic ? undefined : { scaleX: progress }}
          />
        </div>
      </div>
      <motion.div
        data-track-motion=""
        style={isStatic ? undefined : { x }}
        // Décalage réservé à md+ : avant l'hydratation, la piste mobile est déjà
        // statique (CSS) et rien ne doit déborder horizontalement.
        className={`mx-auto w-[min(80vw,420px)] rounded-card-xl bg-ivory p-8 text-petrol shadow-long ${
          isStatic ? "" : "md:ml-[60vw]"
        }`}
      >
        <p className="text-sm uppercase tracking-[0.12em] text-petrol/70">{cardLabel}</p>
        <p className="mt-2 text-h3 font-semibold tabular-nums">
          <motion.span>{percent}</motion.span> %
        </p>
      </motion.div>
    </div>
  );
}

export function TrackDemo(props: { title: string; body: string; cardLabel: string }) {
  return (
    <StickyTrack lengthVh={300} surface="dark" staticBelow="md" className="bg-petrol-panel-4">
      <TrackStage {...props} />
    </StickyTrack>
  );
}
