#!/usr/bin/env node
import { promises as fs } from "node:fs";
import { buildPublicEvidence } from "../src/public-evidence.js";

const STATUS_DOC = "docs/application-status.md";
const text = await fs.readFile(STATUS_DOC, "utf8");
const packageJson = JSON.parse(await fs.readFile("package.json", "utf8"));
const installSmokeSample = JSON.parse(await fs.readFile("examples/install-smoke.sample.json", "utf8"));
const evidence = buildPublicEvidence();
let failures = 0;

requireText("# Application Status", "title");
requireText(`codex-oss-lens@${packageJson.version}`, "current package version");
requireText("npm run submission:check", "submit-time gate command");
requireText("Account-owner fields", "manual account-owner row");
requireValue(installSmokeSample.package?.resolvedVersion, packageJson.version, "install smoke resolved version");
requireValue(installSmokeSample.package?.version, "latest", "install smoke package selector");

for (const [label, url] of Object.entries(evidence.publicLinks)) {
  requireText(url, `public evidence link ${label}`);
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

function requireValue(actual, expected, label) {
  if (actual === expected) {
    console.log(`pass ${label}`);
    return;
  }
  console.error(`fail ${label}: expected ${expected}, got ${actual}`);
  failures += 1;
}
