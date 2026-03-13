"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

import type { Cta, MessengerLink, NavigationItem } from "@/types/content";
import { useSmoothScrollTo } from "@/hooks/useSmoothScrollTo";
import { typograf } from "@/lib/typograf";

import { CTAButton } from "./CTAButton";
import { ContactIcons } from "./ContactIcons";
import { Logo } from "./Logo";

export interface MobileNavDrawerProps {
  menuItems: NavigationItem[];
  cta: Cta;
  messengers: MessengerLink[];
}

export function MobileNavDrawer({ menuItems, cta, messengers }: MobileNavDrawerProps) {
  const [open, setOpen] = useState(false);
  const scrollTo = useSmoothScrollTo();

  const handleNavigationClick = (targetId: string) => {
    setOpen(false);
    setTimeout(() => {
      scrollTo(targetId);
    }, 300); // Delay to allow drawer to close smoothly
  };

  return (
    <div className="flex items-center">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-secondary text-foreground transition hover:border-primary"
        aria-label={typograf("Открыть меню")}
        aria-expanded={open}
      >
        <Menu className="h-5 w-5" aria-hidden />
      </button>
      {open ? (
        <div className="fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-border px-6 py-5">
            <Logo className="h-7 w-auto" variant="adaptive" />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition hover:border-primary"
              aria-label={typograf("Закрыть меню")}
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
          </div>
          <nav className="flex flex-1 flex-col gap-1 px-6 py-6 text-lg font-medium text-foreground">
            {menuItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className="cursor-pointer rounded-2xl px-4 py-3 text-left transition hover:bg-secondary"
                onClick={() => handleNavigationClick(item.targetId)}
              >
                {item.label}
              </button>
            ))}
          </nav>
          <div className="space-y-4 border-t border-border px-6 py-6">
            <CTAButton cta={cta} className="w-full justify-center !bg-foreground/10 !text-foreground !border-foreground/20 hover:!bg-foreground hover:!text-background dark:!bg-white/20 dark:!text-white dark:!border-white/30 dark:hover:!bg-white dark:hover:!text-gray-900" />
            <div className="space-y-3">
              <div className="flex justify-center">
                <ContactIcons items={messengers} orientation="horizontal" iconOnly />
              </div>
              <p className="text-center text-xs text-muted-foreground">
                {typograf("На связи в будни с 05:00 до 14:00 по Москве.")}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
