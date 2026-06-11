#!/usr/bin/env node
import http from "node:http";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { demoReport, scanCodexHome } from "./parser.js";
import { renderWeeklyReport } from "./report.js";
import { buildApiSummaryPayload } from "./api-payload.js";
import { importGitHubOutcomes } from "./github-import.js";
import { linkGitHubOutcomes } from "./outcome-linker.js";
import { runDoctor } from "./doctor.js";
import { generateBrief } from "./brief.js";
import { auditBrief } from "./audit.js";
import { redactCheck } from "./redact-check.js";
import { compareBriefs } from "./compare-briefs.js";
import { buildReadinessReport } from "./readiness.js";
import { buildApiCreditPlan } from "./api-plan.js";
import { buildActivityTimeline } from "./timeline.js";
import { buildEvidenceIndex } from "./evidence-index.js";
import { buildMaintainerScorecard } from "./scorecard.js";
import { generateSubmissionPack } from "./submission-pack.js";
import { buildFormDraft } from "./form-draft.js";
import { validateSubmissionPack } from "./pack-validate.js";
import { runPublishedInstallSmoke } from "./install-smoke.js";
import { runPublishCheck } from "./publish-check.js";
import { buildPublicEvidence } from "./public-evidence.js";

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const publicDir = path.join(rootDir, "public");

