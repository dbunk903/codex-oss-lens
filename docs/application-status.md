# Application Status

Use this page as the public status snapshot before submitting Codex OSS Lens to the OpenAI Codex
open-source support form.

## Current snapshot

| Area | Status | Evidence |
| --- | --- | --- |
| Public repository | Ready | https://github.com/dbunk903/codex-oss-lens |
| Latest release | Ready | https://github.com/dbunk903/codex-oss-lens/releases/tag/v1.6.1 |
| npm package | Ready | https://www.npmjs.com/package/codex-oss-lens |
| Source CI | Ready | https://github.com/dbunk903/codex-oss-lens/actions/workflows/test.yml |
| Published-package smoke | Install-ready | https://github.com/dbunk903/codex-oss-lens/actions/workflows/published-smoke.yml verifies npm latest installs and runs; source privacy smoke improvements need the next publish. |
| Next publish gate | Blocked | `examples/publish-check.sample.md` shows npm login is required and `1.6.1` cannot be republished without a version bump. |
| Privacy posture | Ready | `npm run public:redaction` scans public docs and samples for local paths, raw-log markers, and likely secrets. |
| Form copy | Ready | `application/final-copy.md` contains the paste-ready Korean answers and is checked by `npm run final-copy:check`. |
| Form draft sample | Ready | `examples/form-draft.sample.md` includes the current release, roadmap, and API-credit workflow links without placeholders. |
| Public evidence sample | Ready | `examples/public-evidence.sample.md` is checked by `npm run evidence:sample` against the canonical reviewer link map. |
| Account-owner fields | Manual | Last name, First name, Email registered to the ChatGPT account, GitHub username, OpenAI organization ID, and Terms review and final submit stay with the account owner. |

## Reviewer links

- Repository: https://github.com/dbunk903/codex-oss-lens
- Latest release: https://github.com/dbunk903/codex-oss-lens/releases/tag/v1.6.1
- npm package: https://www.npmjs.com/package/codex-oss-lens
- Roadmap: https://github.com/dbunk903/codex-oss-lens/blob/main/ROADMAP.md
- Application status: https://github.com/dbunk903/codex-oss-lens/blob/main/docs/application-status.md
- Reviewer quickstart: https://github.com/dbunk903/codex-oss-lens/blob/main/docs/reviewer-quickstart.md
- API-credit workflow: https://github.com/dbunk903/codex-oss-lens/blob/main/docs/api-credit-workflow.md
- Maintainer use cases: https://github.com/dbunk903/codex-oss-lens/blob/main/docs/maintainer-use-cases.md
- Final checklist: https://github.com/dbunk903/codex-oss-lens/blob/main/docs/final-submission-checklist.md
- Final copy: https://github.com/dbunk903/codex-oss-lens/blob/main/application/final-copy.md
- Form draft sample: https://github.com/dbunk903/codex-oss-lens/blob/main/examples/form-draft.sample.md
- Public evidence sample: https://github.com/dbunk903/codex-oss-lens/blob/main/examples/public-evidence.sample.md
- Publish check sample: https://github.com/dbunk903/codex-oss-lens/blob/main/examples/publish-check.sample.md
- Install smoke sample: https://github.com/dbunk903/codex-oss-lens/blob/main/examples/install-smoke.sample.md
- Node CI: https://github.com/dbunk903/codex-oss-lens/actions/workflows/test.yml
- Published smoke CI: https://github.com/dbunk903/codex-oss-lens/actions/workflows/published-smoke.yml

## Submit-time gates

Run the one-command local gate before opening the form:

```bash
npm run submission:check
```

That gate validates final copy, release-version drift, public redaction, public evidence sample
freshness, public links, README badges, unit tests, package dry-run, and packaged CLI smoke.

The status page itself is checked by:

```bash
npm run application:status
```

## Version note

The current public package is `codex-oss-lens@1.6.1`. Source changes made after that release should
be published as a later version before claiming they are available from `npm exec --package
codex-oss-lens@latest`. The current `examples/install-smoke.sample.md` is regenerated from npm
latest and intentionally records whether the published package passes the newer source-side privacy
smoke criteria. The current `examples/publish-check.sample.md` is blocked until a maintainer logs in
to npm and bumps the package version above `1.6.1`.
