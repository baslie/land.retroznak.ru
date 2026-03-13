"use client";

import { useCallback, useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { typograf } from "@/lib/typograf";

type Theme = "light" | "dark";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null;
    if (stored === "dark") {
      setTheme("dark");
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const newTheme: Theme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  }, [theme]);

  return (
    <div className="relative inline-flex h-10 w-10">
      <div
        className="absolute inset-[-2px] rounded-full animate-[spin-gradient_2.5s_linear_infinite]"
        style={{
          background: 'conic-gradient(from 0deg, rgb(var(--brand-orange-600)), rgb(var(--brand-orange-500)), rgb(var(--brand-orange-400)), rgb(var(--brand-orange-300)), rgb(var(--brand-orange-600)))',
          filter: 'blur(2px)',
          opacity: 0.7
        }}
      />
      <button
        type="button"
        onClick={toggleTheme}
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-secondary text-foreground transition-all duration-200 hover:border-primary hover:scale-110 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background cursor-pointer z-10"
        aria-label={theme === "light" ? typograf("Переключить на тёмную тему") : typograf("Переключить на светлую тему")}
      >
        {theme === "light" ? (
          <Moon className="h-5 w-5" aria-hidden />
        ) : (
          <Sun className="h-5 w-5" aria-hidden />
        )}
      </button>
    </div>
  );
}
