"use client";

import { useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { unmuteInGesture } from "@/lib/media-sound";
import { useReducedMotionSafe } from "@/lib/use-media-query";

/**
 * Lecture automatique des teasers : toujours muette, dès que la vidéo est à
 * l'écran — y compris en reduced motion (la pause reste à portée, WCAG 2.2.2).
 * Seul l'économiseur de données du visiteur la bloque. Le son, lui, n'est
 * jamais activé que par le visiteur.
 */
export function teaserAutoplayAllowed() {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return !connection?.saveData;
}

/**
 * Lecture d'un teaser de maison, partagée par ses présentations (FilialeTeaser,
 * KLoungeTeaser, ClubAftermovie, MokaVideo) :
 * - la vidéo n'est demandée qu'à l'approche du cadre (`frameRef`, 400 px) ;
 * - lecture muette en boucle tant qu'elle est à l'écran (35 % visible) ;
 * - choix du visiteur (lecture / pause, son) prioritaire sur l'automatique ;
 * - économiseur de données : pas de lecture automatique (teaserAutoplayAllowed) ;
 * - progression publiée sans rendu (`progressRef`, scaleX, ou `onProgress`).
 */
export function useTeaserVideo({ onProgress }: { onProgress?: (ratio: number) => void } = {}) {
  const reduced = useReducedMotionSafe();
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const near = useInView(frameRef, { once: true, margin: "400px 0px" });
  // null : lecture automatique ; true / false : choix du visiteur.
  const [paused, setPaused] = useState<boolean | null>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const element = videoRef.current;
    if (!element || !near) return;
    const wanted = paused === null ? teaserAutoplayAllowed() : !paused;
    if (!wanted) {
      element.pause();
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) element.play().catch(() => {});
        else element.pause();
      },
      { threshold: 0.35 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [near, paused]);

  const onTimeUpdate = () => {
    const element = videoRef.current;
    if (!element || !element.duration) return;
    const ratio = element.currentTime / element.duration;
    if (progressRef.current) progressRef.current.style.transform = `scaleX(${ratio})`;
    onProgress?.(ratio);
  };

  const togglePlay = () => setPaused(playing);

  const toggleSound = () => {
    const element = videoRef.current;
    if (!element) return;
    if (!muted) {
      element.muted = true;
      setMuted(true);
      return;
    }
    // Son activé et lecture relancée dans le geste même (sinon refusés sur mobile).
    if (element.paused) setPaused(false);
    setMuted(false);
    unmuteInGesture(element, () => setMuted(true));
  };

  /** Attributs à poser sur la balise <video>. */
  const videoProps = {
    ref: videoRef,
    muted: true,
    loop: true,
    playsInline: true,
    preload: near ? ("metadata" as const) : ("none" as const),
    onPlaying: () => setPlaying(true),
    onPause: () => setPlaying(false),
    onTimeUpdate,
  };

  return { reduced, near, playing, muted, frameRef, videoRef, progressRef, videoProps, togglePlay, toggleSound };
}
