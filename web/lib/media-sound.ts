/**
 * Son sur mobile : deux pièges des téléphones, réglés ici.
 *
 * 1. iPhone en mode silencieux : le son Web Audio (cordes de guitare) est
 *    coupé par l'interrupteur, contrairement aux vidéos. On demande une
 *    session audio « lecture » (Safari 16.4+, `navigator.audioSession`) ;
 *    sur les versions plus anciennes, un court son muet joué en boucle par un
 *    élément <audio> place la page dans la même catégorie.
 * 2. Vidéo sans lecture automatique (mode économie d'énergie, économiseur de
 *    données) : un `play()` avec le son, lancé hors du geste (dans un effet),
 *    est refusé. Le son est donc activé et la lecture lancée dans le geste
 *    même (`unmuteInGesture`).
 *
 * À appeler uniquement depuis un geste du visiteur (clic, toucher).
 */

type AudioSessionNavigator = Navigator & { audioSession?: { type: string } };

let keepAlive: HTMLAudioElement | null = null;

/** WAV mono 8 kHz de 0,25 s de silence, pour la session « lecture » des anciens iOS. */
function silentWavUrl(): string {
  const samples = 2000;
  const buffer = new ArrayBuffer(44 + samples);
  const view = new DataView(buffer);
  const text = (offset: number, value: string) => [...value].forEach((c, i) => view.setUint8(offset + i, c.charCodeAt(0)));
  text(0, "RIFF");
  view.setUint32(4, 36 + samples, true);
  text(8, "WAVE");
  text(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, 8000, true);
  view.setUint32(28, 8000, true);
  view.setUint16(32, 1, true);
  view.setUint16(34, 8, true);
  text(36, "data");
  view.setUint32(40, samples, true);
  for (let i = 0; i < samples; i += 1) view.setUint8(44 + i, 128);
  return URL.createObjectURL(new Blob([buffer], { type: "audio/wav" }));
}

/**
 * Le son de la page joue même téléphone en mode silencieux (comme une
 * vidéo). `keepAliveForWebAudio` : pour Web Audio sur les iOS sans
 * `audioSession`, lance la boucle muette (arrêtée par `releasePlaybackAudio`).
 */
export function preferPlaybackAudio({ keepAliveForWebAudio = false } = {}) {
  if (typeof navigator === "undefined") return;
  const session = (navigator as AudioSessionNavigator).audioSession;
  if (session) {
    try {
      if (session.type !== "playback") session.type = "playback";
    } catch {
      // Valeur refusée : le navigateur garde sa session.
    }
    return;
  }
  if (!keepAliveForWebAudio) return;
  if (!keepAlive) {
    keepAlive = new Audio(silentWavUrl());
    keepAlive.loop = true;
    keepAlive.setAttribute("playsinline", "");
  }
  keepAlive.play().catch(() => {});
}

/** Arrête la boucle muette (son des cordes coupé). */
export function releasePlaybackAudio() {
  keepAlive?.pause();
}

/**
 * Active le son d'une vidéo dans le geste du visiteur et la relance si elle
 * était arrêtée. `onRefused` : le navigateur refuse la lecture avec le son
 * (la vidéo repasse en muet).
 */
export function unmuteInGesture(element: HTMLVideoElement, onRefused: () => void) {
  preferPlaybackAudio();
  element.muted = false;
  element.volume = 1;
  if (!element.paused) return;
  element.play().catch(() => {
    element.muted = true;
    onRefused();
  });
}
