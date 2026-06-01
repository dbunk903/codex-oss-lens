export function renderWeeklyReport(report) {
  const generatedAt = new Date(report.generatedAt).toISOString().slice(0, 10);
  const topWorkspaces = topEntries(report.byWorkspace, 5);
  const topModels = topEntries(report.byModel, 5);
  const topWorkflows = topEntries(report.byWorkflow, 5);
  const rate = report.totals.latestRateLimits;

  return [
    "# Codex OSS Lens Weekly Report",
    "",
    `Generated: ${generatedAt}`,
    "",
    "## Summary",
    "",
    `- Sessions scanned: ${report.totals.sessions}`,
    `- Workspaces touched: ${report.totals.workspaces}`,
    `- Turns observed: ${report.totals.turns}`,
    `- Tool calls observed: ${report.totals.toolCalls}`,
    `- Observed tokens: ${formatNumber(report.totals.tokens.total)}`,
    "",
    "## Quota Windows",
    "",
    `- 5-hour window: ${formatPercent(rate?.primary?.usedPercent)}`,
    `- Weekly window: ${formatPercent(rate?.secondary?.usedPercent)}`,
    "",
    "## Workspace Hotspots",
    "",
    ...renderBullets(topWorkspaces, ([name, row]) => {
      return `${name}: ${row.sessions} sessions, ${row.turns} turns, ${formatNumber(row.tokens.total)} tokens`;
    }),
    "",
    "## Model Mix",
    "",
    ...renderBullets(topModels, ([name, row]) => {
      return `${name}: ${row.sessions} sessions, ${formatNumber(row.tokens.total)} tokens`;
    }),
    "",
    "## Workflow Mix",
    "",
    ...renderBullets(topWorkflows, ([name, row]) => {
      return `${name}: ${row.sessions} sessions, ${row.turns} turns, ${formatNumber(row.tokens.total)} tokens`;
    }),
    "",
    "## Maintainer Notes",
    "",
    "- Review high-turn sessions for missing project instructions or flaky verification loops.",
    "- Use workspace hotspots to prioritize automation candidates for API-credit backed workflows.",
    "- Keep raw rollout JSONL local; share only this aggregate report when public evidence is needed.",
    "",
  ].join("\n");
}

function topEntries(source, limit) {
  return Object.entries(source || {})
    .sort((a, b) => (b[1].tokens?.total || 0) - (a[1].tokens?.total || 0))
    .slice(0, limit);
}

function renderBullets(rows, formatter) {
  if (!rows.length) return ["- No data found."];
  return rows.map((row) => `- ${formatter(row)}`);
}

function formatNumber(value) {
  return new Intl.NumberFormat("en").format(value || 0);
}

function formatPercent(value) {
  if (!Number.isFinite(value)) return "not observed";
  return `${Math.round(value)}%`;
}
