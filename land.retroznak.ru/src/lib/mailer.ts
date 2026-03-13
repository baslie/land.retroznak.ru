import type { ContactFormPayload, ContactFormResponse } from "@/types/forms";

export interface SubmitContactFormOptions {
  endpoint?: string;
  headers?: HeadersInit;
}

const DEFAULT_ENDPOINT = "/api/forms/contact";

export async function submitContactForm(
  payload: ContactFormPayload,
  options: SubmitContactFormOptions = {}
): Promise<ContactFormResponse> {
  const endpoint = options.endpoint ?? DEFAULT_ENDPOINT;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return {
        success: false,
        message: "Не удалось отправить заявку",
        error: `Request failed with status ${response.status}`,
        statusCode: response.status,
      };
    }

    const data = (await response.json().catch(() => null)) as
      | Partial<ContactFormResponse>
      | null;

    return {
      success: data?.success ?? true,
      message: data?.message ?? "Спасибо! Мы свяжемся с вами в ближайшее время.",
      error: data?.error,
      statusCode: data?.statusCode ?? response.status,
    };
  } catch (error) {
    return {
      success: false,
      message: "Произошла ошибка при отправке. Попробуйте ещё раз позже.",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
