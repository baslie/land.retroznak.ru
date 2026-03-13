#!/usr/bin/env tsx
/**
 * Скрипт проверки типографии в проекте
 * Проверяет тексты на наличие типографических ошибок:
 * - Дефисы вместо тире
 * - Прямые кавычки вместо ёлочек
 * - Отсутствие неразрывных пробелов
 *
 * Использование: npm run check-typography
 */

import fs from "fs";
import path from "path";
import { needsTypograf } from "../src/lib/typograf";

interface Issue {
  file: string;
  line: number;
  text: string;
  reason: string;
}

const issues: Issue[] = [];

// Паттерны для поиска текстовых строк в коде
const TEXT_PATTERNS = [
  // Обычные строки
  /"([^"]*[а-яА-ЯёЁ][^"]*)"/g,
  /'([^']*[а-яА-ЯёЁ][^']*)'/g,
  // JSX текст
  />([\s\S]*?[а-яА-ЯёЁ][\s\S]*?)</g,
];

// Файлы и директории для игнорирования
const IGNORE_PATTERNS = [
  /node_modules/,
  /\.next/,
  /\.git/,
  /dist/,
  /build/,
  /coverage/,
  /check-typography\.ts/,
];

// Расширения файлов для проверки
const FILE_EXTENSIONS = [".ts", ".tsx", ".js", ".jsx"];

function shouldIgnore(filePath: string): boolean {
  return IGNORE_PATTERNS.some((pattern) => pattern.test(filePath));
}

function extractTexts(content: string): Array<{ text: string; line: number }> {
  const results: Array<{ text: string; line: number }> = [];
  const lines = content.split("\n");

  lines.forEach((line, index) => {
    TEXT_PATTERNS.forEach((pattern) => {
      const matches = [...line.matchAll(pattern)];
      matches.forEach((match) => {
        const text = match[1];
        if (text && text.trim().length > 0 && /[а-яА-ЯёЁ]/.test(text)) {
          results.push({ text: text.trim(), line: index + 1 });
        }
      });
    });
  });

  return results;
}

function checkFile(filePath: string) {
  if (shouldIgnore(filePath)) return;
  if (!FILE_EXTENSIONS.some((ext) => filePath.endsWith(ext))) return;

  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const texts = extractTexts(content);

    texts.forEach(({ text, line }) => {
      if (needsTypograf(text)) {
        let reason = "";
        if (/\s-\s/.test(text)) {
          reason = "Дефис вместо тире";
        } else if (/"/.test(text)) {
          reason = "Прямые кавычки вместо ёлочек";
        } else if (/\s[внокусзпу]\s/i.test(text)) {
          reason = "Возможно отсутствует неразрывный пробел";
        } else {
          reason = "Требуется типографирование";
        }

        issues.push({
          file: filePath,
          line,
          text,
          reason,
        });
      }
    });
  } catch (error) {
    console.error(`Ошибка при чтении файла ${filePath}:`, error);
  }
}

function walkDirectory(dir: string) {
  if (shouldIgnore(dir)) return;

  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    entries.forEach((entry) => {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        walkDirectory(fullPath);
      } else if (entry.isFile()) {
        checkFile(fullPath);
      }
    });
  } catch (error) {
    console.error(`Ошибка при чтении директории ${dir}:`, error);
  }
}

// Основная функция
function main() {
  console.log("🔍 Проверка типографии в проекте...\n");

  const projectRoot = process.cwd();
  const dirsToCheck = ["src", "app"];

  dirsToCheck.forEach((dir) => {
    const fullPath = path.join(projectRoot, dir);
    if (fs.existsSync(fullPath)) {
      walkDirectory(fullPath);
    }
  });

  if (issues.length === 0) {
    console.log("✅ Проблем с типографией не найдено!\n");
    process.exit(0);
  } else {
    console.log(`⚠️  Найдено проблем: ${issues.length}\n`);

    // Группируем по файлам
    const byFile: Record<string, Issue[]> = {};
    issues.forEach((issue) => {
      if (!byFile[issue.file]) {
        byFile[issue.file] = [];
      }
      byFile[issue.file].push(issue);
    });

    // Выводим результаты
    Object.entries(byFile).forEach(([file, fileIssues]) => {
      console.log(`📄 ${file}`);
      fileIssues.forEach((issue) => {
        console.log(`   Строка ${issue.line}: ${issue.reason}`);
        console.log(`   "${issue.text}"\n`);
      });
    });

    console.log("\n💡 Рекомендации:");
    console.log("1. Используйте функцию typograf() для всех текстов");
    console.log("2. Для content файлов используйте typografContent()");
    console.log("3. Для часто используемых фраз используйте commonTexts");
    console.log("4. Для React компонентов используйте хук useTypograf()\n");

    process.exit(1);
  }
}

main();
