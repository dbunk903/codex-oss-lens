import { promises as fs } from "node:fs";
import crypto from "node:crypto";
import path from "node:path";
import { buildApiSummaryPayload } from "./api-payload.js";
import { demoDoctorReport, runDoctor } from "./doctor.js";
import { importGitHubOutcomes } from "./github-import.js";
import { linkGitHubOutcomes } from "./outcome-linker.js";
import { demoReport, scanCodexHome } from "./parser.js";
import { renderWeeklyReport } from "./report.js";

export async function generateBrief(options = {}) {
  const outDir = path.resolve(options.outDir || options.out || "codex-oss-lens-brief");
  const scanOptions = { ...options, redaction: options.redaction || "hash" };
  const report = sanitizeReport(options.demo ? demoReport() : await scanCodexHome(scanOptions));
  const weekly = renderWeeklyReport(report);
  const apiPayload = buildApiSummaryPayload(report);
  const doctor = options.demo ? demoDoctorReport() : await runDoctor({ ...options, redactPaths: options.redactPaths ?? true });

  await fs.mkdir(outDir, { recursive: true });

  const artifacts = [];
  await writeJson(outDir, artifacts, "scan-report.json", report, "Codex session scan report");
  await writeText(outDir, artifacts, "weekly-report.md", weekly, "Weekly maintainer report");
  await writeJson(outDir, artifacts, "api-payload.dry-run.json", apiPayload, "Aggregate-only API dry-run payload");
  await writeJson(outDir, artifacts, "doctor.json", doctor, "Local readiness diagnostics");

  let githubOutcomes = null;
  let linkedOutcomes = null;
  if (options.repo) {
    githubOutcomes = await importGitHubOutcomes(options);
    linkedOutcomes = linkGitHubOutcomes(report, githubOutcomes);
    await writeJson(outDir, artifacts, "github-outcomes.json", githubOutcomes, "GitHub issue and pull request metadata");
    await writeJson(outDir, artifacts, "linked-outcomes.json", linkedOutcomes, "Branch-to-pull-request outcome links");
  }

  const manifest = buildManifest({ outDir, report, apiPayload, doctor, githubOutcomes, linkedOutcomes, artifacts });
  const markdown = renderBriefMarkdown(manifest);
  const html = renderBriefHtml(manifest, markdown);

  await writeText(outDir, artifacts, "brief.md", markdown, "Human-readable maintainer evidence brief");
  await writeText(outDir, artifacts, "brief.html", html, "Standalone HTML maintainer evidence brief");
  await writeJson(outDir, artifacts, "manifest.json", manifest, "Artifact manifest");

  return manifest;
}

function buildManifest({ outDir, report, apiPayload, doctor, githubOutcomes, linkedOutcomes, artifacts }) {
  return {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    artifactRoot: path.basename(outDir),
    summary: {
      sessions: report.totals.sessions,
      workspaces: report.totals.workspaces,
      turns: report.totals.turns,
      toolCalls: report.totals.toolCalls,
      observedTokens: report.totals.tokens.total,
      workflows: countRows(report.byWorkflow),
      models: countRows(report.byModel),
      quotaWindows: {
        primaryUsedPercent: report.totals.latestRateLimits?.primary?.usedPercent ?? null,
        secondaryUsedPercent: report.totals.latestRateLimits?.secondary?.usedPercent ?? null,
      },
      github: githubOutcomes
        ? {
            repository: githubOutcomes.repository,
            issues: githubOutcomes.totals.issues,
            pullRequests: githubOutcomes.totals.pullRequests,
            linkedSessions: linkedOutcomes?.totals.linkedSessions ?? 0,
          }
        : null,
      doctorStatus: doctor.status,
    },
    privacy: {
      rawLogsIncluded: false,
      promptsIncluded: false,
      sourceCodeIncluded: false,
      fullPathsIncluded: false,
      inputFullPathsObserved: Boolean(apiPayload.privacy.inputFullPathsObserved),
    },
    artifacts,
  };
}

