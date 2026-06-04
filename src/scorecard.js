export function buildMaintainerScorecard({ manifest, readiness, apiPlan, timeline } = {}) {
  if (!manifest) throw new Error("Missing manifest for maintainer scorecard");
  const categories = [
    category("activity", 25, scoreActivity(manifest, timeline), "Evidence shows sustained Codex-backed maintenance activity."),
    category("privacy", 25, scorePrivacy(manifest, readiness), "Evidence is share-safe and redaction checks pass."),
    category("planning", 20, scorePlanning(apiPlan), "API credit use has a concrete privacy-first implementation plan."),
    category("reviewability", 20, scoreReviewability(manifest, readiness, timeline), "Reviewer-facing artifacts are complete and easy to inspect."),
    category("readiness", 10, scoreReadiness(manifest, readiness), "Local diagnostics and submission readiness checks are healthy."),
  ];
  const score = categories.reduce((sum, item) => sum + item.awarded, 0);
  const scorecard = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    score,
    rating: ratingFor(score),
    categories,
    nextActions: categories.filter((item) => item.awarded < item.points).map((item) => nextAction(item.id)),
  };
  return { ...scorecard, markdown: renderScorecardMarkdown(scorecard) };
}

function category(id, points, fraction, message) {
  const awarded = Math.round(points * Math.max(0, Math.min(1, fraction)));
  return { id, points, awarded, message };
}

function scoreActivity(manifest, timeline) {
  const sessions = manifest.summary?.sessions || 0;
  const workspaces = manifest.summary?.workspaces || 0;
  const days = timeline?.days?.length || 0;
  return average([
    sessions >= 5 ? 1 : sessions >= 3 ? 0.8 : sessions >= 1 ? 0.4 : 0,
    workspaces >= 3 ? 1 : workspaces >= 2 ? 0.8 : workspaces >= 1 ? 0.5 : 0,
    days >= 3 ? 1 : days >= 2 ? 0.7 : days >= 1 ? 0.4 : 0,
  ]);
}

function scorePrivacy(manifest, readiness) {
  const privacy = manifest.privacy || {};
  const manifestPasses = privacy.rawLogsIncluded === false
    && privacy.promptsIncluded === false
    && privacy.sourceCodeIncluded === false
    && privacy.fullPathsIncluded === false;
  return average([
    manifestPasses ? 1 : 0,
    readiness?.redaction?.status === "pass" ? 1 : 0,
    readiness?.blockers?.length ? 0 : 1,
  ]);
}

function scorePlanning(apiPlan) {
  return average([
    apiPlan?.candidates?.length >= 2 ? 1 : apiPlan?.candidates?.length === 1 ? 0.6 : 0,
    apiPlan?.milestones?.length >= 2 ? 1 : apiPlan?.milestones?.length === 1 ? 0.5 : 0,
    apiPlan?.guardrails?.length >= 3 ? 1 : apiPlan?.guardrails?.length ? 0.5 : 0,
  ]);
}

function scoreReviewability(manifest, readiness, timeline) {
  const artifactFiles = new Set((manifest.artifacts || []).map((artifact) => artifact.file));
  return average([
    artifactFiles.has("brief.md") && artifactFiles.has("brief.html") ? 1 : 0,
    artifactFiles.has("scan-report.json") && artifactFiles.has("api-payload.dry-run.json") ? 1 : 0,
    readiness?.status === "pass" ? 1 : readiness?.status === "review" ? 0.6 : 0,
    timeline?.days?.length ? 1 : 0,
  ]);
}

function scoreReadiness(manifest, readiness) {
  return average([
    manifest.summary?.doctorStatus === "ok" ? 1 : 0,
    readiness?.audit?.score >= 90 ? 1 : readiness?.audit?.score >= 70 ? 0.6 : 0,
  ]);
}

function average(values) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function ratingFor(score) {
  if (score >= 90) return "strong";
  if (score >= 75) return "ready";
  if (score >= 55) return "needs-review";
  return "not-ready";
}

function nextAction(id) {
  return {
    activity: "Generate evidence from a larger or more recent Codex maintenance window.",
    privacy: "Run readiness and redact-check, then fix any privacy blockers before sharing.",
    planning: "Generate api-plan from the scan report and review the top candidate milestones.",
    reviewability: "Generate timeline and evidence-index artifacts for reviewer navigation.",
    readiness: "Run doctor, audit, and readiness until diagnostics and audit score are healthy.",
  }[id] || `Review category ${id}.`;
}

function renderScorecardMarkdown(scorecard) {
  return [
    "# Codex OSS Lens Maintainer Scorecard",
    "",
    `Generated: ${scorecard.generatedAt}`,
    `Score: ${scorecard.score}`,
    `Rating: ${scorecard.rating}`,
    "",
    "## Categories",
    "",
    ...scorecard.categories.map((item) => {
      return `- ${item.id}: ${item.awarded}/${item.points} - ${item.message}`;
    }),
    "",
    "## Next Actions",
    "",
    ...renderNextActions(scorecard.nextActions),
    "",
  ].join("\n");
}

function renderNextActions(actions) {
  if (!actions.length) return ["- None."];
  return actions.map((action) => `- ${action}`);
}
