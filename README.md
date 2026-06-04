# Codex OSS Lens

[![release](https://img.shields.io/github/v/release/dbunk903/codex-oss-lens?label=release)](https://github.com/dbunk903/codex-oss-lens/releases)
[![license](https://img.shields.io/github/license/dbunk903/codex-oss-lens)](LICENSE)
[![node](https://img.shields.io/badge/node-%3E%3D20-167d68)](package.json)
[![privacy](https://img.shields.io/badge/privacy-local--first-2563a8)](docs/api-credit-workflow.md)

Codex OSS Lens is a local-first usage and workflow dashboard for OpenAI Codex maintainers.
It reads Codex rollout JSONL files from `~/.codex/sessions/` and turns them into a small
browser UI for quota windows, workspace load, model mix, recent sessions, and observed token
signals.

The goal is to help open-source maintainers answer practical questions before a review,
release, or triage sprint:

- Which repositories are consuming most Codex attention?
- Are 5-hour or weekly quota windows close to saturation?
- Which models are used across maintenance work?
- How many turns and tool calls are common in recent sessions?
- Which branch/commit was active during a Codex session?
- Is the recent workload implementation, review, triage, release, or security-oriented?
- Which Codex workflows deserve API-credit automation next?

## Why this exists

Existing Codex usage visibility is fragmented across CLI sessions, plan windows, and local JSONL
files. Maintainers need a fast way to understand where Codex is helping, where it is stuck, and
which maintenance workflows should be automated or improved.

Codex OSS Lens keeps that analysis local. It does not upload prompts, code, logs, or repository
paths to a hosted service.

![Dashboard preview](examples/dashboard-preview.png)

## Current status

| Area | Status |
| --- | --- |
| Local JSONL scan | Available |
| Dashboard preview | Available |
| Weekly Markdown export | Available |
| Path redaction | Basename, hash, or private full path |
| Git branch/commit context | Codex payload and local `.git` fallback |
| Workflow classification | Metadata-only heuristics |
| API summary payload | Aggregate-only dry run available |
| GitHub outcomes | Optional issue/PR metadata import through `gh` |
| Outcome links | Local branch-to-PR matching |
| Maintainer brief | Shareable evidence pack generation |
| Brief audit | Share-readiness score and next actions |
| Redaction check | Leak scan for shareable artifacts |
| Brief comparison | Day-over-day maintainer evidence deltas |

## Quick start

```bash
npm install
npm test
npm run serve
```

Then open `http://127.0.0.1:5057`.

After the package is published, the same UI can run with `npx`:

```bash
npx codex-oss-lens serve --demo
```

To write a report that can be opened in the static UI:

```bash
node src/cli.js scan --out examples/codex-lens-report.json
```

Workspace paths are redacted by default. For stable anonymous workspace ids:

```bash
node src/cli.js scan --redaction hash --out shareable-report.json
```

For a private local report with full paths:

```bash
node src/cli.js scan --show-paths --out private-report.json
```

To export a shareable weekly maintainer summary:

```bash
node src/cli.js weekly --out weekly-codex-report.md
```

To inspect the aggregate-only payload that a future API summary would send:

```bash
node src/cli.js api-payload --out api-payload.dry-run.json
```

To import public GitHub issue and pull request metadata for local comparison:

```bash
node src/cli.js github-import --repo dbunk903/codex-oss-lens --out github-outcomes.json
```

To link a scan report with imported GitHub outcomes:

```bash
node src/cli.js link-outcomes --report report.json --github github-outcomes.json --out linked-outcomes.json
```

To check local readiness without exposing rollout filenames or prompt content:

```bash
node src/cli.js doctor
```

To generate a full local evidence pack for review or OSS support applications:

```bash
node src/cli.js brief --repo dbunk903/codex-oss-lens --out-dir codex-brief
```

To audit whether that evidence pack is ready to share:

```bash
node src/cli.js audit --manifest codex-brief/manifest.json --out codex-brief/audit.json
```

To scan the generated artifacts for accidental paths, rollout filenames, raw-log markers, or
likely secrets:

```bash
node src/cli.js redact-check codex-brief --out codex-brief/redact-check.json
```

To compare two maintainer briefs across days:

```bash
node src/cli.js compare-briefs --base old-brief/manifest.json --head codex-brief/manifest.json --markdown brief-delta.md
```

To preview without local Codex logs:

```bash
node src/cli.js serve --demo
```

## CLI

```bash
codex-oss-lens scan [--codex-home ~/.codex] [--limit 250] [--out report.json]
codex-oss-lens weekly [--codex-home ~/.codex] [--limit 250] [--out weekly.md]
codex-oss-lens api-payload [--codex-home ~/.codex] [--limit 250] [--out payload.json]
codex-oss-lens github-import --repo owner/name [--limit 50] [--out github-outcomes.json]
codex-oss-lens link-outcomes --report report.json --github github-outcomes.json [--out linked.json]
codex-oss-lens doctor [--codex-home ~/.codex] [--out doctor.json]
codex-oss-lens brief [--codex-home ~/.codex] [--repo owner/name] [--out-dir codex-brief]
codex-oss-lens audit --manifest codex-brief/manifest.json [--out audit.json]
codex-oss-lens redact-check <file-or-dir> [--out redact-check.json]
codex-oss-lens compare-briefs --base old/manifest.json --head new/manifest.json [--out compare.json] [--markdown compare.md]
codex-oss-lens serve [--codex-home ~/.codex] [--port 5057] [--demo]
codex-oss-lens demo [--out report.json]
```

## Data model

Codex OSS Lens scans files matching:

```text
~/.codex/sessions/**/rollout-*.jsonl
```

It extracts:

- session metadata: id, start/end timestamps, workspace, model
- workflow metrics: turn count, tool-call count, duration
- Git metadata: branch and short commit when Codex logs or local `.git` metadata provide it
- workflow classification: implementation, review, triage, release, security, or unknown
- token signals when available in `token_count` or `usage` payloads
- quota windows from `rate_limits.primary` and `rate_limits.secondary`

Older Codex logs may not contain token usage details. In that case the dashboard still shows
session, workspace, model, turn, tool, and quota-window data.

Full workspace paths are redacted unless `--show-paths` is passed. Use `--redaction hash`
when a report needs stable workspace identities without exposing names.

See [report schema](docs/report-schema.md) for the generated JSON shape.

## Privacy posture

- Raw rollout JSONL stays on the local machine.
- Shareable exports redact workspace paths by default.
- Workflow labels are derived from metadata such as branch names, event categories, and counts.
- Future API-backed features should start with a dry-run payload and explicit opt-in.

## Roadmap

- Redaction controls for workspace path display
- Cost estimation profiles by model and plan
- Exportable weekly maintainer report
- GitHub issue/PR labels to connect Codex usage with maintenance outcomes
- Optional OpenAI API summarization of local-only aggregate metrics

See [API-credit workflow](docs/api-credit-workflow.md) for the privacy-first API plan.
See [npm publishing](docs/npm-publishing.md) for package verification steps.

## Maintainer Brief

`codex-oss-lens brief` creates a local folder containing:

- `brief.md` and `brief.html`
- `scan-report.json`
- `weekly-report.md`
- `api-payload.dry-run.json`
- `doctor.json`
- optional `github-outcomes.json` and `linked-outcomes.json` when `--repo` is supplied

This is the recommended artifact for sharing a privacy-preserving snapshot of Codex maintainer
activity.

Run `audit`, `redact-check`, and `compare-briefs` before sharing repeated evidence packs. These
commands make the share-readiness score, privacy scan, and day-over-day deltas explicit instead of
leaving them as manual review notes.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Bug reports and integration requests are welcome,
especially examples from maintainers using Codex across multiple repositories.

## License

MIT
