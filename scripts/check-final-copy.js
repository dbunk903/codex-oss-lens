#!/usr/bin/env node
import { promises as fs } from "node:fs";

const FINAL_COPY = "application/final-copy.md";
const FORM_ANSWERS = "application/form-answers.md";
const REQUIRED_LINKS = [
  "https://github.com/dbunk903/codex-oss-lens",
  "https://github.com/dbunk903/codex-oss-lens/releases/tag/v1.6.1",
  "https://www.npmjs.com/package/codex-oss-lens",
  "https://github.com/dbunk903/codex-oss-lens/blob/main/examples/public-evidence.sample.md",
];

const text = await fs.readFile(FINAL_COPY, "utf8");
const formAnswers = await fs.readFile(FORM_ANSWERS, "utf8");
const blocks = extractTextBlocks(text);
const koreanBlocks = blocks.filter((block) => /[가-힣]/.test(block));

if (koreanBlocks.length !== 3) {
  fail(`Expected 3 Korean answer blocks, found ${koreanBlocks.length}.`);
}

for (const block of koreanBlocks) {
  const chars = [...block].length;
  if (chars > 500) fail(`Answer exceeds 500 characters: ${chars}`);
  console.log(`pass answerChars=${chars}`);
}

const canonicalAnswers = {
  repositoryFit: koreanBlocks[0],
  apiCreditsPlan: koreanBlocks[1],
  additionalInfo: koreanBlocks[2],
};

for (const [field, answer] of Object.entries(canonicalAnswers)) {
  if (!formAnswers.includes(answer)) fail(`application/form-answers.md is out of sync for ${field}.`);
  console.log(`pass synced ${field}`);
}

for (const link of REQUIRED_LINKS) {
  if (!text.includes(link)) fail(`Missing required final-copy link: ${link}`);
  console.log(`pass link ${link}`);
}

if (!text.includes("v1.6.1")) fail("Missing current release version v1.6.1.");
if (!text.includes("codex-oss-lens")) fail("Missing package/repository name.");
if (formAnswers.includes("Codex Security")) fail("form-answers.md should not suggest Codex Security for this application.");

console.log("pass final-copy ready");

function extractTextBlocks(source) {
  return [...source.matchAll(/```text\n([\s\S]*?)\n```/g)].map((match) => match[1].trim());
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
