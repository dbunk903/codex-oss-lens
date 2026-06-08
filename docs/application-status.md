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
| Privacy posture | Ready | `npm run public:redaction` scans public docs, samples, package metadata, support/conduct docs, and GitHub templates/workflows for local paths, raw-log markers, and likely secrets. |
| Form copy | Ready | `application/final-copy.md` contains the paste-ready Korean answers and is checked by `npm run final-copy:check`. |
| Form draft sample | Ready | `examples/form-draft.sample.md` includes the full reviewer link map without placeholders. |
| Form draft links | Ready | `npm run form-draft:sample` checks that the public form draft sample includes every reviewer evidence link and manual submit field. |
| Public evidence sample | Ready | `examples/public-evidence.sample.md` is checked by `npm run evidence:sample` against the canonical reviewer link map. |
| Reviewer quickstart | Ready | `docs/reviewer-quickstart.md` is checked by `npm run reviewer:quickstart` against the canonical reviewer link map. |
| Publish samples | Ready | `npm run publish:samples` checks publish-check and install-smoke samples against the current package version. |
| Publishing docs | Ready | `npm run publish:docs` checks npm publishing docs and the publish checklist against the current package and release gates. |
| Dashboard readiness | Ready | `npm run dashboard:readiness` checks the public dashboard evidence panel against reviewer links and submit gates. |
| CI readiness | Ready | `npm run ci:readiness` checks that GitHub Actions keeps the Node 20/22 matrix, package smoke, public evidence, and submission evidence gates wired. |
| Contribution readiness | Ready | `npm run contrib:readiness` checks CONTRIBUTING, the bug report template, and the PR template for validation and privacy guidance. |
| Security readiness | Ready | `npm run security:readiness` checks SECURITY.md and issue templates for vulnerability reporting and sensitive-data guidance. |
| Support readiness | Ready | `npm run support:readiness` checks SUPPORT.md, issue templates, README, and package contents for public support guidance. |
| Conduct readiness | Ready | `npm run conduct:readiness` checks CODE_OF_CONDUCT.md, SUPPORT.md, CONTRIBUTING.md, README, and package contents for community guidance. |
| Visual previews | Ready | Desktop `1440x1200` and mobile `500x1100` dashboard PNGs are checked by `npm run dashboard:readiness`. |
| Public link health | Ready | `npm run evidence:links` checks reviewer links through stable public endpoints and validates public preview PNG dimensions. |
| README badges | Ready | `npm run readme:badges` checks release, npm, CI, license, node, and privacy badges. |
| README readiness | Ready | `npm run readme:readiness` checks that README submission guidance stays aligned with public reviewer evidence. |
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
- Dashboard preview: https://github.com/dbunk903/codex-oss-lens/blob/main/examples/dashboard-preview.png
- Mobile dashboard preview: https://github.com/dbunk903/codex-oss-lens/blob/main/examples/dashboard-mobile-preview.png
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
freshness, public links, public preview PNG dimensions, README badges, unit tests, package dry-run,
and packaged CLI smoke.

The status page itself is checked by:

```bash
npm run application:status
```

The reviewer quickstart is checked by:

```bash
npm run reviewer:quickstart
```

The public form draft sample is checked by:

```bash
npm run form-draft:sample
```

Publish and install smoke samples are checked by:

```bash
npm run publish:samples
```

Publishing docs are checked by:

```bash
npm run publish:docs
```

Dashboard reviewer evidence is checked by:

```bash
npm run dashboard:readiness
```

That check also verifies the desktop and mobile dashboard preview PNG dimensions.

GitHub Actions readiness is checked by:

```bash
npm run ci:readiness
```

Contribution and PR template readiness is checked by:

```bash
npm run contrib:readiness
```

Security policy and issue template readiness is checked by:

```bash
npm run security:readiness
```

Public support guidance readiness is checked by:

```bash
npm run support:readiness
```

Community conduct guidance readiness is checked by:

```bash
npm run conduct:readiness
```

README submission guidance is checked by:

```bash
npm run readme:readiness
```

## Version note

The current public package is `codex-oss-lens@1.6.1`. Source changes made after that release should
be published as a later version before claiming they are available from `npm exec --package
codex-oss-lens@latest`. The current `examples/install-smoke.sample.md` is regenerated from npm
latest and intentionally records whether the published package passes the newer source-side privacy
smoke criteria. The current `examples/publish-check.sample.md` is blocked until a maintainer logs in
to npm and bumps the package version above `1.6.1`.
