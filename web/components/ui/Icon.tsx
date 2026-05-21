import {
  ICON_SIZE,
  ICON_STROKE,
  icons,
  type IconName,
  type IconSize,
} from "@/lib/icons";

type IconProps = {
  name: IconName;
  className?: string;
  size?: IconSize;
  strokeWidth?: number;
};

export function Icon({
  name,
  className = "text-gold",
  size = "md",
  strokeWidth = ICON_STROKE,
}: IconProps) {
  const LucideIcon = icons[name];

  return (
    <LucideIcon
      className={`${ICON_SIZE[size]} shrink-0 ${className}`}
      strokeWidth={strokeWidth}
      aria-hidden
    />
  );
}
