#!/usr/bin/env node
import { promises as fs } from "node:fs";

const files = {
  matrix: await fs.readFile("docs/application-evidence-matrix.md", "utf8"),
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

requireText("matrix", "# Application Evidence Matrix", "title");
requireText("matrix", "Is the project public and installable?", "installable question");
requireText("matrix", "Is the tool relevant to Codex users?", "Codex relevance question");
requireText("matrix", "application review FAQ", "review FAQ proof");
requireText("matrix", "Is private Codex data protected?", "privacy question");
requireText("matrix", "Can reviewers reproduce the evidence?", "reproducibility question");
requireText("matrix", "Is the project maintainable after submission?", "maintainability question");
requireText("matrix", "Are limits and manual gates clear?", "manual-gate question");
requireText("matrix", "npm run application:evidence", "self gate command");
requireText("matrix", "codex-oss-lens@latest", "source-vs-published boundary");
requireText("status", "Application evidence matrix | Ready", "application status row");
requireText("status", "npm run application:evidence", "application status command");
requireText("reviewer", "docs/application-evidence-matrix.md", "reviewer matrix link");
requireText("checklist", "docs/application-evidence-matrix.md", "final checklist matrix link");
requireText("checklist", "npm run application:evidence", "final checklist gate");
requireText("readme", "docs/application-evidence-matrix.md", "README matrix link");
requireText("readme", "npm run application:evidence", "README matrix gate");
requireText("dashboard", "docs/application-evidence-matrix.md", "dashboard matrix link");
requireText("dashboard", "Evidence matrix", "dashboard matrix label");
requireText("dashboard", "application:evidence", "dashboard matrix gate");
requireText("workflow", "npm run application:evidence", "CI matrix gate");
requireText("publishing", "npm run application:evidence", "publishing docs matrix gate");
requireText("publishChecklist", "application:evidence", "publish checklist matrix gate");

if (failures) {
  console.error(`Application evidence matrix check failed for ${failures} requirement(s).`);
  process.exit(1);
}

console.log("pass applicationEvidenceMatrix");

function requireText(fileKey, needle, label) {
  if (files[fileKey].includes(needle)) {
    console.log(`pass ${label}`);
    return;
  }
  console.error(`fail missing ${label}: ${needle}`);
  failures += 1;
}
