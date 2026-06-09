#!/usr/bin/env node
import { promises as fs } from "node:fs";

const files = {
  scope: await fs.readFile("docs/scope-and-limitations.md", "utf8"),
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

requireText("scope", "# Scope And Limitations", "title");
requireText("scope", "Local-first parsing", "local-first scope");
requireText("scope", "No hosted service, telemetry collector", "telemetry non-goal");
requireText("scope", "No live OpenAI API calls", "API non-goal");
requireText("scope", "No raw Codex logs, prompts, source files", "private artifact boundary");
requireText("scope", "No automatic OpenAI support-form submission", "manual submit boundary");
requireText("scope", "source-only changes are available from `codex-oss-lens@latest`", "npm latest boundary");
requireText("scope", "early public OSS tool", "young project framing");
requireText("scope", "npm run scope:limitations", "self gate command");
requireText("status", "Scope and limitations | Ready", "application status row");
requireText("status", "npm run scope:limitations", "application status command");
requireText("reviewer", "docs/scope-and-limitations.md", "reviewer limitations link");
requireText("checklist", "docs/scope-and-limitations.md", "final checklist limitations link");
requireText("checklist", "npm run scope:limitations", "final checklist gate");
requireText("readme", "docs/scope-and-limitations.md", "README limitations link");
requireText("readme", "npm run scope:limitations", "README limitations gate");
requireText("dashboard", "docs/scope-and-limitations.md", "dashboard limitations link");
requireText("dashboard", "Scope limits", "dashboard limitations label");
requireText("dashboard", "scope:limitations", "dashboard limitations gate");
requireText("workflow", "npm run scope:limitations", "CI limitations gate");
requireText("publishing", "npm run scope:limitations", "publishing docs limitations gate");
requireText("publishChecklist", "scope:limitations", "publish checklist limitations gate");

if (failures) {
  console.error(`Scope limitations readiness check failed for ${failures} requirement(s).`);
  process.exit(1);
}

console.log("pass scopeLimitationsReadiness");

function requireText(fileKey, needle, label) {
  if (files[fileKey].includes(needle)) {
    console.log(`pass ${label}`);
    return;
  }
  console.error(`fail missing ${label}: ${needle}`);
  failures += 1;
}
