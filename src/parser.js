import { promises as fs } from "node:fs";
import path from "node:path";
import os from "node:os";
import crypto from "node:crypto";

const TOKEN_KEYS = new Set([
  "input_tokens",
  "cached_input_tokens",
  "output_tokens",
  "reasoning_output_tokens",
  "total_tokens",
]);

export function defaultCodexHome() {
  return process.env.CODEX_HOME || path.join(os.homedir(), ".codex");
}

export async function scanCodexHome(options = {}) {
  const codexHome = options.codexHome || defaultCodexHome();
  const limit = Number.isFinite(options.limit) ? options.limit : 250;
  const redaction = normalizeRedaction(options);
  const files = await findRolloutFiles(path.join(codexHome, "sessions"), limit);
  const sessions = [];

  for (const file of files) {
    const session = await summarizeRollout(file, codexHome, { redaction });
    if (session) sessions.push(session);
  }

  sessions.sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt));
  return buildReport(sessions);
}

export async function findRolloutFiles(root, limit = 250) {
  const files = [];

  async function walk(dir) {
    let entries;
    try {
      entries = await fs.readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (entry.isFile() && /^rollout-.*\.jsonl$/.test(entry.name)) {
        const stat = await fs.stat(fullPath);
        files.push({ path: fullPath, mtimeMs: stat.mtimeMs });
      }
    }
  }

  await walk(root);
  return files
    .sort((a, b) => b.mtimeMs - a.mtimeMs)
    .slice(0, limit)
    .map((item) => item.path);
}

export async function summarizeRollout(file, codexHome = defaultCodexHome(), options = {}) {
  const redaction = normalizeRedaction(options);
  let raw;
  try {
    raw = await fs.readFile(file, "utf8");
  } catch {
    return null;
  }

  const session = {
    id: path.basename(file, ".jsonl").replace(/^rollout-/, ""),
    file: path.relative(codexHome, file),
    cwd: null,
    startedAt: null,
    endedAt: null,
    models: new Set(),
    eventCounts: {},
    turns: 0,
    toolCalls: 0,
    tokens: emptyTokens(),
    latestRateLimits: null,
    planType: null,
  };

  for (const line of raw.split(/\r?\n/)) {
    if (!line.trim()) continue;

    let item;
    try {
      item = JSON.parse(line);
    } catch {
      continue;
    }

    const timestamp = item.timestamp || item.payload?.timestamp;
    if (timestamp) {
      session.startedAt = minDate(session.startedAt, timestamp);
      session.endedAt = maxDate(session.endedAt, timestamp);
    }

    const type = item.payload?.type || item.type || "unknown";
    session.eventCounts[type] = (session.eventCounts[type] || 0) + 1;
    if (type === "turn_context") session.turns += 1;
    if (type.includes("tool") || item.payload?.tool_call_id) session.toolCalls += 1;

    const payload = item.payload || {};
    if (payload.id && item.type === "session_meta") session.id = payload.id;
    if (payload.cwd) session.cwd = payload.cwd;
    if (payload.model) session.models.add(payload.model);
    if (payload.collaboration_mode?.settings?.model) {
      session.models.add(payload.collaboration_mode.settings.model);
    }

    if (payload.type === "token_count") {
      mergeTokens(session.tokens, extractTokens(payload.info || payload));
      if (payload.rate_limits) {
        session.latestRateLimits = normalizeRateLimits(payload.rate_limits);
        session.planType = payload.rate_limits.plan_type || session.planType;
      }
    } else if (payload.usage) {
      mergeTokens(session.tokens, extractTokens(payload.usage));
    }
  }

  if (!session.startedAt) return null;

  return {
    ...session,
    cwd: redactPath(session.cwd, redaction),
    workspace: workspaceName(session.cwd),
    models: [...session.models],
    durationMinutes: diffMinutes(session.startedAt, session.endedAt),
  };
}

export function buildReport(sessions) {
  const totals = {
    sessions: sessions.length,
    workspaces: new Set(),
    models: new Set(),
    tokens: emptyTokens(),
    toolCalls: 0,
    turns: 0,
    latestRateLimits: null,
    planType: null,
  };

  const byDay = {};
  const byWorkspace = {};
  const byModel = {};

  for (const session of sessions) {
    totals.workspaces.add(session.workspace);
    totals.toolCalls += session.toolCalls;
    totals.turns += session.turns;
    mergeTokens(totals.tokens, session.tokens);
    if (session.latestRateLimits && !totals.latestRateLimits) {
      totals.latestRateLimits = session.latestRateLimits;
      totals.planType = session.planType;
    }

    const day = session.startedAt.slice(0, 10);
    byDay[day] = byDay[day] || { sessions: 0, tokens: emptyTokens() };
    byDay[day].sessions += 1;
    mergeTokens(byDay[day].tokens, session.tokens);

    byWorkspace[session.workspace] = byWorkspace[session.workspace] || {
      sessions: 0,
      turns: 0,
      toolCalls: 0,
      tokens: emptyTokens(),
    };
    byWorkspace[session.workspace].sessions += 1;
    byWorkspace[session.workspace].turns += session.turns;
    byWorkspace[session.workspace].toolCalls += session.toolCalls;
    mergeTokens(byWorkspace[session.workspace].tokens, session.tokens);

    for (const model of session.models) {
      totals.models.add(model);
      byModel[model] = byModel[model] || { sessions: 0, tokens: emptyTokens() };
      byModel[model].sessions += 1;
      mergeTokens(byModel[model].tokens, session.tokens);
    }
  }

  return {
    generatedAt: new Date().toISOString(),
    totals: {
      ...totals,
      workspaces: totals.workspaces.size,
      models: [...totals.models],
    },
    byDay,
    byWorkspace,
    byModel,
    sessions,
  };
}

