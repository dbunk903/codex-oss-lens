import test from "node:test";
import assert from "node:assert/strict";
import { buildPublicEvidence } from "../src/public-evidence.js";

test("builds public evidence with required links and manual fields", () => {
  const evidence = buildPublicEvidence();

  assert.equal(evidence.status, "ready");
  assert.equal(evidence.publicLinks.repo, "https://github.com/dbunk903/codex-oss-lens");
  assert.equal(evidence.publicLinks.npmPackage, "https://www.npmjs.com/package/codex-oss-lens");
  assert.ok(evidence.proofPoints.some((item) => item.id === "publishedSmoke"));
  assert.ok(evidence.manualFields.includes("OpenAI organization ID"));
  assert.match(evidence.markdown, /Public Evidence/);
});

test("allows public evidence links to be overridden", () => {
  const evidence = buildPublicEvidence({
    repo: "https://github.com/example/project",
    npmPackage: "https://www.npmjs.com/package/example-project",
  });

  assert.equal(evidence.publicLinks.repo, "https://github.com/example/project");
  assert.equal(evidence.publicLinks.npmPackage, "https://www.npmjs.com/package/example-project");
});
