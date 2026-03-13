import Link from "next/link";
import type { PropsWithChildren, ReactNode } from "react";

import type { Cta } from "@/types/content";
import { cn } from "@/lib/utils";

const variantClasses: Record<string, string> = {
  primary:
    "bg-brand-orange-500 text-white hover:bg-brand-orange-600 focus-visible:ring-brand-orange-400 shadow-lg shadow-brand-orange-500/25",
  secondary:
    "bg-white/20 text-white border border-white/30 hover:bg-white hover:!text-gray-900 focus-visible:ring-white/50",
  outline:
    "bg-transparent border-2 border-foreground text-foreground hover:bg-foreground hover:text-background dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-gray-900 focus-visible:ring-foreground dark:focus-visible:ring-white",
  ghost:
    "bg-transparent text-accent-platinum hover:text-retro-ivory hover:bg-retro-graphite/60 focus-visible:ring-accent-platinum",
};

const sizeClasses: Record<"sm" | "md" | "lg", string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm",
  lg: "px-7 py-3.5 text-base",
};

export interface CTAButtonProps extends PropsWithChildren {
  cta: Cta;
  className?: string;
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

export function CTAButton({ cta, className, size = "md", icon, onClick, children }: CTAButtonProps) {
  const { label, variant = "primary", href, targetId } = cta;
  const finalLabel = children ?? label;
  const destination = href ?? (targetId ? `#${targetId}` : "#");
  const isExternal = Boolean(href && /^https?:/i.test(href));
  const isAnchor = destination.startsWith("#");

  const content = (
    <span className="inline-flex items-center gap-2">
      {icon}
      <span>{finalLabel}</span>
    </span>
  );

  const baseClassName = cn(
    "inline-flex items-center justify-center rounded-full font-semibold tracking-tight transition focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-retro-charcoal cursor-pointer",
    variantClasses[variant] ?? variantClasses.primary,
    sizeClasses[size],
    className,
  );

  // If onClick handler is provided, render as button
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={baseClassName}>
        {content}
      </button>
    );
  }

  // Use regular <a> tag for external links
  if (isExternal) {
    return (
      <a
        href={destination}
        className={baseClassName}
        target="_blank"
        rel="noreferrer"
      >
        {content}
      </a>
    );
  }

  // Use regular <a> tag for anchor links (same page navigation)
  if (isAnchor) {
    return (
      <a href={destination} className={baseClassName}>
        {content}
      </a>
    );
  }

  // Use Next.js Link for internal page navigation
  return (
    <Link href={destination} className={baseClassName}>
      {content}
    </Link>
  );
}
