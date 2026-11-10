"use client";

import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
  useTransform,
  type AnimationPlaybackControls,
  type MotionValue,
} from "framer-motion";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
} from "react";

import { EASE_GSAP } from "@/lib/motion";
import { FINE_POINTER_QUERY, useMediaQuery, useReducedMotionSafe } from "@/lib/use-media-query";

import "@/styles/subsidiaries-arc.css";

export type ArcSliderLabels = {
  region: string;
  roledescription: string;
  prev: string;
  next: string;
  drag: string;
};

/** Teinte des commandes : `light` sur fond clair (sable), `dark` sur fond sombre. */
export type ArcTone = "light" | "dark";

type Status = "active" | "inview" | "hidden";

const CONTROL: Record<ArcTone, string> = {
  light:
    "flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-petrol/25 text-petrol transition-colors duration-fine hover:bg-petrol hover:text-ivory focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-petrol",
  dark: "flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-ivory/25 text-ivory transition-colors duration-fine hover:bg-ivory hover:text-petrol-panel-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ivory",
};

function mod(value: number, count: number) {
  return ((value % count) + count) % count;
}

/** Distance circulaire de la carte `index` au centre `t` (Orbix : calcDistance). */
function circular(index: number, t: number, count: number) {
  return index - (t - Math.round((t - index) / count) * count);
}

function statusOf(index: number, active: number, count: number): Status {
  const distance = Math.abs(circular(index, active, count));
  if (distance < 0.45) return "active";
  return distance < 2.8 ? "inview" : "hidden";
}

function ArcCard({
  index,
  count,
  t,
  step,
  status,
  className,
  onSelect,
  children,
}: {
  index: number;
  count: number;
  t: MotionValue<number>;
  step: MotionValue<number>;
  status: Status;
  className: string;
  onSelect: (index: number) => void;
  children: ReactNode;
}) {
  const rotate = useTransform([t, step], ([value, degrees]: number[]) => circular(index, value, count) * degrees);
  const scale = useTransform(t, (value) => Math.max(0.75, 1 - Math.abs(circular(index, value, count)) * 0.04));
  const opacity = useTransform(t, (value) => {
    const distance = Math.abs(circular(index, value, count));
    if (distance >= 2.5) return 0;
    return distance > 1.3 ? 1 - (distance - 1.3) / 1.2 : 1;
  });
  const zIndex = useTransform(t, (value) => Math.round(50 - Math.abs(circular(index, value, count)) * 10));
  const isActive = status === "active";

  // Carte voisine : un clic la ramène au centre au lieu d'activer son contenu.
  const onClickCapture = (event: MouseEvent) => {
    if (isActive) return;
    event.preventDefault();
    event.stopPropagation();
    onSelect(index);
  };

  return (
    <motion.article
      className={`arc-card ${className}`}
      style={{ x: "-50%", rotate, scale, opacity, zIndex, transformOrigin: "50% 360%" }}
      data-status={status}
      aria-hidden={isActive ? undefined : true}
      inert={status === "hidden"}
      onClickCapture={onClickCapture}
    >
      {children}
    </motion.article>
  );
}

/**
 * Slider en éventail (Orbix : slider « arc »), mécanique commune : filiales
 * sur l'accueil, équipe dirigeante sur À propos. On le fait tourner en
 * glissant (souris, doigt), au trackpad (geste horizontal), aux flèches du
 * clavier ou avec les boutons. Une carte voisine cliquée revient au centre ;
 * seule la carte centrale est active (`active` dans `renderCard`), les cartes
 * hors champ sont `inert`.
 */
