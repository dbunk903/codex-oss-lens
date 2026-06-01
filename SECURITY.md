# Security Policy

Codex OSS Lens reads local Codex session logs. Those logs can contain sensitive maintenance
context, so privacy and redaction bugs are treated as security issues.

## Supported versions

The latest GitHub release is the supported version.

## Reporting a vulnerability

Open a GitHub issue if the report can be written without exposing secrets or private prompts.
If disclosure requires sensitive details, keep the issue minimal and ask for a private contact path.

## Sensitive data expectations

Do not include:

- raw rollout JSONL
- prompts or assistant messages
- source code snippets from private repositories
- API keys, tokens, or credentials
- full local filesystem paths

## Project guarantees

- No hosted service is contacted by default.
- Dashboard rendering is local.
- Weekly report export is local.
- Future API-backed features must be opt-in and aggregate-only by default.
