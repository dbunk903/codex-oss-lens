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
requireText("npm run form-draft:sample", "form draft sample gate command");
requireText("npm run publish:samples", "publish samples gate command");
requireText("npm run publish:docs", "publishing docs gate command");
requireText("npm run dashboard:readiness", "dashboard readiness gate command");
requireText("npm run ci:readiness", "CI readiness gate command");
requireText("npm run contrib:readiness", "contribution readiness gate command");
requireText("npm run security:readiness", "security readiness gate command");
requireText("npm run support:readiness", "support readiness gate command");
requireText("npm run conduct:readiness", "conduct readiness gate command");
requireText("npm run license:readiness", "license readiness gate command");
requireText("npm run issue-routing:readiness", "issue routing readiness gate command");
requireText("npm run release:provenance", "release provenance gate command");
requireText("npm run adoption:readiness", "adoption readiness gate command");
requireText("npm run maintenance:readiness", "maintenance readiness gate command");
requireText("npm run privacy:threat-model", "privacy threat model gate command");
requireText("npm run accessibility:readiness", "accessibility readiness gate command");
requireText("npm run data:retention", "data retention gate command");
requireText("npm run evidence:links", "public link health gate command");
requireText("npm run readme:badges", "README badge gate command");
requireText("npm run readme:readiness", "README readiness gate command");
requireText("package metadata, license/support/conduct docs, and GitHub templates/workflows", "public redaction scope");
requireText("Public evidence sample | Ready", "public evidence sample row");
requireText("Reviewer quickstart | Ready", "reviewer quickstart row");
requireText("full reviewer link map", "form draft full link map");
requireText("Form draft sample | Ready", "form draft sample row");
requireText("Form draft links | Ready", "form draft links row");
requireText("Publish samples | Ready", "publish samples row");
requireText("Publishing docs | Ready", "publishing docs row");
requireText("Dashboard readiness | Ready", "dashboard readiness row");
requireText("CI readiness | Ready", "CI readiness row");
requireText("Contribution readiness | Ready", "contribution readiness row");
requireText("Security readiness | Ready", "security readiness row");
requireText("Support readiness | Ready", "support readiness row");
requireText("Conduct readiness | Ready", "conduct readiness row");
requireText("License readiness | Ready", "license readiness row");
requireText("Issue routing readiness | Ready", "issue routing readiness row");
requireText("Release provenance | Ready", "release provenance row");
requireText("Adoption readiness | Ready", "adoption readiness row");
requireText("Maintenance readiness | Ready", "maintenance readiness row");
requireText("Privacy threat model | Ready", "privacy threat model row");
requireText("Accessibility readiness | Ready", "accessibility readiness row");
requireText("Data retention | Ready", "data retention row");
requireText("Visual previews | Ready", "visual previews row");
requireText("Public link health | Ready", "public link health row");
requireText("public preview PNG dimensions", "public preview PNG dimensions");
requireText("README badges | Ready", "README badges row");
requireText("README readiness | Ready", "README readiness row");
requireText("Account-owner fields", "manual account-owner row");
requireValue(formDraftSample.publicLinks?.latestRelease, `https://github.com/dbunk903/codex-oss-lens/releases/tag/v${packageJson.version}`, "form draft release link");
requireValue(formDraftSample.publicLinks?.npmPackage, "https://www.npmjs.com/package/codex-oss-lens", "form draft npm link");
requireValue(formDraftSample.publicLinks?.applicationStatus, "https://github.com/dbunk903/codex-oss-lens/blob/main/docs/application-status.md", "form draft status link");
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
