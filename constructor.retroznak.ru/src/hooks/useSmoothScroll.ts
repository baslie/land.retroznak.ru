import { useCallback } from "react";
import { useLenis } from "@/components/providers/SmoothScrollProvider";

export interface ScrollToOptions {
  offset?: number;
  lerp?: number;
  duration?: number;
  easing?: (t: number) => number;
  immediate?: boolean;
  lock?: boolean;
  force?: boolean;
  onComplete?: () => void;
}

/**
 * Hook for programmatic smooth scrolling using Lenis
 *
 * @example
 * ```tsx
 * const { scrollTo, scrollToTop, scrollToElement } = useSmoothScroll();
 *
 * // Scroll to specific position
 * scrollTo(500, { duration: 1.5 });
 *
 * // Scroll to top
 * scrollToTop();
 *
 * // Scroll to element
 * scrollToElement("#hero", { offset: -100 });
 * ```
 */
export function useSmoothScroll() {
  const { lenis } = useLenis();

  /**
   * Scroll to a specific position, element, or keyword
   * @param target - Number (pixels), CSS selector, keyword ('top', 'bottom'), or HTMLElement
   * @param options - Scroll options
   */
  const scrollTo = useCallback(
    (target: number | string | HTMLElement, options?: ScrollToOptions) => {
      if (!lenis) {
        console.warn("Lenis is not initialized yet");
        return;
      }

      lenis.scrollTo(target, options);
    },
    [lenis]
  );

  /**
   * Scroll to the top of the page
   * @param options - Scroll options
   */
  const scrollToTop = useCallback(
    (options?: ScrollToOptions) => {
      scrollTo(0, options);
    },
    [scrollTo]
  );

  /**
   * Scroll to the bottom of the page
   * @param options - Scroll options
   */
  const scrollToBottom = useCallback(
    (options?: ScrollToOptions) => {
      scrollTo("bottom", options);
    },
    [scrollTo]
  );

  /**
   * Scroll to a specific element
   * @param selector - CSS selector or HTMLElement
   * @param options - Scroll options
   */
  const scrollToElement = useCallback(
    (selector: string | HTMLElement, options?: ScrollToOptions) => {
      if (!lenis) {
        console.warn("Lenis is not initialized yet");
        return;
      }

      const element = typeof selector === "string" ? document.querySelector(selector) : selector;

      if (!element) {
        console.warn(`Element not found: ${selector}`);
        return;
      }

      lenis.scrollTo(element as HTMLElement, options);
    },
    [lenis]
  );

  /**
   * Start smooth scrolling (resume if stopped)
   */
  const start = useCallback(() => {
    lenis?.start();
  }, [lenis]);

  /**
   * Stop smooth scrolling
   */
  const stop = useCallback(() => {
    lenis?.stop();
  }, [lenis]);

  /**
   * Get current scroll position
   */
  const getScroll = useCallback(() => {
    return lenis?.scroll ?? 0;
  }, [lenis]);

  /**
   * Get scroll limit (max scroll position)
   */
  const getLimit = useCallback(() => {
    return lenis?.limit ?? 0;
  }, [lenis]);

  /**
   * Get scroll progress (0-1)
   */
  const getProgress = useCallback(() => {
    return lenis?.progress ?? 0;
  }, [lenis]);

  return {
    lenis,
    scrollTo,
    scrollToTop,
    scrollToBottom,
    scrollToElement,
    start,
    stop,
    getScroll,
    getLimit,
    getProgress,
  };
}
