"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { QuestionForm } from "./QuestionForm";
import { useProductOptions } from "@/contexts/ProductOptionsContext";

export function QuestionModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { setProductOptions } = useProductOptions();

  useEffect(() => {
    const checkAndOpenModal = () => {
      if (window.location.hash === "#question") {
        setIsOpen(true);
      }
    };

    // Check initial hash
    checkAndOpenModal();

    // Handle hash changes
    const handleHashChange = () => checkAndOpenModal();
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      // Clear hash when closing
      if (window.location.hash === "#question") {
        history.pushState("", document.title, window.location.pathname + window.location.search);
      }
      // Clear selected product options when closing modal
      setProductOptions(null);
    }
  }, [isOpen, setProductOptions]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={() => setIsOpen(false)}
      data-lenis-prevent
    >
      <div
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-card p-8 shadow-lg"
        data-lenis-prevent
      >
        <button
          onClick={() => setIsOpen(false)}
          className="absolute right-4 top-4 z-10 rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          aria-label="Закрыть"
        >
          <X className="h-5 w-5" />
        </button>
        <div onClick={(e) => e.stopPropagation()}>
          <QuestionForm className="!border-0 !bg-transparent !p-0 !shadow-none" />
        </div>
      </div>
    </div>
  );
}
