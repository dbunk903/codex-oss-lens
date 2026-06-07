#!/usr/bin/env node
import { buildPublicEvidence } from "../src/public-evidence.js";

const evidence = buildPublicEvidence();
const links = Object.entries(evidence.publicLinks);
const results = [];

for (const [label, url] of links) {
  const result = await checkUrl(url);
  results.push({ label, url, ...result });
  console.log(`${result.ok ? "pass" : "fail"} ${label} ${result.status || "n/a"} ${url}`);
}

const failures = results.filter((result) => !result.ok);
if (failures.length) {
  console.error(`Public evidence link check failed for ${failures.length} link(s).`);
  process.exitCode = 1;
}

async function checkUrl(url) {
  try {
    const head = await request(url, "HEAD");
    if (head.ok || head.status === 405) return head.status === 405 ? request(url, "GET") : head;
    return request(url, "GET");
  } catch (error) {
    return { ok: false, status: null, error: error.message };
  }
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
