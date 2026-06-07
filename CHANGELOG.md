# Changelog

## Unreleased - Pre-submission Polish

- Added `public-evidence` command for final application links, proof points, manual fields, and
  paste checklist output.
- Added `final-copy:check` for validating paste-ready Korean application answers.
- Extended `final-copy:check` to catch drift between `final-copy.md` and `form-answers.md`.
- Added `submission:versions` for checking final application release links against `package.json`.
- Added `submission:check` as a one-command final local gate for application readiness.
- Added `evidence:links` check for validating public evidence URLs before submission.
- Added public evidence tests and sample JSON/Markdown artifacts.
- Added final submission checklist and form-ready final copy documents.
- Added CI validation for public evidence output and public evidence link health.
- Added dashboard evidence link to the public evidence sample.
- Updated security and contribution docs with public evidence and redaction verification steps.
- Expanded roadmap with public evidence, adoption, and API-credit follow-up work.
- Added top-level README npm usage, npm badge, and published package smoke command.
- Added scheduled/manual GitHub Actions verification for the npm `latest` package.
- Added an application evidence and submission-gates section to the dashboard UI.
- Added maintainer use-case documentation for weekly review, application evidence, API-credit
  planning, privacy review, and published package confidence.
- Updated application materials with npm package and maintainer use-case links.

## v1.6.1 - Published Install Smoke Fix

- Ran published-package install smoke checks from a temporary directory so local repository state
  does not shadow the registry package binary.
- Published `codex-oss-lens` to npm and verified registry availability.

## v1.6.0 - NPM Publish Diagnostics

- Added `publish-check` command for npm login, package metadata, registry, and OTP readiness.
- Added `install-smoke` command for published-package `npm exec` verification after release.
- Normalized the CLI bin path for npm publish compatibility.
- Added tests and sample outputs for publish readiness and published install smoke reports.

## v1.5.1 - CI Restoration

- Restored GitHub Actions Node test workflow for push and pull request verification.
- Made demo maintainer evidence independent of host Codex state so GitHub-hosted runners pass.
- Verified Node 20 and Node 22 CI jobs run tests, package dry-run, and packaged CLI smoke checks.

## v1.5.0 - Application Form Gate

- Added `form-draft` command for copy-ready Korean OSS support application answers.
- Added `pack-validate` command for required-file, readiness, scorecard, and privacy validation.
- Included form drafts in generated submission packs.
- Added tests and sample outputs for form draft and pack validation.

## v1.4.0 - Complete Submission Pack

- Added `scorecard` command for weighted maintainer application readiness scoring.
- Added `submission-pack` command for one-command evidence folder generation.
- Added tests and sample outputs for scorecard and submission pack reports.
- Updated application draft links and public documentation for the complete pack workflow.

## v1.3.0 - Reviewer Evidence Index

- Added `timeline` command for chronological maintainer activity evidence.
- Added `evidence-index` command for reviewer-friendly JSON, Markdown, and HTML artifact indexes.
- Added tests and sample outputs for timeline and evidence index reports.
- Updated application draft links and public documentation for reviewer-facing evidence.

## v1.2.0 - Submission Planning Reports

- Added `readiness` command that combines audit, redaction, and optional baseline comparison.
- Added `api-plan` command that prioritizes privacy-first API credit automation candidates.
- Added tests and sample outputs for readiness and API plan reports.
- Updated application draft links and public documentation for the new planning reports.

## v1.1.0 - Brief Quality Gates

- Added `audit` command for maintainer brief readiness scoring.
- Added `redact-check` command for path, rollout filename, raw-log marker, and likely-secret scans.
- Added `compare-briefs` command for day-over-day maintainer evidence deltas.
- Added tests and sample outputs for the new quality gate commands.

## v1.0.0 - Maintainer Evidence Brief

- Added `brief` command that generates a local maintainer evidence pack.
- Brief output includes Markdown, HTML, scan report, weekly report, API dry-run payload, doctor
  report, and optional GitHub outcome artifacts.
- Added tests for brief generation without network access.
- Updated documentation to make the brief the recommended shareable application artifact.

## v0.7.0 - Local Readiness Checks

- Added `doctor` command for local readiness diagnostics.
- Added doctor tests to confirm rollout filenames and raw logs are not exposed.
- Documented doctor output in README and report schema.

## v0.6.0 - Package Readiness

- Added npm package metadata, repository links, and package file allowlist.
- Added package dry-run and tarball smoke-test scripts.
- Added npm publishing documentation.

## v0.5.0 - Outcome Linking

- Added local outcome linking between scan reports and GitHub import reports.
- Added dashboard API payload export for inspecting aggregate dry-run data in the browser.
- Added tests for branch-to-PR linking.
- Documented outcome linking and dashboard API payload export.

## v0.4.0 - Application Readiness

- Added aggregate-only API summary dry-run payload generation.
- Added optional GitHub issue and pull request metadata import through `gh`.
- Added sample API payload and GitHub outcomes artifacts.
- Expanded schema documentation for API dry-run and GitHub outcome imports.

## v0.3.1 - Repository Polish

- Added README badges, current status table, and privacy posture summary.
- Added contribution, security, and report schema documentation.
- Added dashboard scan metadata row and workflow badges.
- Refreshed desktop and mobile screenshots.

## v0.3.0 - Maintainer Outcome Signals

- Added Git branch and short commit context from Codex session metadata or local `.git` fallback.
- Added metadata-only workflow labels: implementation, review, triage, release, security, unknown.
- Added Workflow Mix to the dashboard and weekly Markdown report.
- Corrected repeated `token_count` snapshot handling to use the latest observed value.

## v0.2.0 - Shareable Maintainer Reports

- Added dashboard weekly Markdown export.
- Added configurable path redaction: basename, stable hash, or private full path.
- Added API-credit workflow documentation with aggregate-only payload examples.
- Added issue and pull request templates.

## v0.1.0 - Local Codex Usage Lens

- Added dependency-free Node CLI for Codex rollout JSONL scanning.
- Added static dashboard for sessions, workspaces, models, quota windows, and recent activity.
- Added demo data, screenshots, tests, and application draft material.
