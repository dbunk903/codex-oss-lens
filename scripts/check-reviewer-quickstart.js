#!/usr/bin/env node
import { promises as fs } from "node:fs";
import { buildPublicEvidence } from "../src/public-evidence.js";

const QUICKSTART = "docs/reviewer-quickstart.md";
const text = await fs.readFile(QUICKSTART, "utf8");
const evidence = buildPublicEvidence();
let failures = 0;

requireText("# Reviewer Quickstart", "title");
requireText("npm exec --yes --package codex-oss-lens@latest -- codex-oss-lens demo", "published CLI smoke command");
requireText("local-first", "local-first privacy claim");
requireText("raw Codex logs, prompts, source code, and full paths are not uploaded", "privacy boundary");
requireText("signed-out browser", "signed-out public review guidance");

for (const [label, url] of Object.entries(evidence.publicLinks)) {
  requireText(url, `public evidence link ${label}`);
}

if (failures) {
  console.error(`Reviewer quickstart check failed for ${failures} requirement(s).`);
  process.exit(1);
}

console.log(`pass reviewerQuickstart links=${Object.keys(evidence.publicLinks).length}`);

function requireText(needle, label) {
  if (text.includes(needle)) {
    console.log(`pass ${label}`);
    return;
  }
  console.error(`fail missing ${label}: ${needle}`);
  failures += 1;
}
