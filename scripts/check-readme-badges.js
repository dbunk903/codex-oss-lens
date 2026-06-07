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
  const result = await checkUrl(url);
  console.log(`${result.ok ? "pass" : "fail"} badge ${result.status || "n/a"} ${url}`);
  if (!result.ok) failures += 1;
}

if (failures) {
  console.error(`README badge check failed for ${failures} badge(s).`);
  process.exit(1);
}

async function checkUrl(url) {
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
