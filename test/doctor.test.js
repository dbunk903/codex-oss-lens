import test from "node:test";
import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { runDoctor } from "../src/doctor.js";

test("doctor reports local Codex readiness without exposing rollout filenames", async () => {
  const codexHome = await fs.mkdtemp(path.join(os.tmpdir(), "codex-oss-lens-doctor-"));
  const sessionsDir = path.join(codexHome, "sessions", "2026", "06", "03");
  await fs.mkdir(sessionsDir, { recursive: true });
  await fs.writeFile(
    path.join(sessionsDir, "rollout-2026-06-03T10-00-00-demo.jsonl"),
    JSON.stringify({ timestamp: "2026-06-03T10:00:00.000Z", type: "session_meta", payload: {} }),
    "utf8",
  );

  const report = await runDoctor({ codexHome });
  const serialized = JSON.stringify(report);

  assert.equal(report.checks.node.ok, true);
  assert.equal(report.checks.codexHome.ok, true);
  assert.equal(report.checks.sessionsDir.ok, true);
  assert.equal(report.checks.rolloutFiles.count, 1);
  assert.equal(report.privacy.rawLogsIncluded, false);
  assert.equal(serialized.includes("rollout-2026"), false);
});
