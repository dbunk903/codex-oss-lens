#!/usr/bin/env node
import { promises as fs } from "node:fs";

const files = {
  faq: await fs.readFile("docs/application-review-faq.md", "utf8"),
  status: await fs.readFile("docs/application-status.md", "utf8"),
  reviewer: await fs.readFile("docs/reviewer-quickstart.md", "utf8"),
  checklist: await fs.readFile("docs/final-submission-checklist.md", "utf8"),
  readme: await fs.readFile("README.md", "utf8"),
  dashboard: await fs.readFile("public/index.html", "utf8"),
  workflow: await fs.readFile(".github/workflows/test.yml", "utf8"),
  publishing: await fs.readFile("docs/npm-publishing.md", "utf8"),
  publishChecklist: await fs.readFile("application/publish-checklist.md", "utf8"),
};
let failures = 0;

requireText("faq", "# Application Review FAQ", "title");
requireText("faq", "Why is this worth supporting if the project is young?", "young-project question");
requireText("faq", "What public proof exists today?", "public-proof question");
requireText("faq", "adoption snapshot", "adoption snapshot boundary");
requireText("faq", "What is not automated?", "manual-submit question");
requireText("faq", "What private Codex data is protected?", "privacy question");
requireText("faq", "What is the source-vs-published boundary?", "published-boundary question");
requireText("faq", "How would API credits be used?", "api-credits question");
requireText("faq", "npm run reviewer:faq", "self gate command");
requireText("faq", "codex-oss-lens@latest", "latest package boundary");
requireText("status", "Application review FAQ | Ready", "application status row");
requireText("status", "npm run reviewer:faq", "application status command");
requireText("reviewer", "docs/application-review-faq.md", "reviewer FAQ link");
requireText("checklist", "docs/application-review-faq.md", "final checklist FAQ link");
requireText("checklist", "npm run reviewer:faq", "final checklist gate");
requireText("readme", "docs/application-review-faq.md", "README FAQ link");
requireText("readme", "npm run reviewer:faq", "README FAQ gate");
requireText("dashboard", "docs/application-review-faq.md", "dashboard FAQ link");
requireText("dashboard", "Review FAQ", "dashboard FAQ label");
requireText("dashboard", "reviewer:faq", "dashboard FAQ gate");
requireText("workflow", "npm run reviewer:faq", "CI FAQ gate");
requireText("publishing", "npm run reviewer:faq", "publishing docs FAQ gate");
requireText("publishChecklist", "reviewer:faq", "publish checklist FAQ gate");

if (failures) {
  console.error(`Application review FAQ check failed for ${failures} requirement(s).`);
  process.exit(1);
}

console.log("pass applicationReviewFaq");

function requireText(fileKey, needle, label) {
  if (files[fileKey].includes(needle)) {
    console.log(`pass ${label}`);
    return;
  }
  console.error(`fail missing ${label}: ${needle}`);
  failures += 1;
}
