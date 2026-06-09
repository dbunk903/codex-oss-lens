#!/usr/bin/env node
import { promises as fs } from "node:fs";

const files = {
  threatModel: await fs.readFile("docs/privacy-threat-model.md", "utf8"),
  apiWorkflow: await fs.readFile("docs/api-credit-workflow.md", "utf8"),
  security: await fs.readFile("SECURITY.md", "utf8"),
  status: await fs.readFile("docs/application-status.md", "utf8"),
  reviewer: await fs.readFile("docs/reviewer-quickstart.md", "utf8"),
  checklist: await fs.readFile("docs/final-submission-checklist.md", "utf8"),
  readme: await fs.readFile("README.md", "utf8"),
  workflow: await fs.readFile(".github/workflows/test.yml", "utf8"),
};

let failures = 0;

requireText("threatModel", "# Privacy Threat Model", "title");
requireText("threatModel", "raw Codex rollout JSONL lines", "raw log protected input");
requireText("threatModel", "prompts, assistant messages, and tool arguments", "prompt protected input");
requireText("threatModel", "source code snippets from private repositories", "source protected input");
requireText("threatModel", "full local filesystem paths", "path protected input");
requireText("threatModel", "API keys, tokens, credentials, and environment variables", "secret protected input");
requireText("threatModel", "redacted workspace labels or stable hashes", "shareable redaction output");
requireText("threatModel", "If a command is run with `--show-paths`, the output is private", "private show-paths boundary");
requireText("threatModel", "privacy.rawLogsIncluded", "manifest privacy flag");
requireText("threatModel", "Local aggregate payload to future API feature", "future API trust boundary");
requireText("threatModel", "npm run public:redaction", "redaction gate");
requireText("threatModel", "npm run submission:check", "submission gate");
requireText("threatModel", "Do not add telemetry, background upload, remote sync, or live API summarization", "network expansion warning");
requireText("apiWorkflow", "docs/privacy-threat-model.md", "API workflow threat-model link");
requireText("security", "docs/privacy-threat-model.md", "security threat-model link");
requireText("status", "Privacy threat model | Ready", "application status row");
requireText("status", "npm run privacy:threat-model", "application status command");
requireText("reviewer", "docs/privacy-threat-model.md", "reviewer threat-model link");
requireText("checklist", "docs/privacy-threat-model.md", "final checklist threat-model link");
requireText("checklist", "npm run privacy:threat-model", "final checklist gate");
requireText("readme", "docs/privacy-threat-model.md", "README threat-model link");
requireText("readme", "npm run privacy:threat-model", "README threat-model gate");
requireText("workflow", "npm run privacy:threat-model", "CI threat-model gate");

if (failures) {
  console.error(`Privacy threat-model check failed for ${failures} requirement(s).`);
  process.exit(1);
}

console.log("pass privacyThreatModel");

function requireText(fileKey, needle, label) {
  if (files[fileKey].includes(needle)) {
    console.log(`pass ${label}`);
    return;
  }
  console.error(`fail missing ${label}: ${needle}`);
  failures += 1;
}
