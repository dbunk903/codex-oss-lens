import test from "node:test";
import assert from "node:assert/strict";
import { buildEvidenceIndex } from "../src/evidence-index.js";

test("builds reviewer-facing evidence index from generated artifacts", () => {
  const index = buildEvidenceIndex({
    manifest: {
      summary: {
        sessions: 4,
        workspaces: 2,
        observedTokens: 1000,
        doctorStatus: "ok",
      },
      artifacts: [
        { file: "brief.md", description: "Brief" },
        { file: "readiness.json", description: "Readiness" },
      ],
    },
    readiness: {
      status: "pass",
      blockers: [],
      warnings: [],
      audit: { score: 100 },
      redaction: { status: "pass", filesScanned: 7 },
    },
    apiPlan: {
      candidates: [{ workflow: "implementation", apiUseCase: "implementation-session-summary" }],
      milestones: ["M1"],
      guardrails: ["Keep raw logs local."],
    },
    timeline: {
      days: [{ day: "2026-06-04" }],
      highlights: { busiestDay: { day: "2026-06-04" } },
    },
    scorecard: {
      score: 100,
      rating: "strong",
      nextActions: [],
    },
    artifactPaths: {
      readiness: "/tmp/readiness.json",
      apiPlan: "/tmp/api-plan.json",
      timeline: "/tmp/timeline.json",
      scorecard: "/tmp/scorecard.json",
    },
  });

  assert.equal(index.status, "pass");
  assert.equal(index.summary.auditScore, 100);
  assert.equal(index.summary.scorecardRating, "strong");
  assert.equal(index.summary.timelineDays, 1);
  assert.ok(index.reviewerNotes.some((note) => note.includes("Top API credit candidate")));
  assert.match(index.markdown, /Evidence Index/);
  assert.match(index.markdown, /readiness\.json/);
  assert.match(index.markdown, /scorecard\.json/);
  assert.match(index.html, /brief\.md/);
});
