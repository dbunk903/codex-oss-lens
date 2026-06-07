# Codex OSS Lens Published Install Smoke

Generated: 2026-06-07T23:46:44.293Z
Status: fail
Command: `npm exec --yes --package codex-oss-lens@latest -- codex-oss-lens demo`

## Checks

- registryVersion: pass - published=1.6.1
- commandExit: pass - npm exec completed.
- jsonOutput: pass - CLI emitted JSON.
- demoSessions: pass - sessions=4
- demoPrivacy: fail - leak rules=unix-full-path
