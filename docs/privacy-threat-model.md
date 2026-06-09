# Privacy Threat Model

Codex OSS Lens is designed for public OSS maintainers who may have private Codex session logs,
private repositories, and account-specific usage context on the same machine. This page records the
privacy boundary that must stay true before API-backed features or public evidence exports are
treated as review-ready.

## Protected Inputs

The following data must stay local by default:

- raw Codex rollout JSONL lines
- prompts, assistant messages, and tool arguments
- source code snippets from private repositories
- full local filesystem paths
- API keys, tokens, credentials, and environment variables
- private terminal output or unpublished maintainer notes

## Shareable Outputs

Reviewer-facing artifacts may include only aggregate or public data:

- counts for sessions, workspaces, models, workflows, turns, tools, and token signals
- redacted workspace labels or stable hashes
- public GitHub repository, release, npm, CI, and documentation links
- generated status, scorecard, timeline, evidence-index, and form-draft summaries after redaction

If a command is run with `--show-paths`, the output is private and must not be posted publicly.
Shareable artifacts must keep `privacy.rawLogsIncluded`, `privacy.promptsIncluded`,
`privacy.sourceCodeIncluded`, and `privacy.fullPathsIncluded` false.

## Trust Boundaries

| Boundary | Default | Required guard |
| --- | --- | --- |
| Local scan to local report | Allowed | Redact full paths unless explicitly private |
| Local report to public evidence | Allowed after checks | Run `npm run public:redaction` and readiness gates |
| Local aggregate payload to future API feature | Blocked until opt-in | Show payload, model, destination, and storage before sending |
| Public issue or discussion | Allowed for sanitized summaries | Do not paste raw logs, prompts, paths, secrets, or private source |
| Security or privacy report | Route privately when sensitive | Follow `SECURITY.md` before disclosure |

## Review Gates

Before publishing evidence or submitting the support form, run:

```bash
npm run privacy:threat-model
npm run public:redaction
npm run submission:check
```

The threat-model gate checks that this page is linked from the README, application status,
reviewer quickstart, final checklist, security policy, and CI submission workflow.

## Future API Feature Requirements

API-backed functionality must start as dry-run only and require explicit opt-in before network use.
The UI or CLI must show:

- the exact aggregate fields that will be sent
- which fields were redacted or excluded
- whether full paths were observed in input
- the model and endpoint family that will be used
- where the response will be stored locally

Do not add telemetry, background upload, remote sync, or live API summarization without updating
this threat model, `docs/api-credit-workflow.md`, `SECURITY.md`, and the readiness gates in the
same change.

See `docs/data-retention.md` for where generated artifacts should live and when private local
outputs should be deleted.
