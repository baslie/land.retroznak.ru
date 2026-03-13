import { useCallback, useMemo, useState } from "react";

import type { ContactFormPayload, ContactFormResponse } from "@/types/forms";

type ContactFormStatus = "idle" | "loading" | "success" | "error";

export function useContactForm(_endpoint?: string) {
  const [status, setStatus] = useState<ContactFormStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<ContactFormResponse | null>(null);

  const isSubmitting = status === "loading";
  const isSuccess = status === "success";
  const isError = status === "error";

  const submit = useCallback(async (_payload: ContactFormPayload) => {
    setStatus("loading");
    setError(null);

    // Stub: simulate form submission without actually sending
    await new Promise(resolve => setTimeout(resolve, 500));

    const result: ContactFormResponse = {
      success: true,
      message: "Спасибо! Мы свяжемся с вами в ближайшее время.",
    };

    setResponse(result);
    setStatus("success");

    return result;
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setError(null);
    setResponse(null);
  }, []);

  const helpers = useMemo(
    () => ({
      isSubmitting,
      isSuccess,
      isError,
    }),
    [isSubmitting, isSuccess, isError]
  );

  return {
    status,
    error,
    response,
    submit,
    reset,
    ...helpers,
  };
}
