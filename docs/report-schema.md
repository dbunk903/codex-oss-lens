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

## Brief audit

`codex-oss-lens audit --manifest codex-brief/manifest.json` emits a share-readiness score for a
maintainer evidence pack. It checks session coverage, workspace coverage, workflow mix, API dry-run
payload presence, doctor status, privacy flags, and the Markdown/HTML brief artifacts.

The output includes:

- `score`: 0 to 100
- `rating`: `ready`, `needs-review`, or `not-ready`
- `checks`: individual boolean checks with point values
- `nextActions`: concrete repair steps for failed checks

## Redaction check

`codex-oss-lens redact-check <file-or-dir>` scans generated artifacts for accidental leakage before
sharing them. It flags full local paths, rollout JSONL filenames, raw Codex log markers, and likely
API or GitHub secrets.

The output includes:

- `status`: `pass` or `fail`
- `filesScanned`
- `findings`: rule id, relative file, line number, and a redacted sample

## Brief comparison

`codex-oss-lens compare-briefs --base old/manifest.json --head new/manifest.json` compares two
maintainer brief manifests. It reports metric, workflow, and model deltas, plus an optional
Markdown summary when `--markdown` is supplied.

## Submission readiness

`codex-oss-lens readiness --manifest codex-brief/manifest.json` combines brief audit, redaction
scan, and optional baseline comparison into one application-oriented report.

The output includes:

- `status`: `pass`, `review`, or `fail`
- `audit`: embedded `audit` output
- `redaction`: embedded `redact-check` output
- `comparison`: embedded `compare-briefs` output when `--base` is supplied
- `blockers`, `warnings`, and `evidence`
- optional Markdown when `--markdown` is supplied

## API credit plan

`codex-oss-lens api-plan --report scan-report.json` turns aggregate Codex usage into a prioritized
API-credit implementation plan. It scores workflow candidates by sessions, turns, tool calls, and
observed tokens, then maps each workflow to a privacy-first API use case.

The output includes:

- `summary`: aggregate scan totals and quota-window observations
- `candidates`: workflow scores, suggested API use cases, benefits, and first prompt shapes
- `milestones`: short implementation sequence for the top candidates
- `guardrails`: privacy requirements for future API-backed features
- optional Markdown when `--markdown` is supplied

## Activity timeline

`codex-oss-lens timeline --report scan-report.json` turns scan sessions into chronological
maintainer activity evidence. It groups sessions by day and keeps per-session entries limited to
metadata already present in the redacted scan report.

The output includes:

- `summary`: sessions, day count, workspace count, workflow counts, and observed tokens
- `days`: daily rollups with entries sorted by start time
- `highlights`: busiest day, longest session, and heaviest-token session
- optional Markdown when `--markdown` is supplied

## Evidence index

`codex-oss-lens evidence-index --manifest manifest.json` composes generated artifacts into a
reviewer-facing index. Supplying `--readiness`, `--api-plan`, `--timeline`, `--scorecard`, and
`--form-draft` enriches the index with status, planning, activity, scoring, and copy-ready form
evidence.

The output includes:

- `summary`: core brief metrics plus readiness, audit, redaction, API-plan, and timeline counts
- `artifacts`: files listed by the maintainer brief manifest
- `evidence`: compact nested summaries from readiness, API plan, and timeline reports
- `reviewerNotes`: short human-readable review cues
- optional Markdown and HTML when `--markdown` or `--html` is supplied

## Maintainer scorecard

`codex-oss-lens scorecard --manifest manifest.json` emits a weighted application readiness
scorecard. Supplying `--readiness`, `--api-plan`, and `--timeline` lets it score privacy,
planning, reviewability, and activity evidence from generated reports.

The output includes:

- `score`: 0 to 100
- `rating`: `strong`, `ready`, `needs-review`, or `not-ready`
- `categories`: weighted category scores for activity, privacy, planning, reviewability, and readiness
- `nextActions`: repair steps for categories that did not receive full points
- optional Markdown when `--markdown` is supplied

## Submission pack

`codex-oss-lens submission-pack --out-dir codex-submission-pack` generates the complete application
evidence folder in one command. It creates the maintainer brief, readiness report, API plan,
activity timeline, scorecard, form draft, evidence index, and top-level README.

The command returns a compact pack manifest with:

- `status`: readiness status
- `score` and `rating`: scorecard result
- `summary`: maintainer brief summary
- `artifacts`: files generated into the pack folder

## Form draft

`codex-oss-lens form-draft --manifest manifest.json` creates copy-ready Korean OpenAI OSS support
form answers from generated evidence. Supplying readiness, API plan, scorecard, repository, and
release links enriches the draft.

The output includes:

- `publicLinks`: repository, release, roadmap, and API-credit workflow URLs when supplied
- `requiredManualFields`: personal fields that must still be filled by the account owner
- `fields`: repository fit, API credit plan, and additional information answers
- character counts and 500-character limit checks for each answer
- optional Markdown when `--markdown` is supplied

## Pack validation

`codex-oss-lens pack-validate <submission-pack-dir>` validates a generated submission pack before
sharing it. It checks required files, redaction status, readiness status, scorecard threshold,
evidence index availability, and HTML index availability.

The output includes:

- `status`: `pass`, `review`, or `fail`
- `checks`: individual validation checks
- `blockers` and `warnings`
- `redaction`: embedded redaction scan result
- optional Markdown when `--markdown` is supplied
