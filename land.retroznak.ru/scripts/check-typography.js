#!/usr/bin/env node

/**
 * Typography checker script
 *
 * Scans .tsx files for Russian text that may not be processed with typograf.
 * Helps maintain consistent typography across the codebase.
 *
 * Usage: node scripts/check-typography.js
 * Or: npm run check-typography
 */

const fs = require("fs");
const path = require("path");
const { glob } = require("glob");

// Colors for console output
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  green: "\x1b[32m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
};

// Patterns to detect
const CYRILLIC_REGEX = /[а-яА-ЯёЁ]/;
const IMPORT_TYPOGRAF_REGEX =
  /import\s+.*(?:useTypograf|typograf|Typography).*from\s+["']@\/(lib\/typograf|hooks\/useTypograf|components\/ui\/Typography)["']/;

// Directories to scan
const SCAN_PATTERNS = [
  "app/**/*.tsx",
  "src/**/*.tsx",
  "components/**/*.tsx",
];

// Files to ignore
const IGNORE_PATTERNS = [
  "**/node_modules/**",
  "**/.next/**",
  "**/build/**",
  "**/dist/**",
];

/**
 * Check if file has typograf imports
 */
function hasTypografImport(content) {
  return IMPORT_TYPOGRAF_REGEX.test(content);
}

/**
 * Find Russian text in JSX that might need typography processing
 */
function findSuspiciousText(content, filePath) {
  const issues = [];
  const lines = content.split("\n");

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Skip comments
    if (trimmed.startsWith("//") || trimmed.startsWith("/*")) {
      return;
    }

    // Check for Russian text in JSX
    if (CYRILLIC_REGEX.test(line)) {
      // Skip if it's in an import statement
      if (trimmed.startsWith("import")) return;

      // Skip if it's a typograf call
      if (/(?:useTypograf|typograf|Typography)\s*\(/.test(line)) return;

      // Count words
      const words = trimmed.match(/[а-яА-ЯёЁ]+/g);
      if (words && words.length >= 3) {
        // Check for typography issues
        const hasHyphenWithSpaces = /\s-\s/.test(line);
        const hasStraightQuotes = /"[^"]*[а-яА-ЯёЁ][^"]*"/.test(line);

        if (hasHyphenWithSpaces || hasStraightQuotes) {
          issues.push({
            line: index + 1,
            text: trimmed.substring(0, 100),
            reason: hasHyphenWithSpaces
              ? "hyphen with spaces (should be dash)"
              : "straight quotes with Russian text",
          });
        }
      }
    }
  });

  return issues;
}

/**
 * Scan a single file
 */
function scanFile(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const hasImport = hasTypografImport(content);
  const issues = findSuspiciousText(content, filePath);

  return {
    filePath,
    hasImport,
    issues,
    hasCyrillic: CYRILLIC_REGEX.test(content),
  };
}

/**
 * Main function
 */
async function main() {
  console.log(`${colors.cyan}Typography Checker${colors.reset}\n`);
  console.log("Scanning TypeScript files for typography issues...\n");

  // Find all files to scan
  const files = await glob(SCAN_PATTERNS, {
    ignore: IGNORE_PATTERNS,
    absolute: true,
  });

  console.log(`Found ${files.length} files to scan.\n`);

  const results = {
    filesWithIssues: [],
    filesWithoutImport: [],
    totalFiles: files.length,
    scannedFiles: 0,
  };

  // Scan each file
  for (const file of files) {
    results.scannedFiles++;
    const result = scanFile(file);

    if (result.hasCyrillic && !result.hasImport) {
      results.filesWithoutImport.push(result.filePath);
    }

    if (result.issues.length > 0) {
      results.filesWithIssues.push({
        ...result,
      });
    }
  }

  // Print results
  if (results.filesWithoutImport.length > 0) {
    console.log(
      `${colors.yellow}⚠️  Files with Russian text but no typograf import:${colors.reset}\n`
    );
    results.filesWithoutImport.forEach((file) => {
      const relativePath = path.relative(process.cwd(), file);
      console.log(`  ${colors.gray}${relativePath}${colors.reset}`);
    });
    console.log();
  }

  if (results.filesWithIssues.length > 0) {
    console.log(
      `${colors.red}❌ Files with potential typography issues:${colors.reset}\n`
    );
    results.filesWithIssues.forEach((result) => {
      const relativePath = path.relative(process.cwd(), result.filePath);
      console.log(`  ${colors.cyan}${relativePath}${colors.reset}`);

      result.issues.forEach((issue) => {
        console.log(
          `    ${colors.gray}Line ${issue.line}: ${colors.reset}${issue.text}`
        );
        console.log(
          `    ${colors.yellow}→ ${issue.reason}${colors.reset}`
        );
      });
      console.log();
    });
  }

  // Summary
  console.log(`${colors.cyan}Summary:${colors.reset}`);
  console.log(`  Total files scanned: ${results.scannedFiles}`);
  console.log(
    `  Files without typograf import: ${results.filesWithoutImport.length}`
  );
  console.log(
    `  Files with typography issues: ${results.filesWithIssues.length}`
  );

  if (
    results.filesWithIssues.length === 0 &&
    results.filesWithoutImport.length === 0
  ) {
    console.log(
      `\n${colors.green}✓ No typography issues found!${colors.reset}`
    );
    process.exit(0);
  } else {
    console.log(
      `\n${colors.yellow}⚠️  Typography issues detected. Please review and fix.${colors.reset}`
    );
    process.exit(0); // Exit with 0 to not block commits, just warn
  }
}

main().catch((error) => {
  console.error(`${colors.red}Error:${colors.reset}`, error);
  process.exit(1);
});
