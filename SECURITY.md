# Security Policy

Codex OSS Lens reads local Codex session logs. Those logs can contain sensitive maintenance
context, so privacy and redaction bugs are treated as security issues.

## Supported versions

The latest GitHub release is the supported version.

## Reporting a vulnerability

Open a GitHub issue if the report can be written without exposing secrets or private prompts.
If disclosure requires sensitive details, do not post them publicly. Use GitHub private vulnerability reporting if it is enabled on the repository, or keep the issue minimal and ask for a private contact path.

## Sensitive data expectations

Do not include:

- raw rollout JSONL
- prompts or assistant messages
- source code snippets from private repositories
- API keys, tokens, or credentials
- full local filesystem paths

Before sharing generated artifacts publicly, run:

```bash
node src/cli.js redact-check <artifact-dir>
node src/cli.js public-evidence --markdown public-evidence.md
npm run security:readiness
npm run privacy:threat-model
```

`redact-check` looks for accidental local-path, rollout filename, raw-log, and likely-secret
leakage. `public-evidence` only emits public URLs and application proof points.
`docs/privacy-threat-model.md` records the protected inputs, shareable outputs, and future API
opt-in boundary that security reviewers should preserve.

## Project guarantees

- No hosted service is contacted by default.
- Dashboard rendering is local.
- Weekly report export is local.
- Future API-backed features must be opt-in and aggregate-only by default.
