#!/usr/bin/env node
import { promises as fs } from "node:fs";

const files = {
  handoff: await fs.readFile("docs/maintainer-handoff.md", "utf8"),
  status: await fs.readFile("docs/application-status.md", "utf8"),
  reviewer: await fs.readFile("docs/reviewer-quickstart.md", "utf8"),
  checklist: await fs.readFile("docs/final-submission-checklist.md", "utf8"),
  readme: await fs.readFile("README.md", "utf8"),
  dashboard: await fs.readFile("public/index.html", "utf8"),
  workflow: await fs.readFile(".github/workflows/test.yml", "utf8"),
  publishing: await fs.readFile("docs/npm-publishing.md", "utf8"),
  publishChecklist: await fs.readFile("application/publish-checklist.md", "utf8"),
};

let failures = 0;

requireText("handoff", "# Maintainer Handoff", "title");
requireText("handoff", "codex-oss-lens@1.6.1", "current package version");
requireText("handoff", "Primary maintainer: `dbunk903`", "primary maintainer");
requireText("handoff", "local-first Codex usage visibility", "core promise");
requireText("handoff", "npm run submission:check", "submission check command");
requireText("handoff", "npm run maintainer:handoff", "self gate command");
requireText("handoff", "docs/submission-rehearsal.md", "submission rehearsal link");
requireText("handoff", "docs/privacy-threat-model.md", "privacy model link");
requireText("handoff", "docs/data-retention.md", "data retention link");
requireText("handoff", "docs/npm-publishing.md", "npm publishing link");
requireText("handoff", "Do not add telemetry", "telemetry guard");
requireText("handoff", "Do not claim npm latest includes source-only changes", "npm latest guard");
requireText("handoff", "account-owner fields, organization ID", "manual submit guard");
requireText("handoff", "Do not commit private scans", "private artifact guard");
requireText("status", "Maintainer handoff | Ready", "application status row");
requireText("status", "npm run maintainer:handoff", "application status command");
requireText("reviewer", "docs/maintainer-handoff.md", "reviewer handoff link");
requireText("checklist", "docs/maintainer-handoff.md", "final checklist handoff link");
requireText("checklist", "npm run maintainer:handoff", "final checklist gate");
requireText("readme", "docs/maintainer-handoff.md", "README handoff link");
requireText("readme", "npm run maintainer:handoff", "README handoff gate");
requireText("dashboard", "docs/maintainer-handoff.md", "dashboard handoff link");
requireText("dashboard", "Maintainer handoff", "dashboard handoff label");
requireText("dashboard", "maintainer:handoff", "dashboard handoff gate");
requireText("workflow", "npm run maintainer:handoff", "CI handoff gate");
requireText("publishing", "npm run maintainer:handoff", "publishing docs handoff gate");
requireText("publishChecklist", "maintainer:handoff", "publish checklist handoff gate");

if (failures) {
  console.error(`Maintainer handoff readiness check failed for ${failures} requirement(s).`);
  process.exit(1);
}

console.log("pass maintainerHandoffReadiness");

function requireText(fileKey, needle, label) {
  if (files[fileKey].includes(needle)) {
    console.log(`pass ${label}`);
    return;
  }
  console.error(`fail missing ${label}: ${needle}`);
  failures += 1;
}
