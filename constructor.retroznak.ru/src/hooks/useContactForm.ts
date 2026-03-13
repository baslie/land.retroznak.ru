import { useCallback, useMemo, useState } from "react";

import { submitContactForm } from "@/lib/mailer";
import type { ContactFormPayload, ContactFormResponse } from "@/types/forms";

type ContactFormStatus = "idle" | "loading" | "success" | "error";

export function useContactForm(endpoint?: string) {
  const [status, setStatus] = useState<ContactFormStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<ContactFormResponse | null>(null);

  const isSubmitting = status === "loading";
  const isSuccess = status === "success";
  const isError = status === "error";

  const submit = useCallback(
    async (payload: ContactFormPayload) => {
      setStatus("loading");
      setError(null);

      const result = await submitContactForm(payload, {
        endpoint,
      });

      setResponse(result);

      if (result.success) {
        setStatus("success");
      } else {
        setStatus("error");
        setError(result.error ?? "Не удалось отправить заявку.");
      }

      return result;
    },
    [endpoint]
  );

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
