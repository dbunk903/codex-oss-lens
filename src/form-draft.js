export function buildFormDraft({ manifest, readiness, apiPlan, scorecard, links = {} } = {}) {
  if (!manifest) throw new Error("Missing manifest for form draft");
  const topCandidate = apiPlan?.candidates?.[0] || null;
  const releaseUrl = links.releaseUrl || "";
  const fields = {
    repositoryFit: field(repositoryFitAnswer(manifest), 500),
    apiCreditsPlan: field(apiCreditsAnswer(topCandidate), 500),
    additionalInfo: field(additionalInfoAnswer({ manifest, readiness, scorecard }), 500),
  };
  const draft = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    publicLinks: {
      repository: links.repo || "",
      latestRelease: releaseUrl,
      npmPackage: links.npmPackage || "",
      roadmap: links.roadmapUrl || "",
      applicationStatus: links.applicationStatusUrl || "",
      reviewerQuickstart: links.reviewerQuickstartUrl || "",
      releaseProvenance: links.releaseProvenanceUrl || "",
      adoptionPlan: links.adoptionPlanUrl || "",
      maintenancePolicy: links.maintenancePolicyUrl || "",
      apiCreditWorkflow: links.apiWorkflowUrl || "",
      maintainerUseCases: links.useCasesUrl || "",
      finalChecklist: links.finalChecklistUrl || "",
      finalCopy: links.finalCopyUrl || "",
      formDraftSample: links.formDraftSampleUrl || "",
      publicEvidenceSample: links.publicEvidenceSampleUrl || "",
      dashboardPreview: links.dashboardPreviewUrl || "",
      mobileDashboardPreview: links.mobileDashboardPreviewUrl || "",
      publishCheckSample: links.publishCheckSampleUrl || "",
      installSmokeSample: links.installSmokeSampleUrl || "",
      nodeCi: links.nodeCiUrl || "",
      publishedSmoke: links.publishedSmokeUrl || "",
    },
    requiredManualFields: [
      "Last name",
      "First name",
      "Email registered to the ChatGPT account",
      "GitHub username",
      "OpenAI organization ID",
      "Terms review and final submit",
    ],
    interests: ["Project API credits"],
    fields,
    readyToPaste: Object.values(fields).every((item) => item.withinLimit),
  };
  return { ...draft, markdown: renderFormDraftMarkdown(draft) };
}

function repositoryFitAnswer(manifest) {
  const sessions = manifest.summary?.sessions || 0;
  const workspaces = manifest.summary?.workspaces || 0;
  return `Codex OSS Lens는 OpenAI Codex 세션 로그를 로컬에서 분석해 OSS 메인테이너가 사용량, quota, 모델 사용, 워크플로, 리뷰 evidence를 확인하게 하는 공개 도구입니다. 최근 evidence 기준 ${sessions}개 세션과 ${workspaces}개 워크스페이스를 집계하며, 원본 로그와 코드는 공유하지 않는 local-first 방식으로 Codex 생태계의 유지관리 투명성을 높입니다.`;
}

function apiCreditsAnswer(topCandidate) {
  const workflow = topCandidate?.workflow || "implementation";
  const useCase = topCandidate?.apiUseCase || "maintainer-workflow-summary";
  return `API 크레딧은 로컬 집계 결과를 기반으로 ${workflow} 워크플로의 ${useCase} 기능을 구현하는 데 우선 사용하려 합니다. 원본 로그, 프롬프트, 코드, 전체 경로는 로컬에 두고, 사용자가 확인한 aggregate payload만 전송해 주간 리포트, 리뷰 요약, 다음 액션 생성을 자동화하겠습니다.`;
}

function additionalInfoAnswer({ manifest, readiness, scorecard }) {
  const status = readiness?.status || "unknown";
  const score = scorecard?.score ?? "n/a";
  const rating = scorecard?.rating || "n/a";
  return `현재 공개 릴리스는 신청용 evidence workflow를 포함합니다. submission-pack이 brief, readiness, api-plan, timeline, scorecard, evidence-index를 한 번에 만들며 readiness=${status}, scorecard=${score}(${rating})로 공유 전 상태를 검증합니다. 의존성 없는 Node CLI와 정적 UI로 npm smoke test까지 통과했습니다.`;
}

function field(text, limit) {
  const chars = [...text].length;
  return { text, chars, limit, withinLimit: chars <= limit };
}

function renderFormDraftMarkdown(draft) {
  return [
    "# Codex OSS Support Form Draft",
    "",
    `Generated: ${draft.generatedAt}`,
    `Ready to paste: ${draft.readyToPaste}`,
    "",
    "## Public Links",
    "",
    ...Object.entries(draft.publicLinks).map(([key, url]) => `- ${PUBLIC_LINK_LABELS[key] || key}: ${url || "TODO"}`),
    "",
    "## Repository Fit",
    "",
    renderField(draft.fields.repositoryFit),
    "",
    "## API Credits Plan",
    "",
    renderField(draft.fields.apiCreditsPlan),
    "",
    "## Additional Information",
    "",
    renderField(draft.fields.additionalInfo),
    "",
    "## Manual Fields",
    "",
    ...draft.requiredManualFields.map((item) => `- ${item}`),
    "",
  ].join("\n");
}

const PUBLIC_LINK_LABELS = {
  repository: "Repository",
  latestRelease: "Latest release",
  npmPackage: "npm package",
  roadmap: "Roadmap",
  applicationStatus: "Application status",
  reviewerQuickstart: "Reviewer quickstart",
  releaseProvenance: "Release provenance",
  adoptionPlan: "Adoption plan",
  maintenancePolicy: "Maintenance policy",
  apiCreditWorkflow: "API credit workflow",
  maintainerUseCases: "Maintainer use cases",
  finalChecklist: "Final checklist",
  finalCopy: "Final copy",
  formDraftSample: "Form draft sample",
  publicEvidenceSample: "Public evidence sample",
  dashboardPreview: "Dashboard preview",
  mobileDashboardPreview: "Mobile dashboard preview",
  publishCheckSample: "Publish check sample",
  installSmokeSample: "Install smoke sample",
  nodeCi: "Node CI",
  publishedSmoke: "Published smoke CI",
};

function renderField(fieldValue) {
  return [
    fieldValue.text,
    "",
    `Characters: ${fieldValue.chars}/${fieldValue.limit}`,
  ].join("\n");
}
