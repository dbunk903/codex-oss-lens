# Maintenance Policy

This policy explains how Codex OSS Lens is maintained while it grows from first public package to
regular external use.

## Maintainer responsibility

- Primary maintainer: `dbunk903`.
- Public support route: GitHub issue templates for bugs, feature requests, and integration requests.
- Private or sensitive route: follow `SECURITY.md` before sharing vulnerability, privacy, prompt,
  path, token, secret, or private-source details.
- Conduct route: follow `CODE_OF_CONDUCT.md` for participation and escalation expectations.

## Triage cadence

- Review new public issues at least weekly while the project is pre-adoption.
- Label reports as bug, feature, integration, documentation, security, privacy, or question.
- Close reports that require raw Codex logs, prompts, full filesystem paths, secrets, or private
  source in public, then redirect the reporter to redacted reproduction steps or `SECURITY.md`.
- Convert recurring requests into small roadmap issues that can be verified through public evidence.

## Release cadence

- Publish patch releases for documentation, privacy, packaging, CI, and evidence-gate fixes.
- Publish minor releases for new CLI commands, dashboard workflow changes, or API-credit planning
  features.
- Before every release, run `npm run submission:check`, `npm run public:redaction`, and
  `npm run release:provenance`.
- After publishing, run the published install smoke command and keep the scheduled npm `latest`
  workflow green.

## Decision boundary

- Keep raw Codex logs local by default.
- Prefer aggregate evidence, redacted workspaces, and demo artifacts for public review.
- Do not add telemetry, remote upload, or API-backed summarization without explicit opt-in and a
  dry-run payload that can be inspected before network use.
- Keep README, reviewer quickstart, adoption plan, release provenance, support, security, conduct,
  and final checklist documents aligned with the current public package.

