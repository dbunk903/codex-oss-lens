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
| Privacy posture | Ready | `npm run public:redaction` scans public docs, samples, package metadata, license/support/conduct docs, and GitHub templates/workflows for local paths, raw-log markers, and likely secrets. |
| Form copy | Ready | `application/final-copy.md` contains the paste-ready Korean answers and is checked by `npm run final-copy:check`. |
| Form answers | Ready | `npm run form-answers:check` checks `application/form-answers.md` against final copy, 500-character limits, manual fields, and the canonical reviewer link map. |
| Form draft sample | Ready | `examples/form-draft.sample.md` includes the full reviewer link map without placeholders. |
| Form draft links | Ready | `npm run form-draft:sample` checks that the public form draft sample includes every reviewer evidence link and manual submit field. |
| npm latest registry | Ready | `npm run npm:latest` checks the live npm registry dist-tag and confirms `codex-oss-lens@latest` matches `package.json`. |
| Latest CI runs | Ready | `npm run ci:latest` checks the latest completed Node tests and published smoke workflow runs are green. |
| Public evidence sample | Ready | `examples/public-evidence.sample.md` is checked by `npm run evidence:sample` against the canonical reviewer link map. |
| Application evidence matrix | Ready | `npm run application:evidence` checks reviewer questions against public evidence, local gates, and known boundaries. |
| Application review FAQ | Ready | `npm run reviewer:faq` checks likely reviewer questions against public proof, privacy boundaries, manual gates, and API-credit intent. |
| Submission risk register | Ready | `npm run submission:risk` checks known submission risks, mitigations, and submit-time stop conditions. |
| Submission decision summary | Ready | `npm run submission:decision` checks submit-time Go/Stop conditions and manual account-owner decision boundaries. |
| Submission activity log | Ready | `npm run submission:activity` checks recent public readiness work, reviewer value, and local gate links. |
| Reviewer quickstart | Ready | `docs/reviewer-quickstart.md` is checked by `npm run reviewer:quickstart` against the canonical reviewer link map. |
| Signed-out review | Ready | `npm run reviewer:signedout` checks public browser review steps, public link expectations, and manual-account boundaries. |
| Submitter handoff | Ready | `docs/submitter-handoff.md` is checked by `npm run submitter:handoff` against paste-ready inputs, account-owner-only fields, do-not-paste guards, dashboard evidence, and CI workflow. |
| Publish samples | Ready | `npm run publish:samples` checks publish-check and install-smoke samples against the current package version. |
| Publishing docs | Ready | `npm run publish:docs` checks npm publishing docs and the publish checklist against the current package and release gates. |
| Dashboard readiness | Ready | `npm run dashboard:readiness` checks the public dashboard evidence panel against reviewer links, privacy threat-model evidence, and submit gates. |
| CI readiness | Ready | `npm run ci:readiness` checks that GitHub Actions keeps the Node 20/22 matrix, package smoke, public evidence, and submission evidence gates wired. |
| Contribution readiness | Ready | `npm run contrib:readiness` checks CONTRIBUTING, the bug report template, and the PR template for validation and privacy guidance. |
| Security readiness | Ready | `npm run security:readiness` checks SECURITY.md and issue templates for vulnerability reporting and sensitive-data guidance. |
| Support readiness | Ready | `npm run support:readiness` checks SUPPORT.md, the support question template, issue templates, README, and package contents for public support guidance. |
| Conduct readiness | Ready | `npm run conduct:readiness` checks CODE_OF_CONDUCT.md, SUPPORT.md, CONTRIBUTING.md, README, and package contents for community guidance. |
| License readiness | Ready | `npm run license:readiness` checks MIT license text, package metadata, README license link, and package contents. |
| Issue routing readiness | Ready | `npm run issue-routing:readiness` checks the GitHub issue chooser, support question route, support links, security links, conduct links, and template privacy warnings. |
| Release provenance | Ready | `npm run release:provenance` checks the release provenance page, status snapshot, README, checklist, publishing docs, publish checklist, and CI workflow. |
| Adoption readiness | Ready | `npm run adoption:readiness` checks the adoption plan, reviewer quickstart, README, final checklist, status snapshot, and CI workflow. |
| Adoption snapshot | Ready | `npm run adoption:snapshot` checks current public signals, claims-not-made boundaries, privacy-safe validation loops, public evidence, dashboard evidence, form drafts, and CI workflow. |
| Maintenance readiness | Ready | `npm run maintenance:readiness` checks the maintenance policy, triage cadence, release gates, reviewer quickstart, README, checklist, publishing docs, and CI workflow. |
| Maintainer handoff | Ready | `npm run maintainer:handoff` checks continuity notes, release handoff, privacy guards, reviewer links, dashboard evidence, publishing docs, and CI workflow. |
| Scope and limitations | Ready | `npm run scope:limitations` checks public scope, non-goals, manual gates, source-vs-published boundaries, reviewer links, dashboard evidence, publishing docs, and CI workflow. |
| Privacy threat model | Ready | `npm run privacy:threat-model` checks protected inputs, shareable outputs, API opt-in boundaries, reviewer entry points, security policy, and CI workflow. |
| Accessibility readiness | Ready | `npm run accessibility:readiness` checks keyboard navigation, dashboard landmarks, labelled reviewer evidence links, viewport support, reviewer docs, and CI workflow. |
| Data retention | Ready | `npm run data:retention` checks generated artifact storage, deletion guidance, package allowlist boundaries, reviewer links, dashboard evidence, and CI workflow. |
| Demo walkthrough | Ready | `npm run demo:walkthrough` checks npm latest demo instructions, dashboard demo expectations, reviewer links, README guidance, and CI workflow. |
| Submission rehearsal | Ready | `npm run submission:rehearsal` checks final dry-run commands, manual account-owner fields, abort conditions, reviewer links, dashboard evidence, and CI workflow. |
| Visual previews | Ready | Desktop `1440x1200` and mobile `500x1100` dashboard PNGs are checked by `npm run dashboard:readiness`. |
| Public link health | Ready | `npm run evidence:links` checks reviewer links through stable public endpoints, retries transient network failures, and validates public preview PNG dimensions. |
| README badges | Ready | `npm run readme:badges` checks release, npm, CI, license, node, and privacy badges, and retries transient badge fetch failures. |
| README readiness | Ready | `npm run readme:readiness` checks that README submission guidance stays aligned with public reviewer evidence. |
| Account-owner fields | Manual | Last name, First name, Email registered to the ChatGPT account, GitHub username, OpenAI organization ID, and Terms review and final submit stay with the account owner. |

