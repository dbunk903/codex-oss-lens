import test from "node:test";
import assert from "node:assert/strict";
import { compareBriefs } from "../src/compare-briefs.js";

test("compares maintainer brief metrics and workflow counts", () => {
  const comparison = compareBriefs(
    {
      generatedAt: "2026-06-03T00:00:00.000Z",
      summary: {
        sessions: 2,
        workspaces: 1,
        turns: 10,
        toolCalls: 4,
        observedTokens: 1000,
        workflows: { implementation: 1, review: 1 },
        models: { "gpt-5.5": 2 },
      },
    },
    {
      generatedAt: "2026-06-04T00:00:00.000Z",
      summary: {
        sessions: 5,
        workspaces: 2,
        turns: 31,
        toolCalls: 9,
        observedTokens: 1800,
        workflows: { implementation: 3, release: 1, review: 1 },
        models: { "gpt-5.5": 4, "gpt-5.4": 1 },
      },
    },
  );

  assert.deepEqual(comparison.metricDeltas.sessions, { before: 2, after: 5, delta: 3 });
  assert.deepEqual(comparison.workflowDeltas.implementation, { before: 1, after: 3, delta: 2 });
  assert.deepEqual(comparison.workflowDeltas.release, { before: 0, after: 1, delta: 1 });
  assert.deepEqual(comparison.modelDeltas["gpt-5.4"], { before: 0, after: 1, delta: 1 });
  assert.match(comparison.markdown, /sessions: 2 -> 5 \(\+3\)/);
  assert.match(comparison.markdown, /gpt-5\.4: 0 -> 1 \(\+1\)/);
});
