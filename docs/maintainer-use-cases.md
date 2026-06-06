# Maintainer Use Cases

Codex OSS Lens is designed for maintainers who use Codex across real open-source maintenance work
and need a local, reviewable way to explain that usage.

## 1. Weekly maintainer review

Run a local scan before a weekly review to see which repositories consumed the most Codex attention,
which workflows dominated the week, and whether recent sessions are pushing quota windows.

```bash
npx -y codex-oss-lens@latest scan --out codex-report.json
npx -y codex-oss-lens@latest weekly --out weekly-report.md
```

The weekly report is safe to share because workspace paths are redacted by default and raw rollout
logs are never included.

## 2. OSS support application evidence

Generate a complete evidence folder before an OSS support or grant application. The pack includes a
brief, readiness report, timeline, scorecard, API-credit plan, evidence index, and Korean form draft.

```bash
npx -y codex-oss-lens@latest submission-pack --repo owner/project --out-dir codex-submission-pack
npx -y codex-oss-lens@latest pack-validate codex-submission-pack --markdown pack-validation.md
```

This gives reviewers concrete artifacts without requiring access to local logs, prompts, terminal
output, or source code.

## 3. API-credit planning

Use aggregate session data to decide which Codex workflow deserves API automation first. The API
plan ranks candidates by sessions, turns, tool calls, and observed token pressure.

```bash
npx -y codex-oss-lens@latest api-plan --report codex-submission-pack/scan-report.json --markdown api-plan.md
```

Good early candidates are repeated implementation summaries, review briefs, issue triage, and
release evidence generation.

## 4. Privacy review before sharing

Before posting evidence in a public issue, release note, or application, run the privacy gates.

```bash
npx -y codex-oss-lens@latest redact-check codex-submission-pack --out redact-check.json
npx -y codex-oss-lens@latest readiness --manifest codex-submission-pack/manifest.json --markdown readiness.md
```

The checks flag local paths, rollout filenames, raw-log markers, and likely secrets.

## 5. Published package confidence

Use the published install smoke command to prove the public package is installable and emits a valid
demo report.

```bash
npm exec --yes --package codex-oss-lens@latest -- codex-oss-lens demo
```

The repository also includes a scheduled GitHub Actions workflow that runs this check against npm
`latest`, so package regressions are visible outside the maintainer machine.
