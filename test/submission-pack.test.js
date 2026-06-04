import test from "node:test";
import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { generateSubmissionPack } from "../src/submission-pack.js";

test("generates a complete local submission pack from demo data", async () => {
  const outDir = await fs.mkdtemp(path.join(os.tmpdir(), "codex-oss-lens-pack-"));
  const pack = await generateSubmissionPack({ demo: true, outDir });
  const files = await fs.readdir(outDir);

  assert.equal(pack.status, "review");
  assert.ok(pack.score >= 75);
  assert.ok(files.includes("README.md"));
  assert.ok(files.includes("brief.md"));
  assert.ok(files.includes("readiness.json"));
  assert.ok(files.includes("api-plan.md"));
  assert.ok(files.includes("timeline.md"));
  assert.ok(files.includes("scorecard.md"));
  assert.ok(files.includes("evidence-index.html"));

  const readme = await fs.readFile(path.join(outDir, "README.md"), "utf8");
  const evidence = await fs.readFile(path.join(outDir, "evidence-index.md"), "utf8");
  assert.match(readme, /Submission Pack/);
  assert.match(evidence, /scorecard\.json/);
});
