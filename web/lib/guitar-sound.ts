/**
 * Son de corde de guitare pincée, synthétisé dans le navigateur (aucun
 * fichier audio) : algorithme de Karplus-Strong. Un bruit bref circule dans
 * une ligne à retard d'une période de la note ; à chaque tour, la moyenne de
 * deux échantillons voisins (filtre passe-bas) et un léger amortissement le
 * transforment en note qui s'éteint comme une vraie corde.
 *
 * Les six notes d'une guitare accordée en mi, de la corde la plus aiguë (en
 * haut) à la plus grave : mi4, si3, sol3, ré3, la2, mi2.
 *
 * Le contexte audio ne peut démarrer qu'après un geste de l'utilisateur
 * (clic, touche) : `enableGuitar()` est appelé par le bouton « Son des
 * cordes », jamais au survol.
 */

export const GUITAR_NOTES = [329.63, 246.94, 196.0, 146.83, 110.0, 82.41] as const;

/** Durée de chaque note pré-calculée (s). */
const NOTE_SECONDS = 2.4;
/** Volume général : un accent sonore, pas une musique de fond. */
const MASTER_GAIN = 0.32;

let context: AudioContext | null = null;
let master: GainNode | null = null;
let buffers: AudioBuffer[] = [];

function pluckBuffer(ctx: AudioContext, frequency: number): AudioBuffer {
  const rate = ctx.sampleRate;
  const length = Math.floor(rate * NOTE_SECONDS);
  const buffer = ctx.createBuffer(1, length, rate);
  const out = buffer.getChannelData(0);
  const period = Math.max(2, Math.round(rate / frequency));
  const ring = new Float32Array(period);
  // Bruit initial adouci (une attaque de doigt, pas de médiator).
  let previous = 0;
  for (let i = 0; i < period; i += 1) {
    previous = previous * 0.5 + (Math.random() * 2 - 1) * 0.5;
    ring[i] = previous;
  }
  // Les cordes aiguës s'éteignent un peu plus vite que les graves.
  const decay = 0.994 + Math.min(0.0045, (110 / frequency) * 0.004);
  let index = 0;
  for (let i = 0; i < length; i += 1) {
    const next = (index + 1) % period;
    const value = ring[index];
    out[i] = value;
    ring[index] = decay * 0.5 * (value + ring[next]);
    index = next;
  }
  return buffer;
}

/** Prépare le contexte et les six notes ; à appeler dans un geste utilisateur. */
export async function enableGuitar(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  const AudioCtor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtor) return false;
  if (!context) {
    context = new AudioCtor();
    master = context.createGain();
    master.gain.value = MASTER_GAIN;
    // Coupe le souffle aigu du bruit : un son de corde plus rond.
    const tone = context.createBiquadFilter();
    tone.type = "lowpass";
    tone.frequency.value = 4200;
    master.connect(tone).connect(context.destination);
    buffers = GUITAR_NOTES.map((frequency) => pluckBuffer(context as AudioContext, frequency));
  }
  if (context.state === "suspended") await context.resume();
  return context.state === "running";
}

/** Suspend le contexte (son coupé) sans perdre les notes préparées. */
export function disableGuitar() {
  void context?.suspend();
}

/**
 * Pince la corde `index` (0 = la plus aiguë). `strength` 0 → 1 : vitesse du
 * geste ; `pan` −1 → 1 : position du doigt sur la largeur. Sans effet tant
 * que le son n'est pas activé.
 */
export function pluck(index: number, strength: number, pan: number) {
  if (!context || !master || context.state !== "running") return;
  const buffer = buffers[index];
  if (!buffer) return;
  const source = context.createBufferSource();
  source.buffer = buffer;
  const gain = context.createGain();
  gain.gain.value = 0.25 + 0.75 * Math.min(1, Math.max(0, strength));
  const panner = context.createStereoPanner();
  panner.pan.value = Math.min(1, Math.max(-1, pan)) * 0.7;
  source.connect(gain).connect(panner).connect(master);
  source.start();
}
