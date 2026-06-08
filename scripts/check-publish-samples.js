#!/usr/bin/env node
import { promises as fs } from "node:fs";

const packageJson = JSON.parse(await fs.readFile("package.json", "utf8"));
const installSmoke = JSON.parse(await fs.readFile("examples/install-smoke.sample.json", "utf8"));
const installSmokeMarkdown = await fs.readFile("examples/install-smoke.sample.md", "utf8");
const publishCheck = JSON.parse(await fs.readFile("examples/publish-check.sample.json", "utf8"));
const publishCheckMarkdown = await fs.readFile("examples/publish-check.sample.md", "utf8");
let failures = 0;

requireValue(installSmoke.schemaVersion, 1, "install smoke schemaVersion");
requireValue(installSmoke.package?.name, packageJson.name, "install smoke package name");
requireValue(installSmoke.package?.version, "latest", "install smoke package selector");
requireValue(installSmoke.package?.resolvedVersion, packageJson.version, "install smoke resolved version");
requireValue(installSmoke.command, `npm exec --yes --package ${packageJson.name}@latest -- ${packageJson.name} demo`, "install smoke command");
requireCheck(installSmoke.checks, "registryVersion", "install smoke registry check");
requireCheck(installSmoke.checks, "commandExit", "install smoke command check");
requireCheck(installSmoke.checks, "jsonOutput", "install smoke JSON check");
requireCheck(installSmoke.checks, "demoPrivacy", "install smoke privacy check");
requireText(installSmokeMarkdown, `published=${packageJson.version}`, "install smoke markdown version");
requireNoText(JSON.stringify(installSmoke), "TODO", "install smoke JSON placeholders");

requireValue(publishCheck.schemaVersion, 1, "publish check schemaVersion");
requireValue(publishCheck.package?.name, packageJson.name, "publish check package name");
requireValue(publishCheck.package?.version, packageJson.version, "publish check package version");
requireValue(publishCheck.package?.latestPublishedVersion, packageJson.version, "publish check latest published version");
requireValue(publishCheck.status, "blocked", "publish check blocked status");
requireCheck(publishCheck.checks, "npmLogin", "publish check npm login gate");
requireCheck(publishCheck.checks, "versionAvailable", "publish check version gate");
requireArrayText(publishCheck.blockers, "npmLogin", "publish check npm login blocker");
requireArrayText(publishCheck.blockers, "versionAvailable", "publish check version blocker");
requireArrayText(publishCheck.publishCommands, "npm run submission:check", "publish check submission gate command");
requireArrayText(publishCheck.publishCommands, "npm publish --access public --otp <6-digit-code>", "publish check OTP publish command");
requireArrayText(
  publishCheck.publishCommands,
  `node src/cli.js install-smoke --package ${packageJson.name} --version ${packageJson.version}`,
  "publish check post-publish smoke command",
);
requireText(publishCheckMarkdown, `Package: ${packageJson.name}@${packageJson.version}`, "publish check markdown package");
requireNoText(JSON.stringify(publishCheck), "TODO", "publish check JSON placeholders");

if (failures) {
  console.error(`Publish sample check failed for ${failures} requirement(s).`);
  process.exit(1);
}

console.log(`pass publishSamples package=${packageJson.name}@${packageJson.version}`);

function requireValue(actual, expected, label) {
  if (actual === expected) {
    console.log(`pass ${label}`);
    return;
  }
  console.error(`fail ${label}: expected ${expected}, got ${actual}`);
  failures += 1;
}

function requireCheck(checks, id, label) {
  if (Array.isArray(checks) && checks.some((check) => check.id === id)) {
    console.log(`pass ${label}`);
    return;
  }
  console.error(`fail missing ${label}: ${id}`);
  failures += 1;
}

function requireArrayText(items, needle, label) {
  if (Array.isArray(items) && items.some((item) => String(item).includes(needle))) {
    console.log(`pass ${label}`);
    return;
  }
  console.error(`fail missing ${label}: ${needle}`);
  failures += 1;
}

function requireText(source, needle, label) {
  if (source.includes(needle)) {
    console.log(`pass ${label}`);
    return;
  }
  console.error(`fail missing ${label}: ${needle}`);
  failures += 1;
}

function requireNoText(source, needle, label) {
  if (!source.includes(needle)) {
    console.log(`pass ${label}`);
    return;
  }
  console.error(`fail ${label}: found ${needle}`);
  failures += 1;
}
