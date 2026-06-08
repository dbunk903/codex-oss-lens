#!/usr/bin/env node
import { promises as fs } from "node:fs";

const files = {
  security: await fs.readFile("SECURITY.md", "utf8"),
  bugTemplate: await fs.readFile(".github/ISSUE_TEMPLATE/bug_report.md", "utf8"),
  featureTemplate: await fs.readFile(".github/ISSUE_TEMPLATE/feature_request.md", "utf8"),
  integrationTemplate: await fs.readFile(".github/ISSUE_TEMPLATE/integration_request.md", "utf8"),
};

let failures = 0;

requireText("security", "privacy and redaction bugs are treated as security issues", "security privacy classification");
requireText("security", "The latest GitHub release is the supported version", "security supported version");
requireText("security", "Open a GitHub issue if the report can be written without exposing secrets", "security public issue boundary");
requireText("security", "private vulnerability reporting", "security private disclosure path");
requireText("security", "Do not include:", "security sensitive data list");
requireText("security", "node src/cli.js redact-check <artifact-dir>", "security redaction command");
requireText("security", "node src/cli.js public-evidence --markdown public-evidence.md", "security public evidence command");
requireText("security", "No hosted service is contacted by default", "security local-first guarantee");
requireText("bugTemplate", "Do not paste raw Codex rollout logs", "bug raw log warning");
requireText("featureTemplate", "Do not include raw Codex logs", "feature privacy warning");
requireText("featureTemplate", "aggregate output is safe to export", "feature aggregate boundary");
requireText("integrationTemplate", "Do not include raw Codex logs", "integration privacy warning");
requireText("integrationTemplate", "aggregate data leaves the local machine", "integration aggregate boundary");
requireText("integrationTemplate", "tokens, credentials, or private source code", "integration secret warning");

if (failures) {
  console.error(`Security readiness check failed for ${failures} requirement(s).`);
  process.exit(1);
}

console.log("pass securityReadiness");

function requireText(fileKey, needle, label) {
  if (files[fileKey].includes(needle)) {
    console.log(`pass ${label}`);
    return;
  }
  console.error(`fail missing ${label}: ${needle}`);
  failures += 1;
}
