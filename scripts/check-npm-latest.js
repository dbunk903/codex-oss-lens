#!/usr/bin/env node
import { promises as fs } from "node:fs";

const packageJson = JSON.parse(await fs.readFile("package.json", "utf8"));
const registryUrl = `https://registry.npmjs.org/${encodeURIComponent(packageJson.name)}`;
const result = await requestWithRetry(registryUrl);

if (!result.ok) {
  console.error(`npm latest check failed status=${result.status || "n/a"} attempts=${result.attempts} error=${result.error || "n/a"}`);
  process.exit(1);
}

const latest = result.body?.["dist-tags"]?.latest;
if (latest !== packageJson.version) {
  console.error(`npm latest mismatch: registry latest is ${latest || "missing"}, package.json is ${packageJson.version}.`);
  process.exit(1);
}

if (!result.body?.versions?.[packageJson.version]) {
  console.error(`npm registry does not list ${packageJson.name}@${packageJson.version}.`);
  process.exit(1);
}

console.log(`pass npmLatest package=${packageJson.name}@${packageJson.version} attempts=${result.attempts}`);

async function requestWithRetry(url) {
  const maxAttempts = 3;
  let latest;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    latest = await requestJson(url);
    latest.attempts = attempt;
    if (!isTransientFailure(latest) || attempt === maxAttempts) return latest;
    await delay(attempt * 500);
  }
  return latest;
}

async function requestJson(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: { "user-agent": "codex-oss-lens-npm-latest-check" },
    });
    const body = response.ok ? await response.json() : null;
    return { ok: response.status >= 200 && response.status < 400, status: response.status, body };
  } catch (error) {
    return { ok: false, status: null, error: error.message };
  } finally {
    clearTimeout(timeout);
  }
}

function isTransientFailure(result) {
  if (!result.status) return true;
  return [408, 429, 500, 502, 503, 504].includes(result.status);
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
