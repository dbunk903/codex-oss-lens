import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const ISSUE_FIELDS = ["number", "title", "state", "labels", "createdAt", "updatedAt", "closedAt"];
const PR_FIELDS = [
  "number",
  "title",
  "state",
  "headRefName",
  "baseRefName",
  "labels",
  "createdAt",
  "updatedAt",
  "closedAt",
  "mergedAt",
];

export async function importGitHubOutcomes(options) {
  if (!options?.repo) {
    throw new Error("Missing --repo owner/name");
  }
  const limit = Number.isFinite(options.limit) ? options.limit : 50;
  const [issues, pullRequests] = await Promise.all([
    ghJson(["issue", "list", "--repo", options.repo, "--state", "all", "--limit", String(limit), "--json", ISSUE_FIELDS.join(",")]),
    ghJson(["pr", "list", "--repo", options.repo, "--state", "all", "--limit", String(limit), "--json", PR_FIELDS.join(",")]),
  ]);

  return normalizeGitHubOutcomes({ repo: options.repo, issues, pullRequests });
}

export function normalizeGitHubOutcomes({ repo, issues = [], pullRequests = [] }) {
  return {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    repository: repo,
    source: "github-cli",
    privacy: {
      rawCodexLogsIncluded: false,
      promptsIncluded: false,
      sourceCodeIncluded: false,
    },
    totals: {
      issues: issues.length,
      pullRequests: pullRequests.length,
      closedIssues: issues.filter((issue) => issue.state === "CLOSED").length,
      mergedPullRequests: pullRequests.filter((pullRequest) => Boolean(pullRequest.mergedAt)).length,
      openPullRequests: pullRequests.filter((pullRequest) => pullRequest.state === "OPEN").length,
    },
    issues: issues.map(normalizeIssue),
    pullRequests: pullRequests.map(normalizePullRequest),
  };
}

async function ghJson(args) {
  try {
    const { stdout } = await execFileAsync("gh", args, { maxBuffer: 10 * 1024 * 1024 });
    return JSON.parse(stdout || "[]");
  } catch (error) {
    const detail = error.stderr || error.message || String(error);
    throw new Error(`GitHub import failed. Install/authenticate gh or check --repo. ${detail}`);
  }
}

function normalizeIssue(issue) {
  return {
    number: issue.number,
    title: issue.title,
    state: issue.state,
    labels: labelNames(issue.labels),
    createdAt: issue.createdAt,
    updatedAt: issue.updatedAt,
    closedAt: issue.closedAt || null,
  };
}

function normalizePullRequest(pullRequest) {
  return {
    number: pullRequest.number,
    title: pullRequest.title,
    state: pullRequest.state,
    headRefName: pullRequest.headRefName || null,
    baseRefName: pullRequest.baseRefName || null,
    labels: labelNames(pullRequest.labels),
    createdAt: pullRequest.createdAt,
    updatedAt: pullRequest.updatedAt,
    closedAt: pullRequest.closedAt || null,
    mergedAt: pullRequest.mergedAt || null,
  };
}

function labelNames(labels = []) {
  return labels.map((label) => label.name).filter(Boolean).sort();
}