async function main() {
  const [command = "scan", ...args] = process.argv.slice(2);
  const options = parseArgs(args);

  if (command === "scan") {
    const report = options.demo ? demoReport() : await scanCodexHome(options);
    await writeReport(report, options.out);
    return;
  }

  if (command === "weekly") {
    const report = options.demo ? demoReport() : await scanCodexHome(options);
    await writeText(renderWeeklyReport(report), options.out);
    return;
  }

  if (command === "api-payload") {
    const report = options.demo ? demoReport() : await scanCodexHome({ ...options, redaction: options.redaction || "hash" });
    await writeReport(buildApiSummaryPayload(report), options.out);
    return;
  }

  if (command === "github-import") {
    await writeReport(await importGitHubOutcomes(options), options.out);
    return;
  }

  if (command === "link-outcomes") {
    const report = await readJsonOption(options.report, "--report");
    const github = await readJsonOption(options.github, "--github");
    await writeReport(linkGitHubOutcomes(report, github), options.out);
    return;
  }

  if (command === "doctor") {
    await writeReport(await runDoctor(options), options.out);
    return;
  }

  if (command === "brief") {
    await writeReport(await generateBrief(options), options.out ? path.join(options.out, "manifest.stdout.json") : null);
    return;
  }

  if (command === "audit") {
    const manifest = await readJsonOption(options.manifest, "--manifest");
    await writeReport(auditBrief(manifest), options.out);
    return;
  }

  if (command === "redact-check") {
    await writeReport(await redactCheck(options.path || args[0]), options.out);
    return;
  }

  if (command === "compare-briefs") {
    const base = await readJsonOption(options.base, "--base");
    const head = await readJsonOption(options.head, "--head");
    const comparison = compareBriefs(base, head);
    if (options.markdown) await writeText(comparison.markdown, options.markdown);
    await writeReport(comparison, options.out);
    return;
  }

  if (command === "readiness") {
    const manifest = await readJsonOption(options.manifest, "--manifest");
    const baseManifest = options.base ? await readJsonOption(options.base, "--base") : null;
    const readiness = await buildReadinessReport({
      manifest,
      manifestPath: options.manifest,
      artifactsDir: options.path,
      baseManifest,
    });
    if (options.markdown) await writeText(readiness.markdown, options.markdown);
    await writeReport(readiness, options.out);
    return;
  }

  if (command === "api-plan") {
    const report = await readJsonOption(options.report, "--report");
    const plan = buildApiCreditPlan(report);
    if (options.markdown) await writeText(plan.markdown, options.markdown);
    await writeReport(plan, options.out);
    return;
  }

  if (command === "timeline") {
    const report = await readJsonOption(options.report, "--report");
    const timeline = buildActivityTimeline(report);
    if (options.markdown) await writeText(timeline.markdown, options.markdown);
    await writeReport(timeline, options.out);
    return;
  }

  if (command === "evidence-index") {
    const manifest = await readJsonOption(options.manifest, "--manifest");
    const readiness = options.readiness ? await readJsonOption(options.readiness, "--readiness") : null;
    const apiPlan = options.apiPlan ? await readJsonOption(options.apiPlan, "--api-plan") : null;
    const timeline = options.timeline ? await readJsonOption(options.timeline, "--timeline") : null;
    const scorecard = options.scorecard ? await readJsonOption(options.scorecard, "--scorecard") : null;
    const index = buildEvidenceIndex({
      manifest,
      readiness,
      apiPlan,
      timeline,
      scorecard,
      artifactPaths: {
        readiness: options.readiness,
        apiPlan: options.apiPlan,
        timeline: options.timeline,
        scorecard: options.scorecard,
        formDraft: options.formDraft,
      },
    });
    if (options.markdown) await writeText(index.markdown, options.markdown);
    if (options.html) await writeText(index.html, options.html);
    await writeReport(index, options.out);
    return;
  }

  if (command === "scorecard") {
    const manifest = await readJsonOption(options.manifest, "--manifest");
    const readiness = options.readiness ? await readJsonOption(options.readiness, "--readiness") : null;
    const apiPlan = options.apiPlan ? await readJsonOption(options.apiPlan, "--api-plan") : null;
    const timeline = options.timeline ? await readJsonOption(options.timeline, "--timeline") : null;
    const scorecard = buildMaintainerScorecard({ manifest, readiness, apiPlan, timeline });
    if (options.markdown) await writeText(scorecard.markdown, options.markdown);
    await writeReport(scorecard, options.out);
    return;
  }

  if (command === "submission-pack") {
    await writeReport(await generateSubmissionPack(options), options.out);
    return;
  }

  if (command === "form-draft") {
    const manifest = await readJsonOption(options.manifest, "--manifest");
    const readiness = options.readiness ? await readJsonOption(options.readiness, "--readiness") : null;
    const apiPlan = options.apiPlan ? await readJsonOption(options.apiPlan, "--api-plan") : null;
    const scorecard = options.scorecard ? await readJsonOption(options.scorecard, "--scorecard") : null;
    const draft = buildFormDraft({
      manifest,
      readiness,
      apiPlan,
      scorecard,
      links: {
        repo: options.repo,
        releaseUrl: options.releaseUrl,
        npmPackage: options.npmPackage,
        roadmapUrl: options.roadmapUrl,
        applicationStatusUrl: options.applicationStatusUrl,
        applicationEvidenceMatrixUrl: options.applicationEvidenceMatrixUrl,
        applicationReviewFaqUrl: options.applicationReviewFaqUrl,
        submissionRiskRegisterUrl: options.submissionRiskRegisterUrl,
        submissionDecisionSummaryUrl: options.submissionDecisionSummaryUrl,
        submissionActivityLogUrl: options.submissionActivityLogUrl,
        reviewerQuickstartUrl: options.reviewerQuickstartUrl,
        signedOutReviewUrl: options.signedOutReviewUrl,
        releaseProvenanceUrl: options.releaseProvenanceUrl,
        adoptionPlanUrl: options.adoptionPlanUrl,
        maintenancePolicyUrl: options.maintenancePolicyUrl,
        maintainerHandoffUrl: options.maintainerHandoffUrl,
        scopeLimitationsUrl: options.scopeLimitationsUrl,
        privacyThreatModelUrl: options.privacyThreatModelUrl,
        dataRetentionUrl: options.dataRetentionUrl,
        demoWalkthroughUrl: options.demoWalkthroughUrl,
        accessibilityUrl: options.accessibilityUrl,
        apiWorkflowUrl: options.apiWorkflowUrl,
        useCasesUrl: options.useCasesUrl,
        finalChecklistUrl: options.finalChecklistUrl,
        submissionRehearsalUrl: options.submissionRehearsalUrl,
        finalCopyUrl: options.finalCopyUrl,
        formDraftSampleUrl: options.formDraftSampleUrl,
        publicEvidenceSampleUrl: options.publicEvidenceSampleUrl,
        dashboardPreviewUrl: options.dashboardPreviewUrl,
        mobileDashboardPreviewUrl: options.mobileDashboardPreviewUrl,
        publishCheckSampleUrl: options.publishCheckSampleUrl,
        installSmokeSampleUrl: options.installSmokeSampleUrl,
        nodeCiUrl: options.nodeCiUrl,
        publishedSmokeUrl: options.publishedSmokeUrl,
      },
    });
    if (options.markdown) await writeText(draft.markdown, options.markdown);
    await writeReport(draft, options.out);
    return;
  }

  if (command === "pack-validate") {
    const validation = await validateSubmissionPack(options.path || args[0], options);
    if (options.markdown) await writeText(validation.markdown, options.markdown);
    await writeReport(validation, options.out);
    return;
  }

  if (command === "publish-check") {
    const report = await runPublishCheck(options);
    if (options.markdown) await writeText(report.markdown, options.markdown);
    await writeReport(report, options.out);
    return;
  }

  if (command === "install-smoke") {
    const report = await runPublishedInstallSmoke(options);
    if (options.markdown) await writeText(report.markdown, options.markdown);
    await writeReport(report, options.out);
    return;
  }

  if (command === "public-evidence") {
    const evidence = buildPublicEvidence(options);
    if (options.markdown) await writeText(evidence.markdown, options.markdown);
    await writeReport(evidence, options.out);
    return;
  }

  if (command === "serve") {
    await serve(options);
    return;
  }

  if (command === "demo") {
    await writeReport(demoReport(), options.out);
    return;
  }

  printHelp();
  process.exitCode = 1;
}

