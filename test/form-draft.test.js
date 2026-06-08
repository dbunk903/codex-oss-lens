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
    },
  });

  assert.equal(draft.readyToPaste, true);
  assert.equal(draft.publicLinks.repository, "https://github.com/dbunk903/codex-oss-lens");
  assert.equal(draft.publicLinks.npmPackage, "https://www.npmjs.com/package/codex-oss-lens");
  assert.equal(draft.publicLinks.applicationStatus, "https://github.com/dbunk903/codex-oss-lens/blob/main/docs/application-status.md");
  assert.ok(draft.requiredManualFields.includes("Terms review and final submit"));
  assert.ok(draft.fields.repositoryFit.chars <= 500);
  assert.ok(draft.fields.apiCreditsPlan.text.includes("implementation"));
  assert.match(draft.markdown, /Repository Fit/);
});
