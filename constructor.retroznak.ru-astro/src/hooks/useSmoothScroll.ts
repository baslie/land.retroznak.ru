import { useCallback } from "react";

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

function getLenis() {
  return (window as any).__lenis ?? null;
}

export function useSmoothScroll() {
  const scrollTo = useCallback(
    (target: number | string | HTMLElement, options?: ScrollToOptions) => {
      const lenis = getLenis();
      if (!lenis) {
        console.warn("Lenis is not initialized yet");
        return;
      }
      lenis.scrollTo(target, options);
    },
    []
  );

  const scrollToTop = useCallback(
    (options?: ScrollToOptions) => {
      scrollTo(0, options);
    },
    [scrollTo]
  );

  const scrollToBottom = useCallback(
    (options?: ScrollToOptions) => {
      scrollTo("bottom", options);
    },
    [scrollTo]
  );

  const scrollToElement = useCallback(
    (selector: string | HTMLElement, options?: ScrollToOptions) => {
      const lenis = getLenis();
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
    []
  );

  const start = useCallback(() => {
    getLenis()?.start();
  }, []);

  const stop = useCallback(() => {
    getLenis()?.stop();
  }, []);

  const getScroll = useCallback(() => {
    return getLenis()?.scroll ?? 0;
  }, []);

  const getLimit = useCallback(() => {
    return getLenis()?.limit ?? 0;
  }, []);

  const getProgress = useCallback(() => {
    return getLenis()?.progress ?? 0;
  }, []);

  return {
    lenis: getLenis(),
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
