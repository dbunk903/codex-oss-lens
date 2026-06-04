import test from "node:test";
import assert from "node:assert/strict";
import { buildApiCreditPlan } from "../src/api-plan.js";

test("prioritizes API credit candidates from workflow aggregates", () => {
  const plan = buildApiCreditPlan({
    totals: {
      sessions: 4,
      workspaces: 2,
      turns: 42,
      toolCalls: 14,
      tokens: { total: 180000 },
      latestRateLimits: {
        primary: { usedPercent: 20 },
        secondary: { usedPercent: 8 },
      },
    },
    byWorkflow: {
      triage: { sessions: 1, turns: 5, toolCalls: 1, tokens: { total: 10000 } },
      implementation: { sessions: 3, turns: 37, toolCalls: 13, tokens: { total: 170000 } },
    },
  });

  assert.equal(plan.candidates[0].workflow, "implementation");
  assert.equal(plan.candidates[0].apiUseCase, "implementation-session-summary");
  assert.equal(plan.privacy.rawLogsIncluded, false);
  assert.ok(plan.milestones[0].includes("implementation-session-summary"));
  assert.match(plan.markdown, /Prioritized Candidates/);
});
