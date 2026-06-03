# API-Credit Workflow

Codex OSS Lens is local-first. Raw Codex rollout JSONL files can contain prompts, repository
paths, tool arguments, and other sensitive maintenance context, so future OpenAI API features must
use explicit opt-in and aggregate payloads.

## Default behavior

- Scan local rollout JSONL files.
- Redact workspace paths by default.
- Render dashboard and weekly Markdown reports locally.
- Send no data to hosted services.

## Candidate API-backed features

### Weekly maintainer summary

Input should be aggregate metrics only:

```json
{
  "sessions": 18,
  "workspaces": ["codex", "docs-site", "api-gateway"],
  "models": ["gpt-5.5", "gpt-5.3-codex"],
  "workflowCounts": {
    "implementation": 7,
    "review": 5,
    "triage": 4,
    "release": 2
  },
  "quotaWindows": {
    "primaryUsedPercent": 43,
    "secondaryUsedPercent": 28
  }
}
```

Output:

- short maintainer summary
- suggested automation candidates
- sessions that may need better project instructions
- release or triage planning notes

### Long-session failure classification

Input should include counts and event categories, not raw assistant/user content:

```json
{
  "turns": 42,
  "toolCalls": 17,
  "durationMinutes": 190,
  "eventTypes": {
    "turn_context": 42,
    "token_count": 30,
    "exec_command": 12,
    "apply_patch": 5
  }
}
```

Output:

- likely friction category
- local-only follow-up checklist
- suggested issue template for maintainers

## Data that must not be sent by default

- raw rollout JSONL lines
- prompts or assistant messages
- source code snippets
- full local filesystem paths
- secrets, tokens, environment variables, or terminal output containing credentials

## Opt-in requirements

Before any API-backed feature is enabled, the UI and CLI should show:

- what aggregate fields will be sent
- what fields are redacted
- which model will be used
- where the response will be stored

The first implementation should be dry-run first: print the payload locally without sending it.

## Dry-run command

Codex OSS Lens provides the dry-run payload now:

```bash
node src/cli.js api-payload --out api-payload.dry-run.json
```

The command defaults to stable hash redaction for workspace buckets and does not call any API.
If a private full-path report is intentionally generated with `--show-paths`, the payload marks
`privacy.fullPathsIncluded` as `true` instead of claiming the output is shareable.

The dashboard also provides an `API payload` export button. It uses the same aggregate-only shape
and downloads JSON locally from the currently loaded report.

`codex-oss-lens brief` includes `api-payload.dry-run.json` in the generated evidence pack so the
payload can be reviewed before any future live API integration is enabled.
