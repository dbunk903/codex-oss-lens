#!/usr/bin/env node
import { promises as fs } from "node:fs";

const files = {
  signedOut: await fs.readFile("docs/signed-out-review.md", "utf8"),
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

requireText("signedOut", "# Signed-Out Review Checklist", "title");
requireText("signedOut", "Public Browser Checks", "public browser checks");
requireText("signedOut", "Repository opens", "repository check");
requireText("signedOut", "Release opens", "release check");
requireText("signedOut", "npm package opens", "npm check");
requireText("signedOut", "Reviewer docs open", "reviewer docs check");
requireText("signedOut", "Preview images open", "preview image check");
requireText("signedOut", "CI workflows open", "CI check");
requireText("signedOut", "npm run reviewer:signedout", "self gate command");
requireText("signedOut", "npm run evidence:links", "public link command");
requireText("signedOut", "npm run submission:check", "submission check command");
requireText("signedOut", "account-owner-only", "manual account-owner boundary");
requireText("signedOut", "Private Codex logs", "private data boundary");
requireText("status", "Signed-out review | Ready", "application status row");
requireText("status", "npm run reviewer:signedout", "application status command");
requireText("reviewer", "docs/signed-out-review.md", "reviewer signed-out link");
requireText("checklist", "docs/signed-out-review.md", "final checklist signed-out link");
requireText("checklist", "npm run reviewer:signedout", "final checklist gate");
requireText("readme", "docs/signed-out-review.md", "README signed-out link");
requireText("readme", "npm run reviewer:signedout", "README signed-out gate");
requireText("dashboard", "docs/signed-out-review.md", "dashboard signed-out link");
requireText("dashboard", "Signed-out review", "dashboard signed-out label");
requireText("dashboard", "reviewer:signedout", "dashboard signed-out gate");
requireText("workflow", "npm run reviewer:signedout", "CI signed-out gate");
requireText("publishing", "npm run reviewer:signedout", "publishing docs signed-out gate");
requireText("publishChecklist", "reviewer:signedout", "publish checklist signed-out gate");

if (failures) {
  console.error(`Signed-out review check failed for ${failures} requirement(s).`);
  process.exit(1);
}

console.log("pass signedOutReview");

function requireText(fileKey, needle, label) {
  if (files[fileKey].includes(needle)) {
    console.log(`pass ${label}`);
    return;
  }
  console.error(`fail missing ${label}: ${needle}`);
  failures += 1;
}
