# Scope And Limitations

Use this page when a reviewer wants to understand what Codex OSS Lens can prove today, what remains
manual, and which boundaries should not be blurred for the OpenAI Codex OSS support application.

## In Scope Today

- Local-first parsing of Codex rollout JSONL files into aggregate usage, quota, workflow, model, and
  maintainer activity reports.
- Static dashboard previews for reviewer inspection without uploading raw Codex logs or source code.
- Submission evidence generation: maintainer brief, readiness report, API plan, timeline, scorecard,
  form draft, evidence index, public evidence sample, and final copy checks.
- npm package verification through `pack:check`, `pack:smoke`, `publish:samples`, and published
  install smoke.
- Public documentation for reviewer quickstart, release provenance, adoption, maintenance,
  maintainer handoff, privacy threat model, accessibility, data retention, demo walkthrough, and
  submission rehearsal.

## Out Of Scope Today

- No hosted service, telemetry collector, background sync, or remote analytics.
- No live OpenAI API calls; API-backed summaries remain dry-run and opt-in until a future feature
  shows the payload, destination, model, retention behavior, and cost before sending.
- No raw Codex logs, prompts, source files, full local paths, terminal output, or secrets in public
  artifacts.
- No automatic OpenAI support-form submission. Account-owner fields, organization ID, terms review,
  and the final Submit action remain manual.
- No claim that source-only changes are available from `codex-oss-lens@latest` until a later npm
  release is published and install-smoke evidence is regenerated.

## Reviewer Interpretation

- Treat the project as an early public OSS tool with strong evidence hygiene, not as a mature
  adoption case with large external usage signals.
- Trust public samples for workflow shape and privacy posture, but do not infer private maintainer
  logs or source contents from those samples.
- Prefer `npm exec --yes --package codex-oss-lens@latest -- codex-oss-lens demo` for a public smoke
  test, and use source checkout checks only when reviewing source-side improvements after the latest
  npm release.

## Drift Checks

Run:

```bash
npm run scope:limitations
npm run submission:check
```

`scope:limitations` verifies this page is linked from the reviewer quickstart, final checklist,
application status, README, public evidence, dashboard evidence, CI, and publishing docs.
