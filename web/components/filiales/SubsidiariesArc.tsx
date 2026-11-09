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
import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
} from "react";

import { Link } from "@/i18n/navigation";
import { EASE_GSAP } from "@/lib/motion";
import { FINE_POINTER_QUERY, useMediaQuery, useReducedMotionSafe } from "@/lib/use-media-query";

import "@/styles/subsidiaries-arc.css";

export type ArcItem = {
  slug: string;
  name: string;
  sector: string;
  tagline: string;
  cover: string;
  logo?: string;
  /** Couleur de la marque (bandeau bas de carte). */
  brandColor: string;
  /** « Découvrir {name} » */
  ariaLabel: string;
  /** « {index} sur {total} : {name} » — annoncé au changement de carte. */
  positionLabel: string;
};

export type ArcLabels = {
  region: string;
  roledescription: string;
  prev: string;
  next: string;
  drag: string;
  discover: string;
};

type Status = "active" | "inview" | "hidden";

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
  item,
  index,
  count,
  t,
  step,
  status,
  discoverLabel,
  onSelect,
}: {
  item: ArcItem;
  index: number;
  count: number;
  t: MotionValue<number>;
  step: MotionValue<number>;
  status: Status;
  discoverLabel: string;
  onSelect: (index: number) => void;
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

  // Carte voisine : un clic la ramène au centre au lieu d'ouvrir la page.
  const onClickCapture = (event: MouseEvent) => {
    if (isActive) return;
    event.preventDefault();
    onSelect(index);
  };

  return (
    <motion.article
      className="arc-card bg-petrol-panel-4"
      style={{ x: "-50%", rotate, scale, opacity, zIndex, transformOrigin: "50% 360%" }}
      data-status={status}
      aria-hidden={isActive ? undefined : true}
      inert={status === "hidden"}
      onClickCapture={onClickCapture}
    >
      <Image
        src={item.cover}
        alt=""
        fill
        draggable={false}
        sizes="(max-width: 768px) 76vw, 440px"
        className="object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-petrol-panel-4/95 from-10% via-petrol-panel-4/75 via-45% to-transparent to-80%"
      />

      <div className="relative flex flex-col items-center gap-3 px-6 pt-7 text-center md:px-8 md:pt-9">
        {item.logo && (
          <span className="relative block h-14 w-36 md:h-16 md:w-44">
            <Image src={item.logo} alt="" fill draggable={false} sizes="176px" className="object-contain" />
          </span>
        )}
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">{item.sector}</p>
        <h3 className="title-section text-2xl text-ivory md:text-[1.75rem]">{item.name}</h3>
        <p className="line-clamp-2 max-w-[22rem] text-sm text-ivory/80">{item.tagline}</p>
      </div>

      <div
        className="absolute inset-x-0 bottom-0 flex h-[4.5rem] items-center justify-center"
        style={{ backgroundColor: item.brandColor }}
      >
        <Link
          href={`/filiales/${item.slug}`}
          aria-label={item.ariaLabel}
          tabIndex={isActive ? 0 : -1}
          draggable={false}
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ivory px-5 text-sm font-medium text-petrol-panel-4 shadow-[var(--shadow-soft)] transition-transform duration-fine hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ivory"
        >
          {discoverLabel}
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </motion.article>
  );
}

/**
 * Filiales en éventail (Orbix : slider « arc ») : une carte par filiale, à sa
 * couleur. On le fait tourner en glissant (souris, doigt), au trackpad
 * (geste horizontal), aux flèches du clavier ou avec les boutons. Une carte
 * voisine cliquée revient au centre ; seule la carte centrale est active, les
 * cartes hors champ sont `inert`.
 */
export function SubsidiariesArc({ items, labels }: { items: ArcItem[]; labels: ArcLabels }) {
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
      <div className="arc-viewport -mx-4 md:-mx-6 lg:-mx-8">
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
          {items.map((item, index) => (
            <ArcCard
              key={item.slug}
              item={item}
              index={index}
              count={count}
              t={t}
              step={step}
              status={statusOf(index, active, count)}
              discoverLabel={labels.discover}
              onSelect={goTo}
            />
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => shift(-1)}
          aria-label={labels.prev}
          className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-petrol/25 text-petrol transition-colors duration-fine hover:bg-petrol hover:text-ivory focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-petrol"
        >
          <span aria-hidden="true">←</span>
        </button>
        <p className="min-w-[9rem] text-center text-sm font-medium tabular-nums text-petrol/80" aria-live="polite">
          {items[active]?.positionLabel}
        </p>
        <button
          type="button"
          onClick={() => shift(1)}
          aria-label={labels.next}
          className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-petrol/25 text-petrol transition-colors duration-fine hover:bg-petrol hover:text-ivory focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-petrol"
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
