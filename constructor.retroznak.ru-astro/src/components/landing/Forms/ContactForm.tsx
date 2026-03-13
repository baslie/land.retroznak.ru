"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Loader2, CheckCircle2 } from "lucide-react";

import { useContactForm } from "@/hooks/useContactForm";
import type { ContactFormDefinition } from "@/types/forms";
import { contactFormSchema } from "@/validation/contactForm";
import { useProductOptions } from "@/contexts/ProductOptionsContext";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import { typograf } from "@/lib/typograf";
import { sendMetrikaGoal, getFormGoalName } from "@/lib/yandex-metrika";
import { sendVKPixelGoal } from "@/lib/vk-pixel";

type ContactFormValues = z.input<typeof contactFormSchema>;

type ContactFormSubmission = z.infer<typeof contactFormSchema>;

export interface ContactFormProps {
  definition: ContactFormDefinition;
  className?: string;
}

export function ContactForm({ definition, className }: ContactFormProps) {
  const { productOptions, setProductOptions } = useProductOptions();
  const [showSuccess, setShowSuccess] = useState(false);

  const defaultValues = useMemo<ContactFormValues>(
    () => ({
      name: "",
      phone: "",
      address: "",
      messenger: "",
      preferredTime: "",
      contactReason: definition.contactReason,
      comment: "",
      projectType: "",
      consent: false,
      productOptions: undefined,
    }),
    [definition.contactReason],
  );

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues,
    mode: "onSubmit",
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  const { submit, status, error: submitError } = useContactForm();

  const onSubmit = handleSubmit(async (values) => {
    const parsed: ContactFormSubmission = contactFormSchema.parse({
      ...values,
      contactReason: definition.contactReason,
      productOptions: productOptions ?? undefined,
    });

    const result = await submit(parsed);

    if (result.success) {
      // Параметры для аналитики
      const analyticsParams = {
        contactReason: definition.contactReason,
        hasComment: Boolean(parsed.comment),
        hasProductOptions: Boolean(parsed.productOptions),
        formId: definition.id,
      };

      // Внутренняя аналитика
      trackEvent({
        name: "contact_form_submitted",
        properties: analyticsParams,
      });

      // Яндекс.Метрика: общее событие для всех форм
      sendMetrikaGoal("form_submitted", analyticsParams);

      // Яндекс.Метрика: уникальное событие для конкретной формы
      const formGoalName = getFormGoalName(definition.contactReason);
      sendMetrikaGoal(formGoalName, analyticsParams);

      // VK Pixel: событие отправки формы
      sendVKPixelGoal("form_submitted");

      // Show success state
      setShowSuccess(true);

      // Reset form
      reset({ ...defaultValues, consent: false });

      // Clear selected product options
      setProductOptions(null);

      // Redirect to thank you page after a short delay
      setTimeout(() => {
        window.location.href = "/thank-you";
      }, 1500);
    }
  });

  const isError = status === "error";

  return (
    <article
      id={definition.id}
      className={cn(
        "relative space-y-4 rounded-3xl border border-border/70 bg-retro-charcoal/85 p-8 shadow-glow",
        className,
      )}
    >
      {definition.aliasTargetIds?.map((alias) => (
        <div key={alias} id={alias} aria-hidden className="sr-only" />
      ))}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground">{definition.title}</h3>
        {definition.description ? (
          <p className="text-xs text-muted-foreground leading-snug">{definition.description}</p>
        ) : null}
      </div>
      <form className="space-y-2" onSubmit={onSubmit} noValidate>
        <input
          type="hidden"
          value={definition.contactReason}
          {...register("contactReason")}
        />
        {definition.fields.map((field) => {
          const fieldError = errors[field.name]?.message;

          if (field.type === "checkbox") {
            // Специальная обработка чекбокса согласия с добавлением ссылок
            const isConsentCheckbox = field.name === "consent";

            return (
              <div key={field.name as string} className="space-y-2">
                <div className="flex items-start gap-3 rounded-2xl bg-secondary/50 p-3">
                  <Checkbox
                    id={`${definition.id}-${String(field.name)}`}
                    {...register(field.name as keyof ContactFormValues, {
                      required: field.required,
                    })}
                    aria-invalid={Boolean(fieldError) || undefined}
                    required={field.required}
                    disabled={isSubmitting}
                  />
                  <label
                    htmlFor={`${definition.id}-${String(field.name)}`}
                    className="text-sm text-foreground leading-relaxed"
                  >
                    {isConsentCheckbox ? (
                      <>
                        {typograf("Я подтверждаю ознакомление и даю")}{" "}
                        <a
                          href="/consent"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-brand-orange-600 hover:text-brand-orange-700 dark:text-brand-orange-500 dark:hover:text-brand-orange-400 underline underline-offset-2 transition-colors"
                        >
                          {typograf("Согласие")}
                        </a>{" "}
                        {typograf("на обработку моих персональных данных в порядке и на условиях, указанных в")}{" "}
                        <a
                          href="/privacy"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-brand-orange-600 hover:text-brand-orange-700 dark:text-brand-orange-500 dark:hover:text-brand-orange-400 underline underline-offset-2 transition-colors"
                        >
                          {typograf("Политике обработки персональных данных")}
                        </a>
                      </>
                    ) : (
                      field.label
                    )}
                  </label>
                </div>
                {fieldError ? (
                  <p className="text-xs text-rose-500 dark:text-rose-300">{String(fieldError)}</p>
                ) : null}
              </div>
            );
          }

          if (field.type === "textarea") {
            return (
              <div key={field.name as string} className="space-y-2">
                <label
                  htmlFor={`${definition.id}-${String(field.name)}`}
                  className="text-sm font-medium text-foreground"
                >
                  {field.label}
                </label>
                <Textarea
                  id={`${definition.id}-${String(field.name)}`}
                  placeholder={field.placeholder}
                  rows={field.rows ?? 4}
                  {...register(field.name as keyof ContactFormValues, {
                    required: field.required,
                  })}
                  aria-invalid={Boolean(fieldError) || undefined}
                  required={field.required}
                  disabled={isSubmitting}
                />
                {field.helperText ? (
                  <p className="text-xs text-muted-foreground/80">{field.helperText}</p>
                ) : null}
                {fieldError ? (
                  <p className="text-xs text-rose-500 dark:text-rose-300">{String(fieldError)}</p>
                ) : null}
              </div>
            );
          }

          if (field.type === "select") {
            return (
              <div key={field.name as string} className="space-y-2">
                <label
                  htmlFor={`${definition.id}-${String(field.name)}`}
                  className="text-sm font-medium text-foreground"
                >
                  {field.label}
                </label>
                <Select
                  id={`${definition.id}-${String(field.name)}`}
                  defaultValue=""
                  {...register(field.name as keyof ContactFormValues, {
                    required: field.required,
                  })}
                  aria-invalid={Boolean(fieldError) || undefined}
                  required={field.required}
                  disabled={isSubmitting}
                >
                  <option value="" disabled>
                    {field.placeholder ?? "Выберите вариант"}
                  </option>
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
                {field.helperText ? (
                  <p className="text-xs text-muted-foreground/80">{field.helperText}</p>
                ) : null}
                {fieldError ? (
                  <p className="text-xs text-rose-500 dark:text-rose-300">{String(fieldError)}</p>
                ) : null}
              </div>
            );
          }

          return (
            <div key={field.name as string} className="space-y-2">
              <label
                htmlFor={`${definition.id}-${String(field.name)}`}
                className="text-sm font-medium text-foreground"
              >
                {field.label}
              </label>
              <Input
                id={`${definition.id}-${String(field.name)}`}
                type={field.type === "tel" ? "tel" : field.type === "email" ? "email" : "text"}
                placeholder={field.placeholder}
                autoComplete={field.autoComplete}
                inputMode={field.inputMode}
                {...register(field.name as keyof ContactFormValues, {
                  required: field.required,
                })}
                aria-invalid={Boolean(fieldError) || undefined}
                required={field.required}
                disabled={isSubmitting}
              />
              {field.helperText ? (
                <p className="text-xs text-muted-foreground/80">{field.helperText}</p>
              ) : null}
              {fieldError ? <p className="text-xs text-rose-500 dark:text-rose-300">{String(fieldError)}</p> : null}
            </div>
          );
        })}
        <Button
          type="submit"
          className="w-full justify-center gap-2 transition-all duration-300"
          disabled={isSubmitting || showSuccess}
        >
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {showSuccess && <CheckCircle2 className="h-4 w-4" />}
          {isSubmitting ? "Отправляем..." : showSuccess ? "Отправлено!" : definition.submitLabel}
        </Button>
        {isError || submitError ? (
          <div className="text-sm">
            <p className="rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-rose-700 dark:text-rose-200" role="alert">
              {submitError ?? typograf("Не удалось отправить заявку. Попробуйте ещё раз.")}
            </p>
          </div>
        ) : null}
      </form>

      {/* Success Overlay */}
      {showSuccess && (
        <div className="absolute inset-0 flex items-center justify-center rounded-3xl bg-background/95 backdrop-blur-sm animate-in fade-in duration-500">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="rounded-full bg-green-500/10 p-4">
              <CheckCircle2 className="h-12 w-12 text-green-500 animate-in zoom-in duration-300" />
            </div>
            <div className="space-y-2">
              <h4 className="text-lg font-semibold text-foreground">Заявка отправлена!</h4>
              <p className="text-sm text-muted-foreground">Перенаправляем на страницу благодарности...</p>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
