import { promises as fs } from "node:fs";
import path from "node:path";

const RULES = [
  { id: "unix-full-path", pattern: /\/Users\/[^\s"'<>]+|\/work\/[^\s"'<>]+|\/home\/[^\s"'<>]+/g },
  { id: "windows-full-path", pattern: /[A-Za-z]:\\[^\s"'<>]+/g },
  { id: "rollout-filename", pattern: /rollout-\d{4}-\d{2}-\d{2}T[^\s"'<>]+\.jsonl/g },
  { id: "raw-log-marker", pattern: /"type"\s*:\s*"session_meta"|"payload"\s*:\s*\{/g },
  { id: "likely-secret", pattern: /(sk-[A-Za-z0-9_-]{20,}|gh[opsu]_[A-Za-z0-9_]{20,})/g },
];

export async function redactCheck(targetPath) {
  if (!targetPath) throw new Error("Missing path for redact-check");
  const root = path.resolve(targetPath);
  const files = await collectFiles(root);
  const stat = await fs.stat(root);
  const relativeRoot = stat.isFile() ? path.dirname(root) : root;
  const findings = [];
  for (const file of files) {
    const text = await readText(file);
    if (text === null) continue;
    for (const rule of RULES) {
      for (const match of text.matchAll(rule.pattern)) {
        findings.push({
          rule: rule.id,
          file: path.relative(relativeRoot, file) || path.basename(file),
          line: lineForIndex(text, match.index || 0),
          sample: redactSample(match[0]),
        });
      }
    }
  }
  return {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    status: findings.length ? "fail" : "pass",
    filesScanned: files.length,
    findings,
  };
}

async function collectFiles(targetPath) {
  const stat = await fs.stat(targetPath);
  if (stat.isFile()) return [targetPath];
  const files = [];
  async function walk(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name === "node_modules" || entry.name === ".git") continue;
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) await walk(fullPath);
      else if (entry.isFile()) files.push(fullPath);
    }
  }
  await walk(targetPath);
  return files.sort();
}

async function readText(file) {
  const buffer = await fs.readFile(file);
  if (buffer.includes(0)) return null;
  return buffer.toString("utf8");
}

function lineForIndex(text, index) {
  return text.slice(0, index).split(/\r?\n/).length;
}

function redactSample(value) {
  if (value.length <= 16) return value;
  return `${value.slice(0, 8)}...[redacted]`;
}
