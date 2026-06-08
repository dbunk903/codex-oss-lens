#!/usr/bin/env node
import { promises as fs } from "node:fs";
import { buildPublicEvidence } from "../src/public-evidence.js";

const packageJson = JSON.parse(await fs.readFile("package.json", "utf8"));
const version = packageJson.version;
const tag = `v${version}`;
const releaseUrl = `https://github.com/dbunk903/codex-oss-lens/releases/tag/${tag}`;
const files = [
  "application/final-copy.md",
  "application/form-answers.md",
  "docs/application-status.md",
  "docs/final-submission-checklist.md",
  "docs/reviewer-quickstart.md",
  "examples/form-draft.sample.md",
  "examples/form-draft.sample.json",
  "examples/public-evidence.sample.md",
  "examples/public-evidence.sample.json",
];

const evidence = buildPublicEvidence();
if (evidence.publicLinks.releaseUrl !== releaseUrl) {
  fail(`public-evidence release URL is ${evidence.publicLinks.releaseUrl}, expected ${releaseUrl}`);
}
console.log(`pass publicEvidenceRelease=${releaseUrl}`);

for (const file of files) {
  const text = await fs.readFile(file, "utf8");
  if (!text.includes(tag)) fail(`${file} does not mention ${tag}.`);
  if (!text.includes(releaseUrl)) fail(`${file} does not mention ${releaseUrl}.`);
  console.log(`pass ${file} ${tag}`);
}

console.log("pass submission versions aligned");

function fail(message) {
  console.error(message);
  process.exit(1);
}
