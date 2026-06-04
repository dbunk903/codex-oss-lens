export function buildApiCreditPlan(report) {
  const candidates = Object.entries(report.byWorkflow || {})
    .map(([workflow, row]) => buildCandidate(workflow, row))
    .sort((a, b) => b.score - a.score || a.workflow.localeCompare(b.workflow));
  const plan = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    purpose: "codex-api-credit-implementation-plan",
    privacy: {
      rawLogsIncluded: false,
      promptsIncluded: false,
      sourceCodeIncluded: false,
      fullPathsIncluded: false,
      recommendedInput: "Use api-payload.dry-run.json or equivalent aggregate metrics only.",
    },
    summary: {
      sessions: report.totals?.sessions || 0,
      workspaces: report.totals?.workspaces || 0,
      turns: report.totals?.turns || 0,
      toolCalls: report.totals?.toolCalls || 0,
      observedTokens: report.totals?.tokens?.total || 0,
      primaryQuotaUsedPercent: report.totals?.latestRateLimits?.primary?.usedPercent ?? null,
      secondaryQuotaUsedPercent: report.totals?.latestRateLimits?.secondary?.usedPercent ?? null,
    },
    candidates,
    milestones: buildMilestones(candidates),
    guardrails: [
      "Keep raw Codex rollout JSONL, prompts, source code, terminal output, and full paths local.",
      "Start with dry-run payload review before enabling any live API request.",
      "Store only aggregate summaries unless a maintainer explicitly opts into richer context.",
    ],
  };
  return { ...plan, markdown: renderApiPlanMarkdown(plan) };
}

function buildCandidate(workflow, row = {}) {
  const sessions = row.sessions || 0;
  const turns = row.turns || 0;
  const toolCalls = row.toolCalls || 0;
  const tokens = row.tokens?.total || 0;
  const score = Math.round((sessions * 12) + (turns * 1.4) + (toolCalls * 3) + (tokens / 12000));
  const labels = workflowRecommendation(workflow);
  return {
    workflow,
    score,
    sessions,
    turns,
    toolCalls,
    observedTokens: tokens,
    apiUseCase: labels.apiUseCase,
    expectedBenefit: labels.expectedBenefit,
    firstPrompt: labels.firstPrompt,
  };
}

function workflowRecommendation(workflow) {
  const map = {
    implementation: {
      apiUseCase: "implementation-session-summary",
      expectedBenefit: "Summarize long implementation sessions into release notes, residual risks, and follow-up tasks.",
      firstPrompt: "Summarize aggregate implementation activity by workflow, tokens, turns, and linked outcomes.",
    },
    review: {
      apiUseCase: "review-risk-brief",
      expectedBenefit: "Turn review-heavy Codex sessions into concise risk and verification briefs for maintainers.",
      firstPrompt: "Create a maintainer review brief from aggregate review sessions and linked pull requests.",
    },
    triage: {
      apiUseCase: "issue-triage-prioritization",
      expectedBenefit: "Prioritize issue triage themes without sending raw issue bodies or local session logs.",
      firstPrompt: "Rank triage themes using only workflow counts, session counts, and public issue metadata.",
    },
    release: {
      apiUseCase: "release-readiness-summary",
      expectedBenefit: "Produce release checklists from aggregate release-session activity and verification status.",
      firstPrompt: "Draft a release readiness summary from aggregate release workflow metrics.",
    },
    security: {
      apiUseCase: "security-maintenance-digest",
      expectedBenefit: "Summarize security maintenance effort and unresolved verification gaps for maintainers.",
      firstPrompt: "Summarize security workflow activity using aggregate counts and local readiness flags.",
    },
  };
  return map[workflow] || {
    apiUseCase: "maintainer-workflow-summary",
    expectedBenefit: "Identify whether this workflow deserves a dedicated API-backed summary after more data is collected.",
    firstPrompt: "Summarize aggregate Codex workflow activity and recommend whether to automate it.",
  };
}

function buildMilestones(candidates) {
  const top = candidates.slice(0, 3);
  if (!top.length) {
    return ["Collect a scan report with at least one Codex session before selecting API-backed workflows."];
  }
  return top.map((candidate, index) => {
    return `M${index + 1}: prototype ${candidate.apiUseCase} for ${candidate.workflow} using aggregate dry-run payloads.`;
  });
}

function renderApiPlanMarkdown(plan) {
  return [
    "# Codex OSS Lens API Credit Plan",
    "",
    `Generated: ${plan.generatedAt}`,
    "",
    "## Summary",
    "",
    `- Sessions: ${plan.summary.sessions}`,
    `- Workspaces: ${plan.summary.workspaces}`,
    `- Turns: ${plan.summary.turns}`,
    `- Tool calls: ${plan.summary.toolCalls}`,
    `- Observed tokens: ${plan.summary.observedTokens}`,
    "",
    "## Prioritized Candidates",
    "",
    ...renderCandidateBullets(plan.candidates),
    "",
    "## Milestones",
    "",
    ...plan.milestones.map((item) => `- ${item}`),
    "",
    "## Guardrails",
    "",
    ...plan.guardrails.map((item) => `- ${item}`),
    "",
  ].join("\n");
}

function renderCandidateBullets(candidates) {
  if (!candidates.length) return ["- No workflow data found."];
  return candidates.map((candidate) => {
    return `- ${candidate.workflow}: score ${candidate.score}, ${candidate.apiUseCase} (${candidate.sessions} sessions, ${candidate.observedTokens} tokens)`;
  });
}
