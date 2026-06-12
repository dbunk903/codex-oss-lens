#!/usr/bin/env node
import { promises as fs } from "node:fs";

const files = {
  log: await fs.readFile("docs/submission-activity-log.md", "utf8"),
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

requireText("log", "# Submission Activity Log", "title");
requireText("log", "Recent Readiness Work", "recent work section");
requireText("log", "1d2a6d0", "privacy-safe support evidence commit");
requireText("log", "cda9c50", "support policy public evidence commit");
requireText("log", "0cd2773", "dashboard support route commit");
requireText("log", "b1c70a3", "adoption support evidence commit");
requireText("log", "87bc98e", "support question route commit");
requireText("log", "Privacy-safe support evidence", "privacy-safe support evidence row");
requireText("log", "SUPPORT.md", "support policy artifact");
requireText("log", "issue chooser guidance", "issue chooser guidance row");
requireText("log", "active readiness work", "young-project signal");
requireText("log", "npm run submission:activity", "self gate command");
requireText("log", "npm run submission:check", "submission check command");
requireText("log", "codex-oss-lens@1.6.1", "published package boundary");
requireText("status", "Submission activity log | Ready", "application status row");
requireText("status", "npm run submission:activity", "application status command");
requireText("reviewer", "docs/submission-activity-log.md", "reviewer activity link");
requireText("checklist", "docs/submission-activity-log.md", "final checklist activity link");
requireText("checklist", "npm run submission:activity", "final checklist gate");
requireText("readme", "docs/submission-activity-log.md", "README activity link");
requireText("readme", "npm run submission:activity", "README activity gate");
requireText("dashboard", "docs/submission-activity-log.md", "dashboard activity link");
requireText("dashboard", "Activity log", "dashboard activity label");
requireText("dashboard", "submission:activity", "dashboard activity gate");
requireText("workflow", "npm run submission:activity", "CI activity gate");
requireText("publishing", "npm run submission:activity", "publishing docs activity gate");
requireText("publishChecklist", "submission:activity", "publish checklist activity gate");

if (failures) {
  console.error(`Submission activity log check failed for ${failures} requirement(s).`);
  process.exit(1);
}

console.log("pass submissionActivityLog");

function requireText(fileKey, needle, label) {
  if (files[fileKey].includes(needle)) {
    console.log(`pass ${label}`);
    return;
  }
  console.error(`fail missing ${label}: ${needle}`);
  failures += 1;
}
