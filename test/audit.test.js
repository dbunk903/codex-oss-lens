import test from "node:test";
import assert from "node:assert/strict";
import { auditBrief } from "../src/audit.js";

test("rates a complete maintainer brief as ready", () => {
  const audit = auditBrief({
    summary: {
      sessions: 4,
      workspaces: 2,
      workflows: { implementation: 3, review: 1 },
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
  });

  assert.equal(audit.score, 100);
  assert.equal(audit.rating, "ready");
  assert.equal(audit.nextActions.length, 0);
});

test("returns next actions for an incomplete or unsafe brief", () => {
  const audit = auditBrief({
    summary: { sessions: 0, workspaces: 0, workflows: {}, doctorStatus: "warn" },
    privacy: {
      rawLogsIncluded: true,
      promptsIncluded: false,
      sourceCodeIncluded: false,
      fullPathsIncluded: false,
    },
    artifacts: [],
  });

  assert.equal(audit.rating, "not-ready");
  assert.ok(audit.nextActions.some((action) => action.includes("Codex home")));
  assert.ok(audit.checks.find((check) => check.id === "privacy").ok === false);
});