export function ArcSlider<T>({
  items,
  getKey,
  getPositionLabel,
  renderCard,
  labels,
  tone = "light",
  cardClassName = "bg-petrol-panel-4",
}: {
  items: T[];
  getKey: (item: T) => string;
  /** « {index} sur {total} : {nom} » — annoncé au changement de carte. */
  getPositionLabel: (item: T) => string;
  renderCard: (item: T, state: { active: boolean }) => ReactNode;
  labels: ArcSliderLabels;
  tone?: ArcTone;
  cardClassName?: string;
}) {
  const count = items.length;
  const t = useMotionValue(0);
  const [active, setActive] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [badgeVisible, setBadgeVisible] = useState(false);
  const reduced = useReducedMotionSafe();
  const finePointer = useMediaQuery(FINE_POINTER_QUERY);
  const small = useMediaQuery("(max-width: 768px)");
  /** Angle entre deux cartes, recalculé à la taille d'écran (voir effet ci-dessous). */
  const step = useMotionValue(21);
  const stageRef = useRef<HTMLDivElement>(null);
  const glideRef = useRef<AnimationPlaybackControls | null>(null);
  const movedRef = useRef(false);
  const drag = useRef({
    down: false,
    touch: false,
    horizontal: false,
    startX: 0,
    startY: 0,
    startT: 0,
    lastX: 0,
    lastTime: 0,
    velocity: 0,
    sensitivity: 320,
  });

  // Badge « Glisser » qui suit le curseur (desktop).
  const badgeX = useMotionValue(0);
  const badgeY = useMotionValue(0);
  const badgeSpringX = useSpring(badgeX, { stiffness: 500, damping: 40, mass: 0.4 });
  const badgeSpringY = useSpring(badgeY, { stiffness: 500, damping: 40, mass: 0.4 });

  useMotionValueEvent(t, "change", (value) => {
    const next = mod(Math.round(value), count);
    setActive((previous) => (previous === next ? previous : next));
  });

  /** 1 carte ≈ 0,72 largeur de carte glissée (Orbix : borné entre 260 et 380 px). */
  const sensitivity = useCallback(() => {
    const card = stageRef.current?.querySelector<HTMLElement>(".arc-card");
    const width = card?.offsetWidth ?? 440;
    return Math.max(260, Math.min(width * 0.72, 380));
  }, []);

  const glideTo = useCallback(
    (destination: number) => {
      glideRef.current?.stop();
      const target = Math.round(destination);
      const distance = Math.abs(target - t.get());
      if (reduced || distance < 0.001) {
        t.set(target);
        return;
      }
      glideRef.current = animate(t, target, {
        duration: Math.min(0.46, Math.max(0.28, distance * 0.32)),
        ease: EASE_GSAP.power3Out,
      });
    },
    [t, reduced],
  );

  const goTo = useCallback(
    (index: number) => {
      const current = t.get();
      glideTo(current + circular(index, current, count));
    },
    [t, glideTo, count],
  );

  const shift = (direction: 1 | -1) => glideTo(Math.round(t.get()) + direction);

  // Orbix : 21° entre deux cartes, pensé pour ~1 440 px. Ici l'angle place le
  // centre des voisines au bord de l'écran (rayon = 3,6 × hauteur de carte),
  // borné entre 12° et 21° : on les devine aussi sur mobile et tablette.
  useEffect(() => {
    const measure = () => {
      const card = stageRef.current?.querySelector<HTMLElement>(".arc-card");
      if (!card) return;
      const radius = card.offsetHeight * 3.6;
      const degrees = (Math.asin(Math.min(1, (window.innerWidth * 0.5) / radius)) * 180) / Math.PI;
      step.set(Math.min(21, Math.max(12, degrees)));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [step]);

  // Glisser : écouteurs fenêtre (le pointeur peut sortir de la scène).
  useEffect(() => {
    const onMove = (event: globalThis.PointerEvent) => {
      const state = drag.current;
      if (!state.down) return;
      const dx = event.clientX - state.startX;
      const dy = event.clientY - state.startY;

      // Doigt : un geste vertical rend la main au défilement de la page.
      if (state.touch && !state.horizontal) {
        if (Math.abs(dy) > 8 && Math.abs(dy) > Math.abs(dx)) {
          state.down = false;
          return;
        }
        if (Math.abs(dx) > 8 && Math.abs(dx) >= Math.abs(dy)) {
          state.horizontal = true;
          setDragging(true);
        } else {
          return;
        }
      }

      if (Math.abs(dx) > 6) movedRef.current = true;
      t.set(state.startT - dx / state.sensitivity);

      const now = performance.now();
      const elapsed = now - state.lastTime;
      if (elapsed > 4) {
        const instant = (state.lastX - event.clientX) / elapsed;
        state.velocity = state.velocity * 0.6 + instant * 0.4;
        state.lastX = event.clientX;
        state.lastTime = now;
      }
    };

    const onUp = () => {
      const state = drag.current;
      if (!state.down) return;
      state.down = false;
      setDragging(false);
      if (performance.now() - state.lastTime > 80) state.velocity = 0;
      const cardsPerSecond = (state.velocity * 1000) / state.sensitivity;
      const current = t.get();
      glideTo(
        Math.abs(cardsPerSecond) > 0.35 ? Math.round(current + Math.sign(cardsPerSecond) * 0.55) : Math.round(current),
      );
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [t, glideTo]);

  // Trackpad : un geste horizontal fait tourner l'éventail, un geste vertical
  // laisse défiler la page (verrouillage d'axe, comme Orbix).
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    let axis: "x" | "y" | null = null;
    let accumulatedX = 0;
    let accumulatedY = 0;
    let settleTimer = 0;
    let axisTimer = 0;

    const onWheel = (event: WheelEvent) => {
      const ax = Math.abs(event.deltaX);
      const ay = Math.abs(event.deltaY);
      window.clearTimeout(axisTimer);
      axisTimer = window.setTimeout(() => {
        axis = null;
        accumulatedX = 0;
        accumulatedY = 0;
      }, 160);
      if (!axis) {
        accumulatedX += ax;
        accumulatedY += ay;
        if (accumulatedX + accumulatedY < 4) return;
        axis = accumulatedX > accumulatedY * 1.5 ? "x" : "y";
      }
      if (axis !== "x") return;
      event.preventDefault();
      event.stopPropagation();
      glideRef.current?.stop();
      t.set(t.get() + event.deltaX / (sensitivity() * 1.5));
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(() => glideTo(Math.round(t.get())), 90);
    };

    stage.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      stage.removeEventListener("wheel", onWheel);
      window.clearTimeout(settleTimer);
      window.clearTimeout(axisTimer);
    };
  }, [t, glideTo, sensitivity]);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    glideRef.current?.stop();
    const state = drag.current;
    state.down = true;
    state.touch = event.pointerType !== "mouse";
    state.horizontal = false;
    state.startX = event.clientX;
    state.startY = event.clientY;
    state.startT = t.get();
    state.lastX = event.clientX;
    state.lastTime = performance.now();
    state.velocity = 0;
    state.sensitivity = sensitivity();
    movedRef.current = false;
    if (!state.touch) setDragging(true);
  };

  // Après un glisser, le clic qui suit n'ouvre pas de lien.
  const onClickCapture = (event: MouseEvent) => {
    if (!movedRef.current) return;
    event.preventDefault();
    event.stopPropagation();
    movedRef.current = false;
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      shift(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      shift(-1);
    }
  };

  const showBadge = badgeVisible && finePointer && !small && !reduced;

  return (
    <div
      role="region"
      aria-roledescription={labels.roledescription}
      aria-label={labels.region}
      onKeyDown={onKeyDown}
      className="relative"
    >
      <div className="arc-viewport">
        <div
          ref={stageRef}
          className="arc-stage"
          data-dragging={dragging ? "" : undefined}
          onPointerDown={onPointerDown}
          onClickCapture={onClickCapture}
          onPointerEnter={(event) => event.pointerType === "mouse" && setBadgeVisible(true)}
          onPointerLeave={() => setBadgeVisible(false)}
          onPointerMove={(event) => {
            if (event.pointerType !== "mouse") return;
            badgeX.set(event.clientX);
            badgeY.set(event.clientY);
          }}
        >
          {items.map((item, index) => {
            const status = statusOf(index, active, count);
            return (
              <ArcCard
                key={getKey(item)}
                index={index}
                count={count}
                t={t}
                step={step}
                status={status}
                className={cardClassName}
                onSelect={goTo}
              >
                {renderCard(item, { active: status === "active" })}
              </ArcCard>
            );
          })}
        </div>
      </div>

      {/* Au-dessus de la fenêtre de la scène, qui descend jusque sous les commandes. */}
      <div className="relative z-10 mt-6 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => shift(-1)}
          aria-label={labels.prev}
          className={CONTROL[tone]}
        >
          <span aria-hidden="true">←</span>
        </button>
        <p className={`min-w-[9rem] text-center text-sm font-medium tabular-nums ${tone === "light" ? "text-petrol/80" : "text-ivory/75"}`} aria-live="polite">
          {items[active] ? getPositionLabel(items[active]) : null}
        </p>
        <button
          type="button"
          onClick={() => shift(1)}
          aria-label={labels.next}
          className={CONTROL[tone]}
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>

      {/* Badge « Glisser » (Orbix : « DRAG ») — décoratif, souris uniquement. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-40 flex -translate-x-1/2 -translate-y-1/2 items-center gap-3"
        style={{ x: badgeSpringX, y: badgeSpringY }}
        initial={false}
        animate={{ opacity: showBadge ? 1 : 0, scale: showBadge ? (dragging ? 0.88 : 1) : 0.6 }}
        transition={{ duration: 0.2, ease: EASE_GSAP.power2Out }}
      >
        <span className="h-2.5 w-2.5 rounded-full bg-petrol-panel-4" />
        <span className="flex h-[5.5rem] w-[5.5rem] items-center justify-center rounded-full bg-petrol-panel-4 text-xs font-semibold uppercase tracking-[0.16em] text-ivory">
          {labels.drag}
        </span>
        <span className="h-2.5 w-2.5 rounded-full bg-petrol-panel-4" />
      </motion.div>
    </div>
  );
}