export function demoReport() {
  return buildReport([
    demoSession("demo-a", "2026-06-01T09:15:00.000Z", "codex", "gpt-5.5", 18, 7, 124000, 6, 4),
    demoSession("demo-b", "2026-06-01T12:45:00.000Z", "api-gateway", "gpt-5.3-codex", 9, 2, 68000, 6, 4),
    demoSession("demo-c", "2026-05-31T18:20:00.000Z", "design-system", "gpt-5.5", 13, 4, 92000, 5, 3),
    demoSession("demo-d", "2026-05-30T08:05:00.000Z", "codex", "gpt-5.4", 6, 1, 37000, 4, 2),
  ]);
}

function demoSession(id, startedAt, workspace, model, turns, toolCalls, totalTokens, primary, secondary) {
  return {
    id,
    file: `sessions/demo/${id}.jsonl`,
    cwd: `/work/${workspace}`,
    workspace,
    startedAt,
    endedAt: new Date(new Date(startedAt).getTime() + turns * 6 * 60_000).toISOString(),
    models: [model],
    eventCounts: { turn_context: turns, token_count: turns },
    turns,
    toolCalls,
    tokens: {
      input: Math.round(totalTokens * 0.58),
      cachedInput: Math.round(totalTokens * 0.21),
      output: Math.round(totalTokens * 0.17),
      reasoningOutput: Math.round(totalTokens * 0.04),
      total: totalTokens,
    },
    latestRateLimits: {
      primary: { usedPercent: primary, windowMinutes: 300, resetsAt: null },
      secondary: { usedPercent: secondary, windowMinutes: 10080, resetsAt: null },
    },
    planType: "pro",
    durationMinutes: turns * 6,
  };
}

function extractTokens(source) {
  const tokens = emptyTokens();
  collectTokenNumbers(source, tokens);
  if (!tokens.total) {
    tokens.total = tokens.input + tokens.cachedInput + tokens.output + tokens.reasoningOutput;
  }
  return tokens;
}

function collectTokenNumbers(value, tokens) {
  if (!value || typeof value !== "object") return;
  for (const [key, child] of Object.entries(value)) {
    if (typeof child === "number" && TOKEN_KEYS.has(key)) {
      if (key === "input_tokens") tokens.input += child;
      if (key === "cached_input_tokens") tokens.cachedInput += child;
      if (key === "output_tokens") tokens.output += child;
      if (key === "reasoning_output_tokens") tokens.reasoningOutput += child;
      if (key === "total_tokens") tokens.total += child;
    } else if (child && typeof child === "object") {
      collectTokenNumbers(child, tokens);
    }
  }
}

function normalizeRateLimits(rateLimits) {
  return {
    primary: normalizeWindow(rateLimits.primary),
    secondary: normalizeWindow(rateLimits.secondary),
    credits: rateLimits.credits || null,
    reachedType: rateLimits.rate_limit_reached_type || null,
  };
}

function normalizeWindow(window) {
  if (!window) return null;
  return {
    usedPercent: Number(window.used_percent || 0),
    windowMinutes: Number(window.window_minutes || 0),
    resetsAt: window.resets_at || null,
  };
}

function emptyTokens() {
  return { input: 0, cachedInput: 0, output: 0, reasoningOutput: 0, total: 0 };
}

function mergeTokens(target, source) {
  target.input += source.input || 0;
  target.cachedInput += source.cachedInput || 0;
  target.output += source.output || 0;
  target.reasoningOutput += source.reasoningOutput || 0;
  target.total += source.total || 0;
}

function minDate(current, next) {
  if (!current) return next;
  return new Date(next) < new Date(current) ? next : current;
}

function maxDate(current, next) {
  if (!current) return next;
  return new Date(next) > new Date(current) ? next : current;
}

function diffMinutes(startedAt, endedAt) {
  if (!startedAt || !endedAt) return 0;
  return Math.max(0, Math.round((new Date(endedAt) - new Date(startedAt)) / 60_000));
}

function workspaceName(cwd) {
  if (!cwd) return "(unknown)";
  return path.basename(cwd) || cwd;
}

function normalizeRedaction(options) {
  if (options.redactPaths === false) return "none";
  if (options.redaction) return options.redaction;
  return "basename";
}

function redactPath(cwd, redaction) {
  if (!cwd) return "(unknown workspace)";
  if (redaction === "none") return cwd;
  if (redaction === "hash") {
    const hash = crypto.createHash("sha256").update(cwd).digest("hex").slice(0, 10);
    return `[workspace:${hash}]`;
  }
  return path.join("[redacted]", workspaceName(cwd));
}
