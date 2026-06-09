#!/usr/bin/env node
import { promises as fs } from "node:fs";

const packageJson = JSON.parse(await fs.readFile("package.json", "utf8"));
const files = {
  license: await fs.readFile("LICENSE", "utf8"),
  readme: await fs.readFile("README.md", "utf8"),
  packageJsonText: await fs.readFile("package.json", "utf8"),
  npmPublishing: await fs.readFile("docs/npm-publishing.md", "utf8"),
  finalChecklist: await fs.readFile("docs/final-submission-checklist.md", "utf8"),
};

let failures = 0;

requireValue(packageJson.license, "MIT", "package license");
requireArrayValue(packageJson.files, "LICENSE", "package license allowlist");
requireText("license", "MIT License", "license title");
requireText("license", "Copyright (c) 2026 Codex OSS Lens contributors", "license copyright");
requireText("license", "Permission is hereby granted, free of charge", "MIT permission grant");
requireText("license", "THE SOFTWARE IS PROVIDED \"AS IS\"", "MIT warranty disclaimer");
requireText("readme", "[MIT](LICENSE)", "README license link");
requireText("readme", "https://img.shields.io/github/license/dbunk903/codex-oss-lens", "README license badge");
requireText("packageJsonText", "\"license\": \"MIT\"", "package license metadata");
requireText("npmPublishing", "LICENSE", "publishing docs package content");
requireText("finalChecklist", "npm run license:readiness", "final checklist license gate");

if (failures) {
  console.error(`License readiness check failed for ${failures} requirement(s).`);
  process.exit(1);
}

console.log("pass licenseReadiness");

function requireText(fileKey, needle, label) {
  if (files[fileKey].includes(needle)) {
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

function requireArrayValue(values, expected, label) {
  if (Array.isArray(values) && values.includes(expected)) {
    console.log(`pass ${label}`);
    return;
  }
  console.error(`fail ${label}: missing ${expected}`);
  failures += 1;
}
