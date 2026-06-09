#!/usr/bin/env node
import { promises as fs } from "node:fs";

const files = {
  walkthrough: await fs.readFile("docs/demo-walkthrough.md", "utf8"),
  status: await fs.readFile("docs/application-status.md", "utf8"),
  reviewer: await fs.readFile("docs/reviewer-quickstart.md", "utf8"),
  checklist: await fs.readFile("docs/final-submission-checklist.md", "utf8"),
  readme: await fs.readFile("README.md", "utf8"),
  dashboard: await fs.readFile("public/index.html", "utf8"),
  workflow: await fs.readFile(".github/workflows/test.yml", "utf8"),
};

let failures = 0;

requireText("walkthrough", "# Demo Walkthrough", "title");
requireText("walkthrough", "npm exec --yes --package codex-oss-lens@latest -- codex-oss-lens demo", "published CLI demo command");
requireText("walkthrough", "npx -y codex-oss-lens@latest serve --demo", "published dashboard demo command");
requireText("walkthrough", "totals.sessions", "demo output signal");
requireText("walkthrough", "not local filesystem paths", "path privacy signal");
requireText("walkthrough", "Application Evidence panel", "dashboard evidence signal");
requireText("walkthrough", "npm run demo:walkthrough", "self gate command");
requireText("walkthrough", "npm run public:redaction", "public redaction command");
requireText("walkthrough", "npm run data:retention", "data retention command");
requireText("status", "Demo walkthrough | Ready", "application status row");
requireText("status", "npm run demo:walkthrough", "application status command");
requireText("reviewer", "docs/demo-walkthrough.md", "reviewer walkthrough link");
requireText("checklist", "docs/demo-walkthrough.md", "final checklist walkthrough link");
requireText("checklist", "npm run demo:walkthrough", "final checklist gate");
requireText("readme", "docs/demo-walkthrough.md", "README walkthrough link");
requireText("readme", "npm run demo:walkthrough", "README walkthrough gate");
requireText("dashboard", "docs/demo-walkthrough.md", "dashboard walkthrough link");
requireText("dashboard", "Demo walkthrough", "dashboard walkthrough label");
requireText("dashboard", "demo:walkthrough", "dashboard walkthrough gate");
requireText("workflow", "npm run demo:walkthrough", "CI walkthrough gate");

if (failures) {
  console.error(`Demo walkthrough readiness check failed for ${failures} requirement(s).`);
  process.exit(1);
}

console.log("pass demoWalkthroughReadiness");

function requireText(fileKey, needle, label) {
  if (files[fileKey].includes(needle)) {
    console.log(`pass ${label}`);
    return;
  }
  console.error(`fail missing ${label}: ${needle}`);
  failures += 1;
}
