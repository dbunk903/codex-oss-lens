# Data Retention

Codex OSS Lens is local-first and does not run a hosted service. This page documents where generated
artifacts live, what is safe to publish, and what a maintainer should delete after preparing public
evidence.

## Local Inputs

Codex session logs remain in the user's Codex home, usually `~/.codex/sessions/`. The tool reads
those files during local commands but does not move, upload, or delete them.

Private full-path reports created with `--show-paths` are local working files. They are not
shareable and should be deleted when no longer needed for private review.

## Generated Artifacts

| Artifact | Default location | Retention expectation |
| --- | --- | --- |
| Scan reports | Caller-selected `--out` path | Keep locally or delete after private review |
| Weekly reports | Caller-selected `--out` path | Share only after checking redaction output |
| API dry-run payloads | Caller-selected `--out` path or evidence pack | Keep as review evidence only if aggregate-only |
| Submission packs | Caller-selected `--out-dir` path | Recreate when needed; delete packs containing private inputs |
| Public examples | `examples/` in the repository | Must stay sanitized and pass public redaction checks |

Generated local reports are excluded from the npm package allowlist unless they are committed under
`examples/` as sanitized samples.

## Public Sharing Rules

Before publishing generated artifacts:

```bash
npm run data:retention
npm run public:redaction
npm run submission:check
```

Only publish artifacts that omit raw Codex JSONL, prompts, assistant messages, source code, full
local filesystem paths, secrets, private terminal output, and unpublished maintainer notes.

## Deletion Guidance

- Delete temporary `codex-brief/` or `codex-submission-pack/` folders after copying sanitized
  evidence into public docs.
- Delete private reports made with `--show-paths` before sharing a workspace or screen recording.
- Regenerate public samples from source commands instead of editing old generated files manually.
- Do not commit generated artifacts outside the package allowlist unless a readiness gate covers
  them.
