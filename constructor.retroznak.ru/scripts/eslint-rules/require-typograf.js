/**
 * ESLint rule: require-typograf
 *
 * Detects Russian text in JSX that may not be processed with typograf.
 * Checks if the component imports and uses useTypograf or typograf functions.
 *
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Ensure Russian text in JSX is processed with typograf for proper typography",
      category: "Best Practices",
      recommended: false,
    },
    messages: {
      missingTypograf:
        "Russian text detected but typograf/useTypograf not imported. Add proper typography processing.",
      suspiciousText:
        "This Russian text might need typograf processing. Verify typography is applied.",
    },
    schema: [
      {
        type: "object",
        properties: {
          minWordCount: {
            type: "number",
            default: 3,
            description: "Minimum number of words to trigger warning",
          },
          ignoredComponents: {
            type: "array",
            items: { type: "string" },
            default: [],
            description: "Component names to ignore",
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const options = context.options[0] || {};
    const minWordCount = options.minWordCount || 3;
    const ignoredComponents = new Set(options.ignoredComponents || []);

    let hasTypografImport = false;
    let hasUseTypografImport = false;
    let hasTypographyImport = false;

    /**
     * Checks if text contains Cyrillic characters (Russian text)
     */
    function hasCyrillic(text) {
      return /[а-яА-ЯёЁ]/.test(text);
    }

    /**
     * Counts words in text
     */
    function wordCount(text) {
      return text.trim().split(/\s+/).length;
    }

    /**
     * Checks if text likely needs typograf processing
     */
    function needsTypograf(text) {
      if (!hasCyrillic(text)) return false;
      if (wordCount(text) < minWordCount) return false;

      // Check for typography issues
      const hasHyphenWithSpaces = /\s-\s/.test(text);
      const hasStraightQuotes = /"/.test(text);
      const hasCommonPreposition = /\s[внокусзпу]\s/i.test(text);

      return hasHyphenWithSpaces || hasStraightQuotes || hasCommonPreposition;
    }

    /**
     * Checks if we're inside an ignored component
     */
    function isInIgnoredComponent(node) {
      let current = node;
      while (current) {
        if (
          current.type === "JSXElement" &&
          current.openingElement &&
          current.openingElement.name
        ) {
          const componentName =
            current.openingElement.name.type === "JSXIdentifier"
              ? current.openingElement.name.name
              : null;
          if (componentName && ignoredComponents.has(componentName)) {
            return true;
          }
        }
        current = current.parent;
      }
      return false;
    }

    return {
      // Track imports
      ImportDeclaration(node) {
        if (node.source.value === "@/lib/typograf") {
          node.specifiers.forEach((spec) => {
            if (spec.imported) {
              if (spec.imported.name === "typograf") {
                hasTypografImport = true;
              }
            }
          });
        }

        if (node.source.value === "@/hooks/useTypograf") {
          node.specifiers.forEach((spec) => {
            if (spec.imported && spec.imported.name === "useTypograf") {
              hasUseTypografImport = true;
            }
          });
        }

        if (node.source.value === "@/components/ui/Typography") {
          node.specifiers.forEach((spec) => {
            if (spec.imported && spec.imported.name === "Typography") {
              hasTypographyImport = true;
            }
          });
        }
      },

      // Check JSX text content
      "JSXText"(node) {
        const text = node.value.trim();

        // Ignore empty or whitespace-only text
        if (!text) return;

        // Ignore if in an ignored component
        if (isInIgnoredComponent(node)) return;

        // Check if contains Russian text with potential issues
        if (!hasCyrillic(text)) return;

        // If text is short, don't warn
        if (wordCount(text) < minWordCount) return;

        // If no typograf imports at all, warn
        if (
          !hasTypografImport &&
          !hasUseTypografImport &&
          !hasTypographyImport
        ) {
          context.report({
            node,
            messageId: "missingTypograf",
          });
          return;
        }

        // If text has obvious typography issues, suggest verification
        if (needsTypograf(text)) {
          context.report({
            node,
            messageId: "suspiciousText",
          });
        }
      },

      // Check string literals in JSX expressions
      "JSXExpressionContainer > Literal"(node) {
        if (typeof node.value !== "string") return;

        const text = node.value.trim();
        if (!text) return;

        // Ignore if in an ignored component
        if (isInIgnoredComponent(node)) return;

        if (!hasCyrillic(text)) return;
        if (wordCount(text) < minWordCount) return;

        if (
          !hasTypografImport &&
          !hasUseTypografImport &&
          !hasTypographyImport
        ) {
          context.report({
            node,
            messageId: "missingTypograf",
          });
          return;
        }

        if (needsTypograf(text)) {
          context.report({
            node,
            messageId: "suspiciousText",
          });
        }
      },

      // Check template literals in JSX
      "JSXExpressionContainer > TemplateLiteral"(node) {
        // Only check simple template literals without expressions
        if (node.expressions.length === 0 && node.quasis.length === 1) {
          const text = node.quasis[0].value.raw.trim();
          if (!text) return;

          if (isInIgnoredComponent(node)) return;

          if (!hasCyrillic(text)) return;
          if (wordCount(text) < minWordCount) return;

          if (
            !hasTypografImport &&
            !hasUseTypografImport &&
            !hasTypographyImport
          ) {
            context.report({
              node,
              messageId: "missingTypograf",
            });
            return;
          }

          if (needsTypograf(text)) {
            context.report({
              node,
              messageId: "suspiciousText",
            });
          }
        }
      },
    };
  },
};
