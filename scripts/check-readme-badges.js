#!/usr/bin/env node
import { promises as fs } from "node:fs";

const readme = await fs.readFile("README.md", "utf8");
const badgeUrls = [...readme.matchAll(/!\[[^\]]*]\((https?:\/\/[^)]+)\)/g)].map((match) => match[1]);

if (!badgeUrls.length) {
  console.error("No README badge image URLs found.");
  process.exit(1);
}

let failures = 0;
for (const url of badgeUrls) {
  const checkTarget = checkUrlFor(url);
  const result = await checkUrl(checkTarget);
  const targetNote = checkTarget === url ? "" : ` via ${checkTarget}`;
  console.log(`${result.ok ? "pass" : "fail"} badge ${result.status || "n/a"} ${url}${targetNote}`);
  if (!result.ok) failures += 1;
}

if (failures) {
  console.error(`README badge check failed for ${failures} badge(s).`);
  process.exit(1);
}

async function checkUrl(url) {
  const maxAttempts = 3;
  let latest;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    latest = await request(url);
    if (!isTransientStatus(latest.status) || attempt === maxAttempts) return latest;
    await delay(attempt * 500);
  }
  return latest;
}

function checkUrlFor(url) {
  const parsed = new URL(url);
  const githubWorkflowBadgeMatch =
    parsed.hostname === "github.com" &&
    parsed.pathname.match(/^\/([^/]+)\/([^/]+)\/actions\/workflows\/([^/]+)\/badge\.svg$/);
  if (githubWorkflowBadgeMatch) {
    const [, owner, repo, fileName] = githubWorkflowBadgeMatch;
    return `https://raw.githubusercontent.com/${owner}/${repo}/main/.github/workflows/${fileName}`;
  }
  return url;
}

async function request(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: { "user-agent": "codex-oss-lens-readme-badge-check" },
    });
    return { ok: response.status >= 200 && response.status < 400, status: response.status };
  } catch (error) {
    return { ok: false, status: null, error: error.message };
  } finally {
    clearTimeout(timeout);
  }
}

function isTransientStatus(status) {
  return [500, 502, 503, 504].includes(status);
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
