import React, { useMemo } from "react";
import { typograf, needsTypograf, isDevMode } from "@/lib/typograf";
import { typografSafe } from "@/lib/sanitize";
import { cn } from "@/lib/utils";

export type TypographyElement = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";

export interface TypographyProps {
  /**
   * Text content to be processed with typograf
   */
  children: string;

  /**
   * HTML element type to render
   * @default "span"
   */
  as?: TypographyElement;

  /**
   * Whether the content contains HTML that should be sanitized
   * @default false
   */
  html?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Disable dev mode highlighting even if in development
   * @default false
   */
  noDevHighlight?: boolean;
}

/**
 * Typography component that automatically applies typograf processing
 * to Russian text and optionally highlights unprocessed text in dev mode.
 *
 * Features:
 * - Automatic typography processing (non-breaking spaces, proper quotes, dashes)
 * - Safe HTML rendering with DOMPurify (when html=true)
 * - Dev mode highlighting for text that needs processing (red border)
 * - TypeScript support with flexible element types
 *
 * @example
 * // Simple text
 * <Typography as="p">Текст с правильной типографикой</Typography>
 *
 * @example
 * // HTML content (safely sanitized)
 * <Typography as="p" html>
 *   {"Текст с <a href='#'>ссылкой</a>"}
 * </Typography>
 *
 * @example
 * // Custom styling
 * <Typography as="h1" className="text-4xl font-bold">
 *   Заголовок с типографом
 * </Typography>
 */
export function Typography({
  children,
  as: Element = "span",
  html = false,
  className,
  noDevHighlight = false,
}: TypographyProps) {
  const processedText = useMemo(() => {
    if (!children) return "";
    return html ? typografSafe(children) : typograf(children);
  }, [children, html]);

  const showDevHighlight = useMemo(() => {
    if (noDevHighlight) return false;
    if (!isDevMode()) return false;
    return needsTypograf(children);
  }, [children, noDevHighlight]);

  const devStyles = showDevHighlight
    ? {
        outline: "2px solid red",
        outlineOffset: "2px",
        position: "relative" as const,
      }
    : undefined;

  if (html) {
    return (
      <Element
        className={cn(className)}
        style={devStyles}
        dangerouslySetInnerHTML={{ __html: processedText }}
        title={
          showDevHighlight
            ? "⚠️ DEV: This text might need typograf processing"
            : undefined
        }
      />
    );
  }

  return (
    <Element
      className={cn(className)}
      style={devStyles}
      title={
        showDevHighlight
          ? "⚠️ DEV: This text might need typograf processing"
          : undefined
      }
    >
      {processedText}
    </Element>
  );
}
