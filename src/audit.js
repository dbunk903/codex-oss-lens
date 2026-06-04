export function auditBrief(manifest) {
  const checks = [
    check("sessions", manifest.summary?.sessions > 0, 20, "Brief contains session activity."),
    check("workspaces", manifest.summary?.workspaces > 0, 10, "Brief contains workspace coverage."),
    check("workflows", Object.keys(manifest.summary?.workflows || {}).length > 0, 15, "Brief contains workflow mix."),
    check("apiPayload", hasArtifact(manifest, "api-payload.dry-run.json"), 15, "Brief includes aggregate API dry-run payload."),
    check("doctor", manifest.summary?.doctorStatus === "ok", 10, "Doctor status is ok."),
    check("privacy", privacyPasses(manifest), 20, "Brief privacy flags are share-safe."),
    check("html", hasArtifact(manifest, "brief.html"), 5, "Brief includes standalone HTML."),
    check("markdown", hasArtifact(manifest, "brief.md"), 5, "Brief includes Markdown summary."),
  ];
  const score = checks.reduce((sum, item) => sum + (item.ok ? item.points : 0), 0);
  return {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    score,
    rating: score >= 90 ? "ready" : score >= 70 ? "needs-review" : "not-ready",
    checks,
    nextActions: checks.filter((item) => !item.ok).map((item) => nextAction(item.id)),
  };
}

function check(id, ok, points, message) {
  return { id, ok: Boolean(ok), points, message };
}

function hasArtifact(manifest, file) {
  return (manifest.artifacts || []).some((artifact) => artifact.file === file);
}

function privacyPasses(manifest) {
  const privacy = manifest.privacy || {};
  return privacy.rawLogsIncluded === false
    && privacy.promptsIncluded === false
    && privacy.sourceCodeIncluded === false
    && privacy.fullPathsIncluded === false;
}

function nextAction(id) {
  return {
    sessions: "Generate the brief from a Codex home that contains sessions.",
    workspaces: "Verify Codex session metadata includes workspace context.",
    workflows: "Run a fresh scan so workflow classification can be included.",
    apiPayload: "Regenerate the brief with API dry-run payload output enabled.",
    doctor: "Run codex-oss-lens doctor and fix local readiness warnings.",
    privacy: "Run codex-oss-lens redact-check before sharing the brief.",
    html: "Regenerate the brief so brief.html is included.",
    markdown: "Regenerate the brief so brief.md is included.",
  }[id] || `Review failed check: ${id}`;
}
