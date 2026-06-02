import crypto from "node:crypto";

export function linkGitHubOutcomes(report, outcomes) {
  const pullRequests = outcomes?.pullRequests || [];
  const pullRequestsByBranch = new Map();
  for (const pullRequest of pullRequests) {
    if (!pullRequest.headRefName) continue;
    const list = pullRequestsByBranch.get(pullRequest.headRefName) || [];
    list.push(summarizePullRequest(pullRequest));
    pullRequestsByBranch.set(pullRequest.headRefName, list);
  }

  const sessions = (report.sessions || []).map((session) => {
    const branch = session.git?.branch || null;
    const matchedPullRequests = branch ? pullRequestsByBranch.get(branch) || [] : [];
    return {
      workspace: safeWorkspaceBucket(session.cwd || session.workspace || "[unknown]"),
      workflow: session.workflow || "unknown",
      branch,
      commit: session.git?.commit || null,
      startedAt: session.startedAt,
      turns: session.turns || 0,
      toolCalls: session.toolCalls || 0,
      tokens: session.tokens?.total || 0,
      matchedPullRequests,
    };
  });

  const matchedNumbers = new Set(
    sessions.flatMap((session) => session.matchedPullRequests.map((pullRequest) => pullRequest.number)),
  );

  return {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    repository: outcomes?.repository || null,
    privacy: {
      rawCodexLogsIncluded: false,
      promptsIncluded: false,
      sourceCodeIncluded: false,
      fullPathsIncluded: false,
      inputFullPathsObserved: (report.sessions || []).some((session) => {
        return isFullPathLike(session.cwd || session.workspace || "");
      }),
    },
    totals: {
      sessions: sessions.length,
      pullRequests: pullRequests.length,
      linkedSessions: sessions.filter((session) => session.matchedPullRequests.length > 0).length,
      unmatchedSessions: sessions.filter((session) => session.matchedPullRequests.length === 0).length,
      unmatchedPullRequests: pullRequests.filter((pullRequest) => !matchedNumbers.has(pullRequest.number)).length,
    },
    sessions,
    unmatchedPullRequests: pullRequests
      .filter((pullRequest) => !matchedNumbers.has(pullRequest.number))
      .map(summarizePullRequest),
  };
}

function summarizePullRequest(pullRequest) {
  return {
    number: pullRequest.number,
    title: pullRequest.title,
    state: pullRequest.state,
    headRefName: pullRequest.headRefName || null,
    baseRefName: pullRequest.baseRefName || null,
    mergedAt: pullRequest.mergedAt || null,
    labels: pullRequest.labels || [],
  };
}

function isFullPathLike(value) {
  return String(value || "").startsWith("/") || /^[A-Za-z]:[\\/]/.test(String(value || ""));
}

function safeWorkspaceBucket(value) {
  if (!isFullPathLike(value)) return value;
  const hash = crypto.createHash("sha256").update(String(value)).digest("hex").slice(0, 10);
  return `[workspace:${hash}]`;
}
