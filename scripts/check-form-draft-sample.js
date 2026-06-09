#!/usr/bin/env node
import { promises as fs } from "node:fs";
import { buildPublicEvidence } from "../src/public-evidence.js";

const sample = JSON.parse(await fs.readFile("examples/form-draft.sample.json", "utf8"));
const markdown = await fs.readFile("examples/form-draft.sample.md", "utf8");
const evidence = buildPublicEvidence();
let failures = 0;

const expectedLinks = {
  repository: evidence.publicLinks.repo,
  latestRelease: evidence.publicLinks.releaseUrl,
  npmPackage: evidence.publicLinks.npmPackage,
  roadmap: evidence.publicLinks.roadmapUrl,
  applicationStatus: evidence.publicLinks.applicationStatusUrl,
  reviewerQuickstart: evidence.publicLinks.reviewerQuickstartUrl,
  releaseProvenance: evidence.publicLinks.releaseProvenanceUrl,
  adoptionPlan: evidence.publicLinks.adoptionPlanUrl,
  maintenancePolicy: evidence.publicLinks.maintenancePolicyUrl,
  privacyThreatModel: evidence.publicLinks.privacyThreatModelUrl,
  dataRetention: evidence.publicLinks.dataRetentionUrl,
  demoWalkthrough: evidence.publicLinks.demoWalkthroughUrl,
  accessibility: evidence.publicLinks.accessibilityUrl,
  apiCreditWorkflow: evidence.publicLinks.apiWorkflowUrl,
  maintainerUseCases: evidence.publicLinks.useCasesUrl,
  finalChecklist: evidence.publicLinks.finalChecklistUrl,
  finalCopy: evidence.publicLinks.finalCopyUrl,
  formDraftSample: evidence.publicLinks.formDraftSampleUrl,
  publicEvidenceSample: evidence.publicLinks.publicEvidenceSampleUrl,
  dashboardPreview: evidence.publicLinks.dashboardPreviewUrl,
  mobileDashboardPreview: evidence.publicLinks.mobileDashboardPreviewUrl,
  publishCheckSample: evidence.publicLinks.publishCheckSampleUrl,
  installSmokeSample: evidence.publicLinks.installSmokeSampleUrl,
  nodeCi: evidence.publicLinks.nodeCiUrl,
  publishedSmoke: evidence.publicLinks.publishedSmokeUrl,
};

requireEqual(sample.readyToPaste, true, "readyToPaste");
requireEqual(sample.interests?.[0], "Project API credits", "project API credits interest");
requireNoText(JSON.stringify(sample), "TODO", "JSON placeholders");
requireNoText(markdown, "TODO", "markdown placeholders");

for (const [key, url] of Object.entries(expectedLinks)) {
  requireEqual(sample.publicLinks?.[key], url, `public link ${key}`);
  requireText(markdown, url, `markdown link ${key}`);
}

for (const field of evidence.manualFields) {
  requireText(JSON.stringify(sample.requiredManualFields), field, `manual field ${field}`);
  requireText(markdown, field, `markdown manual field ${field}`);
}

for (const [field, value] of Object.entries(sample.fields || {})) {
  requireEqual(value.withinLimit, true, `${field} within limit`);
  if (value.chars > value.limit) {
    fail(`${field} exceeds ${value.limit}: ${value.chars}`);
  } else {
    console.log(`pass ${field} chars=${value.chars}/${value.limit}`);
  }
}

if (failures) {
  console.error(`Form draft sample check failed for ${failures} requirement(s).`);
  process.exit(1);
}

console.log(`pass formDraftSample links=${Object.keys(expectedLinks).length}`);

function requireEqual(actual, expected, label) {
  if (actual === expected) {
    console.log(`pass ${label}`);
    return;
  }
  fail(`${label}: expected ${expected}, got ${actual}`);
}

function requireText(source, needle, label) {
  if (source.includes(needle)) {
    console.log(`pass ${label}`);
    return;
  }
  fail(`missing ${label}: ${needle}`);
}

function requireNoText(source, needle, label) {
  if (!source.includes(needle)) {
    console.log(`pass ${label}`);
    return;
  }
  fail(`${label}: found ${needle}`);
}

function fail(message) {
  console.error(`fail ${message}`);
  failures += 1;
}