function parseArgs(args) {
  const options = { port: 5057 };
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === "--codex-home") options.codexHome = args[++i];
    else if (arg === "--out") options.out = args[++i];
    else if (arg === "--out-dir") options.outDir = args[++i];
    else if (arg === "--limit") options.limit = Number(args[++i]);
    else if (arg === "--port") options.port = Number(args[++i]);
    else if (arg === "--repo") options.repo = args[++i];
    else if (arg === "--report") options.report = args[++i];
    else if (arg === "--github") options.github = args[++i];
    else if (arg === "--manifest") options.manifest = args[++i];
    else if (arg === "--base") options.base = args[++i];
    else if (arg === "--head") options.head = args[++i];
    else if (arg === "--path") options.path = args[++i];
    else if (arg === "--markdown") options.markdown = args[++i];
    else if (arg === "--html") options.html = args[++i];
    else if (arg === "--readiness") options.readiness = args[++i];
    else if (arg === "--api-plan") options.apiPlan = args[++i];
    else if (arg === "--timeline") options.timeline = args[++i];
    else if (arg === "--scorecard") options.scorecard = args[++i];
    else if (arg === "--form-draft") options.formDraft = args[++i];
    else if (arg === "--release-url") options.releaseUrl = args[++i];
    else if (arg === "--roadmap-url") options.roadmapUrl = args[++i];
    else if (arg === "--application-status-url") options.applicationStatusUrl = args[++i];
    else if (arg === "--application-evidence-matrix-url") options.applicationEvidenceMatrixUrl = args[++i];
    else if (arg === "--application-review-faq-url") options.applicationReviewFaqUrl = args[++i];
    else if (arg === "--submission-risk-register-url") options.submissionRiskRegisterUrl = args[++i];
    else if (arg === "--submission-decision-summary-url") options.submissionDecisionSummaryUrl = args[++i];
    else if (arg === "--submission-activity-log-url") options.submissionActivityLogUrl = args[++i];
    else if (arg === "--reviewer-quickstart-url") options.reviewerQuickstartUrl = args[++i];
    else if (arg === "--signed-out-review-url") options.signedOutReviewUrl = args[++i];
    else if (arg === "--release-provenance-url") options.releaseProvenanceUrl = args[++i];
    else if (arg === "--adoption-plan-url") options.adoptionPlanUrl = args[++i];
    else if (arg === "--maintenance-policy-url") options.maintenancePolicyUrl = args[++i];
    else if (arg === "--maintainer-handoff-url") options.maintainerHandoffUrl = args[++i];
    else if (arg === "--scope-limitations-url") options.scopeLimitationsUrl = args[++i];
    else if (arg === "--privacy-threat-model-url") options.privacyThreatModelUrl = args[++i];
    else if (arg === "--data-retention-url") options.dataRetentionUrl = args[++i];
    else if (arg === "--demo-walkthrough-url") options.demoWalkthroughUrl = args[++i];
    else if (arg === "--accessibility-url") options.accessibilityUrl = args[++i];
    else if (arg === "--api-workflow-url") options.apiWorkflowUrl = args[++i];
    else if (arg === "--npm-package") options.npmPackage = args[++i];
    else if (arg === "--use-cases-url") options.useCasesUrl = args[++i];
    else if (arg === "--final-checklist-url") options.finalChecklistUrl = args[++i];
    else if (arg === "--submission-rehearsal-url") options.submissionRehearsalUrl = args[++i];
    else if (arg === "--final-copy-url") options.finalCopyUrl = args[++i];
    else if (arg === "--form-draft-sample-url") options.formDraftSampleUrl = args[++i];
    else if (arg === "--public-evidence-sample-url") options.publicEvidenceSampleUrl = args[++i];
    else if (arg === "--dashboard-preview-url") options.dashboardPreviewUrl = args[++i];
    else if (arg === "--mobile-dashboard-preview-url") options.mobileDashboardPreviewUrl = args[++i];
    else if (arg === "--publish-check-sample-url") options.publishCheckSampleUrl = args[++i];
    else if (arg === "--install-smoke-sample-url") options.installSmokeSampleUrl = args[++i];
    else if (arg === "--node-ci-url") options.nodeCiUrl = args[++i];
    else if (arg === "--published-smoke-url") options.publishedSmokeUrl = args[++i];
    else if (arg === "--min-score") options.minScore = Number(args[++i]);
    else if (arg === "--package-json") options.packageJson = args[++i];
    else if (arg === "--package" || arg === "--package-name") options.packageName = args[++i];
    else if (arg === "--version") options.version = args[++i];
    else if (arg === "--bin") options.bin = args[++i];
    else if (arg === "--demo") options.demo = true;
    else if (arg === "--show-paths") options.redactPaths = false;
    else if (arg === "--redaction") options.redaction = args[++i];
    else if (arg === "--help" || arg === "-h") options.help = true;
  }
  if (options.help) printHelp();
  return options;
}

