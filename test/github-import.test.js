import test from "node:test";
import assert from "node:assert/strict";
import { normalizeGitHubOutcomes } from "../src/github-import.js";

test("normalizes GitHub issue and pull request metadata", () => {
  const result = normalizeGitHubOutcomes({
    repo: "example/repo",
    issues: [
      { number: 1, title: "Bug", state: "CLOSED", labels: [{ name: "bug" }], createdAt: "a", updatedAt: "b", closedAt: "c" },
      { number: 2, title: "Idea", state: "OPEN", labels: [], createdAt: "a", updatedAt: "b" },
    ],
    pullRequests: [
      {
        number: 3,
        title: "Feature",
        state: "MERGED",
        headRefName: "feature/x",
        baseRefName: "main",
        labels: [{ name: "enhancement" }],
        createdAt: "a",
        updatedAt: "b",
        mergedAt: "c",
      },
    ],
  });

  assert.equal(result.repository, "example/repo");
  assert.equal(result.privacy.rawCodexLogsIncluded, false);
  assert.equal(result.totals.issues, 2);
  assert.equal(result.totals.closedIssues, 1);
  assert.equal(result.totals.pullRequests, 1);
  assert.equal(result.totals.mergedPullRequests, 1);
  assert.deepEqual(result.issues[0].labels, ["bug"]);
  assert.equal(result.pullRequests[0].headRefName, "feature/x");
});
