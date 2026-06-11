# Signed-Out Review Checklist

Use this checklist when a reviewer or account owner wants to confirm that the application evidence
works from a public, signed-out browser session.

## Public Browser Checks

| Check | Public evidence | Expected result |
| --- | --- | --- |
| Repository opens | https://github.com/dbunk903/codex-oss-lens | Repository, README, license, support, security, and issue templates are visible. |
| Release opens | https://github.com/dbunk903/codex-oss-lens/releases/tag/v1.6.1 | The current release tag matches `package.json`. |
| npm package opens | https://www.npmjs.com/package/codex-oss-lens | The public package page shows `codex-oss-lens@1.6.1` or newer. |
| Reviewer docs open | `docs/application-status.md`, `docs/reviewer-quickstart.md`, and `docs/final-submission-checklist.md` | Reviewer evidence, manual gates, and submit-time checks are readable without private context. |
| Preview images open | `examples/dashboard-preview.png` and `examples/dashboard-mobile-preview.png` | Desktop and mobile dashboard previews render at the documented sizes. |
| CI workflows open | Node tests and published smoke workflows | Latest relevant runs are visible from GitHub Actions. |

## Local Cross-Checks

Run these commands from a clean checkout before final submission:

```bash
npm run reviewer:signedout
npm run evidence:links
npm run submission:check
```

`evidence:links` checks stable public endpoints and public preview PNG dimensions. `submission:check`
then confirms the same public evidence is still wired into docs, samples, CI, tests, and package
smoke.

## Boundaries

- Signed-out review proves public reachability, not account ownership or OpenAI form eligibility.
- Personal fields, OpenAI organization ID, terms review, and final Submit remain account-owner-only.
- Private Codex logs, prompts, source snippets, full local paths, terminal output, and secrets must
  not be pasted into public issues, screenshots, or application notes.

## Drift Checks

Run:

```bash
npm run reviewer:signedout
npm run submission:check
```

`reviewer:signedout` verifies this checklist is linked from application status, reviewer quickstart,
final checklist, README, public evidence, dashboard evidence, CI, and publishing docs.
