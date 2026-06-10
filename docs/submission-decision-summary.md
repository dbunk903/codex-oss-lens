# Submission Decision Summary

Use this summary immediately before the account owner opens the OpenAI Codex OSS support form.
It compresses the public evidence set into a single Go/Stop decision.

## Go Conditions

| Condition | Evidence | Gate |
| --- | --- | --- |
| Public package is installable | GitHub release, npm package, install smoke sample, published smoke workflow | `npm run submission:versions`, `npm run publish:samples` |
| Reviewer evidence is reproducible | Application status, evidence matrix, review FAQ, risk register, reviewer quickstart, public evidence sample | `npm run application:status`, `npm run application:evidence`, `npm run reviewer:faq`, `npm run submission:risk`, `npm run evidence:sample` |
| Privacy boundaries are current | Privacy threat model, data retention policy, public redaction scan, scope limitations | `npm run privacy:threat-model`, `npm run data:retention`, `npm run public:redaction`, `npm run scope:limitations` |
| Maintainer continuity is credible | Adoption plan, maintenance policy, maintainer handoff, support and issue routing docs | `npm run adoption:readiness`, `npm run maintenance:readiness`, `npm run maintainer:handoff`, `npm run issue-routing:readiness` |
| Form copy is ready | Final Korean copy, form draft sample, final checklist, submission rehearsal | `npm run final-copy:check`, `npm run form-draft:sample`, `npm run submission:rehearsal` |

## Stop Conditions

- Any local gate in `npm run submission:check` fails.
- Any public evidence link fails in `npm run evidence:links`.
- The latest Node CI or published package smoke workflow is red.
- The npm latest package no longer matches the claimed public release.
- The account owner has not confirmed personal fields, OpenAI organization ID, terms review, and
  the final Submit action in the same browser session.
- A public artifact exposes raw Codex logs, prompts, full paths, terminal output, source snippets,
  tool arguments, or secrets.

## Decision

Current source evidence is ready for account-owner review when:

```bash
npm run submission:decision
npm run submission:check
```

The account owner still makes the final browser-session submission decision manually.

`submission:decision` verifies this summary is linked from application status, reviewer quickstart,
final checklist, README, public evidence, dashboard evidence, CI, and publishing docs.
