# Codex OSS Lens API Credit Plan

Generated: 2026-06-04T08:04:15.495Z

## Summary

- Sessions: 4
- Workspaces: 3
- Turns: 46
- Tool calls: 14
- Observed tokens: 321000

## Prioritized Candidates

- implementation: score 105, implementation-session-summary (2 sessions, 192000 tokens)
- review: score 50, review-risk-brief (1 sessions, 92000 tokens)
- triage: score 26, issue-triage-prioritization (1 sessions, 37000 tokens)

## Milestones

- M1: prototype implementation-session-summary for implementation using aggregate dry-run payloads.
- M2: prototype review-risk-brief for review using aggregate dry-run payloads.
- M3: prototype issue-triage-prioritization for triage using aggregate dry-run payloads.

## Guardrails

- Keep raw Codex rollout JSONL, prompts, source code, terminal output, and full paths local.
- Start with dry-run payload review before enabling any live API request.
- Store only aggregate summaries unless a maintainer explicitly opts into richer context.
