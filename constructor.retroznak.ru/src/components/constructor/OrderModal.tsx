"use client";

import { useState } from "react";
import { X, Loader2, CheckCircle } from "lucide-react";
import { useConstructor } from "@/contexts/ConstructorContext";
import { signTypesConfig, materialNames } from "@/content/constructor-config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTypograf } from "@/hooks/useTypograf";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OrderModal({ isOpen, onClose }: OrderModalProps) {
  const { state, totalPrice } = useConstructor();
  const [formState, setFormState] = useState({
    name: "",
    phone: "",
    email: "",
    comment: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const typografTitle = useTypograf("Оформление заказа");
  const typografSuccess = useTypograf("Заявка отправлена!");
  const typografSuccessDesc = useTypograf(
    "Мы свяжемся с вами в ближайшее время для уточнения деталей заказа."
  );

  const signConfig = signTypesConfig[state.signType];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const orderData = {
        // Контактные данные
        name: formState.name,
        phone: formState.phone,
        email: formState.email,
        comment: formState.comment,
        // Параметры заказа
        signType: signConfig.name,
        signSize: signConfig.size,
        street: state.street,
        houseNumber: state.houseNumber,
        material: materialNames[state.material],
        roofColor: `RAL ${state.roofColor}`,
        plateColor: `RAL ${state.plateColor}`,
        hasRelief: state.hasRelief,
        hasBacklight: state.hasBacklight,
        hasPhotoRelay: state.hasPhotoRelay,
        totalPrice,
      };

      const response = await fetch("/api/forms/constructor-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error("Ошибка отправки формы");
      }

      setIsSuccess(true);
      // Редирект на страницу благодарности
      window.location.href = "/thank-you";
    } catch {
      setError("Произошла ошибка. Попробуйте ещё раз или позвоните нам.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
      data-lenis-prevent
    >
      <div
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-card p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
        data-lenis-prevent
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          aria-label="Закрыть"
        >
          <X className="h-5 w-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-8 space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <h3 className="text-xl font-semibold">{typografSuccess}</h3>
            <p className="text-muted-foreground">{typografSuccessDesc}</p>
            <Button onClick={onClose} className="mt-4">
              Закрыть
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">{typografTitle}</h3>
              <p className="text-sm text-muted-foreground">
                {signConfig.name} ({signConfig.size}) — {totalPrice.toLocaleString("ru-RU")} ₽
              </p>
              {state.street && (
                <p className="text-sm text-muted-foreground">
                  {state.street}, д. {state.houseNumber}
                </p>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="order-name" className="block text-sm font-medium mb-1">
                  Ваше имя *
                </label>
                <Input
                  id="order-name"
                  type="text"
                  required
                  value={formState.name}
                  onChange={(e) => setFormState((s) => ({ ...s, name: e.target.value }))}
                  placeholder="Иван Иванов"
                  className="rounded-xl"
                />
              </div>

              <div>
                <label htmlFor="order-phone" className="block text-sm font-medium mb-1">
                  Телефон *
                </label>
                <Input
                  id="order-phone"
                  type="tel"
                  required
                  value={formState.phone}
                  onChange={(e) => setFormState((s) => ({ ...s, phone: e.target.value }))}
                  placeholder="+7 (999) 123-45-67"
                  className="rounded-xl"
                />
              </div>

              <div>
                <label htmlFor="order-email" className="block text-sm font-medium mb-1">
                  Email
                </label>
                <Input
                  id="order-email"
                  type="email"
                  value={formState.email}
                  onChange={(e) => setFormState((s) => ({ ...s, email: e.target.value }))}
                  placeholder="your@email.com"
                  className="rounded-xl"
                />
              </div>

              <div>
                <label htmlFor="order-comment" className="block text-sm font-medium mb-1">
                  Комментарий
                </label>
                <Textarea
                  id="order-comment"
                  value={formState.comment}
                  onChange={(e) => setFormState((s) => ({ ...s, comment: e.target.value }))}
                  placeholder="Дополнительные пожелания..."
                  rows={3}
                  className="rounded-xl resize-none"
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-brand-orange-500 hover:bg-brand-orange-600"
            >
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Отправка...
                </span>
              ) : (
                "Отправить заявку"
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Нажимая кнопку, вы соглашаетесь с{" "}
              <a href="/privacy" target="_blank" className="underline">
                политикой конфиденциальности
              </a>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
