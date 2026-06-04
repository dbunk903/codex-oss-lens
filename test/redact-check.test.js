import test from "node:test";
import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { redactCheck } from "../src/redact-check.js";

test("passes clean shareable artifacts", async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "codex-oss-lens-redact-clean-"));
  await fs.writeFile(path.join(dir, "brief.md"), "# Brief\n\nWorkspace: [workspace:abc123]\n", "utf8");

  const result = await redactCheck(dir);

  assert.equal(result.status, "pass");
  assert.equal(result.filesScanned, 1);
  assert.deepEqual(result.findings, []);
});

test("flags paths, rollout filenames, raw log markers, and likely secrets", async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "codex-oss-lens-redact-leak-"));
  const file = path.join(dir, "leaky.json");
  await fs.writeFile(
    file,
    [
      "/Users/example/project",
      "rollout-2026-06-04T01-02-03-000Z.jsonl",
      "{\"type\":\"session_meta\",\"payload\": {}}",
      "sk-1234567890abcdefghijklmnopqrstuvwxyz",
    ].join("\n"),
    "utf8",
  );

  const result = await redactCheck(file);
  const rules = result.findings.map((finding) => finding.rule);

  assert.equal(result.status, "fail");
  assert.equal(result.filesScanned, 1);
  assert.equal(result.findings[0].file, "leaky.json");
  assert.ok(rules.includes("unix-full-path"));
  assert.ok(rules.includes("rollout-filename"));
  assert.ok(rules.includes("raw-log-marker"));
  assert.ok(rules.includes("likely-secret"));
});
