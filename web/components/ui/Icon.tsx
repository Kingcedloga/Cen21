import {
  ICON_SIZE,
  ICON_STROKE,
  icons,
  type IconName,
  type IconSize,
  type IconWeight,
} from "@/lib/icons";

type IconProps = {
  name: IconName;
  className?: string;
  size?: IconSize;
  weight?: IconWeight;
};

export function Icon({
  name,
  className = "text-gold",
  size = "md",
  weight = ICON_STROKE,
}: IconProps) {
  const PhIcon = icons[name];

  return (
    <PhIcon
      className={`${ICON_SIZE[size]} shrink-0 ${className}`}
      weight={weight}
      aria-hidden
    />
  );
}
