import { useEffect, useRef } from "react";

interface NoiseConfig {
  opacity: number;
  size: number;
  speed: number;
}

/**
 * Custom hook for generating animated white noise effect on a canvas element.
 * Based on the original Tilda implementation but adapted for React.
 *
 * @param canvasRef - React ref to the canvas element
 * @param config - Configuration object for noise parameters
 */
export function useNoiseEffect(canvasRef: React.RefObject<HTMLCanvasElement | null>, config: NoiseConfig) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { opacity, size, speed } = config;

    /**
     * Resize canvas to match window dimensions, accounting for noise size.
     */
    function resizeCanvas() {
      if (!canvas) return;

      canvas.width = window.innerWidth / size;
      canvas.height = window.innerHeight / size;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;

      // Reset scale after resizing
      if (ctx) {
        ctx.scale(1 / size, 1 / size);
      }
    }

    /**
     * Generate white noise pattern on the canvas.
     */
    function generateNoise() {
      if (!canvas || !ctx) return;

      const w = canvas.width;
      const h = canvas.height;
      const imageData = ctx.createImageData(w, h);
      const buffer32 = new Uint32Array(imageData.data.buffer);
      const len = buffer32.length;

      // Generate random grayscale pixels with alpha channel
      for (let i = 0; i < len; i++) {
        buffer32[i] = ((Math.random() * 255) | 0) << 24;
      }

      ctx.putImageData(imageData, 0, 0);
    }

    /**
     * Animation loop that updates noise at the specified speed.
     */
    function loop() {
      generateNoise();
      timeoutRef.current = setTimeout(loop, speed);
    }

    // Set canvas opacity
    canvas.style.opacity = opacity.toString();

    // Initial setup
    resizeCanvas();
    loop();

    // Handle window resize
    const handleResize = () => {
      resizeCanvas();
    };
    window.addEventListener("resize", handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener("resize", handleResize);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [canvasRef, config]);
}
