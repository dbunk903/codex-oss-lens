import test from "node:test";
import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { buildReadinessReport } from "../src/readiness.js";

const readyManifest = {
  summary: {
    sessions: 4,
    workspaces: 2,
    turns: 20,
    toolCalls: 8,
    observedTokens: 1000,
    workflows: { implementation: 3, review: 1 },
    models: { "gpt-5.5": 4 },
    doctorStatus: "ok",
  },
  privacy: {
    rawLogsIncluded: false,
    promptsIncluded: false,
    sourceCodeIncluded: false,
    fullPathsIncluded: false,
  },
  artifacts: [
    { file: "api-payload.dry-run.json" },
    { file: "brief.html" },
    { file: "brief.md" },
  ],
};

test("builds a passing submission readiness report", async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "codex-oss-lens-ready-"));
  await fs.writeFile(path.join(dir, "manifest.json"), JSON.stringify(readyManifest), "utf8");
  await fs.writeFile(path.join(dir, "brief.md"), "# Brief\n\nNo leaks.\n", "utf8");

  const report = await buildReadinessReport({
    manifest: readyManifest,
    manifestPath: path.join(dir, "manifest.json"),
    baseManifest: { ...readyManifest, summary: { ...readyManifest.summary, sessions: 3 } },
  });

  assert.equal(report.status, "pass");
  assert.equal(report.audit.rating, "ready");
  assert.equal(report.redaction.status, "pass");
  assert.equal(report.comparison.metricDeltas.sessions.delta, 1);
  assert.match(report.markdown, /Status: pass/);
});

test("fails readiness when generated artifacts leak local details", async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "codex-oss-lens-not-ready-"));
  await fs.writeFile(path.join(dir, "manifest.json"), JSON.stringify(readyManifest), "utf8");
  await fs.writeFile(path.join(dir, "brief.md"), "/Users/example/private\n", "utf8");

  const report = await buildReadinessReport({
    manifest: readyManifest,
    manifestPath: path.join(dir, "manifest.json"),
  });

  assert.equal(report.status, "fail");
  assert.ok(report.blockers.some((blocker) => blocker.source === "redaction"));
});
