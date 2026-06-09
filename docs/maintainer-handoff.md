# Maintainer Handoff

Use this page when a new maintainer, reviewer, or future automation agent needs to continue Codex
OSS Lens without private local context.

## Current Public State

- Public repository: https://github.com/dbunk903/codex-oss-lens
- Current release and npm package: `codex-oss-lens@1.6.1`
- Primary maintainer: `dbunk903`
- Core promise: local-first Codex usage visibility with no raw log upload.

## First Checks

Run:

```bash
npm run submission:check
npm run maintainer:handoff
```

If `npm run submission:check` is too broad while investigating, start with:

```bash
npm test
npm run public:redaction
npm run data:retention
npm run demo:walkthrough
npm run submission:rehearsal
```

## Handoff Map

- Product and reviewer entry point: `README.md`
- Fast public validation: `docs/reviewer-quickstart.md`
- Submit-time dry run: `docs/submission-rehearsal.md`
- Release/public package evidence: `docs/release-provenance.md`
- Privacy and retention boundaries: `docs/privacy-threat-model.md`, `docs/data-retention.md`
- Publishing authority and package gates: `docs/npm-publishing.md`, `application/publish-checklist.md`
- Paste-ready application material: `application/final-copy.md`, `application/form-answers.md`

## Change Rules

- Do not add telemetry, remote sync, or automatic API calls without updating the privacy threat
  model, API-credit workflow, security policy, README, and CI readiness gates in the same change.
- Do not claim npm latest includes source-only changes until a new package version is published and
  `examples/install-smoke.sample.*` is regenerated.
- Do not submit the OpenAI form from an automation run; account-owner fields, organization ID,
  terms review, and final Submit remain manual.
- Do not commit private scans, raw rollout JSONL, prompts, source code, secrets, full local paths,
  or unpublished maintainer notes.

## Release Handoff

Before a release:

```bash
npm run submission:check
node src/cli.js publish-check --markdown publish-check.md
npm publish --access public --otp <6-digit-code>
node src/cli.js install-smoke --package codex-oss-lens --version latest --markdown install-smoke.md
```

After a release, regenerate public samples and update release links before asking reviewers to trust
npm latest.
