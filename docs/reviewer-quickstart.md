# Reviewer Quickstart

Use this page when you want a fast, public-only review of Codex OSS Lens before reading the full
submission pack.

## Five-minute checks

1. Open the repository: https://github.com/dbunk903/codex-oss-lens
2. Confirm the current release: https://github.com/dbunk903/codex-oss-lens/releases/tag/v1.6.1
3. Confirm the npm package: https://www.npmjs.com/package/codex-oss-lens
4. Run the published CLI demo:

```bash
npm exec --yes --package codex-oss-lens@latest -- codex-oss-lens demo
```

5. Inspect the privacy and API-credit plan:
   https://github.com/dbunk903/codex-oss-lens/blob/main/docs/api-credit-workflow.md

## What To Look For

- The project is local-first: raw Codex logs, prompts, source code, and full paths are not uploaded.
- The public package is dependency-free, ships the static dashboard, and includes application
  evidence docs in the tarball.
- The Node CI workflow runs tests, package dry-run checks, packaged CLI smoke, public evidence
  generation, final-copy validation, version alignment, and public link checks.
- The published smoke workflow verifies `codex-oss-lens@latest` directly from npm.

## Submit-Time Evidence

- Final checklist: https://github.com/dbunk903/codex-oss-lens/blob/main/docs/final-submission-checklist.md
- Final Korean form copy: https://github.com/dbunk903/codex-oss-lens/blob/main/application/final-copy.md
- Maintainer use cases: https://github.com/dbunk903/codex-oss-lens/blob/main/docs/maintainer-use-cases.md
- Public evidence sample: https://github.com/dbunk903/codex-oss-lens/blob/main/examples/public-evidence.sample.md
