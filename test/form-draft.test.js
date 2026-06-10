import test from "node:test";
import assert from "node:assert/strict";
import { buildFormDraft } from "../src/form-draft.js";

test("builds copy-ready Korean OSS support form draft", () => {
  const draft = buildFormDraft({
    manifest: {
      summary: {
        sessions: 6,
        workspaces: 3,
      },
    },
    readiness: { status: "pass" },
    apiPlan: {
      candidates: [
        { workflow: "implementation", apiUseCase: "implementation-session-summary" },
      ],
    },
    scorecard: { score: 94, rating: "strong" },
    links: {
      repo: "https://github.com/dbunk903/codex-oss-lens",
      releaseUrl: "https://github.com/dbunk903/codex-oss-lens/releases/tag/v1.6.1",
      npmPackage: "https://www.npmjs.com/package/codex-oss-lens",
      applicationStatusUrl: "https://github.com/dbunk903/codex-oss-lens/blob/main/docs/application-status.md",
      applicationEvidenceMatrixUrl: "https://github.com/dbunk903/codex-oss-lens/blob/main/docs/application-evidence-matrix.md",
      applicationReviewFaqUrl: "https://github.com/dbunk903/codex-oss-lens/blob/main/docs/application-review-faq.md",
      adoptionPlanUrl: "https://github.com/dbunk903/codex-oss-lens/blob/main/docs/adoption-plan.md",
      maintenancePolicyUrl: "https://github.com/dbunk903/codex-oss-lens/blob/main/docs/maintenance-policy.md",
      maintainerHandoffUrl: "https://github.com/dbunk903/codex-oss-lens/blob/main/docs/maintainer-handoff.md",
      scopeLimitationsUrl: "https://github.com/dbunk903/codex-oss-lens/blob/main/docs/scope-and-limitations.md",
      privacyThreatModelUrl: "https://github.com/dbunk903/codex-oss-lens/blob/main/docs/privacy-threat-model.md",
      dataRetentionUrl: "https://github.com/dbunk903/codex-oss-lens/blob/main/docs/data-retention.md",
      demoWalkthroughUrl: "https://github.com/dbunk903/codex-oss-lens/blob/main/docs/demo-walkthrough.md",
      accessibilityUrl: "https://github.com/dbunk903/codex-oss-lens/blob/main/docs/accessibility.md",
      submissionRehearsalUrl: "https://github.com/dbunk903/codex-oss-lens/blob/main/docs/submission-rehearsal.md",
    },
  });

  assert.equal(draft.readyToPaste, true);
  assert.equal(draft.publicLinks.repository, "https://github.com/dbunk903/codex-oss-lens");
  assert.equal(draft.publicLinks.npmPackage, "https://www.npmjs.com/package/codex-oss-lens");
  assert.equal(draft.publicLinks.applicationStatus, "https://github.com/dbunk903/codex-oss-lens/blob/main/docs/application-status.md");
  assert.equal(draft.publicLinks.applicationEvidenceMatrix, "https://github.com/dbunk903/codex-oss-lens/blob/main/docs/application-evidence-matrix.md");
  assert.equal(draft.publicLinks.applicationReviewFaq, "https://github.com/dbunk903/codex-oss-lens/blob/main/docs/application-review-faq.md");
  assert.equal(draft.publicLinks.adoptionPlan, "https://github.com/dbunk903/codex-oss-lens/blob/main/docs/adoption-plan.md");
  assert.equal(draft.publicLinks.maintenancePolicy, "https://github.com/dbunk903/codex-oss-lens/blob/main/docs/maintenance-policy.md");
  assert.equal(draft.publicLinks.maintainerHandoff, "https://github.com/dbunk903/codex-oss-lens/blob/main/docs/maintainer-handoff.md");
  assert.equal(draft.publicLinks.scopeLimitations, "https://github.com/dbunk903/codex-oss-lens/blob/main/docs/scope-and-limitations.md");
  assert.equal(draft.publicLinks.privacyThreatModel, "https://github.com/dbunk903/codex-oss-lens/blob/main/docs/privacy-threat-model.md");
  assert.equal(draft.publicLinks.dataRetention, "https://github.com/dbunk903/codex-oss-lens/blob/main/docs/data-retention.md");
  assert.equal(draft.publicLinks.demoWalkthrough, "https://github.com/dbunk903/codex-oss-lens/blob/main/docs/demo-walkthrough.md");
  assert.equal(draft.publicLinks.accessibility, "https://github.com/dbunk903/codex-oss-lens/blob/main/docs/accessibility.md");
  assert.equal(draft.publicLinks.submissionRehearsal, "https://github.com/dbunk903/codex-oss-lens/blob/main/docs/submission-rehearsal.md");
  assert.ok(draft.requiredManualFields.includes("Terms review and final submit"));
  assert.ok(draft.fields.repositoryFit.chars <= 500);
  assert.ok(draft.fields.apiCreditsPlan.text.includes("implementation"));
  assert.match(draft.markdown, /Repository Fit/);
});