## Reviewer links

- Repository: https://github.com/dbunk903/codex-oss-lens
- Latest release: https://github.com/dbunk903/codex-oss-lens/releases/tag/v1.6.1
- npm package: https://www.npmjs.com/package/codex-oss-lens
- Roadmap: https://github.com/dbunk903/codex-oss-lens/blob/main/ROADMAP.md
- Application status: https://github.com/dbunk903/codex-oss-lens/blob/main/docs/application-status.md
- Application evidence matrix: https://github.com/dbunk903/codex-oss-lens/blob/main/docs/application-evidence-matrix.md
- Application review FAQ: https://github.com/dbunk903/codex-oss-lens/blob/main/docs/application-review-faq.md
- Submission risk register: https://github.com/dbunk903/codex-oss-lens/blob/main/docs/submission-risk-register.md
- Submission decision summary: https://github.com/dbunk903/codex-oss-lens/blob/main/docs/submission-decision-summary.md
- Submission activity log: https://github.com/dbunk903/codex-oss-lens/blob/main/docs/submission-activity-log.md
- Reviewer quickstart: https://github.com/dbunk903/codex-oss-lens/blob/main/docs/reviewer-quickstart.md
- Signed-out review: https://github.com/dbunk903/codex-oss-lens/blob/main/docs/signed-out-review.md
- Submitter handoff: https://github.com/dbunk903/codex-oss-lens/blob/main/docs/submitter-handoff.md
- Release provenance: https://github.com/dbunk903/codex-oss-lens/blob/main/docs/release-provenance.md
- Adoption plan: https://github.com/dbunk903/codex-oss-lens/blob/main/docs/adoption-plan.md
- Adoption snapshot: https://github.com/dbunk903/codex-oss-lens/blob/main/docs/adoption-snapshot.md
- Maintenance policy: https://github.com/dbunk903/codex-oss-lens/blob/main/docs/maintenance-policy.md
- Support policy: https://github.com/dbunk903/codex-oss-lens/blob/main/SUPPORT.md
- Maintainer handoff: https://github.com/dbunk903/codex-oss-lens/blob/main/docs/maintainer-handoff.md
- Scope and limitations: https://github.com/dbunk903/codex-oss-lens/blob/main/docs/scope-and-limitations.md
- Privacy threat model: https://github.com/dbunk903/codex-oss-lens/blob/main/docs/privacy-threat-model.md
- Accessibility notes: https://github.com/dbunk903/codex-oss-lens/blob/main/docs/accessibility.md
- Data retention: https://github.com/dbunk903/codex-oss-lens/blob/main/docs/data-retention.md
- Demo walkthrough: https://github.com/dbunk903/codex-oss-lens/blob/main/docs/demo-walkthrough.md
- API-credit workflow: https://github.com/dbunk903/codex-oss-lens/blob/main/docs/api-credit-workflow.md
- Maintainer use cases: https://github.com/dbunk903/codex-oss-lens/blob/main/docs/maintainer-use-cases.md
- Final checklist: https://github.com/dbunk903/codex-oss-lens/blob/main/docs/final-submission-checklist.md
- Submission rehearsal: https://github.com/dbunk903/codex-oss-lens/blob/main/docs/submission-rehearsal.md
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

