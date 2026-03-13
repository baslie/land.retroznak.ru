"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

/**
 * Standalone theme hook that reads from DOM and localStorage
 * Works without ThemeProvider — suitable for Astro islands
 */
export function useThemeFromDOM() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    // Initial read
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");

    // Watch for class changes on <html>
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains("dark");
      setTheme(isDark ? "dark" : "light");
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return { theme };
}
