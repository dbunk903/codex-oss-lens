import test from "node:test";
import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { generateBrief } from "../src/brief.js";

test("generates a local maintainer evidence brief from demo data", async () => {
  const outDir = await fs.mkdtemp(path.join(os.tmpdir(), "codex-oss-lens-brief-"));
  const manifest = await generateBrief({ demo: true, outDir });

  assert.equal(manifest.summary.sessions, 4);
  assert.equal(manifest.privacy.rawLogsIncluded, false);
  assert.equal(manifest.privacy.fullPathsIncluded, false);

  const files = await fs.readdir(outDir);
  assert.ok(files.includes("brief.md"));
  assert.ok(files.includes("brief.html"));
  assert.ok(files.includes("scan-report.json"));
  assert.ok(files.includes("api-payload.dry-run.json"));
  assert.ok(files.includes("doctor.json"));

  const brief = await fs.readFile(path.join(outDir, "brief.md"), "utf8");
  const manifestText = await fs.readFile(path.join(outDir, "manifest.json"), "utf8");
  const scanText = await fs.readFile(path.join(outDir, "scan-report.json"), "utf8");
  assert.match(brief, /Codex OSS Lens Maintainer Brief/);
  assert.match(brief, /API dry-run/);
  assert.equal(manifestText.includes(outDir), false);
  assert.equal(scanText.includes("/work/"), false);
  assert.equal(scanText.includes("rollout-"), false);
});
