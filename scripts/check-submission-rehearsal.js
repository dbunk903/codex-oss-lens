#!/usr/bin/env node
import { promises as fs } from "node:fs";

const files = {
  rehearsal: await fs.readFile("docs/submission-rehearsal.md", "utf8"),
  status: await fs.readFile("docs/application-status.md", "utf8"),
  reviewer: await fs.readFile("docs/reviewer-quickstart.md", "utf8"),
  checklist: await fs.readFile("docs/final-submission-checklist.md", "utf8"),
  readme: await fs.readFile("README.md", "utf8"),
  dashboard: await fs.readFile("public/index.html", "utf8"),
  workflow: await fs.readFile(".github/workflows/test.yml", "utf8"),
  formAnswers: await fs.readFile("application/form-answers.md", "utf8"),
};

let failures = 0;

requireText("rehearsal", "# Submission Rehearsal", "title");
requireText("rehearsal", "npm run submission:check", "submission check command");
requireText("rehearsal", "npm run evidence:links", "public link command");
requireText("rehearsal", "npm run npm:latest", "npm latest command");
requireText("rehearsal", "npm run ci:latest", "latest CI command");
requireText("rehearsal", "npm run submission:rehearsal", "self gate command");
requireText("rehearsal", "live npm dist-tag", "live npm latest expected signal");
requireText("rehearsal", "latest public Node CI and published smoke CI are green", "latest CI expected signal");
requireText("rehearsal", "signed-out browser", "signed-out review requirement");
requireText("rehearsal", "docs/submitter-handoff.md", "submitter handoff evidence order");
requireText("rehearsal", "Last name", "manual last name");
requireText("rehearsal", "OpenAI organization ID", "manual org id");
requireText("rehearsal", "Terms review and final submit", "manual terms gate");
requireText("rehearsal", "https://openai.com/ko-KR/form/codex-for-oss/", "source form URL");
requireText("rehearsal", "Stop before pressing Submit", "submit stop gate");
requireText("rehearsal", "Do not submit if", "abort condition heading");
requireText("status", "Submission rehearsal | Ready", "application status row");
requireText("status", "npm run submission:rehearsal", "application status command");
requireText("reviewer", "docs/submission-rehearsal.md", "reviewer rehearsal link");
requireText("checklist", "docs/submission-rehearsal.md", "final checklist rehearsal link");
requireText("checklist", "npm run submission:rehearsal", "final checklist gate");
requireText("readme", "docs/submission-rehearsal.md", "README rehearsal link");
requireText("readme", "npm run submission:rehearsal", "README rehearsal gate");
requireText("dashboard", "docs/submission-rehearsal.md", "dashboard rehearsal link");
requireText("dashboard", "Submission rehearsal", "dashboard rehearsal label");
requireText("dashboard", "submission:rehearsal", "dashboard rehearsal gate");
requireText("workflow", "npm run submission:rehearsal", "CI rehearsal gate");
requireText("formAnswers", "docs/submission-rehearsal.md", "form answers rehearsal link");

if (failures) {
  console.error(`Submission rehearsal check failed for ${failures} requirement(s).`);
  process.exit(1);
}

console.log("pass submissionRehearsal");

function requireText(fileKey, needle, label) {
  if (files[fileKey].includes(needle)) {
    console.log(`pass ${label}`);
    return;
  }
  console.error(`fail missing ${label}: ${needle}`);
  failures += 1;
}
