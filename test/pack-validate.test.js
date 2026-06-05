import test from "node:test";
import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { validateSubmissionPack } from "../src/pack-validate.js";
import { generateSubmissionPack } from "../src/submission-pack.js";

test("validates a generated submission pack", async () => {
  const outDir = await fs.mkdtemp(path.join(os.tmpdir(), "codex-oss-lens-validate-"));
  await generateSubmissionPack({ demo: true, outDir });

  const validation = await validateSubmissionPack(outDir);

  assert.equal(validation.status, "review");
  assert.equal(validation.blockers.length, 0);
  assert.ok(validation.warnings.some((warning) => warning.includes("baseline")));
  assert.ok(validation.checks.every((check) => check.ok));
  assert.match(validation.markdown, /Pack Validation/);
});

test("fails validation when required files are missing", async () => {
  const outDir = await fs.mkdtemp(path.join(os.tmpdir(), "codex-oss-lens-invalid-pack-"));
  await fs.writeFile(path.join(outDir, "README.md"), "# Pack\n", "utf8");

  const validation = await validateSubmissionPack(outDir);

  assert.equal(validation.status, "fail");
  assert.ok(validation.blockers.some((blocker) => blocker.includes("requiredFiles")));
});