async function writeReport(report, outPath) {
  const json = `${JSON.stringify(report, null, 2)}\n`;
  if (!outPath) {
    process.stdout.write(json);
    return;
  }
  await fs.mkdir(path.dirname(path.resolve(outPath)), { recursive: true });
  await fs.writeFile(outPath, json, "utf8");
}

async function writeText(text, outPath) {
  if (!outPath) {
    process.stdout.write(text);
    return;
  }
  await fs.mkdir(path.dirname(path.resolve(outPath)), { recursive: true });
  await fs.writeFile(outPath, text, "utf8");
}

async function readJsonOption(filePath, flagName) {
  if (!filePath) throw new Error(`Missing ${flagName} path`);
  return JSON.parse(await fs.readFile(path.resolve(filePath), "utf8"));
}

async function serve(options) {
  const server = http.createServer(async (request, response) => {
    try {
      const url = new URL(request.url || "/", `http://localhost:${options.port}`);
      if (url.pathname === "/codex-lens-report.json") {
        const report = options.demo ? demoReport() : await scanCodexHome(options);
        send(response, 200, "application/json", JSON.stringify(report));
        return;
      }

      const filePath = url.pathname === "/" ? "index.html" : url.pathname.slice(1);
      const safePath = path.normalize(filePath).replace(/^(\.\.[/\\])+/, "");
      const absolutePath = path.join(publicDir, safePath);
      const body = await fs.readFile(absolutePath);
      send(response, 200, contentType(absolutePath), body);
    } catch (error) {
      send(response, 404, "text/plain; charset=utf-8", `Not found\n${error.message}\n`);
    }
  });

  await new Promise((resolve) => server.listen(options.port, "127.0.0.1", resolve));
  console.log(`Codex OSS Lens running at http://127.0.0.1:${options.port}`);
}

function send(response, status, type, body) {
  response.writeHead(status, { "content-type": type, "cache-control": "no-store" });
  response.end(body);
}

function contentType(filePath) {
  if (filePath.endsWith(".html")) return "text/html; charset=utf-8";
  if (filePath.endsWith(".css")) return "text/css; charset=utf-8";
  if (filePath.endsWith(".js")) return "application/javascript; charset=utf-8";
  if (filePath.endsWith(".json")) return "application/json; charset=utf-8";
  return "application/octet-stream";
}

