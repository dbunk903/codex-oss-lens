const DEFAULTS = {
  repo: "https://github.com/dbunk903/codex-oss-lens",
  releaseUrl: "https://github.com/dbunk903/codex-oss-lens/releases/tag/v1.6.1",
  npmPackage: "https://www.npmjs.com/package/codex-oss-lens",
  roadmapUrl: "https://github.com/dbunk903/codex-oss-lens/blob/main/ROADMAP.md",
  applicationStatusUrl: "https://github.com/dbunk903/codex-oss-lens/blob/main/docs/application-status.md",
  reviewerQuickstartUrl: "https://github.com/dbunk903/codex-oss-lens/blob/main/docs/reviewer-quickstart.md",
  apiWorkflowUrl: "https://github.com/dbunk903/codex-oss-lens/blob/main/docs/api-credit-workflow.md",
  useCasesUrl: "https://github.com/dbunk903/codex-oss-lens/blob/main/docs/maintainer-use-cases.md",
  finalChecklistUrl: "https://github.com/dbunk903/codex-oss-lens/blob/main/docs/final-submission-checklist.md",
  finalCopyUrl: "https://github.com/dbunk903/codex-oss-lens/blob/main/application/final-copy.md",
  formDraftSampleUrl: "https://github.com/dbunk903/codex-oss-lens/blob/main/examples/form-draft.sample.md",
  publicEvidenceSampleUrl: "https://github.com/dbunk903/codex-oss-lens/blob/main/examples/public-evidence.sample.md",
  publishCheckSampleUrl: "https://github.com/dbunk903/codex-oss-lens/blob/main/examples/publish-check.sample.md",
  installSmokeSampleUrl: "https://github.com/dbunk903/codex-oss-lens/blob/main/examples/install-smoke.sample.md",
  nodeCiUrl: "https://github.com/dbunk903/codex-oss-lens/actions/workflows/test.yml",
  publishedSmokeUrl: "https://github.com/dbunk903/codex-oss-lens/actions/workflows/published-smoke.yml",
};

export function buildPublicEvidence(options = {}) {
  const links = { ...DEFAULTS, ...compactLinks(options) };
  const evidence = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    status: "ready",
    manualFields: [
      "Last name",
      "First name",
      "Email registered to the ChatGPT account",
      "GitHub username",
      "OpenAI organization ID",
      "Terms review and final submit",
    ],
    publicLinks: links,
    proofPoints: [
      proof("publicRepository", "Public GitHub repository is available.", links.repo),
      proof("latestRelease", "Latest GitHub release is available.", links.releaseUrl),
      proof("npmPackage", "Package is published on npm.", links.npmPackage),
      proof("nodeCi", "Source tests and packaged CLI smoke run in GitHub Actions.", links.nodeCiUrl),
      proof("publishedSmoke", "npm latest install smoke runs in GitHub Actions.", links.publishedSmokeUrl),
      proof("roadmap", "Roadmap documents future maintainer workflow work.", links.roadmapUrl),
      proof("applicationStatus", "Application status captures ready, source-only, and manual submit gates.", links.applicationStatusUrl),
      proof("reviewerQuickstart", "Reviewer quickstart gives public-only verification steps.", links.reviewerQuickstartUrl),
      proof("apiCreditWorkflow", "API-credit workflow keeps raw logs local and sends aggregate opt-in payloads.", links.apiWorkflowUrl),
      proof("maintainerUseCases", "Maintainer use cases document weekly review, evidence, privacy, and package confidence.", links.useCasesUrl),
      proof("finalChecklist", "Final checklist captures submit-time public links, verification, and account-owner gates.", links.finalChecklistUrl),
      proof("finalCopy", "Final copy keeps Korean application answers within form limits.", links.finalCopyUrl),
      proof("formDraftSample", "Form draft sample shows paste-ready answers with complete reviewer links.", links.formDraftSampleUrl),
      proof("publicEvidenceSample", "Public evidence sample records the generated reviewer link set.", links.publicEvidenceSampleUrl),
      proof("publishCheckSample", "Publish check sample records npm login and version-availability gates.", links.publishCheckSampleUrl),
      proof("installSmokeSample", "Install smoke sample records the current npm latest result and source-vs-published gap.", links.installSmokeSampleUrl),
    ],
    copyChecklist: [
      "Paste repository URL and GitHub username.",
      "Select Project API credits.",
      "Paste the three 500-character Korean answers from application/final-copy.md.",
      "Fill OpenAI organization ID from platform settings.",
      "Review terms in the account owner's browser before final submit.",
    ],
  };
  return { ...evidence, markdown: renderPublicEvidenceMarkdown(evidence) };
}

function compactLinks(options) {
  return {
    ...(options.repo ? { repo: options.repo } : {}),
    ...(options.releaseUrl ? { releaseUrl: options.releaseUrl } : {}),
    ...(options.npmPackage ? { npmPackage: options.npmPackage } : {}),
    ...(options.roadmapUrl ? { roadmapUrl: options.roadmapUrl } : {}),
    ...(options.applicationStatusUrl ? { applicationStatusUrl: options.applicationStatusUrl } : {}),
    ...(options.reviewerQuickstartUrl ? { reviewerQuickstartUrl: options.reviewerQuickstartUrl } : {}),
    ...(options.apiWorkflowUrl ? { apiWorkflowUrl: options.apiWorkflowUrl } : {}),
    ...(options.useCasesUrl ? { useCasesUrl: options.useCasesUrl } : {}),
    ...(options.finalChecklistUrl ? { finalChecklistUrl: options.finalChecklistUrl } : {}),
    ...(options.finalCopyUrl ? { finalCopyUrl: options.finalCopyUrl } : {}),
    ...(options.formDraftSampleUrl ? { formDraftSampleUrl: options.formDraftSampleUrl } : {}),
    ...(options.publicEvidenceSampleUrl ? { publicEvidenceSampleUrl: options.publicEvidenceSampleUrl } : {}),
    ...(options.publishCheckSampleUrl ? { publishCheckSampleUrl: options.publishCheckSampleUrl } : {}),
    ...(options.installSmokeSampleUrl ? { installSmokeSampleUrl: options.installSmokeSampleUrl } : {}),
    ...(options.nodeCiUrl ? { nodeCiUrl: options.nodeCiUrl } : {}),
    ...(options.publishedSmokeUrl ? { publishedSmokeUrl: options.publishedSmokeUrl } : {}),
  };
}

function proof(id, label, url) {
  return { id, label, url };
}

function renderPublicEvidenceMarkdown(evidence) {
  return [
    "# Codex OSS Lens Public Evidence",
    "",
    `Generated: ${evidence.generatedAt}`,
    `Status: ${evidence.status}`,
    "",
    "## Public Links",
    "",
    ...Object.entries(evidence.publicLinks).map(([label, url]) => `- ${label}: ${url}`),
    "",
    "## Proof Points",
    "",
    ...evidence.proofPoints.map((item) => `- ${item.id}: ${item.label} ${item.url}`),
    "",
    "## Copy Checklist",
    "",
    ...evidence.copyChecklist.map((item) => `- ${item}`),
    "",
    "## Manual Fields",
    "",
    ...evidence.manualFields.map((item) => `- ${item}`),
    "",
  ].join("\n");
}
