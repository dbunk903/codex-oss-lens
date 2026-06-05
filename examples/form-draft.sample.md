# Codex OSS Support Form Draft

Generated: 2026-06-05T04:17:23.050Z
Ready to paste: true

## Public Links

- Repository: https://github.com/dbunk903/codex-oss-lens
- Latest release: https://github.com/dbunk903/codex-oss-lens/releases/tag/v1.5.0
- Roadmap: https://github.com/dbunk903/codex-oss-lens/blob/main/ROADMAP.md
- API credit workflow: https://github.com/dbunk903/codex-oss-lens/blob/main/docs/api-credit-workflow.md

## Repository Fit

Codex OSS Lens는 OpenAI Codex 세션 로그를 로컬에서 분석해 OSS 메인테이너가 사용량, quota, 모델 사용, 워크플로, 리뷰 evidence를 확인하게 하는 공개 도구입니다. 최근 evidence 기준 4개 세션과 3개 워크스페이스를 집계하며, 원본 로그와 코드는 공유하지 않는 local-first 방식으로 Codex 생태계의 유지관리 투명성을 높입니다.

Characters: 213/500

## API Credits Plan

API 크레딧은 로컬 집계 결과를 기반으로 implementation 워크플로의 implementation-session-summary 기능을 구현하는 데 우선 사용하려 합니다. 원본 로그, 프롬프트, 코드, 전체 경로는 로컬에 두고, 사용자가 확인한 aggregate payload만 전송해 주간 리포트, 리뷰 요약, 다음 액션 생성을 자동화하겠습니다.

Characters: 198/500

## Additional Information

현재 공개 릴리스는 신청용 evidence workflow를 포함합니다. submission-pack이 brief, readiness, api-plan, timeline, scorecard, evidence-index를 한 번에 만들며 readiness=pass, scorecard=98(strong)로 공유 전 상태를 검증합니다. 의존성 없는 Node CLI와 정적 UI로 npm smoke test까지 통과했습니다.

Characters: 234/500
