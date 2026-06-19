import type { ReactNode } from "react";

import { Link } from "@/i18n/navigation";
import {
  getSubsidiaryHref,
  isSubsidiaryExternalLink,
  type SubsidiaryLinkTarget,
} from "@/lib/subsidiary-links";

type Props = {
  subsidiary: SubsidiaryLinkTarget;
  className?: string;
  children?: ReactNode;
  "aria-label"?: string;
  prefetch?: boolean;
  onMouseEnter?: () => void;
  onFocus?: () => void;
};

export function SubsidiaryHrefLink({
  subsidiary,
  className,
  children,
  "aria-label": ariaLabel,
  prefetch = true,
  onMouseEnter,
  onFocus,
}: Props) {
  const href = getSubsidiaryHref(subsidiary);
  const external = isSubsidiaryExternalLink(subsidiary);

  if (external) {
    return (
      <a
        href={href}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
        onMouseEnter={onMouseEnter}
        onFocus={onFocus}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href}
      prefetch={prefetch}
      className={className}
      aria-label={ariaLabel}
      onMouseEnter={onMouseEnter}
      onFocus={onFocus}
    >
      {children}
    </Link>
  );
}
