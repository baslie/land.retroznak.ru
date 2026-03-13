import { useCallback } from "react";
import { useLenis } from "@/components/providers/SmoothScrollProvider";

/**
 * Hook for smooth scrolling to sections using Lenis
 * @returns Function to scroll to a section by ID
 */
export function useSmoothScrollTo() {
  const { lenis } = useLenis();

  const scrollTo = useCallback(
    (targetId: string, options?: { offset?: number; duration?: number }) => {
      if (!lenis) return;

      const target = document.getElementById(targetId);
      if (!target) {
        console.warn(`Element with id "${targetId}" not found`);
        return;
      }

      const offset = options?.offset ?? 5; // Default offset with slight overlap
      const duration = options?.duration ?? 1.2;

      lenis.scrollTo(target, {
        offset,
        duration,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    },
    [lenis]
  );

  return scrollTo;
}
