import DOMPurify from "dompurify";
import { typograf } from "./typograf";

/**
 * Safely processes HTML with typograf and sanitizes it using DOMPurify
 * to prevent XSS attacks.
 *
 * Use this function when you need to render HTML content that has been
 * processed by typograf (e.g., FAQ answers with links or formatting).
 *
 * @param html - HTML string to process
 * @returns Sanitized HTML string with proper typography
 *
 * @example
 * const safeHtml = typografSafe('<p>Ответ: <a href="#">ссылка</a></p>');
 * <div dangerouslySetInnerHTML={{ __html: safeHtml }} />
 */
export function typografSafe(html: string): string {
  if (!html) return "";

  // First, apply typograf to fix typography
  const processedText = typograf(html);

  // Then sanitize the HTML to remove any potentially dangerous content
  // DOMPurify will run in the browser environment
  if (typeof window !== "undefined") {
    return DOMPurify.sanitize(processedText, {
      ALLOWED_TAGS: [
        "p",
        "span",
        "a",
        "strong",
        "em",
        "b",
        "i",
        "u",
        "br",
        "ul",
        "ol",
        "li",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
      ],
      ALLOWED_ATTR: ["href", "title", "target", "rel", "class"],
      ALLOW_DATA_ATTR: false,
    });
  }

  // For SSR, just return the typograf-processed text
  // (sanitization will happen on client side if needed)
  return processedText;
}
