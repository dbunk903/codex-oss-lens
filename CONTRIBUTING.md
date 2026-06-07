# Contributing

Thanks for helping improve Codex OSS Lens. The project is intentionally small: dependency-free
Node.js, a local JSONL parser, and a static browser dashboard.

## Local setup

```bash
npm install
npm test
npm run serve
```

To use demo data:

```bash
node src/cli.js serve --demo
```

To scan local Codex sessions:

```bash
node src/cli.js scan --out report.json
node src/cli.js weekly --out weekly-report.md
```

To verify application-facing public evidence:

```bash
node src/cli.js public-evidence --markdown public-evidence.md
npm exec --yes --package codex-oss-lens@latest -- codex-oss-lens demo
```

## Privacy rules

- Do not commit raw Codex rollout logs.
- Do not paste private prompts, terminal output, repository content, or full filesystem paths into
  issues unless they are intentionally redacted.
- New exports must redact paths by default.
- New API-backed behavior must start with a dry-run payload and explicit opt-in.

## Pull request checklist

- Keep changes scoped and dependency-free unless a dependency is clearly justified.
- Add tests for parser/report behavior.
- Update README or docs when behavior changes.
- Run `npm test` before opening a PR.
- For application evidence changes, run `node src/cli.js public-evidence --markdown public-evidence.md`.

## Good first areas

- GitHub PR/issue import from public metadata.
- API summary dry-run payload.
- Better workflow heuristics with explainable labels.
- More report examples from real maintainer workflows.
