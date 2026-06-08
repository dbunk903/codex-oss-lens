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
- Application draft links point at the current public release, npm package, roadmap, and API-credit workflow.
- `submission:check`, `publish:samples`, and `readme:readiness` keep the public application, publish,
  and README guidance aligned before the account owner submits the form.
