#!/usr/bin/env node
import { promises as fs } from "node:fs";

const files = {
  adoption: await fs.readFile("docs/adoption-plan.md", "utf8"),
  status: await fs.readFile("docs/application-status.md", "utf8"),
  readme: await fs.readFile("README.md", "utf8"),
  reviewer: await fs.readFile("docs/reviewer-quickstart.md", "utf8"),
  checklist: await fs.readFile("docs/final-submission-checklist.md", "utf8"),
  workflow: await fs.readFile(".github/workflows/test.yml", "utf8"),
};

let failures = 0;

requireText("adoption", "# Adoption Plan", "title");
requireText("adoption", "young public OSS project", "new project positioning");
requireText("adoption", "30-day adoption loop", "adoption loop");
requireText("adoption", "privacy-first maintainer workflows", "privacy-first workflow seed");
requireText("adoption", "typed GitHub issue templates", "typed feedback route");
requireText("adoption", "npm run submission:check", "submission gate");
requireText("adoption", "npm exec --yes --package codex-oss-lens@latest -- codex-oss-lens demo", "published demo target");
requireText("adoption", "No local Codex logs, raw prompts, full paths", "privacy boundary");
requireText("status", "Adoption readiness | Ready", "application status row");
requireText("status", "npm run adoption:readiness", "application status command");
requireText("readme", "docs/adoption-plan.md", "README adoption link");
requireText("readme", "npm run adoption:readiness", "README adoption gate");
requireText("reviewer", "docs/adoption-plan.md", "reviewer adoption link");
requireText("checklist", "docs/adoption-plan.md", "final checklist adoption link");
requireText("checklist", "npm run adoption:readiness", "final checklist adoption gate");
requireText("workflow", "npm run adoption:readiness", "CI adoption gate");

if (failures) {
  console.error(`Adoption readiness check failed for ${failures} requirement(s).`);
  process.exit(1);
}

console.log("pass adoptionReadiness");

function requireText(fileKey, needle, label) {
  if (files[fileKey].includes(needle)) {
    console.log(`pass ${label}`);
    return;
  }
  console.error(`fail missing ${label}: ${needle}`);
  failures += 1;
}
