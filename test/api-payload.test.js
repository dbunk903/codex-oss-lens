import test from "node:test";
import assert from "node:assert/strict";
import { buildApiSummaryPayload } from "../src/api-payload.js";
import { demoReport } from "../src/parser.js";

test("builds aggregate-only API summary dry-run payload", () => {
  const payload = buildApiSummaryPayload(demoReport());

  assert.equal(payload.purpose, "codex-maintainer-summary-dry-run");
  assert.equal(payload.privacy.rawLogsIncluded, false);
  assert.equal(payload.privacy.promptsIncluded, false);
  assert.equal(payload.privacy.sourceCodeIncluded, false);
  assert.equal(payload.totals.sessions, 4);
  assert.equal(payload.workflowCounts.implementation, 2);
  assert.ok(payload.workspaceBuckets.length > 0);
  assert.equal(JSON.stringify(payload).includes("rollout-"), false);
  assert.equal(JSON.stringify(payload).includes("/work/"), false);
});

test("hashes full-path workspace buckets and records that the input had paths", () => {
  const report = demoReport();
  report.sessions[0].cwd = "/Users/example/private-repo";

  const payload = buildApiSummaryPayload(report);

  assert.equal(payload.privacy.fullPathsIncluded, false);
  assert.equal(payload.privacy.inputFullPathsObserved, true);
  assert.equal(JSON.stringify(payload).includes("/Users/example"), false);
});
