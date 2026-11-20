"use client";

import { useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { playInGesture, unmuteInGesture } from "@/lib/media-sound";
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
 * - progression publiée sans rendu (`progressRef`, scaleX, ou `onProgress`) ;
 * - `enabled` (vrai par défaut) : faux, la vidéo reste arrêtée, même au clic
 *   (ex. ascenseur de Gourmet Mexicana : lecture au seul 9ᵉ étage).
 */
export function useTeaserVideo({
  onProgress,
  enabled = true,
}: { onProgress?: (ratio: number) => void; enabled?: boolean } = {}) {
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
    const wanted = enabled && (paused === null ? teaserAutoplayAllowed() : !paused);
    if (!wanted) {
      element.pause();
      return;
    }
    let inView = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView && !document.hidden) element.play().catch(() => {});
        else element.pause();
      },
      { threshold: 0.35 },
    );
    observer.observe(element);
    // Onglet en arrière-plan : pause (batterie, données) ; au retour, reprise
    // si la vidéo est toujours à l'écran.
    const onVisibility = () => {
      if (document.hidden) element.pause();
      else if (inView) element.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [near, paused, enabled]);

  const onTimeUpdate = () => {
    const element = videoRef.current;
    if (!element || !element.duration) return;
    const ratio = element.currentTime / element.duration;
    if (progressRef.current) progressRef.current.style.transform = `scaleX(${ratio})`;
    onProgress?.(ratio);
  };

  const togglePlay = () => {
    setPaused(playing);
    if (!playing && enabled) playInGesture(videoRef.current);
  };

  const toggleSound = () => {
    const element = videoRef.current;
    if (!element) return;
    if (!muted) {
      element.muted = true;
      setMuted(true);
      return;
    }
    // Son activé et lecture relancée dans le geste même (sinon refusés sur mobile).
    setMuted(false);
    if (!enabled) {
      // Lecture interdite pour l'instant : le son sera là au démarrage.
      element.muted = false;
      return;
    }
    if (element.paused) setPaused(false);
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
