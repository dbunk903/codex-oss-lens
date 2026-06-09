# Reviewer Quickstart

Use this page when you want a fast, public-only review of Codex OSS Lens before reading the full
submission pack.

## Five-minute checks

1. Open the repository: https://github.com/dbunk903/codex-oss-lens
2. Confirm the current release: https://github.com/dbunk903/codex-oss-lens/releases/tag/v1.6.1
3. Confirm the npm package: https://www.npmjs.com/package/codex-oss-lens
4. Check the application status snapshot:
   https://github.com/dbunk903/codex-oss-lens/blob/main/docs/application-status.md
5. Run the published CLI demo:

```bash
npm exec --yes --package codex-oss-lens@latest -- codex-oss-lens demo
```

6. Follow the demo walkthrough:
   https://github.com/dbunk903/codex-oss-lens/blob/main/docs/demo-walkthrough.md
7. Inspect the privacy and API-credit plan:
   https://github.com/dbunk903/codex-oss-lens/blob/main/docs/api-credit-workflow.md
8. Confirm the public roadmap and reviewer evidence:
   https://github.com/dbunk903/codex-oss-lens/blob/main/ROADMAP.md
   https://github.com/dbunk903/codex-oss-lens/blob/main/docs/final-submission-checklist.md
   https://github.com/dbunk903/codex-oss-lens/blob/main/docs/adoption-plan.md
   https://github.com/dbunk903/codex-oss-lens/blob/main/docs/maintenance-policy.md
   https://github.com/dbunk903/codex-oss-lens/blob/main/docs/maintainer-handoff.md
   https://github.com/dbunk903/codex-oss-lens/blob/main/docs/privacy-threat-model.md
   https://github.com/dbunk903/codex-oss-lens/blob/main/docs/data-retention.md
   https://github.com/dbunk903/codex-oss-lens/blob/main/docs/accessibility.md
   https://github.com/dbunk903/codex-oss-lens/blob/main/docs/submission-rehearsal.md
8. Confirm the latest public CI signals:
   https://github.com/dbunk903/codex-oss-lens/actions/workflows/test.yml
   https://github.com/dbunk903/codex-oss-lens/actions/workflows/published-smoke.yml

## What To Look For

- The project is local-first: raw Codex logs, prompts, source code, and full paths are not uploaded.
- The public package is dependency-free, ships the static dashboard, and includes application
  evidence docs in the tarball.
- The form draft sample shows the Korean application answers with repository, release, roadmap, and
  API-credit workflow links filled in.
- The install smoke sample shows the current npm latest result; if source privacy smoke is stricter
  than the published package, the application status page calls out that release gap.
- The publish check sample shows whether a later package release is currently blocked by npm login
  or version availability.
- The adoption plan explains how a young public OSS project will collect validation without asking
  users to disclose raw Codex logs, prompts, full paths, secrets, or private source.
- The maintenance policy explains weekly triage, release gates, post-publish smoke checks, and the
  boundary against telemetry or remote upload without explicit opt-in.
- The maintainer handoff explains continuity, release handoff, privacy guards, and manual submit
  boundaries for future maintainers.
- The privacy threat model names protected inputs, shareable outputs, trust boundaries, and the
  dry-run/opt-in requirements for future API-backed features.
- The data retention policy explains generated artifact locations, deletion expectations, and the
  boundary between private local reports and sanitized public samples.
- The accessibility notes document keyboard navigation, labelled reviewer evidence links, viewport
  expectations, and screenshot review limits.
- The dashboard preview images show the reviewer-facing UI at `1440x1200` desktop and `500x1100`
  mobile viewports; `npm run dashboard:readiness` checks those dimensions.
- The Node CI workflow runs tests, package dry-run checks, packaged CLI smoke, public evidence
  generation, final-copy validation, version alignment, public evidence sample freshness, and
  public link checks.
- The published smoke workflow verifies `codex-oss-lens@latest` directly from npm.
- The demo walkthrough gives expected npm latest CLI and dashboard signals without requiring
  private Codex logs.
- The submission rehearsal separates machine checks from account-owner-only fields and submit
  abort conditions.
- Public links should open in a signed-out browser; the application status page records the
  source-only, published-package, and account-owner gates separately.

## Submit-Time Evidence

- Reviewer quickstart: https://github.com/dbunk903/codex-oss-lens/blob/main/docs/reviewer-quickstart.md
- Roadmap: https://github.com/dbunk903/codex-oss-lens/blob/main/ROADMAP.md
- Release provenance: https://github.com/dbunk903/codex-oss-lens/blob/main/docs/release-provenance.md
- Adoption plan: https://github.com/dbunk903/codex-oss-lens/blob/main/docs/adoption-plan.md
- Maintenance policy: https://github.com/dbunk903/codex-oss-lens/blob/main/docs/maintenance-policy.md
- Maintainer handoff: https://github.com/dbunk903/codex-oss-lens/blob/main/docs/maintainer-handoff.md
- Privacy threat model: https://github.com/dbunk903/codex-oss-lens/blob/main/docs/privacy-threat-model.md
- Data retention: https://github.com/dbunk903/codex-oss-lens/blob/main/docs/data-retention.md
- Demo walkthrough: https://github.com/dbunk903/codex-oss-lens/blob/main/docs/demo-walkthrough.md
- Accessibility notes: https://github.com/dbunk903/codex-oss-lens/blob/main/docs/accessibility.md
- Final checklist: https://github.com/dbunk903/codex-oss-lens/blob/main/docs/final-submission-checklist.md
- Application status: https://github.com/dbunk903/codex-oss-lens/blob/main/docs/application-status.md
- Final Korean form copy: https://github.com/dbunk903/codex-oss-lens/blob/main/application/final-copy.md
- Form draft sample: https://github.com/dbunk903/codex-oss-lens/blob/main/examples/form-draft.sample.md
- Maintainer use cases: https://github.com/dbunk903/codex-oss-lens/blob/main/docs/maintainer-use-cases.md
- API-credit workflow: https://github.com/dbunk903/codex-oss-lens/blob/main/docs/api-credit-workflow.md
- Submission rehearsal: https://github.com/dbunk903/codex-oss-lens/blob/main/docs/submission-rehearsal.md
- Dashboard preview: https://github.com/dbunk903/codex-oss-lens/blob/main/examples/dashboard-preview.png
- Mobile dashboard preview: https://github.com/dbunk903/codex-oss-lens/blob/main/examples/dashboard-mobile-preview.png
- Publish check sample: https://github.com/dbunk903/codex-oss-lens/blob/main/examples/publish-check.sample.md
- Install smoke sample: https://github.com/dbunk903/codex-oss-lens/blob/main/examples/install-smoke.sample.md
- Public evidence sample: https://github.com/dbunk903/codex-oss-lens/blob/main/examples/public-evidence.sample.md
- Node CI: https://github.com/dbunk903/codex-oss-lens/actions/workflows/test.yml
- Published smoke CI: https://github.com/dbunk903/codex-oss-lens/actions/workflows/published-smoke.yml
