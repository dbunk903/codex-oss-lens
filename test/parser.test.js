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

  const report = await scanCodexHome({ codexHome: dir });
  assert.equal(report.totals.sessions, 1);
  assert.equal(report.totals.workspaces, 1);
  assert.equal(report.byWorkspace.codex.tokens.total, 160);
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
