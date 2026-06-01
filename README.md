# Codex OSS Lens

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
- Which Codex workflows deserve API-credit automation next?

## Why this exists

Existing Codex usage visibility is fragmented across CLI sessions, plan windows, and local JSONL
files. Maintainers need a fast way to understand where Codex is helping, where it is stuck, and
which maintenance workflows should be automated or improved.

Codex OSS Lens keeps that analysis local. It does not upload prompts, code, logs, or repository
paths to a hosted service.

![Dashboard preview](examples/dashboard-preview.png)

## Quick start

```bash
npm install
npm test
npm run serve
```

Then open `http://127.0.0.1:5057`.

To write a report that can be opened in the static UI:

```bash
node src/cli.js scan --out examples/codex-lens-report.json
```

Workspace paths are redacted by default. For a private local report with full paths:

```bash
node src/cli.js scan --show-paths --out private-report.json
```

To export a shareable weekly maintainer summary:

```bash
node src/cli.js weekly --out weekly-codex-report.md
```

To preview without local Codex logs:

```bash
node src/cli.js serve --demo
```

## CLI

```bash
codex-oss-lens scan [--codex-home ~/.codex] [--limit 250] [--out report.json]
codex-oss-lens weekly [--codex-home ~/.codex] [--limit 250] [--out weekly.md]
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
- token signals when available in `token_count` or `usage` payloads
- quota windows from `rate_limits.primary` and `rate_limits.secondary`

Older Codex logs may not contain token usage details. In that case the dashboard still shows
session, workspace, model, turn, tool, and quota-window data.

Full workspace paths are redacted unless `--show-paths` is passed.

## Roadmap

- Redaction controls for workspace path display
- Cost estimation profiles by model and plan
- Exportable weekly maintainer report
- GitHub issue/PR labels to connect Codex usage with maintenance outcomes
- Optional OpenAI API summarization of local-only aggregate metrics

See [API-credit workflow](docs/api-credit-workflow.md) for the privacy-first API plan.

## License

MIT
