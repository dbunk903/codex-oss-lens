# Adoption Snapshot

Use this page when a reviewer wants a factual current adoption signal without inflated claims. Codex
OSS Lens is a young project, so this snapshot separates public evidence that exists today from
validation goals that still need outside users.

## Current Signals

| Signal | Current state | Public evidence |
| --- | --- | --- |
| Public source | Repository is public and has issue templates, support, security, conduct, and license files. | https://github.com/dbunk903/codex-oss-lens |
| Published package | npm latest is published as `codex-oss-lens@1.6.1`. | https://www.npmjs.com/package/codex-oss-lens |
| Release provenance | Current GitHub release is documented and tied to package/CI evidence. | https://github.com/dbunk903/codex-oss-lens/releases/tag/v1.6.1 |
| Public CI | Source test matrix and package smoke run in GitHub Actions. | https://github.com/dbunk903/codex-oss-lens/actions/workflows/test.yml |
| Published smoke | Scheduled/manual workflow verifies the npm latest package can install and run. | https://github.com/dbunk903/codex-oss-lens/actions/workflows/published-smoke.yml |
| Reviewer path | Quickstart, signed-out review, and demo walkthrough let a reviewer inspect without private logs. | `docs/reviewer-quickstart.md`, `docs/signed-out-review.md`, `docs/demo-walkthrough.md` |
| Feedback routing | Public templates route bugs, support, and security reports away from raw logs and secrets. | `.github/ISSUE_TEMPLATE/`, `SUPPORT.md`, `SECURITY.md` |

## Claims Not Made

- No mature adoption, download, star, or production-user claim is made.
- No external maintainer endorsement is claimed.
- No telemetry, remote usage tracking, or private Codex content collection is used as an adoption
  signal.
- No private issue, support email, raw prompt, terminal transcript, or source snippet is treated as
  public proof.

## Next Validation Loop

1. Keep `npm exec --yes --package codex-oss-lens@latest -- codex-oss-lens demo` working.
2. Ask early users to validate the demo, submission-pack workflow, and API-credit plan with
   sanitized feedback only.
3. Convert recurring feedback into public issues or roadmap items without asking for raw Codex logs,
   prompts, full paths, secrets, or private source.
4. Before citing a new adoption signal, verify it is public, signed-out accessible, and safe to
   reference from the support application.

## Local Gate

Run:

```bash
npm run adoption:snapshot
npm run submission:check
```

`adoption:snapshot` verifies this snapshot is linked from the adoption plan, application status,
reviewer quickstart, final checklist, README, public evidence, dashboard evidence, CI, and form
draft samples.
