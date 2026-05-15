import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)));

export function specPath(...segments: string[]): string {
  return join(ROOT, ...segments);
}

export function readSpecJson<T>(filename: string): T {
  const raw = readFileSync(specPath("spec", filename), "utf-8");
  return JSON.parse(raw) as T;
}

export function readCahierMarkdown(): string {
  return readFileSync(specPath("content", "cahier-des-charges.md"), "utf-8");
}

export function searchInMarkdown(query: string, maxResults = 8): Array<{ line: number; text: string }> {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const lines = readCahierMarkdown().split("\n");
  const results: Array<{ line: number; text: string }> = [];

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].toLowerCase().includes(q)) {
      const start = Math.max(0, i - 1);
      const end = Math.min(lines.length, i + 2);
      const snippet = lines.slice(start, end).join("\n").trim();
      results.push({ line: i + 1, text: snippet });
      if (results.length >= maxResults) break;
    }
  }

  return results;
}
