# Demo Walkthrough

Use this page when a reviewer or new maintainer wants to try Codex OSS Lens without local Codex
logs. The walkthrough uses only the published npm package and synthetic demo data.

## Published CLI Demo

Run:

```bash
npm exec --yes --package codex-oss-lens@latest -- codex-oss-lens demo
```

Expected reviewer signals:

- `totals.sessions` is greater than zero.
- Workspace names are demo-safe names, not local filesystem paths.
- No raw rollout JSONL, prompts, assistant messages, source code, secrets, or full local paths are
  printed.
- The package version is the current npm `latest` release, which is also tracked by
  `examples/install-smoke.sample.md`.

## Dashboard Demo

Run:

```bash
npx -y codex-oss-lens@latest serve --demo
```

Then open the printed local URL, normally `http://127.0.0.1:5057`.

Expected reviewer signals:

- The KPI row shows sessions, workspaces, turns, and observed tokens.
- The Application Evidence panel links to public reviewer materials.
- The Submission Gates panel shows privacy, retention, evidence, reviewer, publish, link, README,
  and distribution gates.
- Export buttons operate on the local demo report only.

## Source-Side Verification

Maintainers can reproduce the source checks with:

```bash
npm run publish:samples
npm run dashboard:readiness
npm run demo:walkthrough
```

`npm run demo:walkthrough` verifies this page, README, reviewer quickstart, final checklist,
application status, dashboard evidence, and CI workflow references stay aligned.

## Privacy Boundary

The demo path is intentionally separate from private scans. It should never require a reviewer to
upload local Codex logs, paste prompts, reveal source code, or expose workspace paths. Private scans
use the same CLI and dashboard, but public evidence should be generated only after running
`npm run public:redaction`, `npm run data:retention`, and `npm run submission:check`.
