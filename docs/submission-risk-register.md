# Submission Risk Register

Use this register when a reviewer wants to see the known application risks, current mitigations,
and the local gates that keep those mitigations reviewable.

| Risk | Impact | Mitigation | Local gate |
| --- | --- | --- | --- |
| Young public project | Adoption signals are early and should not be overstated. | Public evidence focuses on installability, reproducibility, privacy posture, maintenance policy, and concrete Codex maintainer workflows. | `npm run reviewer:faq`, `npm run adoption:readiness` |
| Private Codex data exposure | Raw logs, prompts, paths, source snippets, terminal output, or secrets could be disclosed if examples drift. | Public samples stay aggregate-only or synthetic, public redaction scans docs/samples/package metadata/templates, and privacy/data-retention docs define protected inputs. | `npm run public:redaction`, `npm run privacy:threat-model`, `npm run data:retention` |
| Source-vs-published drift | GitHub docs may describe readiness checks that are newer than `codex-oss-lens@latest`. | Application status, review FAQ, install smoke sample, release provenance, live npm latest gate, latest CI gate, and npm publishing docs separate source-only evidence from published package behavior. | `npm run submission:versions`, `npm run npm:latest`, `npm run ci:latest`, `npm run release:provenance`, `npm run publish:samples` |
| Manual account-owner fields | Automation cannot safely fill personal fields, organization ID, terms review, or final Submit. | Final checklist and submission rehearsal keep manual fields explicit and abort submission if account-owner review is incomplete. | `npm run final-copy:check`, `npm run submission:rehearsal` |
| API-credit scope creep | Future API-backed features could accidentally send sensitive Codex context or exceed the reviewed use case. | API workflow and privacy threat model require dry-run, opt-in aggregate payloads with payload, destination, model, cost, and retention visible before sending. | `npm run privacy:threat-model`, `npm run scope:limitations` |
| Evidence link rot | Reviewer-facing links could break after releases, branch moves, or sample regeneration. | Public evidence links are generated from a canonical link map, checked through stable endpoints, and exercised in README/dashboard/status/checklist gates. | `npm run evidence:sample`, `npm run evidence:links`, `npm run readme:readiness` |

## Submit-Time Decision

Do not submit if any local gate above fails, if `npm run ci:latest` reports red public CI, if
`npm run npm:latest` shows npm latest no longer matches the claimed release, or if the account owner
has not reviewed the OpenAI organization ID and terms in the submitting browser session.

## Drift Checks

Run:

```bash
npm run submission:risk
npm run submission:check
```

`submission:risk` verifies this register is linked from application status, reviewer quickstart,
final checklist, README, public evidence, dashboard evidence, CI, and publishing docs.
