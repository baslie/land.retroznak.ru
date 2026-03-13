"use client";

import type { NavigationItem } from "@/types/content";
import { NavLink } from "./NavLink";
import { typograf } from "@/lib/typograf";

interface NavigationProps {
  menuItems: NavigationItem[];
}

export function Navigation({ menuItems }: NavigationProps) {
  return (
    <nav aria-label={typograf("Основная навигация")} className="hidden items-center gap-6 text-sm font-medium lg:flex">
      {menuItems.map((item) => (
        <NavLink
          key={item.id}
          targetId={item.targetId}
          className="text-white/90 dark:text-white/80 transition-colors duration-200 hover:text-white"
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
