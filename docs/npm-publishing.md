# npm Publishing

Codex OSS Lens is prepared for npm publishing, but publishing should be done manually by the
package owner after reviewing the tarball.

## Package checks

```bash
npm test
npm run pack:check
npm run pack:smoke
```

`pack:smoke` creates a tarball, installs it in a temporary directory, runs the packaged
`codex-oss-lens` binary, and verifies that demo output is valid JSON.

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
npm publish --access public
```

After publishing, update README examples to use:

```bash
npx codex-oss-lens serve --demo
```
