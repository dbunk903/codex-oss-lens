import test from "node:test";
import assert from "node:assert/strict";
import { buildInstallSmokeResult } from "../src/install-smoke.js";

test("passes install smoke result when CLI emits demo JSON", () => {
  const report = buildInstallSmokeResult({
    packageName: "codex-oss-lens",
    version: "1.6.0",
    bin: "codex-oss-lens",
    command: ["exec", "--yes", "--package", "codex-oss-lens@1.6.0", "--", "codex-oss-lens", "demo"],
    startedAt: "2026-06-06T00:00:00.000Z",
    ok: true,
    stdout: "{\"totals\":{\"sessions\":4}}",
    stderr: "",
    parsed: { totals: { sessions: 4 } },
  });

  assert.equal(report.status, "pass");
  assert.ok(report.checks.every((check) => check.ok));
  assert.match(report.markdown, /Published Install Smoke/);
});

test("fails install smoke result when npm exec fails", () => {
  const report = buildInstallSmokeResult({
    packageName: "codex-oss-lens",
    version: "latest",
    bin: "codex-oss-lens",
    command: ["exec", "--yes", "--package", "codex-oss-lens@latest", "--", "codex-oss-lens", "demo"],
    startedAt: "2026-06-06T00:00:00.000Z",
    ok: false,
    stdout: "",
    stderr: "not found",
    parsed: null,
    registryVersion: "1.6.0",
  });

  assert.equal(report.status, "fail");
  assert.ok(report.checks.some((check) => check.id === "commandExit" && !check.ok));
});

test("fails install smoke result when package version is not published", () => {
  const report = buildInstallSmokeResult({
    packageName: "codex-oss-lens",
    version: "1.6.0",
    bin: "codex-oss-lens",
    command: ["exec", "--yes", "--package", "codex-oss-lens@1.6.0", "--", "codex-oss-lens", "demo"],
    startedAt: "2026-06-06T00:00:00.000Z",
    ok: false,
    stdout: "",
    stderr: "not published",
    parsed: null,
    registryVersion: null,
  });

  assert.equal(report.status, "fail");
  assert.ok(report.checks.some((check) => check.id === "registryVersion" && !check.ok));
});

test("redacts local filesystem paths from install smoke previews", () => {
  const report = buildInstallSmokeResult({
    packageName: "codex-oss-lens",
    version: "1.6.0",
    bin: "codex-oss-lens",
    command: ["exec", "--yes", "--package", "codex-oss-lens@1.6.0", "--", "codex-oss-lens", "demo"],
    startedAt: "2026-06-06T00:00:00.000Z",
    ok: false,
    stdout: "",
    stderr: "log: /Users/paco/.npm/_logs/example.log temp: /var/folders/example/log",
    parsed: null,
    registryVersion: null,
  });

  assert.doesNotMatch(report.stderrPreview, /\/Users\/paco/);
  assert.doesNotMatch(report.stderrPreview, /\/var\/folders/);
});
