import crypto from "node:crypto";

export function buildApiSummaryPayload(report) {
  return {
    schemaVersion: 1,
    generatedAt: report.generatedAt,
    purpose: "codex-maintainer-summary-dry-run",
    privacy: {
      rawLogsIncluded: false,
      promptsIncluded: false,
      sourceCodeIncluded: false,
      terminalOutputIncluded: false,
      fullPathsIncluded: false,
      inputFullPathsObserved: hasFullPathLikeValue(report),
    },
    totals: {
      sessions: report.totals.sessions,
      workspaces: report.totals.workspaces,
      turns: report.totals.turns,
      toolCalls: report.totals.toolCalls,
      tokens: safeTokens(report.totals.tokens),
      planType: report.totals.planType || null,
    },
    quotaWindows: {
      primaryUsedPercent: report.totals.latestRateLimits?.primary?.usedPercent ?? null,
      secondaryUsedPercent: report.totals.latestRateLimits?.secondary?.usedPercent ?? null,
    },
    modelCounts: countRows(report.byModel),
    workflowCounts: countRows(report.byWorkflow),
    dailySessionCounts: Object.fromEntries(
      Object.entries(report.byDay || {}).map(([day, row]) => [day, row.sessions || 0]),
    ),
    workspaceBuckets: buildWorkspaceBuckets(report),
    frictionCandidates: buildFrictionCandidates(report),
  };
}

function buildWorkspaceBuckets(report) {
  const byCwd = new Map();
  for (const session of report.sessions || []) {
    const key = safeWorkspaceBucket(session.cwd || "[unknown]");
    const current = byCwd.get(key) || {
      workspace: key,
      sessions: 0,
      turns: 0,
      toolCalls: 0,
      tokens: 0,
      workflows: {},
    };
    current.sessions += 1;
    current.turns += session.turns || 0;
    current.toolCalls += session.toolCalls || 0;
    current.tokens += session.tokens?.total || 0;
    current.workflows[session.workflow || "unknown"] = (current.workflows[session.workflow || "unknown"] || 0) + 1;
    byCwd.set(key, current);
  }
  return [...byCwd.values()].sort((a, b) => b.tokens - a.tokens).slice(0, 10);
}

function safeWorkspaceBucket(value) {
  if (!isFullPathLike(value)) return value;
  const hash = crypto.createHash("sha256").update(value).digest("hex").slice(0, 10);
  return `[workspace:${hash}]`;
}

function buildFrictionCandidates(report) {
  return (report.sessions || [])
    .map((session) => ({
      workflow: session.workflow || "unknown",
      turns: session.turns || 0,
      toolCalls: session.toolCalls || 0,
      durationMinutes: session.durationMinutes || 0,
      tokens: session.tokens?.total || 0,
      hasGitMetadata: Boolean(session.git),
    }))
    .filter((session) => session.turns >= 15 || session.toolCalls >= 8 || session.durationMinutes >= 120)
    .sort((a, b) => b.turns - a.turns || b.toolCalls - a.toolCalls)
    .slice(0, 10);
}

function countRows(source) {
  return Object.fromEntries(
    Object.entries(source || {}).map(([key, row]) => [key, row.sessions || 0]),
  );
}

function safeTokens(tokens = {}) {
  return {
    input: tokens.input || 0,
    cachedInput: tokens.cachedInput || 0,
    output: tokens.output || 0,
    reasoningOutput: tokens.reasoningOutput || 0,
    total: tokens.total || 0,
  };
}

function hasFullPathLikeValue(report) {
  return (report.sessions || []).some((session) => {
    return isFullPathLike(session.cwd || "");
  });
}

function isFullPathLike(value) {
  return value.startsWith("/") || /^[A-Za-z]:[\\/]/.test(value);
}
