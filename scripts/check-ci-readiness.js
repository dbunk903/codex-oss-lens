#!/usr/bin/env node
import { promises as fs } from "node:fs";

const workflow = await fs.readFile(".github/workflows/test.yml", "utf8");
let failures = 0;

requireText("permissions:", "explicit permissions");
requireText("contents: read", "read-only contents permission");
requireText("node-version: [20, 22]", "Node 20/22 matrix");
requireText("fail-fast: false", "full matrix reporting");
requireText("npm test", "unit tests");
requireText("npm run pack:check", "package contents check");
requireText("npm run pack:smoke", "packaged CLI smoke");
requireText("node src/cli.js public-evidence", "public evidence generation");
requireText("evidence.status", "public evidence readiness assertion");
requireText("npm run final-copy:check", "final copy check");
requireText("npm run form-answers:check", "form answers check");
requireText("npm run submission:versions", "submission version check");
requireText("npm run application:status", "application status check");
requireText("npm run application:evidence", "application evidence matrix check");
requireText("npm run reviewer:faq", "application review FAQ check");
requireText("npm run submission:risk", "submission risk register check");
requireText("npm run submission:decision", "submission decision summary check");
requireText("npm run submission:activity", "submission activity log check");
requireText("npm run reviewer:quickstart", "reviewer quickstart check");
requireText("npm run reviewer:signedout", "signed-out review check");
requireText("npm run submitter:handoff", "submitter handoff check");
requireText("npm run form-draft:sample", "form draft sample check");
requireText("npm run publish:samples", "publish samples check");
requireText("npm run publish:docs", "publishing docs check");
requireText("npm run dashboard:readiness", "dashboard readiness check");
requireText("npm run contrib:readiness", "contribution readiness check");
requireText("npm run security:readiness", "security readiness check");
requireText("npm run support:readiness", "support readiness check");
requireText("npm run conduct:readiness", "conduct readiness check");
requireText("npm run license:readiness", "license readiness check");
requireText("npm run issue-routing:readiness", "issue routing readiness check");
requireText("npm run release:provenance", "release provenance check");
requireText("npm run adoption:readiness", "adoption readiness check");
requireText("npm run adoption:snapshot", "adoption snapshot check");
requireText("npm run maintenance:readiness", "maintenance readiness check");
requireText("npm run maintainer:handoff", "maintainer handoff check");
requireText("npm run scope:limitations", "scope limitations check");
requireText("npm run privacy:threat-model", "privacy threat model check");
requireText("npm run accessibility:readiness", "accessibility readiness check");
requireText("npm run data:retention", "data retention check");
requireText("npm run demo:walkthrough", "demo walkthrough check");
requireText("npm run submission:rehearsal", "submission rehearsal check");
requireText("npm run public:redaction", "public redaction check");
requireText("npm run evidence:sample", "public evidence sample check");
requireText("npm run evidence:links", "public evidence link check");
requireText("matrix.node-version == 22", "Node 22 network-only link checks");
requireText("GITHUB_TOKEN: ${{ github.token }}", "GitHub API token for link checks");
requireText("npm run readme:badges", "README badge check");
requireText("npm run readme:readiness", "README readiness check");

if (failures) {
  console.error(`CI readiness check failed for ${failures} requirement(s).`);
  process.exit(1);
}

console.log("pass ciReadiness");

function requireText(needle, label) {
  if (workflow.includes(needle)) {
    console.log(`pass ${label}`);
    return;
  }
  console.error(`fail missing ${label}: ${needle}`);
  failures += 1;
}
