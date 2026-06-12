#!/usr/bin/env node
import { promises as fs } from "node:fs";

const files = {
  handoff: await fs.readFile("docs/submitter-handoff.md", "utf8"),
  status: await fs.readFile("docs/application-status.md", "utf8"),
  checklist: await fs.readFile("docs/final-submission-checklist.md", "utf8"),
  readme: await fs.readFile("README.md", "utf8"),
  dashboard: await fs.readFile("public/index.html", "utf8"),
  workflow: await fs.readFile(".github/workflows/test.yml", "utf8"),
  packageJson: await fs.readFile("package.json", "utf8"),
};

let failures = 0;

requireText("handoff", "# Submitter Handoff", "title");
requireText("handoff", "Paste-Ready Inputs", "paste-ready inputs section");
requireText("handoff", "Public Evidence Order", "public evidence order section");
requireText("handoff", "Account-Owner-Only Inputs", "account-owner-only section");
requireText("handoff", "Browser Order", "browser order section");
requireText("handoff", "Do Not Paste", "do-not-paste section");
requireText("handoff", "Abort Conditions", "abort conditions section");
requireText("handoff", "application/final-copy.md", "final copy source");
requireText("handoff", "application/form-answers.md", "form answers source");
requireText("handoff", "examples/form-draft.sample.md", "form draft sample source");
requireText("handoff", "examples/public-evidence.sample.md", "public evidence sample source");
requireText("handoff", "docs/application-status.md", "application status evidence");
requireText("handoff", "docs/final-submission-checklist.md", "final checklist evidence");
requireText("handoff", "docs/application-evidence-matrix.md", "evidence matrix order");
requireText("handoff", "Node CI", "Node CI evidence");
requireText("handoff", "published smoke CI", "published smoke evidence");
requireText("handoff", "npm run final-copy:check", "final copy check command");
requireText("handoff", "npm run form-answers:check", "form answers check command");
requireText("handoff", "npm run form-draft:sample", "form draft sample command");
requireText("handoff", "npm run submitter:handoff", "self gate command");
requireText("handoff", "npm run submission:check", "submission check command");
requireText("handoff", "npm run evidence:links", "public links command");
requireText("handoff", "npm run npm:latest", "npm latest command");
requireText("handoff", "npm run ci:latest", "latest CI command");
requireText("handoff", "docs/signed-out-review.md", "signed-out review handoff");
requireText("handoff", "OpenAI organization ID", "manual org id");
requireText("handoff", "Terms review and final Submit", "manual terms submit");
requireText("handoff", "Raw Codex rollout logs", "raw log paste guard");
requireText("handoff", "npm tokens, OpenAI API keys", "secret paste guard");
requireText("handoff", "codex-oss-lens@1.6.1", "current npm release guard");
requireText("handoff", "red public CI", "latest CI abort guard");

requireText("status", "Submitter handoff | Ready", "application status row");
requireText("status", "npm run submitter:handoff", "application status command");
requireText("status", "docs/submitter-handoff.md", "application status link");
requireText("checklist", "docs/submitter-handoff.md", "final checklist link");
requireText("checklist", "npm run submitter:handoff", "final checklist gate");
requireText("readme", "docs/submitter-handoff.md", "README link");
requireText("readme", "npm run submitter:handoff", "README gate");
requireText("dashboard", "docs/submitter-handoff.md", "dashboard link");
requireText("dashboard", "Submitter handoff", "dashboard label");
requireText("dashboard", "submitter:handoff", "dashboard gate");
requireText("workflow", "npm run submitter:handoff", "CI gate");
requireText("workflow", "npm run form-answers:check", "CI form answers gate");
requireText("packageJson", "\"submitter:handoff\"", "package script");
requireText("packageJson", "\"form-answers:check\"", "form answers package script");
requireText("packageJson", "npm run form-answers:check", "form answers submission check wiring");
requireText("packageJson", "npm run submitter:handoff", "submission check wiring");

if (failures) {
  console.error(`Submitter handoff check failed for ${failures} requirement(s).`);
  process.exit(1);
}

console.log("pass submitterHandoff");

function requireText(fileKey, needle, label) {
  if (files[fileKey].includes(needle)) {
    console.log(`pass ${label}`);
    return;
  }
  console.error(`fail missing ${label}: ${needle}`);
  failures += 1;
}
