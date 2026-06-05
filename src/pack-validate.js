import { promises as fs } from "node:fs";
import path from "node:path";
import { redactCheck } from "./redact-check.js";

const REQUIRED_FILES = [
  "README.md",
  "brief.md",
  "brief.html",
  "manifest.json",
  "scan-report.json",
  "weekly-report.md",
  "api-payload.dry-run.json",
  "doctor.json",
  "readiness.json",
  "api-plan.json",
  "timeline.json",
  "scorecard.json",
  "form-draft.json",
  "evidence-index.json",
  "evidence-index.html",
];

export async function validateSubmissionPack(packDir, options = {}) {
  if (!packDir) throw new Error("Missing submission pack directory");
  const root = path.resolve(packDir);
  const checks = [];
  const files = await safeReaddir(root);
  const missing = REQUIRED_FILES.filter((file) => !files.includes(file));
  checks.push(check("requiredFiles", missing.length === 0, `Missing files: ${missing.join(", ") || "none"}`));

  const readiness = await readOptionalJson(root, "readiness.json");
  const scorecard = await readOptionalJson(root, "scorecard.json");
  const evidenceIndex = await readOptionalJson(root, "evidence-index.json");
  const redaction = await redactCheck(root);
  const minScore = Number(options.minScore || 75);

  checks.push(check("redaction", redaction.status === "pass", `${redaction.findings.length} redaction findings`));
  checks.push(check("readiness", readiness?.status === "pass" || readiness?.status === "review", `readiness=${readiness?.status || "missing"}`));
  checks.push(check("scorecard", (scorecard?.score || 0) >= minScore, `score=${scorecard?.score ?? "missing"}, min=${minScore}`));
  checks.push(check("evidenceIndex", Boolean(evidenceIndex?.artifacts?.length), "Evidence index has artifact links."));
  checks.push(check("htmlIndex", files.includes("evidence-index.html"), "HTML evidence index exists."));

  const blockers = checks.filter((item) => !item.ok).map((item) => `${item.id}: ${item.message}`);
  const warnings = [];
  if (readiness?.status === "review") warnings.push("Readiness is review because no baseline comparison was supplied or review warnings remain.");
  const status = blockers.length ? "fail" : warnings.length ? "review" : "pass";
  const report = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    status,
    packDir: path.basename(root),
    minScore,
    checks,
    blockers,
    warnings,
    files: files.sort(),
    redaction,
  };
  return { ...report, markdown: renderValidationMarkdown(report) };
}

function check(id, ok, message) {
  return { id, ok: Boolean(ok), message };
}

async function safeReaddir(root) {
  const entries = await fs.readdir(root, { withFileTypes: true });
  return entries.filter((entry) => entry.isFile()).map((entry) => entry.name);
}

async function readOptionalJson(root, file) {
  try {
    return JSON.parse(await fs.readFile(path.join(root, file), "utf8"));
  } catch {
    return null;
  }
}

function renderValidationMarkdown(report) {
  return [
    "# Codex OSS Lens Pack Validation",
    "",
    `Generated: ${report.generatedAt}`,
    `Status: ${report.status}`,
    `Pack: ${report.packDir}`,
    "",
    "## Checks",
    "",
    ...report.checks.map((item) => `- ${item.id}: ${item.ok ? "pass" : "fail"} - ${item.message}`),
    "",
    "## Blockers",
    "",
    ...renderMessages(report.blockers),
    "",
    "## Warnings",
    "",
    ...renderMessages(report.warnings),
    "",
  ].join("\n");
}

function renderMessages(messages) {
  if (!messages.length) return ["- None."];
  return messages.map((message) => `- ${message}`);
}
