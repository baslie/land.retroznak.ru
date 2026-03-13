"use client";

import { memo } from "react";

import { contactFormsContent } from "@/content/forms";

import { ContactForm } from "./ContactForm";

export interface ConsultationFormProps {
  className?: string;
}

export const ConsultationForm = memo(function ConsultationForm({ className }: ConsultationFormProps) {
  return <ContactForm definition={contactFormsContent.forms.consultation} className={className} />;
});
