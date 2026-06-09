# Adoption Plan

Codex OSS Lens is a young public OSS project, so the application should be clear about how public
use will be developed after the first stable package and evidence set.

## Current public baseline

| Signal | Status | Evidence |
| --- | --- | --- |
| Repository | Public | https://github.com/dbunk903/codex-oss-lens |
| Release | Published | https://github.com/dbunk903/codex-oss-lens/releases/tag/v1.6.1 |
| npm package | Published | https://www.npmjs.com/package/codex-oss-lens |
| CI | Public | https://github.com/dbunk903/codex-oss-lens/actions/workflows/test.yml |
| Published smoke | Public | https://github.com/dbunk903/codex-oss-lens/actions/workflows/published-smoke.yml |
| Support routes | Public | SUPPORT.md, SECURITY.md, CODE_OF_CONDUCT.md, and the GitHub issue chooser |

## 30-day adoption loop

1. Keep `npm latest` install smoke green so a new reviewer or maintainer can try the tool without
   cloning the repository.
2. Use `docs/reviewer-quickstart.md` as the first public review path and keep it linked from README,
   the final checklist, and the application status page.
3. Seed use through privacy-first maintainer workflows: weekly review, submission-pack generation,
   API-credit planning, and release provenance review.
4. Route feedback through typed GitHub issue templates instead of blank issues, so users do not post
   raw Codex logs, prompts, full filesystem paths, secrets, or private source.
5. Convert recurring feedback into small roadmap issues under `ROADMAP.md`, then verify new public
   evidence through `npm run submission:check`.

## Starter validation targets

- One external maintainer can run `npm exec --yes --package codex-oss-lens@latest -- codex-oss-lens demo`.
- One external maintainer can generate a local `submission-pack` without sharing private logs.
- One issue or discussion can validate whether the API-credit plan matches a real maintainer workflow.
- One release can publish a user-facing improvement after passing public redaction and package smoke gates.

## Privacy boundary

Adoption evidence should measure public use and workflow fit, not collect private Codex content.
No local Codex logs, raw prompts, full paths, secrets, private source, or private terminal output
should be requested in public issues, release notes, or application evidence.

