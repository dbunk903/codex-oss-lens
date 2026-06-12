#!/usr/bin/env node
import { promises as fs } from "node:fs";
import { buildPublicEvidence } from "../src/public-evidence.js";

const FORM_ANSWERS = "application/form-answers.md";
const FINAL_COPY = "application/final-copy.md";
const text = await fs.readFile(FORM_ANSWERS, "utf8");
const finalCopy = await fs.readFile(FINAL_COPY, "utf8");
const evidence = buildPublicEvidence();
let failures = 0;

requireText("# Codex Open Source Support Program - Application Draft", "title");
requireText("Source form: https://openai.com/ko-KR/form/codex-for-oss/", "source form");
requireText("## Required fields to fill manually", "manual fields section");
requireText("## Public evidence links", "public links section");
requireText("## Repository fit answer - max 500 Korean characters", "repository answer heading");
requireText("## API credits plan - max 500 Korean characters", "API credits answer heading");
requireText("## Additional information - max 500 Korean characters", "additional information heading");
requireText("## Final manual submission steps", "manual submission steps");
requireText("## Stronger submission note", "stronger submission note");
requireText("Project API credits", "API credits interest");
requireText("GitHub repository URL: https://github.com/dbunk903/codex-oss-lens", "repository URL field");
requireText("Role: Primary maintainer", "role field");
requireText("OpenAI organization ID: TODO", "manual organization ID placeholder");
requireText("Review the terms and submit from the account owner's browser session.", "terms submit guard");
requireText("actively maintained and widely adopted OSS", "young project caveat");

for (const field of evidence.manualFields) {
  const label = field === "Email registered to the ChatGPT account" ? "Email" : field;
  requireText(label, `manual field ${field}`);
}

for (const [key, link] of Object.entries(evidence.publicLinks)) {
  requireText(link, `public link ${key}`);
}

const finalAnswers = extractFinalCopyAnswers(finalCopy);
const formAnswers = extractFormAnswers(text);
requireEqual(formAnswers.repositoryFit, finalAnswers[0], "repository fit answer sync");
requireEqual(formAnswers.apiCreditsPlan, finalAnswers[1], "API credits answer sync");
requireEqual(formAnswers.additionalInformation, finalAnswers[2], "additional information sync");

for (const [label, answer] of Object.entries(formAnswers)) {
  const chars = [...answer].length;
  if (chars > 500) {
    fail(`${label} exceeds 500 characters: ${chars}`);
  } else {
    console.log(`pass ${label} chars=${chars}/500`);
  }
}

if (failures) {
  console.error(`Form answers check failed for ${failures} requirement(s).`);
  process.exit(1);
}

console.log(`pass formAnswers links=${Object.keys(evidence.publicLinks).length}`);

function extractFinalCopyAnswers(source) {
  const blocks = [...source.matchAll(/```text\n([\s\S]*?)\n```/g)]
    .map((match) => match[1].trim())
    .filter((block) => /[가-힣]/.test(block));
  if (blocks.length !== 3) fail(`expected 3 final-copy Korean answers, found ${blocks.length}`);
  return blocks;
}

function extractFormAnswers(source) {
  return {
    repositoryFit: extractSection(
      source,
      "## Repository fit answer - max 500 Korean characters",
      "## Interests",
    ),
    apiCreditsPlan: extractSection(
      source,
      "## API credits plan - max 500 Korean characters",
      "## Additional information - max 500 Korean characters",
    ),
    additionalInformation: extractSection(
      source,
      "## Additional information - max 500 Korean characters",
      "## Final manual submission steps",
    ),
  };
}

function extractSection(source, start, end) {
  const startIndex = source.indexOf(start);
  const endIndex = source.indexOf(end);
  if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) {
    fail(`missing section between ${start} and ${end}`);
    return "";
  }
  return source.slice(startIndex + start.length, endIndex).trim();
}

function requireText(needle, label) {
  if (text.includes(needle)) {
    console.log(`pass ${label}`);
    return;
  }
  fail(`missing ${label}: ${needle}`);
}

function requireEqual(actual, expected, label) {
  if (actual === expected) {
    console.log(`pass ${label}`);
    return;
  }
  fail(`${label} mismatch`);
}

function fail(message) {
  console.error(`fail ${message}`);
  failures += 1;
}
