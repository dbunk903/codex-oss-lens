import { promises as fs } from "node:fs";
import path from "node:path";
import { buildApiCreditPlan } from "./api-plan.js";
import { generateBrief } from "./brief.js";
import { buildEvidenceIndex } from "./evidence-index.js";
import { buildReadinessReport } from "./readiness.js";
import { buildMaintainerScorecard } from "./scorecard.js";
import { buildActivityTimeline } from "./timeline.js";

export async function generateSubmissionPack(options = {}) {
  const outDir = path.resolve(options.outDir || "codex-submission-pack");
  const manifest = await generateBrief({ ...options, outDir });
  const scanReport = await readJson(path.join(outDir, "scan-report.json"));
  const baseManifest = options.base ? await readJson(options.base) : null;

  const readiness = await buildReadinessReport({
    manifest,
    manifestPath: path.join(outDir, "manifest.json"),
    artifactsDir: outDir,
    baseManifest,
  });
  const apiPlan = buildApiCreditPlan(scanReport);
  const timeline = buildActivityTimeline(scanReport);
  const scorecard = buildMaintainerScorecard({ manifest, readiness, apiPlan, timeline });
  const evidenceIndex = buildEvidenceIndex({
    manifest,
    readiness,
    apiPlan,
    timeline,
    scorecard,
    artifactPaths: {
      readiness: "readiness.json",
      apiPlan: "api-plan.json",
      timeline: "timeline.json",
      scorecard: "scorecard.json",
    },
  });

  await writeJson(outDir, "readiness.json", readiness);
  await writeText(outDir, "readiness.md", readiness.markdown);
  await writeJson(outDir, "api-plan.json", apiPlan);
  await writeText(outDir, "api-plan.md", apiPlan.markdown);
  await writeJson(outDir, "timeline.json", timeline);
  await writeText(outDir, "timeline.md", timeline.markdown);
  await writeJson(outDir, "scorecard.json", scorecard);
  await writeText(outDir, "scorecard.md", scorecard.markdown);
  await writeJson(outDir, "evidence-index.json", evidenceIndex);
  await writeText(outDir, "evidence-index.md", evidenceIndex.markdown);
  await writeText(outDir, "evidence-index.html", evidenceIndex.html);
  await writeText(outDir, "README.md", renderPackReadme({ manifest, readiness, scorecard }));

  return buildPackManifest({ outDir, manifest, readiness, scorecard });
}

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(path.resolve(filePath), "utf8"));
}

async function writeJson(outDir, file, value) {
  await writeText(outDir, file, `${JSON.stringify(value, null, 2)}\n`);
}

async function writeText(outDir, file, value) {
  await fs.mkdir(outDir, { recursive: true });
  await fs.writeFile(path.join(outDir, file), value, "utf8");
}

function buildPackManifest({ outDir, manifest, readiness, scorecard }) {
  return {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    artifactRoot: path.basename(outDir),
    status: readiness.status,
    score: scorecard.score,
    rating: scorecard.rating,
    summary: manifest.summary,
    artifacts: [
      "README.md",
      "brief.md",
      "brief.html",
      "manifest.json",
      "scan-report.json",
      "weekly-report.md",
      "api-payload.dry-run.json",
      "doctor.json",
      "readiness.json",
      "readiness.md",
      "api-plan.json",
      "api-plan.md",
      "timeline.json",
      "timeline.md",
      "scorecard.json",
      "scorecard.md",
      "evidence-index.json",
      "evidence-index.md",
      "evidence-index.html",
    ],
  };
}

function renderPackReadme({ manifest, readiness, scorecard }) {
  return [
    "# Codex OSS Lens Submission Pack",
    "",
    `Generated: ${manifest.generatedAt}`,
    `Readiness: ${readiness.status}`,
    `Scorecard: ${scorecard.score} (${scorecard.rating})`,
    "",
    "## Start Here",
    "",
    "- Open `evidence-index.html` for a reviewer-friendly index.",
    "- Read `brief.md` for the maintainer evidence brief.",
    "- Read `readiness.md` and `scorecard.md` before sharing externally.",
    "- Use `api-plan.md` to explain API credit usage.",
    "- Use `timeline.md` to show chronological maintenance activity.",
    "",
    "## Privacy",
    "",
    "- Raw Codex rollout JSONL files are not included.",
    "- Prompts, source code, terminal output, and full paths are not included by default.",
    "- Run `redact-check` again before sharing modified artifacts.",
    "",
  ].join("\n");
}
