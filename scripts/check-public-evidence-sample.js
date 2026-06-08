#!/usr/bin/env node
import { promises as fs } from "node:fs";
import { buildPublicEvidence } from "../src/public-evidence.js";

const SAMPLE_JSON = "examples/public-evidence.sample.json";
const SAMPLE_MD = "examples/public-evidence.sample.md";
const expected = buildPublicEvidence();
const sample = JSON.parse(await fs.readFile(SAMPLE_JSON, "utf8"));
const markdown = await fs.readFile(SAMPLE_MD, "utf8");
let failures = 0;

requireEqual(sample.schemaVersion, expected.schemaVersion, "schemaVersion");
requireEqual(sample.status, expected.status, "status");
requireArrayEqual(sample.manualFields, expected.manualFields, "manualFields");
requireObjectEqual(sample.publicLinks, expected.publicLinks, "publicLinks");
requireProofPoints(sample.proofPoints, expected.proofPoints);

for (const [label, url] of Object.entries(expected.publicLinks)) {
  requireText(markdown, `- ${label}: ${url}`, `markdown public link ${label}`);
}

for (const proofPoint of expected.proofPoints) {
  requireText(markdown, `- ${proofPoint.id}: ${proofPoint.label} ${proofPoint.url}`, `markdown proof ${proofPoint.id}`);
}

if (failures) {
  console.error(`Public evidence sample check failed for ${failures} requirement(s).`);
  process.exit(1);
}

console.log(`pass publicEvidenceSample links=${Object.keys(expected.publicLinks).length} proofPoints=${expected.proofPoints.length}`);

function requireEqual(actual, expectedValue, label) {
  if (actual === expectedValue) {
    console.log(`pass ${label}`);
    return;
  }
  console.error(`fail ${label}: expected ${expectedValue}, got ${actual}`);
  failures += 1;
}

function requireArrayEqual(actual, expectedValue, label) {
  if (JSON.stringify(actual) === JSON.stringify(expectedValue)) {
    console.log(`pass ${label}`);
    return;
  }
  console.error(`fail ${label}: sample does not match current public evidence`);
  failures += 1;
}

function requireObjectEqual(actual, expectedValue, label) {
  if (JSON.stringify(actual) === JSON.stringify(expectedValue)) {
    console.log(`pass ${label}`);
    return;
  }
  console.error(`fail ${label}: sample does not match current public evidence`);
  failures += 1;
}

function requireProofPoints(actual, expectedValue) {
  const actualStable = actual.map(({ id, label, url }) => ({ id, label, url }));
  const expectedStable = expectedValue.map(({ id, label, url }) => ({ id, label, url }));
  requireArrayEqual(actualStable, expectedStable, "proofPoints");
}

function requireText(source, needle, label) {
  if (source.includes(needle)) {
    console.log(`pass ${label}`);
    return;
  }
  console.error(`fail missing ${label}: ${needle}`);
  failures += 1;
}
