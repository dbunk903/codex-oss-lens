import path from "node:path";
import { auditBrief } from "./audit.js";
import { compareBriefs } from "./compare-briefs.js";
import { redactCheck } from "./redact-check.js";

export async function buildReadinessReport({ manifest, manifestPath, artifactsDir, baseManifest } = {}) {
  if (!manifest) throw new Error("Missing manifest for readiness report");
  const resolvedArtifactsDir = artifactsDir || (manifestPath ? path.dirname(path.resolve(manifestPath)) : null);
  if (!resolvedArtifactsDir) throw new Error("Missing artifacts directory for readiness report");

  const audit = auditBrief(manifest);
  const redaction = await redactCheck(resolvedArtifactsDir);
  const comparison = baseManifest ? compareBriefs(baseManifest, manifest) : null;
  const blockers = [
    ...audit.nextActions.map((action) => ({ source: "audit", message: action })),
    ...redaction.findings.map((finding) => ({
      source: "redaction",
      message: `${finding.rule} in ${finding.file}:${finding.line}`,
    })),
  ];
  const warnings = [];
  if (!comparison) warnings.push("No baseline brief supplied; trend comparison was skipped.");
  if (comparison && hasNegativeActivityDelta(comparison)) {
    warnings.push("Some activity metrics decreased compared with the baseline brief; verify that the scan window is intentional.");
  }

  const status = blockers.length ? "fail" : warnings.length ? "review" : "pass";
  const report = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    status,
    audit,
    redaction,
    comparison,
    blockers,
    warnings,
    evidence: buildEvidence({ manifest, audit, redaction, comparison }),
  };
  return { ...report, markdown: renderReadinessMarkdown(report) };
}

function hasNegativeActivityDelta(comparison) {
  return ["sessions", "workspaces", "turns", "toolCalls", "observedTokens"].some((metric) => {
    return comparison.metricDeltas?.[metric]?.delta < 0;
  });
}

function buildEvidence({ manifest, audit, redaction, comparison }) {
  return {
    sessions: manifest.summary?.sessions || 0,
    workspaces: manifest.summary?.workspaces || 0,
    observedTokens: manifest.summary?.observedTokens || 0,
    auditScore: audit.score,
    redactionStatus: redaction.status,
    filesScanned: redaction.filesScanned,
    comparedWithBaseline: Boolean(comparison),
  };
}

function renderReadinessMarkdown(report) {
  return [
    "# Codex OSS Lens Submission Readiness",
    "",
    `Status: ${report.status}`,
    `Generated: ${report.generatedAt}`,
    "",
    "## Evidence",
    "",
    `- Audit score: ${report.evidence.auditScore}`,
    `- Redaction status: ${report.evidence.redactionStatus}`,
    `- Files scanned: ${report.evidence.filesScanned}`,
    `- Sessions: ${report.evidence.sessions}`,
    `- Workspaces: ${report.evidence.workspaces}`,
    `- Observed tokens: ${report.evidence.observedTokens}`,
    `- Compared with baseline: ${report.evidence.comparedWithBaseline}`,
    "",
    "## Blockers",
    "",
    ...renderMessages(report.blockers),
    "",
    "## Warnings",
    "",
    ...renderMessages(report.warnings.map((message) => ({ message }))),
    "",
  ].join("\n");
}

function renderMessages(messages) {
  if (!messages.length) return ["- None."];
  return messages.map((item) => `- ${item.message}`);
}
