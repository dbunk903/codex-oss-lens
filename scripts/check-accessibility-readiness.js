#!/usr/bin/env node
import { promises as fs } from "node:fs";

const files = {
  accessibility: await fs.readFile("docs/accessibility.md", "utf8"),
  dashboard: await fs.readFile("public/index.html", "utf8"),
  status: await fs.readFile("docs/application-status.md", "utf8"),
  reviewer: await fs.readFile("docs/reviewer-quickstart.md", "utf8"),
  checklist: await fs.readFile("docs/final-submission-checklist.md", "utf8"),
  readme: await fs.readFile("README.md", "utf8"),
  workflow: await fs.readFile(".github/workflows/test.yml", "utf8"),
};

let failures = 0;

requireText("accessibility", "# Accessibility Notes", "title");
requireText("accessibility", "keyboard-visible skip link", "skip-link baseline");
requireText("accessibility", "labelled navigation region", "labelled nav baseline");
requireText("accessibility", "not color-only status", "non-color-only status");
requireText("accessibility", "1440x1200", "desktop preview dimension");
requireText("accessibility", "500x1100", "mobile preview dimension");
requireText("accessibility", "npm run accessibility:readiness", "self gate command");
requireText("accessibility", "No automated WCAG scanner is bundled", "dependency-free scanner limit");
requireText("dashboard", "<html lang=\"en\">", "document language");
requireText("dashboard", "name=\"viewport\"", "responsive viewport");
requireText("dashboard", "class=\"skip-link\"", "skip link");
requireText("dashboard", "href=\"#main\"", "skip target link");
requireText("dashboard", "<main id=\"main\" tabindex=\"-1\">", "main focus target");
requireText("dashboard", "aria-label=\"Reviewer evidence links\"", "reviewer evidence nav label");
requireText("dashboard", "Accessibility", "dashboard accessibility link");
requireText("dashboard", "docs/accessibility.md", "dashboard accessibility URL");
requireText("dashboard", "button:focus-visible", "keyboard button focus style");
requireText("dashboard", ".link-button:focus-visible", "keyboard link focus style");
requireText("status", "Accessibility readiness | Ready", "application status row");
requireText("status", "npm run accessibility:readiness", "application status command");
requireText("reviewer", "docs/accessibility.md", "reviewer accessibility link");
requireText("checklist", "docs/accessibility.md", "final checklist accessibility link");
requireText("checklist", "npm run accessibility:readiness", "final checklist gate");
requireText("readme", "docs/accessibility.md", "README accessibility link");
requireText("readme", "npm run accessibility:readiness", "README accessibility gate");
requireText("workflow", "npm run accessibility:readiness", "CI accessibility gate");

if (failures) {
  console.error(`Accessibility readiness check failed for ${failures} requirement(s).`);
  process.exit(1);
}

console.log("pass accessibilityReadiness");

function requireText(fileKey, needle, label) {
  if (files[fileKey].includes(needle)) {
    console.log(`pass ${label}`);
    return;
  }
  console.error(`fail missing ${label}: ${needle}`);
  failures += 1;
}
