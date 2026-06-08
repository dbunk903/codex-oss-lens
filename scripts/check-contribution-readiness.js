#!/usr/bin/env node
import { promises as fs } from "node:fs";

const files = {
  contributing: await fs.readFile("CONTRIBUTING.md", "utf8"),
  issueTemplate: await fs.readFile(".github/ISSUE_TEMPLATE/bug_report.md", "utf8"),
  prTemplate: await fs.readFile(".github/PULL_REQUEST_TEMPLATE.md", "utf8"),
};

let failures = 0;

requireText("contributing", "npm run submission:check", "contributing one-command gate");
requireText("contributing", "npm run public:redaction", "contributing privacy gate");
requireText("contributing", "npm run ci:readiness", "contributing CI gate");
requireText("contributing", "npm run form-draft:sample", "contributing form draft gate");
requireText("contributing", "Do not commit raw Codex rollout logs", "contributing raw log warning");
requireText("issueTemplate", "Do not paste raw Codex rollout logs", "issue raw log warning");
requireText("issueTemplate", "private prompts", "issue private prompt warning");
requireText("issueTemplate", "paths", "issue path warning");
requireText("prTemplate", "npm test", "PR unit-test gate");
requireText("prTemplate", "npm run submission:check", "PR submission gate");
requireText("prTemplate", "npm run public:redaction", "PR redaction gate");
requireText("prTemplate", "raw Codex rollout logs", "PR raw log warning");
requireText("prTemplate", "private paths", "PR private path warning");
requireText("prTemplate", "prompt content", "PR prompt content warning");

if (failures) {
  console.error(`Contribution readiness check failed for ${failures} requirement(s).`);
  process.exit(1);
}

console.log("pass contributionReadiness");

function requireText(fileKey, needle, label) {
  if (files[fileKey].includes(needle)) {
    console.log(`pass ${label}`);
    return;
  }
  console.error(`fail missing ${label}: ${needle}`);
  failures += 1;
}
