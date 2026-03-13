"use client";

import { memo } from "react";

import { contactFormsContent } from "@/content/forms";

import { ContactForm } from "./ContactForm";

export interface QuestionFormProps {
  className?: string;
}

export const QuestionForm = memo(function QuestionForm({ className }: QuestionFormProps) {
  return <ContactForm definition={contactFormsContent.forms.question} className={className} />;
});
