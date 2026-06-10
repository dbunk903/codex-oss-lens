# Application Evidence Matrix

Use this matrix when a reviewer wants a single crosswalk from common OSS support application
questions to public evidence, local gates, and known boundaries.

| Reviewer question | Public evidence | Local gate |
| --- | --- | --- |
| Is the project public and installable? | Repository, `v1.6.1` release, npm package, Node CI, published smoke CI | `npm run submission:versions`, `npm run publish:samples`, `npm run ci:readiness` |
| Is the tool relevant to Codex users? | README, application review FAQ, maintainer use cases, API-credit workflow, demo walkthrough | `npm run reviewer:faq`, `npm run reviewer:quickstart`, `npm run demo:walkthrough` |
| Is private Codex data protected? | Privacy threat model, data retention, public redaction policy, security policy | `npm run privacy:threat-model`, `npm run data:retention`, `npm run public:redaction` |
| Can reviewers reproduce the evidence? | Reviewer quickstart, dashboard previews, public evidence sample, form draft sample | `npm run dashboard:readiness`, `npm run evidence:sample`, `npm run form-draft:sample` |
| Is the project maintainable after submission? | Maintenance policy, maintainer handoff, adoption plan, support policy, issue routing | `npm run maintenance:readiness`, `npm run maintainer:handoff`, `npm run adoption:readiness` |
| Are limits and manual gates clear? | Scope and limitations, submission risk register, submission decision summary, submission rehearsal, final checklist, application status | `npm run scope:limitations`, `npm run submission:risk`, `npm run submission:decision`, `npm run submission:rehearsal`, `npm run application:status` |

## Readiness Boundaries

- Public evidence is intentionally aggregate-only and synthetic where needed; it does not expose raw
  Codex logs, prompts, source files, full paths, terminal output, or secrets.
- `codex-oss-lens@latest` remains the public install target; source-only improvements need a later
  npm publish before they are claimed as published behavior.
- The account owner still fills personal fields, organization ID, terms review, and the final Submit
  action manually.
- API-backed features remain dry-run and opt-in until a future implementation shows payload,
  destination, model, cost, and retention before sending.

## Drift Checks

Run:

```bash
npm run application:evidence
npm run submission:check
```

`application:evidence` verifies this page is linked from application status, reviewer quickstart,
final checklist, README, public evidence, dashboard evidence, CI, and publishing docs.
