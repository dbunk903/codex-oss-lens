#!/usr/bin/env node
import { promises as fs } from "node:fs";

const files = {
  conduct: await fs.readFile("CODE_OF_CONDUCT.md", "utf8"),
  support: await fs.readFile("SUPPORT.md", "utf8"),
  readme: await fs.readFile("README.md", "utf8"),
  packageJson: await fs.readFile("package.json", "utf8"),
  contributing: await fs.readFile("CONTRIBUTING.md", "utf8"),
};

let failures = 0;

requireText("conduct", "# Code of Conduct", "conduct title");
requireText("conduct", "Expected behavior", "expected behavior section");
requireText("conduct", "Unacceptable behavior", "unacceptable behavior section");
requireText("conduct", "Enforcement", "enforcement section");
requireText("conduct", "SUPPORT.md", "support routing");
requireText("conduct", "SECURITY.md", "security routing");
requireText("conduct", "do not post raw Codex logs", "raw log warning");
requireText("conduct", "private prompts", "private prompt warning");
requireText("conduct", "credentials, tokens", "secret warning");
requireText("conduct", "full local filesystem paths", "path warning");
requireText("support", "Code of Conduct", "support conduct routing");
requireText("readme", "CODE_OF_CONDUCT.md", "README conduct link");
requireText("packageJson", "\"CODE_OF_CONDUCT.md\"", "package conduct allowlist");
requireText("contributing", "CODE_OF_CONDUCT.md", "contributing conduct link");

if (failures) {
  console.error(`Conduct readiness check failed for ${failures} requirement(s).`);
  process.exit(1);
}

console.log("pass conductReadiness");

function requireText(fileKey, needle, label) {
  if (files[fileKey].includes(needle)) {
    console.log(`pass ${label}`);
    return;
  }
  console.error(`fail missing ${label}: ${needle}`);
  failures += 1;
}
