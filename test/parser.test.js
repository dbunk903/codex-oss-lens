import test from "node:test";
import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { scanCodexHome, summarizeRollout } from "../src/parser.js";

test("summarizes Codex rollout files", async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "codex-oss-lens-"));
  const sessionsDir = path.join(dir, "sessions", "2026", "06", "01");
  await fs.mkdir(sessionsDir, { recursive: true });
  const file = path.join(sessionsDir, "rollout-2026-06-01T10-00-00-demo.jsonl");

  await fs.writeFile(
    file,
    [
      JSON.stringify({
        timestamp: "2026-06-01T10:00:00.000Z",
        type: "session_meta",
        payload: { id: "session-1", cwd: "/repo/codex", model: "gpt-5.5" },
      }),
      JSON.stringify({
        timestamp: "2026-06-01T10:02:00.000Z",
        type: "event_msg",
        payload: { type: "turn_context", cwd: "/repo/codex", model: "gpt-5.5" },
      }),
      JSON.stringify({
        timestamp: "2026-06-01T10:03:00.000Z",
        type: "event_msg",
        payload: {
          type: "token_count",
          info: {
            input_tokens: 100,
            cached_input_tokens: 20,
            output_tokens: 30,
            reasoning_output_tokens: 10,
            total_tokens: 160,
          },
          rate_limits: {
            primary: { used_percent: 8, window_minutes: 300, resets_at: 1780333655 },
            secondary: { used_percent: 3, window_minutes: 10080, resets_at: 1780859581 },
            plan_type: "pro",
          },
        },
      }),
    ].join("\n"),
    "utf8",
  );

  const session = await summarizeRollout(file, dir);
  assert.equal(session.id, "session-1");
  assert.equal(session.cwd, "[redacted]/codex");
  assert.equal(session.workspace, "codex");
  assert.deepEqual(session.models, ["gpt-5.5"]);
  assert.equal(session.turns, 1);
  assert.equal(session.tokens.total, 160);
  assert.equal(session.latestRateLimits.primary.usedPercent, 8);
  assert.equal(session.workflow, "triage");

  const report = await scanCodexHome({ codexHome: dir });
  assert.equal(report.totals.sessions, 1);
  assert.equal(report.totals.workspaces, 1);
  assert.equal(report.byWorkspace.codex.tokens.total, 160);
  assert.equal(report.byWorkflow.triage.sessions, 1);
});

test("can keep full paths for private reports", async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "codex-oss-lens-paths-"));
  const sessionsDir = path.join(dir, "sessions", "2026", "06", "01");
  await fs.mkdir(sessionsDir, { recursive: true });
  const file = path.join(sessionsDir, "rollout-2026-06-01T11-00-00-demo.jsonl");
  await fs.writeFile(
    file,
    JSON.stringify({
      timestamp: "2026-06-01T11:00:00.000Z",
      type: "session_meta",
      payload: { cwd: "/private/repo/tooling", model: "gpt-5.5" },
    }),
    "utf8",
  );

  const report = await scanCodexHome({ codexHome: dir, redactPaths: false });
  assert.equal(report.sessions[0].cwd, "/private/repo/tooling");
});

test("can hash workspace paths for shareable reports", async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "codex-oss-lens-hash-"));
  const sessionsDir = path.join(dir, "sessions", "2026", "06", "01");
  await fs.mkdir(sessionsDir, { recursive: true });
  const file = path.join(sessionsDir, "rollout-2026-06-01T12-00-00-demo.jsonl");
  await fs.writeFile(
    file,
    JSON.stringify({
      timestamp: "2026-06-01T12:00:00.000Z",
      type: "session_meta",
      payload: { cwd: "/private/repo/tooling", model: "gpt-5.5" },
    }),
    "utf8",
  );

  const report = await scanCodexHome({ codexHome: dir, redaction: "hash" });
  assert.match(report.sessions[0].cwd, /^\[workspace:[a-f0-9]{10}\]$/);
  assert.equal(report.sessions[0].workspace, "tooling");
});

test("uses Codex git metadata when present", async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "codex-oss-lens-git-payload-"));
  const sessionsDir = path.join(dir, "sessions", "2026", "06", "02");
  await fs.mkdir(sessionsDir, { recursive: true });
  const file = path.join(sessionsDir, "rollout-2026-06-02T09-00-00-review.jsonl");
  await fs.writeFile(
    file,
    JSON.stringify({
      timestamp: "2026-06-02T09:00:00.000Z",
      type: "session_meta",
      payload: {
        id: "review-session",
        cwd: "/private/repo/design-system",
        model: "gpt-5.5",
        git: {
          branch: "review/pr-12",
          commit_hash: "1234567890abcdef1234567890abcdef12345678",
          repository_url: "git@github.com:example/design-system.git",
        },
      },
    }),
    "utf8",
  );

  const session = await summarizeRollout(file, dir);
  assert.deepEqual(session.git, {
    branch: "review/pr-12",
    commit: "1234567890ab",
    repository: "design-system",
  });
  assert.equal(session.workflow, "review");
});

test("uses the latest token_count event instead of summing snapshots", async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "codex-oss-lens-token-snapshots-"));
  const sessionsDir = path.join(dir, "sessions", "2026", "06", "02");
  await fs.mkdir(sessionsDir, { recursive: true });
  const file = path.join(sessionsDir, "rollout-2026-06-02T09-30-00-demo.jsonl");
  await fs.writeFile(
    file,
    [
      JSON.stringify({
        timestamp: "2026-06-02T09:30:00.000Z",
        type: "session_meta",
        payload: { cwd: "/private/repo/codex", model: "gpt-5.5" },
      }),
      JSON.stringify({
        timestamp: "2026-06-02T09:31:00.000Z",
        type: "event_msg",
        payload: { type: "token_count", info: { total_tokens: 100 } },
      }),
      JSON.stringify({
        timestamp: "2026-06-02T09:32:00.000Z",
        type: "event_msg",
        payload: { type: "token_count", info: { total_tokens: 150 } },
      }),
    ].join("\n"),
    "utf8",
  );

  const session = await summarizeRollout(file, dir);
  assert.equal(session.tokens.total, 150);
});

test("falls back to local git metadata without reading source files", async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "codex-oss-lens-git-fallback-"));
  const workspace = path.join(dir, "workspace");
  const sessionsDir = path.join(dir, "sessions", "2026", "06", "02");
  const commit = "abcdef1234567890abcdef1234567890abcdef12";
  await fs.mkdir(path.join(workspace, ".git", "refs", "heads", "feature"), { recursive: true });
  await fs.mkdir(sessionsDir, { recursive: true });
  await fs.writeFile(path.join(workspace, ".git", "HEAD"), "ref: refs/heads/feature/session-link\n", "utf8");
  await fs.writeFile(path.join(workspace, ".git", "refs", "heads", "feature/session-link"), `${commit}\n`, "utf8");
  const file = path.join(sessionsDir, "rollout-2026-06-02T10-00-00-demo.jsonl");
  await fs.writeFile(
    file,
    JSON.stringify({
      timestamp: "2026-06-02T10:00:00.000Z",
      type: "session_meta",
      payload: { cwd: workspace, model: "gpt-5.5" },
    }),
    "utf8",
  );

  const session = await summarizeRollout(file, dir);
  assert.deepEqual(session.git, {
    branch: "feature/session-link",
    commit: commit.slice(0, 12),
    repository: null,
  });
});
