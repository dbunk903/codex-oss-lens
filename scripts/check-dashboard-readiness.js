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
  reviewerQuickstartUrl: evidence.publicLinks.reviewerQuickstartUrl,
  finalChecklistUrl: evidence.publicLinks.finalChecklistUrl,
  publicEvidenceSampleUrl: evidence.publicLinks.publicEvidenceSampleUrl,
  publishCheckSampleUrl: evidence.publicLinks.publishCheckSampleUrl,
  installSmokeSampleUrl: evidence.publicLinks.installSmokeSampleUrl,
})) {
  requireText(url, `dashboard public link ${label}`);
}

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
