import test from "node:test";
import assert from "node:assert/strict";
import { buildActivityTimeline } from "../src/timeline.js";

test("builds a chronological activity timeline from scan sessions", () => {
  const timeline = buildActivityTimeline({
    sessions: [
      {
        id: "late",
        startedAt: "2026-06-02T12:00:00.000Z",
        workspace: "api",
        workflow: "review",
        models: ["gpt-5.5"],
        turns: 4,
        toolCalls: 1,
        durationMinutes: 20,
        tokens: { total: 2000 },
      },
      {
        id: "early",
        startedAt: "2026-06-01T09:00:00.000Z",
        workspace: "web",
        workflow: "implementation",
        models: ["gpt-5.4"],
        turns: 10,
        toolCalls: 5,
        durationMinutes: 70,
        tokens: { total: 8000 },
      },
    ],
  });

  assert.equal(timeline.summary.sessions, 2);
  assert.equal(timeline.summary.days, 2);
  assert.equal(timeline.days[0].day, "2026-06-01");
  assert.equal(timeline.days[0].entries[0].id, "early");
  assert.equal(timeline.highlights.longestSession.id, "early");
  assert.match(timeline.markdown, /Daily Activity/);
});
