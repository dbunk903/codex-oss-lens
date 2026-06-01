# Research Notes

## Program fit

The Codex Open Source Support Program asks for an actively maintained public repository and
reviews signals such as usage, ecosystem importance, and maintenance activity. The form also asks
how API credits will be used for coding, review, release, or maintenance automation.

Implication: a brand-new repository is weaker than an established OSS project. If an existing
public project is available, submit that repository and position Codex OSS Lens as the concrete
Codex/API-credit workflow to build for it.

## Adjacent tools and signals

- OpenAI Codex CLI is itself open source and runs locally on the user's computer.
- VS Code status-bar style tools show demand for quick Codex quota visibility.
- Multi-agent usage analyzers such as ccusage now include Codex JSONL as a data source.
- Grafana dashboards show there is demand for operational Codex monitoring.
- Session replay tools show demand for local, inspectable Codex workflow artifacts.

## Chosen product angle

Codex OSS Lens focuses on a narrower OSS-maintainer problem: local usage visibility before and
after maintenance work. It is not another generic cost dashboard. The first screen answers:

- which repo/workspace consumed Codex time
- whether current quota windows are close to saturation
- which model mix is being used
- how many turns and tool calls recent sessions needed

## Application positioning

Use "privacy-first maintainer analytics" as the phrase. The strongest API-credit story is optional
summarization of aggregate metrics, not uploading raw session logs.
