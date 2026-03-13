import { useCallback } from "react";

/**
 * Hook for smooth scrolling to sections using Lenis (from window.__lenis)
 * @returns Function to scroll to a section by ID
 */
export function useSmoothScrollTo() {
  const scrollTo = useCallback(
    (targetId: string, options?: { offset?: number; duration?: number }) => {
      const lenis = (window as any).__lenis;

      const target = document.getElementById(targetId);
      if (!target) {
        console.warn(`Element with id "${targetId}" not found`);
        return;
      }

      const offset = options?.offset ?? 5;
      const duration = options?.duration ?? 1.2;

      if (lenis) {
        lenis.scrollTo(target, {
          offset,
          duration,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
      } else {
        // Fallback to native smooth scroll
        target.scrollIntoView({ behavior: "smooth" });
      }
    },
    []
  );

  return scrollTo;
}
