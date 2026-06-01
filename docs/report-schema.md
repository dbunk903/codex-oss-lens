# Report Schema

`codex-oss-lens scan` emits a JSON report with aggregate metrics and recent session summaries.
Fields may be absent when older Codex logs do not include the relevant metadata.

## Top-level shape

```json
{
  "generatedAt": "2026-06-02T00:00:00.000Z",
  "totals": {},
  "byDay": {},
  "byWorkspace": {},
  "byModel": {},
  "byWorkflow": {},
  "sessions": []
}
```

## Session

```json
{
  "id": "session-id",
  "file": "sessions/2026/06/02/rollout-example.jsonl",
  "cwd": "[redacted]/codex-oss-lens",
  "workspace": "codex-oss-lens",
  "startedAt": "2026-06-02T00:00:00.000Z",
  "endedAt": "2026-06-02T00:20:00.000Z",
  "models": ["gpt-5.5"],
  "workflow": "implementation",
  "git": {
    "branch": "main",
    "commit": "abc123def456",
    "repository": "codex-oss-lens"
  },
  "turns": 8,
  "toolCalls": 4,
  "durationMinutes": 20,
  "tokens": {
    "input": 0,
    "cachedInput": 0,
    "output": 0,
    "reasoningOutput": 0,
    "total": 0
  }
}
```

## Workflow labels

Workflow labels are metadata-only heuristics. They use session ids, file names, workspace names,
branch names, repository names, event categories, turn counts, and tool-call counts. They do not
read source files or classify prompt text.

Possible labels:

- `implementation`
- `review`
- `triage`
- `release`
- `security`
- `unknown`

## Redaction

Default path redaction returns a workspace basename:

```text
[redacted]/codex-oss-lens
```

Stable hash redaction returns an anonymous workspace id:

```text
[workspace:7540069d86]
```

Full paths are only emitted when `--show-paths` is passed.
