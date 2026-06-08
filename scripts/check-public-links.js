#!/usr/bin/env node
import { buildPublicEvidence } from "../src/public-evidence.js";

const evidence = buildPublicEvidence();
const links = Object.entries(evidence.publicLinks);
const results = [];

for (const [label, url] of links) {
  const checkTarget = checkUrlFor(url);
  const result = await checkUrl(checkTarget);
  results.push({ label, url, ...result });
  const targetNote = checkTarget === url ? "" : ` via ${checkTarget}`;
  console.log(`${result.ok ? "pass" : "fail"} ${label} ${result.status || "n/a"} ${url}${targetNote}`);
}

const failures = results.filter((result) => !result.ok);
if (failures.length) {
  console.error(`Public evidence link check failed for ${failures.length} link(s).`);
  process.exitCode = 1;
}

async function checkUrl(url) {
  try {
    const head = await requestWithRetry(url, "HEAD");
    if (head.ok || head.status === 405) return head.status === 405 ? requestWithRetry(url, "GET") : head;
    return requestWithRetry(url, "GET");
  } catch (error) {
    return { ok: false, status: null, error: error.message };
  }
}

function checkUrlFor(url) {
  const parsed = new URL(url);
  const packageMatch = parsed.hostname === "www.npmjs.com" && parsed.pathname.match(/^\/package\/([^/]+)$/);
  if (packageMatch) return `https://registry.npmjs.org/${encodeURIComponent(packageMatch[1])}`;

  const githubRepoMatch = parsed.hostname === "github.com" && parsed.pathname.match(/^\/([^/]+)\/([^/]+)$/);
  if (githubRepoMatch) {
    const [, owner, repo] = githubRepoMatch;
    return `https://api.github.com/repos/${owner}/${repo}`;
  }

  const githubReleaseMatch =
    parsed.hostname === "github.com" &&
    parsed.pathname.match(/^\/([^/]+)\/([^/]+)\/releases\/tag\/([^/]+)$/);
  if (githubReleaseMatch) {
    const [, owner, repo, tag] = githubReleaseMatch;
    return `https://api.github.com/repos/${owner}/${repo}/releases/tags/${tag}`;
  }

  const githubBlobMatch =
    parsed.hostname === "github.com" &&
    parsed.pathname.match(/^\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/(.+)$/);
  if (githubBlobMatch) {
    const [, owner, repo, ref, filePath] = githubBlobMatch;
    return `https://raw.githubusercontent.com/${owner}/${repo}/${ref}/${filePath}`;
  }

  const githubWorkflowMatch =
    parsed.hostname === "github.com" &&
    parsed.pathname.match(/^\/([^/]+)\/([^/]+)\/actions\/workflows\/([^/]+)$/);
  if (githubWorkflowMatch) {
    const [, owner, repo, fileName] = githubWorkflowMatch;
    return `https://raw.githubusercontent.com/${owner}/${repo}/main/.github/workflows/${fileName}`;
  }

  return url;
}

async function request(url, method, redirects = 0) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(url, {
      method,
      redirect: "manual",
      signal: controller.signal,
      headers: { "user-agent": "codex-oss-lens-public-link-check" },
    });

    if ([301, 302, 303, 307, 308].includes(response.status) && response.headers.get("location")) {
      if (redirects >= 5) return { ok: false, status: response.status, error: "too many redirects" };
      return request(new URL(response.headers.get("location"), url).toString(), method, redirects + 1);
    }

    return { ok: response.status >= 200 && response.status < 400, status: response.status };
  } finally {
    clearTimeout(timeout);
  }
}

async function requestWithRetry(url, method) {
  const maxAttempts = 3;
  let latest;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    latest = await request(url, method);
    if (!isTransientStatus(latest.status) || attempt === maxAttempts) return latest;
    await delay(attempt * 500);
  }
  return latest;
}

function isTransientStatus(status) {
  return [500, 502, 503, 504].includes(status);
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