function printHelp() {
  console.log(`Codex OSS Lens

Usage:
  codex-oss-lens scan [--codex-home ~/.codex] [--limit 250] [--out report.json]
  codex-oss-lens weekly [--codex-home ~/.codex] [--limit 250] [--out weekly.md]
  codex-oss-lens api-payload [--codex-home ~/.codex] [--limit 250] [--out payload.json]
  codex-oss-lens github-import --repo owner/name [--limit 50] [--out github-outcomes.json]
  codex-oss-lens link-outcomes --report report.json --github github-outcomes.json [--out linked.json]
  codex-oss-lens doctor [--codex-home ~/.codex] [--out doctor.json]
  codex-oss-lens brief [--codex-home ~/.codex] [--repo owner/name] [--out-dir codex-brief]
  codex-oss-lens audit --manifest codex-brief/manifest.json [--out audit.json]
  codex-oss-lens redact-check <file-or-dir> [--out redact-check.json]
  codex-oss-lens compare-briefs --base old/manifest.json --head new/manifest.json [--out compare.json] [--markdown compare.md]
  codex-oss-lens readiness --manifest codex-brief/manifest.json [--path codex-brief] [--base old/manifest.json] [--out readiness.json] [--markdown readiness.md]
  codex-oss-lens api-plan --report scan-report.json [--out api-plan.json] [--markdown api-plan.md]
  codex-oss-lens timeline --report scan-report.json [--out timeline.json] [--markdown timeline.md]
  codex-oss-lens scorecard --manifest manifest.json [--readiness readiness.json] [--api-plan api-plan.json] [--timeline timeline.json] [--out scorecard.json] [--markdown scorecard.md]
  codex-oss-lens evidence-index --manifest manifest.json [--readiness readiness.json] [--api-plan api-plan.json] [--timeline timeline.json] [--scorecard scorecard.json] [--form-draft form-draft.json] [--out evidence-index.json] [--markdown evidence-index.md] [--html evidence-index.html]
  codex-oss-lens submission-pack [--codex-home ~/.codex] [--repo owner/name] [--out-dir codex-submission-pack] [--demo]
  codex-oss-lens form-draft --manifest manifest.json [--readiness readiness.json] [--api-plan api-plan.json] [--scorecard scorecard.json] [--repo url] [--release-url url] [--npm-package url] [--roadmap-url url] [--application-status-url url] [--application-evidence-matrix-url url] [--application-review-faq-url url] [--submission-risk-register-url url] [--submission-decision-summary-url url] [--submission-activity-log-url url] [--reviewer-quickstart-url url] [--signed-out-review-url url] [--release-provenance-url url] [--adoption-plan-url url] [--maintenance-policy-url url] [--maintainer-handoff-url url] [--scope-limitations-url url] [--privacy-threat-model-url url] [--data-retention-url url] [--demo-walkthrough-url url] [--accessibility-url url] [--api-workflow-url url] [--use-cases-url url] [--final-checklist-url url] [--submission-rehearsal-url url] [--final-copy-url url] [--form-draft-sample-url url] [--public-evidence-sample-url url] [--dashboard-preview-url url] [--mobile-dashboard-preview-url url] [--publish-check-sample-url url] [--install-smoke-sample-url url] [--node-ci-url url] [--published-smoke-url url] [--out form-draft.json] [--markdown form-draft.md]
  codex-oss-lens pack-validate <submission-pack-dir> [--min-score 75] [--out pack-validation.json] [--markdown pack-validation.md]
  codex-oss-lens publish-check [--package-json package.json] [--out publish-check.json] [--markdown publish-check.md]
  codex-oss-lens install-smoke [--package codex-oss-lens] [--version latest] [--bin codex-oss-lens] [--out install-smoke.json] [--markdown install-smoke.md]
  codex-oss-lens public-evidence [--repo url] [--release-url url] [--npm-package url] [--roadmap-url url] [--application-status-url url] [--application-evidence-matrix-url url] [--application-review-faq-url url] [--submission-risk-register-url url] [--submission-decision-summary-url url] [--submission-activity-log-url url] [--reviewer-quickstart-url url] [--signed-out-review-url url] [--release-provenance-url url] [--adoption-plan-url url] [--maintenance-policy-url url] [--maintainer-handoff-url url] [--scope-limitations-url url] [--privacy-threat-model-url url] [--data-retention-url url] [--demo-walkthrough-url url] [--accessibility-url url] [--api-workflow-url url] [--use-cases-url url] [--final-checklist-url url] [--submission-rehearsal-url url] [--final-copy-url url] [--form-draft-sample-url url] [--public-evidence-sample-url url] [--dashboard-preview-url url] [--mobile-dashboard-preview-url url] [--publish-check-sample-url url] [--install-smoke-sample-url url] [--node-ci-url url] [--published-smoke-url url] [--out public-evidence.json] [--markdown public-evidence.md]
  codex-oss-lens serve [--codex-home ~/.codex] [--port 5057] [--demo]
  codex-oss-lens demo [--out report.json]

Privacy:
  Workspace paths use --redaction basename by default.
  Use --redaction hash for stable anonymous workspace ids.
  Use --show-paths for private local reports.
`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
