#!/usr/bin/env node
import { promises as fs } from "node:fs";
import { buildPublicEvidence } from "../src/public-evidence.js";

const STATUS_DOC = "docs/application-status.md";
const FINAL_CHECKLIST = "docs/final-submission-checklist.md";
const text = await fs.readFile(STATUS_DOC, "utf8");
const checklistText = await fs.readFile(FINAL_CHECKLIST, "utf8");
const packageJson = JSON.parse(await fs.readFile("package.json", "utf8"));
const formDraftSample = JSON.parse(await fs.readFile("examples/form-draft.sample.json", "utf8"));
const installSmokeSample = JSON.parse(await fs.readFile("examples/install-smoke.sample.json", "utf8"));
const publishCheckSample = JSON.parse(await fs.readFile("examples/publish-check.sample.json", "utf8"));
const evidence = buildPublicEvidence();
let failures = 0;

requireText("# Application Status", "title");
requireText(`codex-oss-lens@${packageJson.version}`, "current package version");
requireText("npm run submission:check", "submit-time gate command");
requireText("npm run evidence:sample", "public evidence sample gate command");
requireText("npm run reviewer:quickstart", "reviewer quickstart gate command");
requireText("npm run publish:samples", "publish samples gate command");
requireText("npm run evidence:links", "public link health gate command");
requireText("npm run readme:badges", "README badge gate command");
requireText("Public evidence sample | Ready", "public evidence sample row");
requireText("Reviewer quickstart | Ready", "reviewer quickstart row");
requireText("Publish samples | Ready", "publish samples row");
requireText("Public link health | Ready", "public link health row");
requireText("README badges | Ready", "README badges row");
requireText("Account-owner fields", "manual account-owner row");
requireValue(formDraftSample.publicLinks?.latestRelease, `https://github.com/dbunk903/codex-oss-lens/releases/tag/v${packageJson.version}`, "form draft release link");
requireValue(formDraftSample.publicLinks?.roadmap, "https://github.com/dbunk903/codex-oss-lens/blob/main/ROADMAP.md", "form draft roadmap link");
requireValue(formDraftSample.publicLinks?.apiCreditWorkflow, "https://github.com/dbunk903/codex-oss-lens/blob/main/docs/api-credit-workflow.md", "form draft API workflow link");
requireNoText(JSON.stringify(formDraftSample), "TODO", "form draft sample placeholders");
requireValue(installSmokeSample.package?.resolvedVersion, packageJson.version, "install smoke resolved version");
requireValue(installSmokeSample.package?.version, "latest", "install smoke package selector");
requireValue(publishCheckSample.package?.version, packageJson.version, "publish check package version");
requireValue(publishCheckSample.package?.latestPublishedVersion, packageJson.version, "publish check latest published version");
requireValue(publishCheckSample.status, "blocked", "publish check blocks republish");

for (const [label, url] of Object.entries(evidence.publicLinks)) {
  requireText(url, `public evidence link ${label}`);
  requireChecklistText(url, `checklist public evidence link ${label}`);
}

for (const field of evidence.manualFields) {
  requireText(field, `manual field ${field}`);
}

if (failures) {
  console.error(`Application status check failed for ${failures} requirement(s).`);
  process.exit(1);
}

console.log(`pass applicationStatus links=${Object.keys(evidence.publicLinks).length} manualFields=${evidence.manualFields.length}`);

function requireText(needle, label) {
  if (text.includes(needle)) {
    console.log(`pass ${label}`);
    return;
  }
  console.error(`fail missing ${label}: ${needle}`);
  failures += 1;
}

function requireChecklistText(needle, label) {
  if (checklistText.includes(needle)) {
    console.log(`pass ${label}`);
    return;
  }
  console.error(`fail missing ${label}: ${needle}`);
  failures += 1;
}

function requireValue(actual, expected, label) {
  if (actual === expected) {
    console.log(`pass ${label}`);
    return;
  }
  console.error(`fail ${label}: expected ${expected}, got ${actual}`);
  failures += 1;
}

function requireNoText(source, needle, label) {
  if (!source.includes(needle)) {
    console.log(`pass ${label}`);
    return;
  }
  console.error(`fail ${label}: found ${needle}`);
  failures += 1;
}
