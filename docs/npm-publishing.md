# npm Publishing

Codex OSS Lens is prepared for npm publishing, but publishing should be done manually by the
package owner after reviewing the tarball.

## Package checks

```bash
npm test
npm run pack:check
npm run pack:smoke
node src/cli.js publish-check --markdown publish-check.md
```

`pack:smoke` creates a tarball, installs it in a temporary directory, runs the packaged
`codex-oss-lens` binary, verifies that demo output is valid JSON, and checks that packaged
`brief --demo` can generate a maintainer evidence pack.

## Expected package contents

The package allowlist includes:

- `src/`
- `public/`
- `docs/`
- sample JSON/Markdown artifacts from `examples/`
- `examples/dashboard-preview.png`
- `README.md`, `LICENSE`, `CHANGELOG.md`, and `package.json`

Generated local reports are excluded by `.gitignore` and not included in the package allowlist.

## Publish command

```bash
npm publish --access public --otp <6-digit-code>
```

If npm write 2FA is enabled, the publish step requires either the current one-time code or a
granular automation token with 2FA bypass enabled by the package owner.

After publishing, verify the public package:

```bash
node src/cli.js install-smoke --package codex-oss-lens --version latest --markdown install-smoke.md
npx codex-oss-lens serve --demo
```
