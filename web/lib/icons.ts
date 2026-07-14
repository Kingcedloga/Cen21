import {
  WarningCircle as AlertCircle,
  Armchair,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Medal as Award,
  Buildings as Building2,
  Calendar,
  CalendarCheck,
  CalendarDots as CalendarClock,
  Check,
  CheckCircle as CheckCircle2,
  CaretLeft as ChevronLeft,
  CaretRight as ChevronRight,
  CaretUp as ChevronUp,
  CaretDown as ChevronDown,
  ChatCircle,
  Clock,
  Clock as Clock3,
  ArrowSquareOut as ExternalLink,
  Globe,
  House as Home,
  EnvelopeSimple as Mail,
  MapPin,
  Martini,
  Lightning,
  List as Menu,
  MusicNote as Music2,
  Phone,
  Play,
  ShoppingCart,
  Sparkle as Sparkles,
  Star,
  TrendUp as TrendingUp,
  User,
  Users,
  ForkKnife as UtensilsCrossed,
  Wine,
  X,
  Ticket,
} from "@phosphor-icons/react/ssr";

import type { Icon as LucideIcon, IconWeight } from "@phosphor-icons/react";

import type { Sector, StatIconId } from "@/lib/types";

export type { LucideIcon, IconWeight };

/** Poids fin — style premium Cen21 (cartes, fiches, chips). */
export const ICON_STROKE = "light" as const satisfies IconWeight;

/** Poids léger — grands blocs clairs (stats banner). */
export const ICON_STROKE_LIGHT = "thin" as const satisfies IconWeight;

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
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Award,
  Building2,
  Calendar,
  CalendarCheck,
  CalendarClock,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  ChatCircle,
  Clock,
  Clock3,
  ExternalLink,
  Globe,
  Home,
  Mail,
  MapPin,
  Lightning,
  Martini,
  Menu,
  Music2,
  Phone,
  Play,
  ShoppingCart,
  Sparkles,
  Star,
  TrendingUp,
  User,
  Users,
  UtensilsCrossed,
  Wine,
  X,
  Ticket,
};
