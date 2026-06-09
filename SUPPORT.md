# Support

Codex OSS Lens is maintained as a public, local-first OSS maintainer tool. Use public GitHub issues
for support when the report can be written without sensitive Codex session details.

## Where to ask

- Bug reports: open a bug issue for incorrect parsing, CLI behavior, dashboard rendering, or
  generated evidence.
- Feature requests: open a feature issue for new maintainer workflows, metrics, or export formats.
- Integration requests: open an integration issue for Git, GitHub, Codex, reporting, or dashboard
  workflow connections.
- Security reports: follow `SECURITY.md` when a report requires vulnerability or sensitive-data
  handling.
- Code of Conduct concerns: follow `CODE_OF_CONDUCT.md`; use `SECURITY.md` first if the concern
  includes sensitive privacy or security details.

The GitHub issue chooser links to SUPPORT.md, SECURITY.md, and CODE_OF_CONDUCT.md directly, and
blank public issues are disabled so privacy-sensitive reports start from the right route.

## What to include

- Codex OSS Lens version.
- Node.js version and operating system.
- The command that failed, with private paths redacted.
- A minimal share-safe sample, or a generated artifact that passes `npm run public:redaction`.
- Whether `npm run submission:check` passes locally when the issue affects public evidence,
  publishing guidance, or submission materials.

## What not to include

Do not paste raw Codex logs, private prompts, source code from private repositories, full local filesystem paths, tokens, credentials, or other secrets into public issues.

For privacy-sensitive support, describe the failure at a high level first and ask for a private
contact path before sharing details.
