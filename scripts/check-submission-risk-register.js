#!/usr/bin/env node
import { promises as fs } from "node:fs";

const files = {
  risk: await fs.readFile("docs/submission-risk-register.md", "utf8"),
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

requireText("risk", "# Submission Risk Register", "title");
requireText("risk", "Young public project", "young-project risk");
requireText("risk", "Private Codex data exposure", "privacy risk");
requireText("risk", "Source-vs-published drift", "published-drift risk");
requireText("risk", "Manual account-owner fields", "manual-fields risk");
requireText("risk", "API-credit scope creep", "api-scope risk");
requireText("risk", "Evidence link rot", "link-rot risk");
requireText("risk", "Do not submit if any local gate above fails", "submit-time decision");
requireText("risk", "npm run submission:risk", "self gate command");
requireText("risk", "codex-oss-lens@latest", "latest package boundary");
requireText("status", "Submission risk register | Ready", "application status row");
requireText("status", "npm run submission:risk", "application status command");
requireText("reviewer", "docs/submission-risk-register.md", "reviewer risk link");
requireText("checklist", "docs/submission-risk-register.md", "final checklist risk link");
requireText("checklist", "npm run submission:risk", "final checklist gate");
requireText("readme", "docs/submission-risk-register.md", "README risk link");
requireText("readme", "npm run submission:risk", "README risk gate");
requireText("dashboard", "docs/submission-risk-register.md", "dashboard risk link");
requireText("dashboard", "Risk register", "dashboard risk label");
requireText("dashboard", "submission:risk", "dashboard risk gate");
requireText("workflow", "npm run submission:risk", "CI risk gate");
requireText("publishing", "npm run submission:risk", "publishing docs risk gate");
requireText("publishChecklist", "submission:risk", "publish checklist risk gate");

if (failures) {
  console.error(`Submission risk register check failed for ${failures} requirement(s).`);
  process.exit(1);
}

console.log("pass submissionRiskRegister");

function requireText(fileKey, needle, label) {
  if (files[fileKey].includes(needle)) {
    console.log(`pass ${label}`);
    return;
  }
  console.error(`fail missing ${label}: ${needle}`);
  failures += 1;
}