That gate validates final copy, form answers, release-version drift, npm latest registry state, latest CI runs, public redaction, public evidence sample
freshness, public links, public preview PNG dimensions, README badges, unit tests, package dry-run,
and packaged CLI smoke.

The status page itself is checked by:

```bash
npm run application:status
```

The application evidence matrix is checked by:

```bash
npm run application:evidence
```

The application review FAQ is checked by:

```bash
npm run reviewer:faq
```

The submission risk register is checked by:

```bash
npm run submission:risk
```

The submission decision summary is checked by:

```bash
npm run submission:decision
```

The submission activity log is checked by:

```bash
npm run submission:activity
```

The reviewer quickstart is checked by:

```bash
npm run reviewer:quickstart
```

The signed-out review checklist is checked by:

```bash
npm run reviewer:signedout
```

The submitter handoff is checked by:

```bash
npm run submitter:handoff
```

The public form draft sample is checked by:

```bash
npm run form-draft:sample
```

Publish and install smoke samples are checked by:

```bash
npm run publish:samples
npm run npm:latest
npm run ci:latest
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

License metadata and package readiness is checked by:

```bash
npm run license:readiness
```

GitHub issue chooser routing is checked by:

```bash
npm run issue-routing:readiness
```

Release provenance guidance is checked by:

```bash
npm run release:provenance
```

Adoption planning guidance is checked by:

```bash
npm run adoption:readiness
```

Adoption signal boundaries are checked by:

```bash
npm run adoption:snapshot
```

Maintenance policy guidance is checked by:

```bash
npm run maintenance:readiness
```

Maintainer handoff guidance is checked by:

```bash
npm run maintainer:handoff
```

Scope and limitations guidance is checked by:

```bash
npm run scope:limitations
```

Privacy threat-model guidance is checked by:

```bash
npm run privacy:threat-model
```

Accessibility guidance is checked by:

```bash
npm run accessibility:readiness
```

Data retention guidance is checked by:

```bash
npm run data:retention
```

Demo walkthrough guidance is checked by:

```bash
npm run demo:walkthrough
```

Submission rehearsal guidance is checked by:

```bash
npm run submission:rehearsal
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
