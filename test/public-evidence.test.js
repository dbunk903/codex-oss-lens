import test from "node:test";
import assert from "node:assert/strict";
import { buildPublicEvidence } from "../src/public-evidence.js";

test("builds public evidence with required links and manual fields", () => {
  const evidence = buildPublicEvidence();

  assert.equal(evidence.status, "ready");
  assert.equal(evidence.publicLinks.repo, "https://github.com/dbunk903/codex-oss-lens");
  assert.equal(evidence.publicLinks.npmPackage, "https://www.npmjs.com/package/codex-oss-lens");
  assert.match(evidence.publicLinks.applicationStatusUrl, /docs\/application-status\.md$/);
  assert.match(evidence.publicLinks.reviewerQuickstartUrl, /docs\/reviewer-quickstart\.md$/);
  assert.ok(evidence.proofPoints.some((item) => item.id === "publishedSmoke"));
  assert.ok(evidence.proofPoints.some((item) => item.id === "applicationStatus"));
  assert.ok(evidence.proofPoints.some((item) => item.id === "reviewerQuickstart"));
  assert.ok(evidence.proofPoints.some((item) => item.id === "finalChecklist"));
  assert.ok(evidence.proofPoints.some((item) => item.id === "finalCopy"));
  assert.ok(evidence.proofPoints.some((item) => item.id === "installSmokeSample"));
  assert.ok(evidence.manualFields.includes("OpenAI organization ID"));
  assert.match(evidence.markdown, /Public Evidence/);
});

test("allows public evidence links to be overridden", () => {
  const evidence = buildPublicEvidence({
    repo: "https://github.com/example/project",
    npmPackage: "https://www.npmjs.com/package/example-project",
    finalCopyUrl: "https://github.com/example/project/blob/main/application/final-copy.md",
  });

  assert.equal(evidence.publicLinks.repo, "https://github.com/example/project");
  assert.equal(evidence.publicLinks.npmPackage, "https://www.npmjs.com/package/example-project");
  assert.equal(evidence.publicLinks.finalCopyUrl, "https://github.com/example/project/blob/main/application/final-copy.md");
});
