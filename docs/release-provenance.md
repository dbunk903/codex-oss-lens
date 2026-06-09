# Release Provenance

Use this page to trace the public release evidence for Codex OSS Lens before submitting the OpenAI
Codex open-source support form.

## Current release

| Artifact | Status | Evidence |
| --- | --- | --- |
| Source repository | Public | https://github.com/dbunk903/codex-oss-lens |
| GitHub release | Published | https://github.com/dbunk903/codex-oss-lens/releases/tag/v1.6.1 |
| npm package | Published | https://www.npmjs.com/package/codex-oss-lens |
| Package version | Current public package | `codex-oss-lens@1.6.1` |
| Source CI | Required before submit | https://github.com/dbunk903/codex-oss-lens/actions/workflows/test.yml |
| Published-package smoke | Required after publish | https://github.com/dbunk903/codex-oss-lens/actions/workflows/published-smoke.yml |

## Verification chain

Run these gates before relying on the public release evidence:

```bash
npm run submission:check
npm run release:provenance
npm run publish:samples
npm run publish:docs
npm run public:redaction
npm run evidence:links
npm run pack:smoke
```

`submission:check` is the umbrella local gate. `release:provenance` keeps this page, the application
status snapshot, README, final checklist, publishing docs, publish checklist, and CI workflow aligned
with the current release evidence.

## Source vs published package

The current public package is `codex-oss-lens@1.6.1`. Source changes made after that release must be
published as a later version before the application claims they are available from
`npm exec --package codex-oss-lens@latest`.

`examples/publish-check.sample.md` records the current publish blocker: a package owner must log in
to npm and bump the version before a new public package can be published. `examples/install-smoke.sample.md`
records whether npm latest installs and runs from a clean command.

## Privacy boundary

Release evidence must stay public-safe. No local Codex logs, raw prompts, full filesystem paths,
secrets, private source, or private terminal output should be included in release notes, public
issues, npm package contents, or application evidence. Run `npm run public:redaction` before sharing
new evidence.

