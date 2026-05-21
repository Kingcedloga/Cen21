import {
  AlertCircle,
  Armchair,
  ArrowUpRight,
  Award,
  Building2,
  Calendar,
  CalendarCheck,
  CalendarClock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Clock3,
  ExternalLink,
  Globe,
  Home,
  Mail,
  MapPin,
  Martini,
  Menu,
  Music2,
  Phone,
  Play,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  UtensilsCrossed,
  Wine,
  X,
  type LucideIcon,
} from "lucide-react";

import type { Sector, StatIconId } from "@/lib/types";

export type { LucideIcon };

/** Stroke fin — style premium Cen21 (cartes, fiches, chips). */
export const ICON_STROKE = 1.5 as const;

/** Stroke léger — grands blocs clairs (stats banner). */
export const ICON_STROKE_LIGHT = 1.25 as const;

export const ICON_SIZE = {
  xs: "h-3.5 w-3.5",
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
  xl: "h-7 w-7",
} as const;

export type IconSize = keyof typeof ICON_SIZE;

/** Icônes sémantiques — préférer via `<Icon name="…" />`. */
export const icons = {
  dining: UtensilsCrossed,
  cocktail: Martini,
  music: Music2,
  location: MapPin,
  booking: CalendarCheck,
  rating: Star,
  hours: Clock3,
  mail: Mail,
  phone: Phone,
  calendar: Calendar,
  calendarClock: CalendarClock,
  clock: Clock,
  externalLink: ExternalLink,
  home: Home,
  menu: Menu,
  close: X,
  play: Play,
  arrowUpRight: ArrowUpRight,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof icons;

/** Icônes par secteur filiale. */
export const sectorIcons: Record<Sector, LucideIcon> = {
  restaurant: UtensilsCrossed,
  bar: Wine,
  lounge: Armchair,
  nightclub: Sparkles,
  evenementiel: Building2,
};

/** Icônes bannière chiffres clés. */
export const statIcons: Record<StatIconId, LucideIcon> = {
  award: Award,
  users: Users,
  globe: Globe,
  trending: TrendingUp,
};

/** Icônes notifications toast. */
export const toastIcons = {
  success: CheckCircle2,
  error: AlertCircle,
  close: X,
} as const;

/** Ré-exports pour usages ponctuels (carrousels, lightbox, etc.). */
export {
  AlertCircle,
  Armchair,
  ArrowUpRight,
  Award,
  Building2,
  Calendar,
  CalendarCheck,
  CalendarClock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Clock3,
  ExternalLink,
  Globe,
  Home,
  Mail,
  MapPin,
  Martini,
  Menu,
  Music2,
  Phone,
  Play,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  UtensilsCrossed,
  Wine,
  X,
};
