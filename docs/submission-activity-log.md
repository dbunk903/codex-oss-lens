# Submission Activity Log

Use this log when a reviewer wants to see recent public maintenance work without reading every
commit. It summarizes application-readiness improvements that are already backed by local gates,
public links, and GitHub Actions.

## Recent Readiness Work

| Commit | Public improvement | Reviewer value | Local gate |
| --- | --- | --- | --- |
| `1d2a6d0` | Privacy-safe support evidence | Maps support routing into reviewer questions, public proof, and redaction gates. | `npm run application:evidence`, `npm run reviewer:faq` |
| `cda9c50` | Support policy public evidence | Adds SUPPORT.md to canonical public evidence, form draft samples, and final application copy. | `npm run evidence:sample`, `npm run form-draft:sample` |
| `0cd2773` | Support route on dashboard | Shows support readiness and issue-routing gates in the reviewer-facing dashboard. | `npm run dashboard:readiness` |
| `b1c70a3` | Support route in adoption evidence | Records privacy-safe feedback routing in adoption evidence without claiming mature adoption. | `npm run adoption:readiness`, `npm run adoption:snapshot` |
| `87bc98e` | Privacy-safe support question route | Adds a structured support question template and issue chooser guidance. | `npm run support:readiness`, `npm run issue-routing:readiness` |

## Review Signal

- The project is still young, so this log is evidence of active readiness work, not a claim of
  mature adoption.
- Each listed change is tied to a public document and a local gate that runs in `npm run
  submission:check`.
- The latest public package remains `codex-oss-lens@1.6.1`; source-only readiness work needs a
  later npm publish before it is claimed as published package behavior.

## Drift Checks

Run:

```bash
npm run submission:activity
npm run submission:check
```

`submission:activity` verifies this log is linked from application status, reviewer quickstart,
final checklist, README, public evidence, dashboard evidence, CI, and publishing docs.
