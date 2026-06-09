#!/usr/bin/env node
import { promises as fs } from "node:fs";

const files = {
  policy: await fs.readFile("docs/maintenance-policy.md", "utf8"),
  status: await fs.readFile("docs/application-status.md", "utf8"),
  readme: await fs.readFile("README.md", "utf8"),
  reviewer: await fs.readFile("docs/reviewer-quickstart.md", "utf8"),
  checklist: await fs.readFile("docs/final-submission-checklist.md", "utf8"),
  publishing: await fs.readFile("docs/npm-publishing.md", "utf8"),
  publishChecklist: await fs.readFile("application/publish-checklist.md", "utf8"),
  workflow: await fs.readFile(".github/workflows/test.yml", "utf8"),
};

let failures = 0;

requireText("policy", "# Maintenance Policy", "title");
requireText("policy", "Primary maintainer: `dbunk903`", "primary maintainer");
requireText("policy", "GitHub issue templates for bugs, feature requests, and integration requests", "public support route");
requireText("policy", "follow `SECURITY.md`", "security route");
requireText("policy", "follow `CODE_OF_CONDUCT.md`", "conduct route");
requireText("policy", "Review new public issues at least weekly", "triage cadence");
requireText("policy", "raw Codex logs, prompts, full filesystem paths, secrets, or private", "privacy triage boundary");
requireText("policy", "Before every release, run `npm run submission:check`, `npm run public:redaction`, and", "release gate");
requireText("policy", "After publishing, run the published install smoke command", "post-publish smoke");
requireText("policy", "Do not add telemetry, remote upload, or API-backed summarization without explicit opt-in", "network boundary");
requireText("status", "Maintenance readiness | Ready", "application status row");
requireText("status", "npm run maintenance:readiness", "application status command");
requireText("readme", "docs/maintenance-policy.md", "README maintenance link");
requireText("readme", "npm run maintenance:readiness", "README maintenance gate");
requireText("reviewer", "docs/maintenance-policy.md", "reviewer maintenance link");
requireText("checklist", "docs/maintenance-policy.md", "final checklist maintenance link");
requireText("checklist", "npm run maintenance:readiness", "final checklist maintenance gate");
requireText("publishing", "npm run maintenance:readiness", "publishing maintenance gate");
requireText("publishChecklist", "maintenance:readiness", "publish checklist maintenance gate");
requireText("workflow", "npm run maintenance:readiness", "CI maintenance gate");

if (failures) {
  console.error(`Maintenance readiness check failed for ${failures} requirement(s).`);
  process.exit(1);
}

console.log("pass maintenanceReadiness");

function requireText(fileKey, needle, label) {
  if (files[fileKey].includes(needle)) {
    console.log(`pass ${label}`);
    return;
  }
  console.error(`fail missing ${label}: ${needle}`);
  failures += 1;
}
