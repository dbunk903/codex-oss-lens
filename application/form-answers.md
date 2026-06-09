# Codex Open Source Support Program - Application Draft

Source form: https://openai.com/ko-KR/form/codex-for-oss/

## Required fields to fill manually

- Last name: TODO
- First name: TODO
- Email: TODO - use the email registered to the ChatGPT account
- GitHub username: TODO - profile must be public
- GitHub repository URL: https://github.com/dbunk903/codex-oss-lens
- Role: Primary maintainer
- OpenAI organization ID: TODO - from https://platform.openai.com/settings/organization/general

## Public evidence links

- Repository: https://github.com/dbunk903/codex-oss-lens
- Latest release: https://github.com/dbunk903/codex-oss-lens/releases/tag/v1.6.1
- npm package: https://www.npmjs.com/package/codex-oss-lens
- Roadmap: https://github.com/dbunk903/codex-oss-lens/blob/main/ROADMAP.md
- Application status: https://github.com/dbunk903/codex-oss-lens/blob/main/docs/application-status.md
- Application evidence matrix: https://github.com/dbunk903/codex-oss-lens/blob/main/docs/application-evidence-matrix.md
- Reviewer quickstart: https://github.com/dbunk903/codex-oss-lens/blob/main/docs/reviewer-quickstart.md
- Release provenance: https://github.com/dbunk903/codex-oss-lens/blob/main/docs/release-provenance.md
- Adoption plan: https://github.com/dbunk903/codex-oss-lens/blob/main/docs/adoption-plan.md
- Maintenance policy: https://github.com/dbunk903/codex-oss-lens/blob/main/docs/maintenance-policy.md
- Maintainer handoff: https://github.com/dbunk903/codex-oss-lens/blob/main/docs/maintainer-handoff.md
- Scope and limitations: https://github.com/dbunk903/codex-oss-lens/blob/main/docs/scope-and-limitations.md
- Privacy threat model: https://github.com/dbunk903/codex-oss-lens/blob/main/docs/privacy-threat-model.md
- Data retention: https://github.com/dbunk903/codex-oss-lens/blob/main/docs/data-retention.md
- Demo walkthrough: https://github.com/dbunk903/codex-oss-lens/blob/main/docs/demo-walkthrough.md
- Accessibility notes: https://github.com/dbunk903/codex-oss-lens/blob/main/docs/accessibility.md
- API-credit workflow: https://github.com/dbunk903/codex-oss-lens/blob/main/docs/api-credit-workflow.md
- Maintainer use cases: https://github.com/dbunk903/codex-oss-lens/blob/main/docs/maintainer-use-cases.md
- Final submission checklist: https://github.com/dbunk903/codex-oss-lens/blob/main/docs/final-submission-checklist.md
- Submission rehearsal: https://github.com/dbunk903/codex-oss-lens/blob/main/docs/submission-rehearsal.md
- Final copy: https://github.com/dbunk903/codex-oss-lens/blob/main/application/final-copy.md
- Form draft sample: https://github.com/dbunk903/codex-oss-lens/blob/main/examples/form-draft.sample.md
- Dashboard preview: https://github.com/dbunk903/codex-oss-lens/blob/main/examples/dashboard-preview.png
- Mobile dashboard preview: https://github.com/dbunk903/codex-oss-lens/blob/main/examples/dashboard-mobile-preview.png
- Publish check sample: https://github.com/dbunk903/codex-oss-lens/blob/main/examples/publish-check.sample.md
- Install smoke sample: https://github.com/dbunk903/codex-oss-lens/blob/main/examples/install-smoke.sample.md
- Public evidence sample: https://github.com/dbunk903/codex-oss-lens/blob/main/examples/public-evidence.sample.md
- Node CI: https://github.com/dbunk903/codex-oss-lens/actions/workflows/test.yml
- Published smoke CI: https://github.com/dbunk903/codex-oss-lens/actions/workflows/published-smoke.yml
- Closed issues: #1, #2, #3, #4, #5, #6, #7, #8, #9, #10, #11, #12, #14, #15, #16, #17, #18, #19, #20, #21, #22, #23, #24, #25, #26, #27
- Open development issues: None blocking application submission

## Repository fit answer - max 500 Korean characters

Codex OSS Lens는 OpenAI Codex CLI 세션 로그를 로컬에서 분석해 OSS 메인테이너가 사용량, quota, 워크스페이스별 작업량, 모델 사용, workflow evidence를 확인하게 하는 공개 도구입니다. 신규 프로젝트라 스타/다운로드 지표는 초기 단계지만, npm 패키지와 v1.6.1 릴리스, CI, published install smoke, submission-pack/form-draft/pack-validate까지 갖춰 Codex 기반 유지관리 투명성을 높이는 생태계 보조 도구로 발전시키고 있습니다.

## Interests

- Project API credits

## API credits plan - max 500 Korean characters

API 크레딧은 로컬 집계 결과를 기반으로 주간 메인테이너 리포트, PR/이슈 triage 요약, 긴 세션의 실패 원인 분류, 릴리스 evidence 생성 자동화에 사용할 계획입니다. 원본 로그, 프롬프트, 코드, 전체 경로는 기본적으로 로컬에 두고, 사용자가 확인한 aggregate payload만 전송하는 privacy-first 방식으로 구현하겠습니다.

## Additional information - max 500 Korean characters

현재 공개 리포지터리, v1.6.1 GitHub 릴리스, npm 패키지(codex-oss-lens)가 준비되어 있습니다. 의존성 없는 Node CLI와 정적 UI로 quota/token 분석, Git/workflow/outcome linking, API dry-run, doctor, CI, published install smoke test를 제공합니다. maintainer use cases 문서와 submission-pack, form-draft, pack-validate로 신청 evidence를 검증합니다.

## Final manual submission steps

1. Open https://openai.com/ko-KR/form/codex-for-oss/
2. Fill the personal fields above.
3. Paste the three Korean answers from this file.
4. Use repository URL `https://github.com/dbunk903/codex-oss-lens`.
5. Review the terms and submit from the account owner's browser session.

## Stronger submission note

The program selection criteria favor actively maintained and widely adopted OSS. This new tool should ideally be published, documented, and seeded with issues/releases before submission. If you already maintain a more established OSS repository, submit that repository and describe Codex OSS Lens as the Codex/API-credit workflow you plan to build for it.