function renderBriefMarkdown(manifest) {
  const github = manifest.summary.github;
  return [
    "# Codex OSS Lens Maintainer Brief",
    "",
    `Generated: ${manifest.generatedAt}`,
    "",
    "## Summary",
    "",
    `- Sessions: ${manifest.summary.sessions}`,
    `- Workspaces: ${manifest.summary.workspaces}`,
    `- Turns: ${manifest.summary.turns}`,
    `- Tool calls: ${manifest.summary.toolCalls}`,
    `- Observed tokens: ${manifest.summary.observedTokens}`,
    `- Doctor status: ${manifest.summary.doctorStatus}`,
    github ? `- GitHub repository: ${github.repository}` : "- GitHub repository: not imported",
    github ? `- GitHub issues / PRs: ${github.issues} / ${github.pullRequests}` : null,
    github ? `- Branch-linked sessions: ${github.linkedSessions}` : null,
    "",
    "## Workflow Mix",
    "",
    ...renderCounts(manifest.summary.workflows),
    "",
    "## Model Mix",
    "",
    ...renderCounts(manifest.summary.models),
    "",
    "## Privacy",
    "",
    `- Raw logs included: ${manifest.privacy.rawLogsIncluded}`,
    `- Prompts included: ${manifest.privacy.promptsIncluded}`,
    `- Source code included: ${manifest.privacy.sourceCodeIncluded}`,
    `- Full paths included: ${manifest.privacy.fullPathsIncluded}`,
    `- Full paths observed in input: ${manifest.privacy.inputFullPathsObserved}`,
    "",
    "## Artifacts",
    "",
    ...manifest.artifacts.map((artifact) => `- [${artifact.file}](${artifact.file}) - ${artifact.description}`),
    "",
    "## Next Steps",
    "",
    "- Review `api-payload.dry-run.json` before enabling any live API-backed summary.",
    "- Use `linked-outcomes.json` to inspect branch-to-PR matches when GitHub data is imported.",
    "- Attach `brief.md` or `brief.html` when a shareable maintainer evidence snapshot is useful.",
    "",
  ]
    .filter((line) => line !== null)
    .join("\n");
}

function renderBriefHtml(manifest, markdown) {
  const escapedMarkdown = escapeHtml(markdown);
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Codex OSS Lens Maintainer Brief</title>
    <style>
      body { margin: 0; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: #1f2933; background: #f4f7f9; }
      main { width: min(1040px, calc(100vw - 32px)); margin: 0 auto; padding: 32px 0 48px; }
      header { background: #132320; color: #f7fbf9; padding: 28px 0; }
      header div { width: min(1040px, calc(100vw - 32px)); margin: 0 auto; }
      h1 { margin: 0; font-size: 40px; line-height: 1; }
      .grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; margin: 20px 0; }
      .card { background: #fff; border: 1px solid #d8dee4; padding: 16px; }
      .label { color: #5d6b78; font-size: 13px; }
      .value { font-size: 28px; font-weight: 700; margin-top: 8px; }
      pre { background: #fff; border: 1px solid #d8dee4; padding: 18px; overflow-x: auto; white-space: pre-wrap; }
      a { color: #2563a8; }
      @media (max-width: 760px) { .grid { grid-template-columns: 1fr; } h1 { font-size: 30px; } }
    </style>
  </head>
  <body>
    <header><div><h1>Codex OSS Lens Maintainer Brief</h1></div></header>
    <main>
      <section class="grid">
        ${metric("Sessions", manifest.summary.sessions)}
        ${metric("Workspaces", manifest.summary.workspaces)}
        ${metric("Turns", manifest.summary.turns)}
        ${metric("Doctor", manifest.summary.doctorStatus)}
      </section>
      <pre>${escapedMarkdown}</pre>
    </main>
  </body>
</html>
`;
}

async function writeJson(outDir, artifacts, file, value, description) {
  await writeText(outDir, artifacts, file, `${JSON.stringify(value, null, 2)}\n`, description);
}

async function writeText(outDir, artifacts, file, value, description) {
  await fs.writeFile(path.join(outDir, file), value, "utf8");
  artifacts.push({ file, description });
}

function renderCounts(counts) {
  const rows = Object.entries(counts || {}).sort((a, b) => b[1] - a[1]);
  if (!rows.length) return ["- No data found."];
  return rows.map(([name, count]) => `- ${name}: ${count}`);
}

function countRows(source) {
  return Object.fromEntries(Object.entries(source || {}).map(([key, row]) => [key, row.sessions || 0]));
}

function sanitizeReport(report) {
  return {
    ...report,
    sessions: (report.sessions || []).map((session) => ({
      ...session,
      file: "[redacted]",
      cwd: safeWorkspaceBucket(session.cwd || session.workspace || "[unknown]"),
    })),
  };
}

function safeWorkspaceBucket(value) {
  if (!isFullPathLike(value)) return value;
  const hash = crypto.createHash("sha256").update(String(value)).digest("hex").slice(0, 10);
  return `[workspace:${hash}]`;
}

function isFullPathLike(value) {
  return String(value || "").startsWith("/") || /^[A-Za-z]:[\\/]/.test(String(value || ""));
}

function metric(label, value) {
  return `<article class="card"><div class="label">${escapeHtml(label)}</div><div class="value">${escapeHtml(String(value))}</div></article>`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  })[char]);
}
