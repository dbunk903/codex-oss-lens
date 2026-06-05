import path from "node:path";

export function buildEvidenceIndex({ manifest, readiness, apiPlan, timeline, scorecard, artifactPaths = {} } = {}) {
  if (!manifest) throw new Error("Missing manifest for evidence index");
  const index = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    title: "Codex OSS Lens Evidence Index",
    status: readiness?.status || "unknown",
    summary: {
      sessions: manifest.summary?.sessions || 0,
      workspaces: manifest.summary?.workspaces || 0,
      observedTokens: manifest.summary?.observedTokens || 0,
      doctorStatus: manifest.summary?.doctorStatus || "unknown",
      readinessStatus: readiness?.status || null,
      auditScore: readiness?.audit?.score ?? null,
      redactionStatus: readiness?.redaction?.status || null,
      apiPlanCandidates: apiPlan?.candidates?.length || 0,
      timelineDays: timeline?.days?.length || 0,
      scorecardScore: scorecard?.score ?? null,
      scorecardRating: scorecard?.rating || null,
    },
    artifacts: buildArtifacts(manifest, artifactPaths),
    evidence: buildEvidence({ readiness, apiPlan, timeline, scorecard }),
    reviewerNotes: buildReviewerNotes({ readiness, apiPlan, timeline, scorecard }),
  };
  return {
    ...index,
    markdown: renderEvidenceMarkdown(index),
    html: renderEvidenceHtml(index),
  };
}

function buildArtifacts(manifest, artifactPaths) {
  const artifacts = (manifest.artifacts || []).map((artifact) => ({
    file: artifact.file,
    description: artifact.description,
  }));
  const supporting = [
    ["readiness", "Submission readiness report"],
    ["apiPlan", "API credit implementation plan"],
    ["timeline", "Maintainer activity timeline"],
    ["scorecard", "Maintainer application scorecard"],
    ["formDraft", "Copy-ready OSS support form draft"],
  ]
    .filter(([key]) => artifactPaths[key])
    .map(([key, description]) => ({
      file: path.basename(artifactPaths[key]),
      description,
    }));
  const seen = new Set();
  return [...artifacts, ...supporting].filter((artifact) => {
    if (seen.has(artifact.file)) return false;
    seen.add(artifact.file);
    return true;
  });
}

function buildEvidence({ readiness, apiPlan, timeline, scorecard }) {
  return {
    readiness: readiness
      ? {
          status: readiness.status,
          blockers: readiness.blockers?.length || 0,
          warnings: readiness.warnings?.length || 0,
          filesScanned: readiness.redaction?.filesScanned || 0,
        }
      : null,
    apiPlan: apiPlan
      ? {
          topCandidate: apiPlan.candidates?.[0]?.workflow || null,
          milestones: apiPlan.milestones || [],
          guardrails: apiPlan.guardrails || [],
        }
      : null,
    timeline: timeline
      ? {
          days: timeline.days?.length || 0,
          busiestDay: timeline.highlights?.busiestDay || null,
        }
      : null,
    scorecard: scorecard
      ? {
          score: scorecard.score,
          rating: scorecard.rating,
          nextActions: scorecard.nextActions || [],
        }
      : null,
  };
}

function buildReviewerNotes({ readiness, apiPlan, timeline, scorecard }) {
  const notes = [];
  if (readiness) notes.push(`Submission readiness status is ${readiness.status}.`);
  if (scorecard) notes.push(`Maintainer scorecard is ${scorecard.score} (${scorecard.rating}).`);
  if (apiPlan?.candidates?.[0]) {
    notes.push(`Top API credit candidate is ${apiPlan.candidates[0].workflow} (${apiPlan.candidates[0].apiUseCase}).`);
  }
  if (timeline?.highlights?.busiestDay) {
    notes.push(`Busiest observed day is ${timeline.highlights.busiestDay.day}.`);
  }
  if (!notes.length) notes.push("Attach manifest, readiness, API plan, and timeline artifacts before external review.");
  return notes;
}

function renderEvidenceMarkdown(index) {
  return [
    "# Codex OSS Lens Evidence Index",
    "",
    `Generated: ${index.generatedAt}`,
    `Status: ${index.status}`,
    "",
    "## Summary",
    "",
    `- Sessions: ${index.summary.sessions}`,
    `- Workspaces: ${index.summary.workspaces}`,
    `- Observed tokens: ${index.summary.observedTokens}`,
    `- Doctor status: ${index.summary.doctorStatus}`,
    `- Readiness status: ${index.summary.readinessStatus || "not supplied"}`,
    `- Audit score: ${index.summary.auditScore ?? "not supplied"}`,
    `- Redaction status: ${index.summary.redactionStatus || "not supplied"}`,
    `- API plan candidates: ${index.summary.apiPlanCandidates}`,
    `- Timeline days: ${index.summary.timelineDays}`,
    `- Scorecard: ${index.summary.scorecardScore ?? "not supplied"}${index.summary.scorecardRating ? ` (${index.summary.scorecardRating})` : ""}`,
    "",
    "## Artifacts",
    "",
    ...renderArtifacts(index.artifacts),
    "",
    "## Reviewer Notes",
    "",
    ...index.reviewerNotes.map((note) => `- ${note}`),
    "",
  ].join("\n");
}

function renderEvidenceHtml(index) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Codex OSS Lens Evidence Index</title>
    <style>
      body { margin: 0; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: #1f2933; background: #f7f9fb; }
      main { width: min(980px, calc(100vw - 32px)); margin: 0 auto; padding: 32px 0 48px; }
      header { background: #14332d; color: #f7fbf9; padding: 28px 0; }
      header div { width: min(980px, calc(100vw - 32px)); margin: 0 auto; }
      h1 { margin: 0; font-size: 34px; line-height: 1.1; }
      h2 { margin-top: 28px; }
      .grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; margin-top: 20px; }
      .metric { background: #fff; border: 1px solid #d8dee4; padding: 14px; }
      .label { color: #52616d; font-size: 13px; }
      .value { font-size: 24px; font-weight: 700; margin-top: 6px; }
      li { margin: 6px 0; }
      a { color: #2563a8; }
      @media (max-width: 760px) { .grid { grid-template-columns: 1fr 1fr; } h1 { font-size: 28px; } }
    </style>
  </head>
  <body>
    <header><div><h1>Codex OSS Lens Evidence Index</h1></div></header>
    <main>
      <section class="grid">
        ${metric("Status", index.status)}
        ${metric("Sessions", index.summary.sessions)}
        ${metric("Audit", index.summary.auditScore ?? "n/a")}
        ${metric("Redaction", index.summary.redactionStatus || "n/a")}
      </section>
      <h2>Artifacts</h2>
      <ul>${index.artifacts.map((artifact) => `<li><a href="${escapeHtml(artifact.file)}">${escapeHtml(artifact.file)}</a> - ${escapeHtml(artifact.description)}</li>`).join("")}</ul>
      <h2>Reviewer Notes</h2>
      <ul>${index.reviewerNotes.map((note) => `<li>${escapeHtml(note)}</li>`).join("")}</ul>
    </main>
  </body>
</html>
`;
}

function renderArtifacts(artifacts) {
  if (!artifacts.length) return ["- No artifacts listed."];
  return artifacts.map((artifact) => `- [${artifact.file}](${artifact.file}) - ${artifact.description}`);
}

function metric(label, value) {
  return `<article class="metric"><div class="label">${escapeHtml(label)}</div><div class="value">${escapeHtml(String(value))}</div></article>`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  })[char]);
}
