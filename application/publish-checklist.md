# Publish Checklist

1. Create a public GitHub repository named `codex-oss-lens`. Done: https://github.com/dbunk903/codex-oss-lens
2. Push this workspace to the repository. Done.
3. Add a short repository description: `Local-first usage dashboard for OpenAI Codex session logs.` Done.
4. Add topics: `openai`, `codex`, `usage-dashboard`, `oss-maintenance`, `jsonl`. Done.
5. Create an initial release `v0.1.0`. Done. Follow-up releases through `v0.4.0` also published.
6. Open 3 starter issues. Done. Issues #1 through #7 were implemented and closed.
   - Add redaction controls for workspace paths
   - Add weekly maintainer report export
   - Connect GitHub PR/issue outcomes to Codex sessions
7. Fill the OpenAI form with the answers in `application/form-answers.md`.
8. Stop before pressing Submit unless the account owner has reviewed the terms and personal fields.

## Deferred

- GitHub Actions workflow requires a GitHub token with `workflow` scope. Add the Node test workflow
  after reauthenticating `gh` with that scope.
