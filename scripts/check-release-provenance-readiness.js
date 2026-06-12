#!/usr/bin/env node
import { promises as fs } from "node:fs";

const packageJson = JSON.parse(await fs.readFile("package.json", "utf8"));
const files = {
  provenance: await fs.readFile("docs/release-provenance.md", "utf8"),
  status: await fs.readFile("docs/application-status.md", "utf8"),
  readme: await fs.readFile("README.md", "utf8"),
  checklist: await fs.readFile("docs/final-submission-checklist.md", "utf8"),
  publishing: await fs.readFile("docs/npm-publishing.md", "utf8"),
  publishChecklist: await fs.readFile("application/publish-checklist.md", "utf8"),
  workflow: await fs.readFile(".github/workflows/test.yml", "utf8"),
};

const version = packageJson.version;
const packageName = packageJson.name;
const releaseUrl = `https://github.com/dbunk903/codex-oss-lens/releases/tag/v${version}`;
let failures = 0;

requireText("provenance", "# Release Provenance", "title");
requireText("provenance", releaseUrl, "release URL");
requireText("provenance", "https://www.npmjs.com/package/codex-oss-lens", "npm package URL");
requireText("provenance", `${packageName}@${version}`, "current package version");
requireText("provenance", "npm run submission:check", "submission gate");
requireText("provenance", "npm run release:provenance", "self gate");
requireText("provenance", "npm run publish:samples", "publish samples gate");
requireText("provenance", "npm run npm:latest", "npm latest gate");
requireText("provenance", "npm run ci:latest", "latest CI gate");
requireText("provenance", "npm run publish:docs", "publishing docs gate");
requireText("provenance", "npm run public:redaction", "public redaction gate");
requireText("provenance", "npm run evidence:links", "public links gate");
requireText("provenance", "npm run pack:smoke", "packaged smoke gate");
requireText("provenance", "Source changes made after that release must be", "source-vs-published boundary");
requireText("provenance", "No local Codex logs, raw prompts, full filesystem paths", "privacy boundary");
requireText("status", "Release provenance | Ready", "application status row");
requireText("status", "npm run release:provenance", "application status command");
requireText("readme", "docs/release-provenance.md", "README provenance link");
requireText("readme", "npm run release:provenance", "README provenance gate");
requireText("checklist", "docs/release-provenance.md", "final checklist provenance link");
requireText("checklist", "npm run release:provenance", "final checklist provenance gate");
requireText("publishing", "release provenance", "publishing provenance mention");
requireText("publishChecklist", "release provenance", "publish checklist provenance mention");
requireText("workflow", "npm run release:provenance", "CI provenance gate");

if (failures) {
  console.error(`Release provenance readiness check failed for ${failures} requirement(s).`);
  process.exit(1);
}

console.log(`pass releaseProvenance package=${packageName}@${version}`);

function requireText(fileKey, needle, label) {
  if (files[fileKey].includes(needle)) {
    console.log(`pass ${label}`);
    return;
  }
  console.error(`fail missing ${label}: ${needle}`);
  failures += 1;
}
