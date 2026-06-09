#!/usr/bin/env node
import { promises as fs } from "node:fs";

const files = {
  retention: await fs.readFile("docs/data-retention.md", "utf8"),
  threatModel: await fs.readFile("docs/privacy-threat-model.md", "utf8"),
  status: await fs.readFile("docs/application-status.md", "utf8"),
  reviewer: await fs.readFile("docs/reviewer-quickstart.md", "utf8"),
  checklist: await fs.readFile("docs/final-submission-checklist.md", "utf8"),
  readme: await fs.readFile("README.md", "utf8"),
  dashboard: await fs.readFile("public/index.html", "utf8"),
  workflow: await fs.readFile(".github/workflows/test.yml", "utf8"),
};

let failures = 0;

requireText("retention", "# Data Retention", "title");
requireText("retention", "does not run a hosted service", "hosted-service boundary");
requireText("retention", "does not move, upload, or delete", "local input boundary");
requireText("retention", "Private full-path reports created with `--show-paths`", "private show-paths retention");
requireText("retention", "Generated local reports are excluded from the npm package allowlist", "package allowlist boundary");
requireText("retention", "npm run data:retention", "self gate command");
requireText("retention", "npm run public:redaction", "public redaction command");
requireText("retention", "Delete temporary `codex-brief/` or `codex-submission-pack/` folders", "temporary folder deletion");
requireText("retention", "Do not commit generated artifacts outside the package allowlist", "commit boundary");
requireText("threatModel", "docs/data-retention.md", "threat-model retention link");
requireText("status", "Data retention | Ready", "application status row");
requireText("status", "npm run data:retention", "application status command");
requireText("reviewer", "docs/data-retention.md", "reviewer retention link");
requireText("checklist", "docs/data-retention.md", "final checklist retention link");
requireText("checklist", "npm run data:retention", "final checklist gate");
requireText("readme", "docs/data-retention.md", "README retention link");
requireText("readme", "npm run data:retention", "README retention gate");
requireText("dashboard", "docs/data-retention.md", "dashboard retention link");
requireText("dashboard", "data:retention", "dashboard retention gate");
requireText("workflow", "npm run data:retention", "CI retention gate");

if (failures) {
  console.error(`Data retention readiness check failed for ${failures} requirement(s).`);
  process.exit(1);
}

console.log("pass dataRetentionReadiness");

function requireText(fileKey, needle, label) {
  if (files[fileKey].includes(needle)) {
    console.log(`pass ${label}`);
    return;
  }
  console.error(`fail missing ${label}: ${needle}`);
  failures += 1;
}
