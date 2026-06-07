#!/usr/bin/env node
import { redactCheck } from "../src/redact-check.js";

const targets = [
  "README.md",
  "SECURITY.md",
  "CONTRIBUTING.md",
  "application",
  "docs",
  "examples",
];

let failures = 0;

for (const target of targets) {
  const result = await redactCheck(target);
  console.log(`${result.status === "pass" ? "pass" : "fail"} ${target} files=${result.filesScanned}`);
  if (result.status !== "pass") {
    failures += 1;
    for (const finding of result.findings) {
      console.error(`${target}: ${finding.rule} ${finding.file}:${finding.line} ${finding.sample}`);
    }
  }
}

if (failures) {
  console.error(`Public redaction check failed for ${failures} target(s).`);
  process.exit(1);
}
