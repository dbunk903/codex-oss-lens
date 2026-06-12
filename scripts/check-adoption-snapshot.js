#!/usr/bin/env node
import { promises as fs } from "node:fs";

const files = {
  snapshot: await fs.readFile("docs/adoption-snapshot.md", "utf8"),
  adoption: await fs.readFile("docs/adoption-plan.md", "utf8"),
  status: await fs.readFile("docs/application-status.md", "utf8"),
  reviewer: await fs.readFile("docs/reviewer-quickstart.md", "utf8"),
  checklist: await fs.readFile("docs/final-submission-checklist.md", "utf8"),
  readme: await fs.readFile("README.md", "utf8"),
  dashboard: await fs.readFile("public/index.html", "utf8"),
  workflow: await fs.readFile(".github/workflows/test.yml", "utf8"),
  finalCopy: await fs.readFile("application/final-copy.md", "utf8"),
  formAnswers: await fs.readFile("application/form-answers.md", "utf8"),
  publicEvidence: await fs.readFile("examples/public-evidence.sample.md", "utf8"),
  formDraft: await fs.readFile("examples/form-draft.sample.md", "utf8"),
};

let failures = 0;

requireText("snapshot", "# Adoption Snapshot", "title");
requireText("snapshot", "factual current adoption signal without inflated claims", "positioning");
requireText("snapshot", "Current Signals", "current signals section");
requireText("snapshot", "Claims Not Made", "claims-not-made section");
requireText("snapshot", "Next Validation Loop", "next validation loop section");
requireText("snapshot", "npm exec --yes --package codex-oss-lens@latest -- codex-oss-lens demo", "published demo command");
requireText("snapshot", "No mature adoption, download, star, or production-user claim is made.", "no mature adoption claim");
requireText("snapshot", "No telemetry, remote usage tracking, or private Codex content collection", "no telemetry boundary");
requireText("snapshot", "raw Codex logs", "raw log feedback boundary");
requireText("snapshot", "private source", "private source feedback boundary");
requireText("snapshot", "npm run adoption:snapshot", "self gate");
requireText("snapshot", "npm run submission:check", "submission check gate");

requireText("adoption", "docs/adoption-snapshot.md", "adoption plan snapshot link");
requireText("status", "Adoption snapshot | Ready", "application status row");
requireText("status", "npm run adoption:snapshot", "application status command");
requireText("status", "docs/adoption-snapshot.md", "application status link");
requireText("reviewer", "docs/adoption-snapshot.md", "reviewer snapshot link");
requireText("checklist", "docs/adoption-snapshot.md", "final checklist snapshot link");
requireText("checklist", "npm run adoption:snapshot", "final checklist gate");
requireText("readme", "docs/adoption-snapshot.md", "README snapshot link");
requireText("readme", "npm run adoption:snapshot", "README snapshot gate");
requireText("dashboard", "docs/adoption-snapshot.md", "dashboard snapshot link");
requireText("dashboard", "Adoption snapshot", "dashboard snapshot label");
requireText("dashboard", "adoption:snapshot", "dashboard snapshot gate");
requireText("workflow", "npm run adoption:snapshot", "CI snapshot gate");
requireText("finalCopy", "docs/adoption-snapshot.md", "final copy snapshot link");
requireText("formAnswers", "docs/adoption-snapshot.md", "form answers snapshot link");
requireText("publicEvidence", "adoptionSnapshotUrl", "public evidence snapshot URL");
requireText("formDraft", "Adoption snapshot", "form draft snapshot label");

if (failures) {
  console.error(`Adoption snapshot check failed for ${failures} requirement(s).`);
  process.exit(1);
}

console.log("pass adoptionSnapshot");

function requireText(fileKey, needle, label) {
  if (files[fileKey].includes(needle)) {
    console.log(`pass ${label}`);
    return;
  }
  console.error(`fail missing ${label}: ${needle}`);
  failures += 1;
}
