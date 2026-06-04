import test from "node:test";
import assert from "node:assert/strict";
import { buildMaintainerScorecard } from "../src/scorecard.js";

test("builds a strong maintainer scorecard from complete evidence", () => {
  const scorecard = buildMaintainerScorecard({
    manifest: {
      summary: {
        sessions: 5,
        workspaces: 3,
        doctorStatus: "ok",
      },
      privacy: {
        rawLogsIncluded: false,
        promptsIncluded: false,
        sourceCodeIncluded: false,
        fullPathsIncluded: false,
      },
      artifacts: [
        { file: "brief.md" },
        { file: "brief.html" },
        { file: "scan-report.json" },
        { file: "api-payload.dry-run.json" },
      ],
    },
    readiness: {
      status: "pass",
      blockers: [],
      audit: { score: 100 },
      redaction: { status: "pass" },
    },
    apiPlan: {
      candidates: [{ workflow: "implementation" }, { workflow: "review" }],
      milestones: ["M1", "M2"],
      guardrails: ["A", "B", "C"],
    },
    timeline: { days: [{ day: "2026-06-01" }, { day: "2026-06-02" }, { day: "2026-06-03" }] },
  });

  assert.equal(scorecard.score, 100);
  assert.equal(scorecard.rating, "strong");
  assert.equal(scorecard.nextActions.length, 0);
  assert.match(scorecard.markdown, /Maintainer Scorecard/);
});

test("returns next actions for incomplete scorecard evidence", () => {
  const scorecard = buildMaintainerScorecard({
    manifest: {
      summary: { sessions: 0, workspaces: 0, doctorStatus: "warn" },
      privacy: { rawLogsIncluded: true },
      artifacts: [],
    },
  });

  assert.equal(scorecard.rating, "not-ready");
  assert.ok(scorecard.nextActions.some((action) => action.includes("redact-check")));
});
