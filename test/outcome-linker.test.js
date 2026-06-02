import test from "node:test";
import assert from "node:assert/strict";
import { linkGitHubOutcomes } from "../src/outcome-linker.js";

test("links sessions to pull requests by branch", () => {
  const result = linkGitHubOutcomes(
    {
      sessions: [
        {
          cwd: "[workspace:aaa]",
          workflow: "implementation",
          git: { branch: "feature/x", commit: "abc123" },
          startedAt: "2026-06-02T00:00:00.000Z",
          turns: 12,
          toolCalls: 5,
          tokens: { total: 1000 },
        },
        {
          cwd: "[workspace:bbb]",
          workflow: "triage",
          git: { branch: "main", commit: "def456" },
          startedAt: "2026-06-02T01:00:00.000Z",
          turns: 2,
          toolCalls: 0,
          tokens: { total: 0 },
        },
      ],
    },
    {
      repository: "example/repo",
      pullRequests: [
        {
          number: 7,
          title: "Add feature",
          state: "MERGED",
          headRefName: "feature/x",
          baseRefName: "main",
          labels: ["enhancement"],
          mergedAt: "2026-06-02T02:00:00.000Z",
        },
        {
          number: 8,
          title: "Other work",
          state: "OPEN",
          headRefName: "feature/y",
          baseRefName: "main",
          labels: [],
        },
      ],
    },
  );

  assert.equal(result.totals.sessions, 2);
  assert.equal(result.totals.linkedSessions, 1);
  assert.equal(result.totals.unmatchedSessions, 1);
  assert.equal(result.totals.unmatchedPullRequests, 1);
  assert.equal(result.privacy.fullPathsIncluded, false);
  assert.equal(result.sessions[0].matchedPullRequests[0].number, 7);
  assert.equal(result.unmatchedPullRequests[0].number, 8);
});

test("redacts full-path workspaces in linked outcome reports", () => {
  const result = linkGitHubOutcomes(
    {
      sessions: [
        {
          cwd: "/Users/example/private-repo",
          workflow: "implementation",
          git: { branch: "feature/private", commit: "abc123" },
          tokens: { total: 1 },
        },
      ],
    },
    { repository: "example/repo", pullRequests: [] },
  );

  assert.equal(result.privacy.fullPathsIncluded, false);
  assert.equal(result.privacy.inputFullPathsObserved, true);
  assert.match(result.sessions[0].workspace, /^\[workspace:[a-f0-9]{10}\]$/);
  assert.equal(JSON.stringify(result).includes("/Users/example"), false);
});
