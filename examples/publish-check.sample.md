# Codex OSS Lens Publish Check

Generated: 2026-06-06T08:08:08.759Z
Status: ready
Package: codex-oss-lens@1.6.1
npm user: dansan0303

## Checks

- name: pass - name=codex-oss-lens
- version: pass - version=1.6.1
- license: pass - license=MIT
- repository: pass - repository=git+https://github.com/dbunk903/codex-oss-lens.git
- bin: pass - CLI bin path exists.
- npmLogin: pass - npm user=dansan0303
- versionAvailable: pass - latest=1.6.0

## Publish Commands

- `npm run submission:check`
- `npm publish --access public --otp <6-digit-code>`
- `node src/cli.js install-smoke --package codex-oss-lens --version 1.6.1 --markdown install-smoke.md`

## Warnings

- If npm 2FA is enabled for writes, publish requires --otp <6-digit-code> or a granular automation token with 2FA bypass.
- If versionAvailable fails, bump package.json before publishing; npm does not allow overwriting an existing version.
- Run the publish command only from the package owner's browser-authenticated npm session or a freshly scoped publish token.
