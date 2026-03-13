import { useCallback, useEffect, useState } from "react";

import type { JivoApiOpenParams } from "@/types/jivo";

/**
 * Custom React hook for interacting with Jivo Chat widget
 * @see https://www.jivochat.com/docs/widget/
 */
export function useJivoChat() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check if Jivo API is already loaded
    if (typeof window !== "undefined" && window.jivo_api) {
      setIsLoaded(true);
      return;
    }

    // Set up callback for when Jivo loads
    if (typeof window !== "undefined") {
      const originalCallback = window.jivo_onLoadCallback;

      window.jivo_onLoadCallback = function () {
        setIsLoaded(true);
        // Call original callback if it exists
        if (originalCallback) {
          originalCallback();
        }
      };
    }
  }, []);

  /**
   * Opens the Jivo chat widget
   * @param params - Optional parameters to control widget state
   * @returns Result object indicating success or failure
   */
  const openChat = useCallback((params?: JivoApiOpenParams) => {
    if (typeof window === "undefined") {
      console.warn("[useJivoChat] Window is not defined (SSR environment)");
      return { result: "fail" as const, reason: "Window is not defined" };
    }

    if (!window.jivo_api) {
      console.warn("[useJivoChat] Jivo API is not loaded yet");
      return { result: "fail" as const, reason: "Jivo API is not loaded" };
    }

    try {
      const result = window.jivo_api.open(params);

      if (result.result === "fail") {
        console.warn("[useJivoChat] Failed to open chat:", result.reason);
      }

      return result;
    } catch (error) {
      console.error("[useJivoChat] Error opening chat:", error);
      return {
        result: "fail" as const,
        reason: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }, []);

  /**
   * Closes/minimizes the Jivo chat widget
   */
  const closeChat = useCallback(() => {
    if (typeof window === "undefined" || !window.jivo_api) {
      console.warn("[useJivoChat] Jivo API is not available");
      return { result: "fail" as const, reason: "Jivo API is not available" };
    }

    try {
      return window.jivo_api.close();
    } catch (error) {
      console.error("[useJivoChat] Error closing chat:", error);
      return {
        result: "fail" as const,
        reason: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }, []);

  /**
   * Gets the current chat mode (online/offline)
   */
  const getChatMode = useCallback(() => {
    if (typeof window === "undefined" || !window.jivo_api) {
      return null;
    }

    try {
      return window.jivo_api.chatMode();
    } catch (error) {
      console.error("[useJivoChat] Error getting chat mode:", error);
      return null;
    }
  }, []);

  return {
    isLoaded,
    openChat,
    closeChat,
    getChatMode,
  };
}
