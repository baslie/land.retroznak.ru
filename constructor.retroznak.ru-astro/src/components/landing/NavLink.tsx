"use client";

import { useSmoothScrollTo } from "@/hooks/useSmoothScrollTo";

interface NavLinkProps {
  targetId: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function NavLink({ targetId, children, className = "", onClick }: NavLinkProps) {
  const scrollTo = useSmoothScrollTo();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    scrollTo(targetId);
    onClick?.();
  };

  return (
    <button
      type="button"
      className={`cursor-pointer ${className}`}
      onClick={handleClick}
    >
      {children}
    </button>
  );
}
