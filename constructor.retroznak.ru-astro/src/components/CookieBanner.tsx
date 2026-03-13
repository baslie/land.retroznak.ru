"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { typograf } from "@/lib/typograf";

const COOKIE_CONSENT_KEY = "cookie-consent-accepted";

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Проверяем, было ли уже дано согласие
    const hasConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!hasConsent) {
      // Показываем баннер после небольшой задержки для плавности
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "true");
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 sm:left-auto sm:right-4 sm:translate-x-0 z-50 w-full max-w-lg px-4 sm:px-0 animate-in slide-in-from-bottom duration-500">
      <div className="border border-border rounded-lg bg-background/95 backdrop-blur-sm shadow-2xl">
        <div className="p-4 sm:p-5">
          <div className="flex flex-col gap-4">
            <div className="flex-1 space-y-2 text-sm">
              <p className="text-foreground leading-relaxed">
                {typograf("Мы используем cookies для улучшения работы сайта. Продолжая использовать сайт, вы соглашаетесь с")}{" "}
                <a
                  href="/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-brand-orange-600 hover:text-brand-orange-700 dark:text-brand-orange-500 dark:hover:text-brand-orange-400 underline underline-offset-2 transition-colors"
                >
                  {typograf("Политикой конфиденциальности")}
                </a>
                .
              </p>
            </div>
            <div className="flex items-center">
              <Button
                onClick={handleAccept}
                size="default"
                className="bg-brand-orange-600 hover:bg-brand-orange-700 text-white shadow-lg w-full"
              >
                {typograf("Понятно")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
