#!/usr/bin/env node
import { promises as fs } from "node:fs";
import { buildPublicEvidence } from "../src/public-evidence.js";

const readme = await fs.readFile("README.md", "utf8");
const evidence = buildPublicEvidence();
let failures = 0;

requireText("npm run submission:check", "one-command submission gate");
requireText("npm run application:evidence", "application evidence matrix gate");
requireText("npm run reviewer:faq", "application review FAQ gate");
requireText("npm run reviewer:quickstart", "reviewer quickstart gate");
requireText("npm run form-draft:sample", "form draft sample gate");
requireText("npm run publish:samples", "publish samples gate");
requireText("npm run ci:readiness", "CI readiness gate");
requireText("npm run contrib:readiness", "contribution readiness gate");
requireText("npm run security:readiness", "security readiness gate");
requireText("npm run support:readiness", "support readiness gate");
requireText("npm run conduct:readiness", "conduct readiness gate");
requireText("npm run license:readiness", "license readiness gate");
requireText("npm run issue-routing:readiness", "issue routing readiness gate");
requireText("npm run release:provenance", "release provenance gate");
requireText("npm run adoption:readiness", "adoption readiness gate");
requireText("npm run maintenance:readiness", "maintenance readiness gate");
requireText("npm run maintainer:handoff", "maintainer handoff gate");
requireText("npm run scope:limitations", "scope limitations gate");
requireText("npm run privacy:threat-model", "privacy threat model gate");
requireText("npm run accessibility:readiness", "accessibility readiness gate");
requireText("npm run data:retention", "data retention gate");
requireText("npm run demo:walkthrough", "demo walkthrough gate");
requireText("npm run submission:rehearsal", "submission rehearsal gate");
requireText("npm run public:redaction", "public redaction gate");
requireText("npm run evidence:sample", "public evidence sample gate");
requireText("npm run evidence:links", "public link health gate");
requireText("npm run readme:badges", "README badge gate");
requireText("docs/application-status.md", "application status link");
requireText("docs/application-evidence-matrix.md", "application evidence matrix link");
requireText("docs/application-review-faq.md", "application review FAQ link");
requireText("docs/reviewer-quickstart.md", "reviewer quickstart link");
requireText("docs/final-submission-checklist.md", "final checklist link");
requireText("docs/release-provenance.md", "release provenance link");
requireText("docs/adoption-plan.md", "adoption plan link");
requireText("docs/maintenance-policy.md", "maintenance policy link");
requireText("docs/maintainer-handoff.md", "maintainer handoff link");
requireText("docs/scope-and-limitations.md", "scope limitations link");
requireText("docs/privacy-threat-model.md", "privacy threat model link");
requireText("docs/accessibility.md", "accessibility link");
requireText("docs/data-retention.md", "data retention link");
requireText("docs/demo-walkthrough.md", "demo walkthrough link");
requireText("docs/submission-rehearsal.md", "submission rehearsal link");
requireText("SUPPORT.md", "support policy link");
requireText("CODE_OF_CONDUCT.md", "code of conduct link");
requireText("[MIT](LICENSE)", "license link");
requireText("examples/public-evidence.sample.md", "public evidence sample link");
requireText("examples/dashboard-preview.png", "dashboard preview link");
requireText("examples/dashboard-mobile-preview.png", "mobile dashboard preview link");
requireText("1440x1200", "desktop preview dimension");
requireText("500x1100", "mobile preview dimension");
requireText("public GitHub raw URLs", "public preview dimension check");
requireText("examples/publish-check.sample.md", "publish check sample link");
requireText("examples/install-smoke.sample.md", "install smoke sample link");

for (const url of [
  evidence.publicLinks.repo,
  evidence.publicLinks.releaseUrl,
  evidence.publicLinks.npmPackage,
  evidence.publicLinks.applicationStatusUrl,
  evidence.publicLinks.applicationReviewFaqUrl,
  evidence.publicLinks.reviewerQuickstartUrl,
  evidence.publicLinks.dashboardPreviewUrl,
  evidence.publicLinks.mobileDashboardPreviewUrl,
]) {
  requireText(url, `public reviewer URL ${url}`);
}

if (failures) {
  console.error(`README readiness check failed for ${failures} requirement(s).`);
  process.exit(1);
}

console.log("pass readmeReadiness");

function requireText(needle, label) {
  if (readme.includes(needle)) {
    console.log(`pass ${label}`);
    return;
  }
  console.error(`fail missing ${label}: ${needle}`);
  failures += 1;
}
