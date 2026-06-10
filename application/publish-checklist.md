# Publish Checklist

1. Create a public GitHub repository named `codex-oss-lens`. Done: https://github.com/dbunk903/codex-oss-lens
2. Push this workspace to the repository. Done.
3. Add a short repository description: `Local-first usage dashboard for OpenAI Codex session logs.` Done.
4. Add topics: `openai`, `codex`, `usage-dashboard`, `oss-maintenance`, `jsonl`. Done.
5. Create an initial release `v0.1.0`. Done. Follow-up releases through `v1.6.1` also published.
6. Open 3 starter issues. Done. Issues #1 through #27 were implemented and closed.
   - Add redaction controls for workspace paths
   - Add weekly maintainer report export
   - Connect GitHub PR/issue outcomes to Codex sessions
7. Fill the OpenAI form with the answers in `application/form-answers.md`.
8. Stop before pressing Submit unless the account owner has reviewed the terms and personal fields.

## Deferred

- npm publish completed for `codex-oss-lens@1.6.1`; published install smoke verifies the npm package from an isolated temporary directory.

## Final pre-submission polish

- Published npm usage is now visible at the top of the README.
- Scheduled/manual GitHub Actions smoke-check the npm `latest` package.
- Dashboard shows application evidence and submission gates in the first viewport after the KPIs.
- Maintainer use cases document weekly review, application evidence, API-credit planning, privacy review, and published package confidence.
- SUPPORT.md documents public support routing and sensitive-data boundaries.
- CODE_OF_CONDUCT.md documents respectful participation and conduct escalation boundaries.
- LICENSE and `package.json` both declare MIT licensing.
- The GitHub issue chooser disables blank issues and routes users to support, security, and conduct guidance.
- The release provenance page links the current GitHub release, npm package, source CI, published smoke CI, and privacy gates.
- The adoption plan documents the first 30 days of public validation without requesting private Codex content.
- The maintenance policy documents weekly triage, release gates, post-publish smoke checks, and privacy-maintenance boundaries.
- The maintainer handoff documents continuity, release handoff, privacy guards, and manual-submit boundaries.
- The scope and limitations page documents current capabilities, non-goals, manual gates, and source-vs-published boundaries.
- The privacy threat model documents protected inputs, shareable outputs, trust boundaries, and future API opt-in requirements.
- The accessibility notes document keyboard navigation, labelled reviewer links, viewport support, and screenshot review limits.
- The data retention policy documents generated artifact locations, deletion guidance, package allowlist boundaries, and public sharing rules.
- The demo walkthrough documents npm latest CLI and dashboard checks that use synthetic data instead of private Codex logs.
- The submission rehearsal documents final machine checks, manual account-owner fields, and abort conditions before pressing Submit.
- Application draft links point at the current public release, npm package, roadmap, and API-credit workflow.
- `submission:check`, `application:evidence`, `reviewer:faq`, `submission:risk`, `publish:samples`, `support:readiness`, `conduct:readiness`,
  `license:readiness`, `issue-routing:readiness`, `release:provenance`, `adoption:readiness`,
  `maintenance:readiness`, `maintainer:handoff`, `scope:limitations`, `privacy:threat-model`, `accessibility:readiness`, `data:retention`,
  `demo:walkthrough`, `submission:rehearsal`, and
  `readme:readiness` keep the public application, evidence matrix, review FAQ, risk register, publish, support, conduct, license, issue
  routing, release provenance, adoption, maintenance, handoff, limitations, accessibility, data retention, demo,
  submission rehearsal, and README guidance aligned before
  the account owner submits the form.
