#!/usr/bin/env node
import { promises as fs } from "node:fs";

const files = {
  support: await fs.readFile("SUPPORT.md", "utf8"),
  readme: await fs.readFile("README.md", "utf8"),
  packageJson: await fs.readFile("package.json", "utf8"),
  bugTemplate: await fs.readFile(".github/ISSUE_TEMPLATE/bug_report.md", "utf8"),
  featureTemplate: await fs.readFile(".github/ISSUE_TEMPLATE/feature_request.md", "utf8"),
  integrationTemplate: await fs.readFile(".github/ISSUE_TEMPLATE/integration_request.md", "utf8"),
};

let failures = 0;

requireText("support", "# Support", "support title");
requireText("support", "public GitHub issues", "public support channel");
requireText("support", "Bug reports", "bug report routing");
requireText("support", "Feature requests", "feature request routing");
requireText("support", "Integration requests", "integration request routing");
requireText("support", "Security reports", "security report routing");
requireText("support", "npm run public:redaction", "support public redaction gate");
requireText("support", "npm run submission:check", "support submission gate");
requireText("support", "Do not paste raw Codex logs", "support raw log warning");
requireText("support", "private prompts", "support private prompt warning");
requireText("support", "full local filesystem paths", "support path warning");
requireText("support", "tokens, credentials, or other secrets", "support secret warning");
requireText("readme", "SUPPORT.md", "README support link");
requireText("packageJson", "\"SUPPORT.md\"", "package support allowlist");
requireText("bugTemplate", "Do not paste raw Codex rollout logs", "bug support privacy warning");
requireText("featureTemplate", "Do not include raw Codex logs", "feature support privacy warning");
requireText("integrationTemplate", "Do not include raw Codex logs", "integration support privacy warning");

if (failures) {
  console.error(`Support readiness check failed for ${failures} requirement(s).`);
  process.exit(1);
}

console.log("pass supportReadiness");

function requireText(fileKey, needle, label) {
  if (files[fileKey].includes(needle)) {
    console.log(`pass ${label}`);
    return;
  }
  console.error(`fail missing ${label}: ${needle}`);
  failures += 1;
}
