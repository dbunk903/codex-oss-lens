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

## API dry-run payload

`codex-oss-lens api-payload` emits an aggregate-only candidate payload for future OpenAI-backed
summaries. It excludes raw rollout lines, prompts, source code, terminal output, session file names,
and full paths by default.

The payload contains:

- total session, workspace, turn, tool-call, token, and quota metrics
- model and workflow counts
- daily session counts
- redacted workspace buckets
- long-session friction candidates represented only by counts and booleans

## GitHub outcome import

`codex-oss-lens github-import --repo owner/name` emits public GitHub issue and pull request
metadata through the GitHub CLI. It does not read local Codex logs, prompts, source code, or
terminal output. This is intended as a local input for comparing Codex session activity with
maintenance outcomes.

## Outcome links

`codex-oss-lens link-outcomes --report report.json --github github-outcomes.json` joins a local
Codex scan report with GitHub outcome metadata by matching session `git.branch` values to pull
request `headRefName` values.

The output keeps unmatched sessions and unmatched pull requests visible so maintainers can see both
where Codex activity led to a branch-linked outcome and where additional manual review is needed.

## Doctor report

`codex-oss-lens doctor` emits local readiness checks for Node.js, Codex home, the sessions
directory, rollout file availability, and GitHub CLI availability. It reports counts and tool
versions only; it does not include rollout filenames, raw logs, prompts, or source code.

## Maintainer brief

`codex-oss-lens brief --out-dir codex-brief` creates a directory with a shareable maintainer
evidence pack:

- `brief.md` and `brief.html`
- `manifest.json`
- `scan-report.json`
- `weekly-report.md`
- `api-payload.dry-run.json`
- `doctor.json`
- optional GitHub outcome artifacts when `--repo owner/name` is passed

The brief defaults to hash redaction and keeps raw logs, prompts, source code, and full paths out
of the generated shareable artifacts.
