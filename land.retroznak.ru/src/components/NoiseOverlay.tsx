"use client";

import { useRef, useMemo } from "react";
import { useTheme } from "./providers/ThemeProvider";
import { useNoiseEffect } from "@/hooks/useNoiseEffect";

/**
 * NoiseOverlay component generates an animated white noise effect
 * that overlays the entire page. The noise adapts to the current theme
 * (light or dark) with different opacity levels.
 *
 * Based on the original implementation for Tilda, adapted for Next.js/React.
 */
export function NoiseOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  // Configuration based on theme
  const noiseConfig = useMemo(
    () => ({
      // Slightly lower opacity for dark theme for better readability
      opacity: theme === "light" ? 0.03 : 0.025,
      size: 1, // Original size of noise grain
      speed: 100, // Update speed in milliseconds
    }),
    [theme],
  );

  // Apply the noise effect to the canvas
  useNoiseEffect(canvasRef, noiseConfig);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[9999]"
      style={{ background: "transparent" }}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
