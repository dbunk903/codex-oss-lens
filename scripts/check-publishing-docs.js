#!/usr/bin/env node
import { promises as fs } from "node:fs";

const packageJson = JSON.parse(await fs.readFile("package.json", "utf8"));
const publishing = await fs.readFile("docs/npm-publishing.md", "utf8");
const checklist = await fs.readFile("application/publish-checklist.md", "utf8");
let failures = 0;

requirePublishingText("npm run submission:check", "submission gate");
requirePublishingText("npm run reviewer:quickstart", "reviewer quickstart gate");
requirePublishingText("npm run publish:samples", "publish samples gate");
requirePublishingText("npm run contrib:readiness", "contribution readiness gate");
requirePublishingText("npm run security:readiness", "security readiness gate");
requirePublishingText("npm run support:readiness", "support readiness gate");
requirePublishingText("npm run conduct:readiness", "conduct readiness gate");
requirePublishingText("npm run license:readiness", "license readiness gate");
requirePublishingText("npm run issue-routing:readiness", "issue routing readiness gate");
requirePublishingText("npm run release:provenance", "release provenance gate");
requirePublishingText("npm run adoption:readiness", "adoption readiness gate");
requirePublishingText("npm run maintenance:readiness", "maintenance readiness gate");
requirePublishingText("npm run privacy:threat-model", "privacy threat model gate");
requirePublishingText("npm run accessibility:readiness", "accessibility readiness gate");
requirePublishingText("npm run data:retention", "data retention gate");
requirePublishingText("npm run demo:walkthrough", "demo walkthrough gate");
requirePublishingText("npm run submission:rehearsal", "submission rehearsal gate");
requirePublishingText("npm run readme:readiness", "README readiness gate");
requirePublishingText("node src/cli.js publish-check --markdown publish-check.md", "publish check command");
requirePublishingText("npm publish --access public --otp <6-digit-code>", "OTP publish command");
requirePublishingText(
  `node src/cli.js install-smoke --package ${packageJson.name} --version latest --markdown install-smoke.md`,
  "latest install smoke command",
);
requirePublishingText("package owner", "package owner authority");
requirePublishingText("versionAvailable: fail", "republish blocker guidance");
requirePublishingText("examples/dashboard-preview.png", "dashboard preview package content");
requirePublishingText("ROADMAP.md", "roadmap package content");
requirePublishingText("SECURITY.md", "security package content");
requirePublishingText("SUPPORT.md", "support package content");
requirePublishingText("CODE_OF_CONDUCT.md", "conduct package content");

requireChecklistText(`v${packageJson.version}`, "current release tag");
requireChecklistText(`${packageJson.name}@${packageJson.version}`, "current npm package");
requireChecklistText("application/form-answers.md", "form answers pointer");
requireChecklistText("account owner has reviewed the terms", "account-owner terms gate");
requireChecklistText("Published npm usage", "README npm usage evidence");
requireChecklistText("Scheduled/manual GitHub Actions", "published smoke CI evidence");
requireChecklistText("submission:check", "submission gate evidence");
requireChecklistText("publish:samples", "publish samples evidence");
requireChecklistText("support:readiness", "support readiness evidence");
requireChecklistText("conduct:readiness", "conduct readiness evidence");
requireChecklistText("license:readiness", "license readiness evidence");
requireChecklistText("issue-routing:readiness", "issue routing readiness evidence");
requireChecklistText("release:provenance", "release provenance evidence");
requireChecklistText("adoption:readiness", "adoption readiness evidence");
requireChecklistText("maintenance:readiness", "maintenance readiness evidence");
requireChecklistText("privacy:threat-model", "privacy threat model evidence");
requireChecklistText("accessibility:readiness", "accessibility readiness evidence");
requireChecklistText("data:retention", "data retention evidence");
requireChecklistText("demo:walkthrough", "demo walkthrough evidence");
requireChecklistText("submission:rehearsal", "submission rehearsal evidence");
requireChecklistText("readme:readiness", "README readiness evidence");

if (failures) {
  console.error(`Publishing docs check failed for ${failures} requirement(s).`);
  process.exit(1);
}

console.log(`pass publishingDocs package=${packageJson.name}@${packageJson.version}`);

function requirePublishingText(needle, label) {
  requireText(publishing, needle, `npm publishing ${label}`);
}

function requireChecklistText(needle, label) {
  requireText(checklist, needle, `publish checklist ${label}`);
}

function requireText(source, needle, label) {
  if (source.includes(needle)) {
    console.log(`pass ${label}`);
    return;
  }
  console.error(`fail missing ${label}: ${needle}`);
  failures += 1;
}
