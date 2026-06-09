import test from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { buildPublicEvidence } from "../src/public-evidence.js";

const execFileAsync = promisify(execFile);

test("builds public evidence with required links and manual fields", () => {
  const evidence = buildPublicEvidence();

  assert.equal(evidence.status, "ready");
  assert.equal(evidence.publicLinks.repo, "https://github.com/dbunk903/codex-oss-lens");
  assert.equal(evidence.publicLinks.npmPackage, "https://www.npmjs.com/package/codex-oss-lens");
  assert.match(evidence.publicLinks.applicationStatusUrl, /docs\/application-status\.md$/);
  assert.match(evidence.publicLinks.reviewerQuickstartUrl, /docs\/reviewer-quickstart\.md$/);
  assert.match(evidence.publicLinks.releaseProvenanceUrl, /docs\/release-provenance\.md$/);
  assert.match(evidence.publicLinks.adoptionPlanUrl, /docs\/adoption-plan\.md$/);
  assert.match(evidence.publicLinks.maintenancePolicyUrl, /docs\/maintenance-policy\.md$/);
  assert.match(evidence.publicLinks.maintainerHandoffUrl, /docs\/maintainer-handoff\.md$/);
  assert.match(evidence.publicLinks.scopeLimitationsUrl, /docs\/scope-and-limitations\.md$/);
  assert.match(evidence.publicLinks.privacyThreatModelUrl, /docs\/privacy-threat-model\.md$/);
  assert.match(evidence.publicLinks.dataRetentionUrl, /docs\/data-retention\.md$/);
  assert.match(evidence.publicLinks.demoWalkthroughUrl, /docs\/demo-walkthrough\.md$/);
  assert.match(evidence.publicLinks.submissionRehearsalUrl, /docs\/submission-rehearsal\.md$/);
  assert.match(evidence.publicLinks.accessibilityUrl, /docs\/accessibility\.md$/);
  assert.ok(evidence.proofPoints.some((item) => item.id === "publishedSmoke"));
  assert.ok(evidence.proofPoints.some((item) => item.id === "applicationStatus"));
  assert.ok(evidence.proofPoints.some((item) => item.id === "reviewerQuickstart"));
  assert.ok(evidence.proofPoints.some((item) => item.id === "releaseProvenance"));
  assert.ok(evidence.proofPoints.some((item) => item.id === "adoptionPlan"));
  assert.ok(evidence.proofPoints.some((item) => item.id === "maintenancePolicy"));
  assert.ok(evidence.proofPoints.some((item) => item.id === "maintainerHandoff"));
  assert.ok(evidence.proofPoints.some((item) => item.id === "scopeLimitations"));
  assert.ok(evidence.proofPoints.some((item) => item.id === "privacyThreatModel"));
  assert.ok(evidence.proofPoints.some((item) => item.id === "dataRetention"));
  assert.ok(evidence.proofPoints.some((item) => item.id === "demoWalkthrough"));
  assert.ok(evidence.proofPoints.some((item) => item.id === "submissionRehearsal"));
  assert.ok(evidence.proofPoints.some((item) => item.id === "accessibility"));
  assert.ok(evidence.proofPoints.some((item) => item.id === "finalChecklist"));
  assert.ok(evidence.proofPoints.some((item) => item.id === "finalCopy"));
  assert.ok(evidence.proofPoints.some((item) => item.id === "formDraftSample"));
  assert.ok(evidence.proofPoints.some((item) => item.id === "publicEvidenceSample"));
  assert.ok(evidence.proofPoints.some((item) => item.id === "dashboardPreview"));
  assert.ok(evidence.proofPoints.some((item) => item.id === "mobileDashboardPreview"));
  assert.ok(evidence.proofPoints.some((item) => item.label.includes("1440x1200")));
  assert.ok(evidence.proofPoints.some((item) => item.label.includes("500x1100")));
  assert.ok(evidence.proofPoints.some((item) => item.id === "publishCheckSample"));
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

test("CLI accepts reviewer link overrides for public evidence", async () => {
  const { stdout } = await execFileAsync(process.execPath, [
    "src/cli.js",
    "public-evidence",
    "--repo",
    "https://github.com/example/project",
    "--release-url",
    "https://github.com/example/project/releases/tag/v1.2.3",
    "--npm-package",
    "https://www.npmjs.com/package/example-project",
    "--roadmap-url",
    "https://github.com/example/project/blob/main/ROADMAP.md",
    "--application-status-url",
    "https://github.com/example/project/blob/main/docs/application-status.md",
    "--reviewer-quickstart-url",
    "https://github.com/example/project/blob/main/docs/reviewer-quickstart.md",
    "--release-provenance-url",
    "https://github.com/example/project/blob/main/docs/release-provenance.md",
    "--adoption-plan-url",
    "https://github.com/example/project/blob/main/docs/adoption-plan.md",
    "--maintenance-policy-url",
    "https://github.com/example/project/blob/main/docs/maintenance-policy.md",
    "--maintainer-handoff-url",
    "https://github.com/example/project/blob/main/docs/maintainer-handoff.md",
    "--scope-limitations-url",
    "https://github.com/example/project/blob/main/docs/scope-and-limitations.md",
    "--privacy-threat-model-url",
    "https://github.com/example/project/blob/main/docs/privacy-threat-model.md",
    "--data-retention-url",
    "https://github.com/example/project/blob/main/docs/data-retention.md",
    "--demo-walkthrough-url",
    "https://github.com/example/project/blob/main/docs/demo-walkthrough.md",
    "--accessibility-url",
    "https://github.com/example/project/blob/main/docs/accessibility.md",
    "--api-workflow-url",
    "https://github.com/example/project/blob/main/docs/api-credit-workflow.md",
    "--use-cases-url",
    "https://github.com/example/project/blob/main/docs/maintainer-use-cases.md",
    "--final-checklist-url",
    "https://github.com/example/project/blob/main/docs/final-submission-checklist.md",
    "--submission-rehearsal-url",
    "https://github.com/example/project/blob/main/docs/submission-rehearsal.md",
    "--final-copy-url",
    "https://github.com/example/project/blob/main/application/final-copy.md",
    "--form-draft-sample-url",
    "https://github.com/example/project/blob/main/examples/form-draft.sample.md",
    "--public-evidence-sample-url",
    "https://github.com/example/project/blob/main/examples/public-evidence.sample.md",
    "--dashboard-preview-url",
    "https://github.com/example/project/blob/main/examples/dashboard-preview.png",
    "--mobile-dashboard-preview-url",
    "https://github.com/example/project/blob/main/examples/dashboard-mobile-preview.png",
    "--publish-check-sample-url",
    "https://github.com/example/project/blob/main/examples/publish-check.sample.md",
    "--install-smoke-sample-url",
    "https://github.com/example/project/blob/main/examples/install-smoke.sample.md",
    "--node-ci-url",
    "https://github.com/example/project/actions/workflows/test.yml",
    "--published-smoke-url",
    "https://github.com/example/project/actions/workflows/published-smoke.yml",
  ]);
  const evidence = JSON.parse(stdout);

  assert.equal(evidence.publicLinks.repo, "https://github.com/example/project");
  assert.equal(evidence.publicLinks.releaseUrl, "https://github.com/example/project/releases/tag/v1.2.3");
  assert.equal(evidence.publicLinks.applicationStatusUrl, "https://github.com/example/project/blob/main/docs/application-status.md");
  assert.equal(evidence.publicLinks.reviewerQuickstartUrl, "https://github.com/example/project/blob/main/docs/reviewer-quickstart.md");
  assert.equal(evidence.publicLinks.releaseProvenanceUrl, "https://github.com/example/project/blob/main/docs/release-provenance.md");
  assert.equal(evidence.publicLinks.adoptionPlanUrl, "https://github.com/example/project/blob/main/docs/adoption-plan.md");
  assert.equal(evidence.publicLinks.maintenancePolicyUrl, "https://github.com/example/project/blob/main/docs/maintenance-policy.md");
  assert.equal(evidence.publicLinks.maintainerHandoffUrl, "https://github.com/example/project/blob/main/docs/maintainer-handoff.md");
  assert.equal(evidence.publicLinks.scopeLimitationsUrl, "https://github.com/example/project/blob/main/docs/scope-and-limitations.md");
  assert.equal(evidence.publicLinks.privacyThreatModelUrl, "https://github.com/example/project/blob/main/docs/privacy-threat-model.md");
  assert.equal(evidence.publicLinks.dataRetentionUrl, "https://github.com/example/project/blob/main/docs/data-retention.md");
  assert.equal(evidence.publicLinks.demoWalkthroughUrl, "https://github.com/example/project/blob/main/docs/demo-walkthrough.md");
  assert.equal(evidence.publicLinks.accessibilityUrl, "https://github.com/example/project/blob/main/docs/accessibility.md");
  assert.equal(evidence.publicLinks.finalChecklistUrl, "https://github.com/example/project/blob/main/docs/final-submission-checklist.md");
  assert.equal(evidence.publicLinks.submissionRehearsalUrl, "https://github.com/example/project/blob/main/docs/submission-rehearsal.md");
  assert.equal(evidence.publicLinks.formDraftSampleUrl, "https://github.com/example/project/blob/main/examples/form-draft.sample.md");
  assert.equal(evidence.publicLinks.publicEvidenceSampleUrl, "https://github.com/example/project/blob/main/examples/public-evidence.sample.md");
  assert.equal(evidence.publicLinks.dashboardPreviewUrl, "https://github.com/example/project/blob/main/examples/dashboard-preview.png");
  assert.equal(evidence.publicLinks.mobileDashboardPreviewUrl, "https://github.com/example/project/blob/main/examples/dashboard-mobile-preview.png");
  assert.equal(evidence.publicLinks.publishedSmokeUrl, "https://github.com/example/project/actions/workflows/published-smoke.yml");
});
