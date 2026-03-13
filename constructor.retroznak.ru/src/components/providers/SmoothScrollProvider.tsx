"use client";

import Lenis from "lenis";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";

interface SmoothScrollContextType {
  lenis: Lenis | null;
}

const SmoothScrollContext = createContext<SmoothScrollContextType | undefined>(undefined);

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    // Initialize Lenis with optimized settings
    const lenisInstance = new Lenis({
      duration: 1, // Animation duration (reduced for better responsiveness)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Smooth easing function
      orientation: "vertical", // Vertical scrolling
      gestureOrientation: "vertical", // Vertical gestures
      smoothWheel: true, // Enable smooth wheel scrolling
      wheelMultiplier: 1, // Mouse wheel multiplier
      touchMultiplier: 1.5, // Touch multiplier
      infinite: false, // Disable infinite scroll
      autoResize: true, // Auto-resize on window changes

      // Prevent smooth scroll on specific elements
      prevent: (node) => {
        // Prevent on elements with data-lenis-prevent attribute
        if (node.hasAttribute("data-lenis-prevent")) return true;

        // Prevent on modals and popups
        const preventClasses = [
          "modal",
          "popup",
          "drawer",
          "dialog",
          "dropdown-menu",
        ];

        return preventClasses.some((className) =>
          node.classList.contains(className) || node.closest(`.${className}`)
        );
      },
    });

    // Auto-stop scroll when modals open (body overflow is hidden)
    const bodyObserver = new MutationObserver(() => {
      const isBodyOverflowHidden = document.body.style.overflow === "hidden";
      if (isBodyOverflowHidden) {
        lenisInstance.stop();
      } else {
        lenisInstance.start();
      }
    });

    bodyObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ["style"],
    });

    setLenis(lenisInstance);

    // Custom RAF loop for better performance
    function raf(time: number) {
      lenisInstance.raf(time);
      rafIdRef.current = requestAnimationFrame(raf);
    }

    rafIdRef.current = requestAnimationFrame(raf);

    // Handle resize events
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        lenisInstance.resize();
      }, 100);
    };

    window.addEventListener("resize", handleResize);

    // Optional: Log scroll events for debugging
    // lenisInstance.on("scroll", (e) => {
    //   console.log("Scroll:", e);
    // });

    // Cleanup
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      window.removeEventListener("resize", handleResize);
      bodyObserver.disconnect();
      lenisInstance.destroy();
    };
  }, []);

  return (
    <SmoothScrollContext.Provider value={{ lenis }}>
      {children}
    </SmoothScrollContext.Provider>
  );
}

/**
 * Hook to access the Lenis instance
 * @example
 * const { lenis } = useLenis();
 * lenis?.scrollTo(0, { duration: 2 });
 */
export function useLenis() {
  const context = useContext(SmoothScrollContext);
  if (context === undefined) {
    throw new Error("useLenis must be used within a SmoothScrollProvider");
  }
  return context;
}
