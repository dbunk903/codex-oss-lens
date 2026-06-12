# Application Review FAQ

Use this FAQ when a reviewer wants short answers to the most likely application questions before
reading the full evidence set.

## Questions

### Why is this worth supporting if the project is young?

Codex OSS Lens is young, so it does not claim mature adoption. The current public evidence focuses
on installability, reproducibility, privacy posture, and a concrete maintainer workflow: local Codex
session review, quota awareness, workflow evidence, and shareable application material.

### What public proof exists today?

Reviewers can inspect the public repository, `v1.6.1` release, npm package, Node CI, published
install smoke workflow, public evidence sample, form draft sample, dashboard previews, and
application evidence matrix without signing in or receiving private logs. The adoption snapshot
separates current public signals from mature adoption claims that are not being made.

### What is not automated?

The OpenAI support form is not submitted by automation. The account owner still fills personal
fields, organization ID, terms review, and the final Submit action manually.

### What private Codex data is protected?

Raw rollout JSONL, prompts, terminal output, source code, full workspace paths, tool arguments, and
secrets stay local. Public samples are aggregate-only or synthetic, and public redaction gates check
docs, samples, package metadata, license/support/conduct docs, and GitHub templates/workflows.

### What is the source-vs-published boundary?

`codex-oss-lens@latest` is the installable public package. Source-only documentation or readiness
improvements are public on GitHub immediately, but they are not claimed as published package
behavior until the next npm release and published smoke check pass.

### How would API credits be used?

API credits would support opt-in summaries over aggregate local metrics, such as weekly maintainer
reports, review-risk briefs, and next-action suggestions. Raw logs, prompts, full paths, and source
content remain excluded from the payload unless a future design explicitly changes that boundary
with user confirmation.

## Drift Checks

Run:

```bash
npm run reviewer:faq
npm run submission:check
```

`reviewer:faq` verifies this FAQ is linked from application status, reviewer quickstart, final
checklist, README, public evidence, dashboard evidence, CI, and publishing docs.
