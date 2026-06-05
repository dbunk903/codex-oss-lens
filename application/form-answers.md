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
- Latest release: https://github.com/dbunk903/codex-oss-lens/releases/tag/v1.5.1
- Roadmap: https://github.com/dbunk903/codex-oss-lens/blob/main/ROADMAP.md
- API-credit workflow: https://github.com/dbunk903/codex-oss-lens/blob/main/docs/api-credit-workflow.md
- Closed issues: #1, #2, #3, #4, #5, #6, #7, #8, #9, #10, #11, #12, #14, #15, #16, #17, #18, #19, #20, #21, #22, #23, #24, #25
- Open development issues: npm package publishing after owner login

## Repository fit answer - max 500 Korean characters

Codex OSS Lens는 OpenAI Codex CLI 세션 로그를 로컬에서 분석해 OSS 메인테이너가 사용량, 5시간/주간 quota, 워크스페이스별 작업량, 모델 사용 비중을 한 화면에서 볼 수 있게 하는 공개 도구입니다. Codex를 실제 유지관리 워크플로에 쓰는 프로젝트가 늘수록 “어디에 Codex 시간이 쓰였는가”를 투명하게 파악해야 하므로 생태계 보조 도구로 가치가 있습니다.

## Interests

- Project API credits
- Codex Security, if the repository becomes eligible after public usage grows

## API credits plan - max 500 Korean characters

API 크레딧은 로컬 집계 결과를 기반으로 주간 메인테이너 리포트, PR/이슈 triage 요약, 긴 세션의 실패 원인 분류를 자동 생성하는 선택 기능에 사용하려 합니다. 원본 로그와 코드 내용은 기본적으로 로컬에 두고, 사용자가 명시적으로 선택한 집계 데이터만 전송하는 privacy-first 방식으로 구현하겠습니다.

## Additional information - max 500 Korean characters

현재 v1.5.1 공개 릴리스가 있습니다. 의존성 없는 Node CLI와 정적 UI로 구성되어 있고 quota/token 분석, Git/workflow/outcome linking, API dry-run, doctor, npm smoke test와 GitHub Actions CI를 제공합니다. `submission-pack`이 신청 evidence를 만들고 `form-draft`와 `pack-validate`가 제출 직전 상태를 검증합니다.

## Final manual submission steps

1. Open https://openai.com/ko-KR/form/codex-for-oss/
2. Fill the personal fields above.
3. Paste the three Korean answers from this file.
4. Use repository URL `https://github.com/dbunk903/codex-oss-lens`.
5. Review the terms and submit from the account owner's browser session.

## Stronger submission note

The program selection criteria favor actively maintained and widely adopted OSS. This new tool should ideally be published, documented, and seeded with issues/releases before submission. If you already maintain a more established OSS repository, submit that repository and describe Codex OSS Lens as the Codex/API-credit workflow you plan to build for it.
