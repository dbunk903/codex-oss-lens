# Codex OSS Lens Publish Check

Generated: 2026-06-06T06:16:48.091Z
Status: ready
Package: codex-oss-lens@1.6.0
npm user: dansan0303

## Checks

- name: pass - name=codex-oss-lens
- version: pass - version=1.6.0
- license: pass - license=MIT
- repository: pass - repository=git+https://github.com/dbunk903/codex-oss-lens.git
- bin: pass - CLI bin path exists.
- npmLogin: pass - npm user=dansan0303
- versionAvailable: pass - not published

## Publish Commands

- `npm test`
- `npm run pack:check`
- `npm run pack:smoke`
- `npm publish --access public --otp <6-digit-code>`
- `npx -y codex-oss-lens@1.6.0 demo`

## Warnings

- If npm 2FA is enabled for writes, publish requires --otp <6-digit-code> or a granular automation token with 2FA bypass.
