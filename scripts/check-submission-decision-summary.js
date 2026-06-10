#!/usr/bin/env node
import { promises as fs } from "node:fs";

const files = {
  summary: await fs.readFile("docs/submission-decision-summary.md", "utf8"),
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

requireText("summary", "# Submission Decision Summary", "title");
requireText("summary", "## Go Conditions", "go conditions");
requireText("summary", "## Stop Conditions", "stop conditions");
requireText("summary", "Public package is installable", "installable condition");
requireText("summary", "Reviewer evidence is reproducible", "reviewer evidence condition");
requireText("summary", "Privacy boundaries are current", "privacy condition");
requireText("summary", "Maintainer continuity is credible", "continuity condition");
requireText("summary", "Form copy is ready", "form copy condition");
requireText("summary", "Any local gate in `npm run submission:check` fails", "local stop condition");
requireText("summary", "npm run submission:decision", "self gate command");
requireText("summary", "account owner still makes the final browser-session submission decision manually", "manual decision boundary");
requireText("status", "Submission decision summary | Ready", "application status row");
requireText("status", "npm run submission:decision", "application status command");
requireText("reviewer", "docs/submission-decision-summary.md", "reviewer decision link");
requireText("checklist", "docs/submission-decision-summary.md", "final checklist decision link");
requireText("checklist", "npm run submission:decision", "final checklist gate");
requireText("readme", "docs/submission-decision-summary.md", "README decision link");
requireText("readme", "npm run submission:decision", "README decision gate");
requireText("dashboard", "docs/submission-decision-summary.md", "dashboard decision link");
requireText("dashboard", "Decision summary", "dashboard decision label");
requireText("dashboard", "submission:decision", "dashboard decision gate");
requireText("workflow", "npm run submission:decision", "CI decision gate");
requireText("publishing", "npm run submission:decision", "publishing docs decision gate");
requireText("publishChecklist", "submission:decision", "publish checklist decision gate");

if (failures) {
  console.error(`Submission decision summary check failed for ${failures} requirement(s).`);
  process.exit(1);
}

console.log("pass submissionDecisionSummary");

function requireText(fileKey, needle, label) {
  if (files[fileKey].includes(needle)) {
    console.log(`pass ${label}`);
    return;
  }
  console.error(`fail missing ${label}: ${needle}`);
  failures += 1;
}
