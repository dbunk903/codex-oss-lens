# Changelog

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
