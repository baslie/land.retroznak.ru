"use client";

import { memo } from "react";

import { contactFormsContent } from "@/content/forms";

import { ContactForm } from "./ContactForm";

export interface CallbackFormProps {
  className?: string;
}

export const CallbackForm = memo(function CallbackForm({ className }: CallbackFormProps) {
  return <ContactForm definition={contactFormsContent.forms.callback} className={className} />;
});
