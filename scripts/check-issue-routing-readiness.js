#!/usr/bin/env node
import { promises as fs } from "node:fs";

const files = {
  config: await fs.readFile(".github/ISSUE_TEMPLATE/config.yml", "utf8"),
  bugTemplate: await fs.readFile(".github/ISSUE_TEMPLATE/bug_report.md", "utf8"),
  featureTemplate: await fs.readFile(".github/ISSUE_TEMPLATE/feature_request.md", "utf8"),
  integrationTemplate: await fs.readFile(".github/ISSUE_TEMPLATE/integration_request.md", "utf8"),
  support: await fs.readFile("SUPPORT.md", "utf8"),
  applicationStatus: await fs.readFile("docs/application-status.md", "utf8"),
};

let failures = 0;

requireText("config", "blank_issues_enabled: false", "blank issues disabled");
requireText("config", "Support policy", "support contact link");
requireText("config", "SECURITY.md", "security contact link");
requireText("config", "CODE_OF_CONDUCT.md", "conduct contact link");
requireText("config", "private prompts, logs, paths, or secrets", "sensitive-data contact warning");
requireText("bugTemplate", "Do not paste raw Codex rollout logs", "bug privacy warning");
requireText("featureTemplate", "Do not include raw Codex logs", "feature privacy warning");
requireText("integrationTemplate", "aggregate data leaves the local machine", "integration aggregate boundary");
requireText("support", "public GitHub issues", "support public issue guidance");
requireText("support", "Code of Conduct concerns", "support conduct guidance");
requireText("applicationStatus", "npm run issue-routing:readiness", "status issue routing gate");

if (failures) {
  console.error(`Issue routing readiness check failed for ${failures} requirement(s).`);
  process.exit(1);
}

console.log("pass issueRoutingReadiness");

function requireText(fileKey, needle, label) {
  if (files[fileKey].includes(needle)) {
    console.log(`pass ${label}`);
    return;
  }
  console.error(`fail missing ${label}: ${needle}`);
  failures += 1;
}
