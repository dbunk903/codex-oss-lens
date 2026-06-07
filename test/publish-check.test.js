import test from "node:test";
import assert from "node:assert/strict";
import { buildPublishReadiness } from "../src/publish-check.js";

test("marks package ready when metadata, login, and version availability pass", () => {
  const report = buildPublishReadiness({
    packageJson: {
      name: "codex-oss-lens",
      version: "1.6.0",
      license: "MIT",
      repository: { url: "git+https://github.com/dbunk903/codex-oss-lens.git" },
      bin: { "codex-oss-lens": "src/cli.js" },
    },
    npmUser: "dansan0303",
    registryVersion: "1.5.1",
    registryError: null,
    binExists: true,
  });

  assert.equal(report.status, "ready");
  assert.equal(report.blockers.length, 0);
  assert.ok(report.publishCommands.includes("npm run submission:check"));
  assert.ok(report.publishCommands.some((command) => command.includes("--otp")));
  assert.ok(report.publishCommands.some((command) => command.includes("install-smoke")));
});

test("blocks publish readiness when npm login or bin metadata is missing", () => {
  const report = buildPublishReadiness({
    packageJson: {
      name: "codex-oss-lens",
      version: "1.6.0",
      license: "MIT",
      repository: { url: "git+https://github.com/dbunk903/codex-oss-lens.git" },
      bin: { "codex-oss-lens": "src/cli.js" },
    },
    npmUser: null,
    registryVersion: null,
    registryError: "not published",
    binExists: false,
  });

  assert.equal(report.status, "blocked");
  assert.ok(report.blockers.some((blocker) => blocker.includes("npmLogin")));
  assert.ok(report.blockers.some((blocker) => blocker.includes("bin")));
});

test("blocks publish readiness when registry lookup fails", () => {
  const report = buildPublishReadiness({
    packageJson: {
      name: "codex-oss-lens",
      version: "1.6.0",
      license: "MIT",
      repository: { url: "git+https://github.com/dbunk903/codex-oss-lens.git" },
      bin: { "codex-oss-lens": "src/cli.js" },
    },
    npmUser: "dansan0303",
    registryVersion: null,
    registryError: "registry lookup failed",
    binExists: true,
  });

  assert.equal(report.status, "blocked");
  assert.ok(report.blockers.some((blocker) => blocker.includes("versionAvailable")));
});
