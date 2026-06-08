#!/usr/bin/env node
import { promises as fs } from "node:fs";
import { buildPublicEvidence } from "../src/public-evidence.js";

const readme = await fs.readFile("README.md", "utf8");
const evidence = buildPublicEvidence();
let failures = 0;

requireText("npm run submission:check", "one-command submission gate");
requireText("npm run reviewer:quickstart", "reviewer quickstart gate");
requireText("npm run form-draft:sample", "form draft sample gate");
requireText("npm run publish:samples", "publish samples gate");
requireText("npm run ci:readiness", "CI readiness gate");
requireText("npm run contrib:readiness", "contribution readiness gate");
requireText("npm run public:redaction", "public redaction gate");
requireText("npm run evidence:sample", "public evidence sample gate");
requireText("npm run evidence:links", "public link health gate");
requireText("npm run readme:badges", "README badge gate");
requireText("docs/application-status.md", "application status link");
requireText("docs/reviewer-quickstart.md", "reviewer quickstart link");
requireText("docs/final-submission-checklist.md", "final checklist link");
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
