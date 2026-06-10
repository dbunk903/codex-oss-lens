#!/usr/bin/env node
import { promises as fs } from "node:fs";
import { buildPublicEvidence } from "../src/public-evidence.js";

const dashboard = await fs.readFile("public/index.html", "utf8");
const evidence = buildPublicEvidence();
let failures = 0;

requireText("Application Evidence", "application evidence panel");
requireText("Submission Gates", "submission gates panel");
requireText("submission-pack", "submission pack gate");
requireText("redact-check + readiness", "privacy readiness gate");
requireText("privacy threat model", "privacy threat model positioning");
requireText("privacy:threat-model", "privacy threat model gate");
requireText("docs/application-evidence-matrix.md", "dashboard evidence matrix link");
requireText("Evidence matrix", "dashboard evidence matrix label");
requireText("application:evidence", "dashboard evidence matrix gate");
requireText("docs/application-review-faq.md", "dashboard review FAQ link");
requireText("Review FAQ", "dashboard review FAQ label");
requireText("reviewer:faq", "dashboard review FAQ gate");
requireText("docs/submission-risk-register.md", "dashboard risk register link");
requireText("Risk register", "dashboard risk register label");
requireText("submission:risk", "dashboard risk register gate");
requireText("docs/accessibility.md", "dashboard accessibility link");
requireText("Accessibility", "dashboard accessibility label");
requireText("docs/data-retention.md", "dashboard data retention link");
requireText("Data retention", "dashboard data retention label");
requireText("data:retention", "dashboard data retention gate");
requireText("docs/maintainer-handoff.md", "dashboard maintainer handoff link");
requireText("Maintainer handoff", "dashboard maintainer handoff label");
requireText("maintainer:handoff", "dashboard maintainer handoff gate");
requireText("docs/scope-and-limitations.md", "dashboard scope limitations link");
requireText("Scope limits", "dashboard scope limitations label");
requireText("scope:limitations", "dashboard scope limitations gate");
requireText("docs/demo-walkthrough.md", "dashboard demo walkthrough link");
requireText("Demo walkthrough", "dashboard demo walkthrough label");
requireText("demo:walkthrough", "dashboard demo walkthrough gate");
requireText("docs/submission-rehearsal.md", "dashboard submission rehearsal link");
requireText("Submission rehearsal", "dashboard submission rehearsal label");
requireText("submission:rehearsal", "dashboard submission rehearsal gate");
requireText("public-evidence + evidence:sample", "public evidence sample gate");
requireText("reviewer:quickstart", "reviewer quickstart gate");
requireText("publish:samples + publish:docs", "publish gate");
requireText("evidence:links + readme:badges", "link and badge gate");
requireText("readme:readiness", "README readiness gate");
requireText("published install smoke", "published install smoke gate");
requireText("without uploading raw", "privacy positioning prefix");
requireText("rollout logs or source code", "privacy positioning scope");

for (const [label, url] of Object.entries({
  releaseUrl: evidence.publicLinks.releaseUrl,
  npmPackage: evidence.publicLinks.npmPackage,
  applicationStatusUrl: evidence.publicLinks.applicationStatusUrl,
  applicationEvidenceMatrixUrl: evidence.publicLinks.applicationEvidenceMatrixUrl,
  applicationReviewFaqUrl: evidence.publicLinks.applicationReviewFaqUrl,
  submissionRiskRegisterUrl: evidence.publicLinks.submissionRiskRegisterUrl,
  reviewerQuickstartUrl: evidence.publicLinks.reviewerQuickstartUrl,
  privacyThreatModelUrl: evidence.publicLinks.privacyThreatModelUrl,
  maintainerHandoffUrl: evidence.publicLinks.maintainerHandoffUrl,
  scopeLimitationsUrl: evidence.publicLinks.scopeLimitationsUrl,
  dataRetentionUrl: evidence.publicLinks.dataRetentionUrl,
  demoWalkthroughUrl: evidence.publicLinks.demoWalkthroughUrl,
  accessibilityUrl: evidence.publicLinks.accessibilityUrl,
  finalChecklistUrl: evidence.publicLinks.finalChecklistUrl,
  submissionRehearsalUrl: evidence.publicLinks.submissionRehearsalUrl,
  publicEvidenceSampleUrl: evidence.publicLinks.publicEvidenceSampleUrl,
  dashboardPreviewUrl: evidence.publicLinks.dashboardPreviewUrl,
  mobileDashboardPreviewUrl: evidence.publicLinks.mobileDashboardPreviewUrl,
  publishCheckSampleUrl: evidence.publicLinks.publishCheckSampleUrl,
  installSmokeSampleUrl: evidence.publicLinks.installSmokeSampleUrl,
})) {
  requireText(url, `dashboard public link ${label}`);
}

await requirePngSize("examples/dashboard-preview.png", 1440, 1200, "desktop dashboard preview");
await requirePngSize("examples/dashboard-mobile-preview.png", 500, 1100, "mobile dashboard preview");

if (failures) {
  console.error(`Dashboard readiness check failed for ${failures} requirement(s).`);
  process.exit(1);
}

console.log("pass dashboardReadiness");

function requireText(needle, label) {
  if (dashboard.includes(needle)) {
    console.log(`pass ${label}`);
    return;
  }
  console.error(`fail missing ${label}: ${needle}`);
  failures += 1;
}

async function requirePngSize(file, expectedWidth, expectedHeight, label) {
  const png = await fs.readFile(file);
  const width = png.readUInt32BE(16);
  const height = png.readUInt32BE(20);
  if (width === expectedWidth && height === expectedHeight) {
    console.log(`pass ${label} ${width}x${height}`);
    return;
  }
  console.error(`fail ${label}: expected ${expectedWidth}x${expectedHeight}, got ${width}x${height}`);
  failures += 1;
}
