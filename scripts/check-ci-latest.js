#!/usr/bin/env node

const OWNER = "dbunk903";
const REPO = "codex-oss-lens";
const WORKFLOWS = [
  { file: "test.yml", name: "Node tests" },
  { file: "published-smoke.yml", name: "Published package smoke" },
];

let failures = 0;
for (const workflow of WORKFLOWS) {
  const result = await latestCompletedRun(workflow.file);
  if (!result.ok) {
    fail(`${workflow.name}: ${result.error || `status ${result.status || "n/a"}`}`);
    continue;
  }

  const run = result.body.workflow_runs?.[0];
  if (!run) {
    fail(`${workflow.name}: no completed runs found`);
    continue;
  }

  if (run.conclusion !== "success") {
    fail(`${workflow.name}: latest completed run ${run.html_url} concluded ${run.conclusion || "unknown"}`);
    continue;
  }

  console.log(`pass ciLatest workflow="${workflow.name}" run=${run.id} conclusion=${run.conclusion} sha=${run.head_sha}`);
}

if (failures) {
  console.error(`Latest CI check failed for ${failures} workflow(s).`);
  process.exit(1);
}

async function latestCompletedRun(workflowFile) {
  const url = new URL(`https://api.github.com/repos/${OWNER}/${REPO}/actions/workflows/${workflowFile}/runs`);
  url.searchParams.set("branch", "main");
  url.searchParams.set("status", "completed");
  url.searchParams.set("per_page", "1");
  return requestWithRetry(url);
}

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
  const headers = {
    accept: "application/vnd.github+json",
    "user-agent": "codex-oss-lens-ci-latest-check",
  };
  if (process.env.GITHUB_TOKEN) headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers,
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

function fail(message) {
  console.error(`fail ${message}`);
  failures += 1;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
