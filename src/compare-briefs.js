export function compareBriefs(base, head) {
  const metricDeltas = {
    sessions: delta(base.summary?.sessions, head.summary?.sessions),
    workspaces: delta(base.summary?.workspaces, head.summary?.workspaces),
    turns: delta(base.summary?.turns, head.summary?.turns),
    toolCalls: delta(base.summary?.toolCalls, head.summary?.toolCalls),
    observedTokens: delta(base.summary?.observedTokens, head.summary?.observedTokens),
  };
  const workflowDeltas = compareCounts(base.summary?.workflows, head.summary?.workflows);
  const modelDeltas = compareCounts(base.summary?.models, head.summary?.models);
  return {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    baseGeneratedAt: base.generatedAt || null,
    headGeneratedAt: head.generatedAt || null,
    metricDeltas,
    workflowDeltas,
    modelDeltas,
    markdown: renderCompareMarkdown(metricDeltas, workflowDeltas, modelDeltas),
  };
}

function delta(baseValue = 0, headValue = 0) {
  const before = Number(baseValue || 0);
  const after = Number(headValue || 0);
  return { before, after, delta: after - before };
}

function compareCounts(baseCounts = {}, headCounts = {}) {
  const keys = [...new Set([...Object.keys(baseCounts || {}), ...Object.keys(headCounts || {})])].sort();
  return Object.fromEntries(keys.map((key) => [key, delta(baseCounts[key], headCounts[key])]));
}

function renderCompareMarkdown(metricDeltas, workflowDeltas, modelDeltas) {
  return [
    "# Codex OSS Lens Brief Comparison",
    "",
    "## Metric Deltas",
    "",
    ...Object.entries(metricDeltas).map(([name, value]) => {
      return `- ${name}: ${value.before} -> ${value.after} (${signed(value.delta)})`;
    }),
    "",
    "## Workflow Deltas",
    "",
    ...Object.entries(workflowDeltas).map(([name, value]) => {
      return `- ${name}: ${value.before} -> ${value.after} (${signed(value.delta)})`;
    }),
    "",
    "## Model Deltas",
    "",
    ...Object.entries(modelDeltas).map(([name, value]) => {
      return `- ${name}: ${value.before} -> ${value.after} (${signed(value.delta)})`;
    }),
    "",
  ].join("\n");
}

function signed(value) {
  return value > 0 ? `+${value}` : String(value);
}
