# npm Publishing

Codex OSS Lens is prepared for npm publishing, but publishing should be done manually by the
package owner after reviewing the tarball.

## Package checks

```bash
npm run submission:check
node src/cli.js publish-check --markdown publish-check.md
```

`submission:check` runs the form-copy, version-alignment, application-status, public-redaction,
public evidence sample, public-link, badge, README readiness, unit-test, tarball dry-run, and
packaged CLI smoke gates. It also runs the reviewer quickstart and publish sample checks:

```bash
npm run reviewer:quickstart
npm run publish:samples
npm run readme:readiness
```

`pack:smoke` creates a tarball, installs it in a temporary directory, runs the packaged
`codex-oss-lens` binary, verifies that demo output is valid JSON and share-safe, and checks that
packaged `brief --demo` can generate a maintainer evidence pack.

## Expected package contents

The package allowlist includes:

- `src/`
- `public/`
- `application/`
- `docs/`
- sample JSON/Markdown artifacts from `examples/`
- `examples/dashboard-preview.png`
- `README.md`, `LICENSE`, `CHANGELOG.md`, `CONTRIBUTING.md`, `ROADMAP.md`, `SECURITY.md`, and
  `package.json`

Generated local reports are excluded by `.gitignore` and not included in the package allowlist.

## Publish command

```bash
npm publish --access public --otp <6-digit-code>
```

If npm write 2FA is enabled, the publish step requires either the current one-time code or a
granular automation token with 2FA bypass enabled by the package owner.
If `publish-check` reports `versionAvailable: fail`, bump `package.json` first; npm does not allow
overwriting an already-published version.

After publishing, verify the public package:

```bash
node src/cli.js install-smoke --package codex-oss-lens --version latest --markdown install-smoke.md
npx codex-oss-lens serve --demo
```

Regenerate `examples/publish-check.sample.*` and `examples/install-smoke.sample.*`, then run:

```bash
npm run publish:docs
npm run publish:samples
```
