import type { MessengerPlatform } from "./content";

export const CONTACT_REASONS = [
  "callback",
  "consultation",
  "question",
  "timeline",
  "order",
  "support",
] as const;

export type ContactReason = (typeof CONTACT_REASONS)[number];

export interface ProductOption {
  id: string;
  label: string;
  price: number;
  group: string;
}

export interface SelectedProductOptions {
  productId: string;
  productName: string;
  basePrice: number;
  selectedOptions: ProductOption[];
  totalPrice: number;
}

export interface ContactFormPayload {
  name: string;
  phone: string;
  address?: string;
  messenger?: MessengerPlatform;
  preferredTime?: string;
  contactReason: ContactReason;
  comment?: string;
  projectType?: string;
  consent: boolean;
  productOptions?: SelectedProductOptions;
}

export interface ContactFormResponse {
  success: boolean;
  message: string;
  error?: string;
  statusCode?: number;
}

export type ContactFormFieldType =
  | "text"
  | "tel"
  | "email"
  | "textarea"
  | "select"
  | "checkbox";

export interface ContactFormField {
  name: keyof ContactFormPayload;
  label: string;
  placeholder?: string;
  type: ContactFormFieldType;
  required?: boolean;
  options?: Array<{
    label: string;
    value: string;
  }>;
  helperText?: string;
  autoComplete?: string;
  inputMode?: "text" | "search" | "tel" | "email" | "url" | "numeric" | "decimal";
  rows?: number;
}

export interface ContactFormDefinition {
  id: string;
  title: string;
  description?: string;
  submitLabel: string;
  successMessage: string;
  fields: ContactFormField[];
  contactReason: ContactReason;
  aliasTargetIds?: string[];
}
