"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import type { Cta, MessengerLink, NavigationItem } from "@/types/content";
import { cn } from "@/lib/utils";
import { typograf } from "@/lib/typograf";

import { CTAButton } from "./CTAButton";
import { ContactIcons } from "./ContactIcons";

export interface FloatingMenuProps {
  menuItems: NavigationItem[];
  cta: Cta;
  messengers: MessengerLink[];
  className?: string;
}

export function FloatingMenu({ menuItems, cta, messengers, className }: FloatingMenuProps) {
  const [activeId, setActiveId] = useState<string>(menuItems[0]?.targetId ?? "");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );

    menuItems.forEach((item) => {
      const element = document.getElementById(item.targetId);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [menuItems]);

  const anchors = useMemo(
    () =>
      menuItems.map((item) => ({
        ...item,
        href: `#${item.targetId}`,
        isActive: activeId === item.targetId,
      })),
    [activeId, menuItems],
  );

  if (menuItems.length === 0) {
    return null;
  }

  return (
    <aside
      className={cn(
        "pointer-events-none fixed right-6 top-1/2 hidden w-64 -translate-y-1/2 flex-col gap-5 rounded-3xl border border-border/70 bg-retro-graphite/75 p-5 shadow-xl shadow-black/30 backdrop-blur-sm 2xl:flex",
        className,
      )}
      aria-label={typograf("Быстрая навигация по разделам")}
    >
      <nav className="pointer-events-auto flex flex-col gap-1 text-sm font-medium text-muted-foreground">
        {anchors.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={cn(
              "rounded-full px-4 py-2 transition-colors",
              item.isActive
                ? "bg-accent-platinum/10 text-retro-ivory"
                : "hover:bg-retro-smoke/60 hover:text-retro-ivory",
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="pointer-events-auto flex flex-col gap-3">
        <CTAButton cta={cta} size="sm" className="w-full justify-center" />
        <ContactIcons items={messengers} orientation="vertical" className="w-full" />
      </div>
    </aside>
  );
}
