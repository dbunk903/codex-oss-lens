# Application Status

Use this page as the public status snapshot before submitting Codex OSS Lens to the OpenAI Codex
open-source support form.

## Current snapshot

| Area | Status | Evidence |
| --- | --- | --- |
| Public repository | Ready | https://github.com/dbunk903/codex-oss-lens |
| Latest release | Ready | https://github.com/dbunk903/codex-oss-lens/releases/tag/v1.6.1 |
| npm package | Ready | https://www.npmjs.com/package/codex-oss-lens |
| Source CI | Ready | https://github.com/dbunk903/codex-oss-lens/actions/workflows/test.yml |
| Published-package smoke | Ready | https://github.com/dbunk903/codex-oss-lens/actions/workflows/published-smoke.yml |
| Privacy posture | Ready | `npm run public:redaction` scans public docs and samples for local paths, raw-log markers, and likely secrets. |
| Form copy | Ready | `application/final-copy.md` contains the paste-ready Korean answers and is checked by `npm run final-copy:check`. |
| Account-owner fields | Manual | Name, ChatGPT email, OpenAI organization ID, terms review, and final submit stay with the account owner. |

## Submit-time gates

Run the one-command local gate before opening the form:

```bash
npm run submission:check
```

That gate validates final copy, release-version drift, public redaction, public links, README badges,
unit tests, package dry-run, and packaged CLI smoke.

## Version note

The current public package is `codex-oss-lens@1.6.1`. Source changes made after that release should
be published as a later version before claiming they are available from `npm exec --package
codex-oss-lens@latest`.
