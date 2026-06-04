export function buildActivityTimeline(report) {
  const sessions = (report.sessions || [])
    .map((session) => ({
      id: session.id || "[unknown]",
      startedAt: session.startedAt || null,
      endedAt: session.endedAt || null,
      day: dayOf(session.startedAt),
      workspace: session.workspace || "[unknown]",
      workflow: session.workflow || "unknown",
      models: session.models || [],
      turns: session.turns || 0,
      toolCalls: session.toolCalls || 0,
      durationMinutes: session.durationMinutes || 0,
      observedTokens: session.tokens?.total || 0,
      git: safeGit(session.git),
    }))
    .sort((a, b) => String(a.startedAt || "").localeCompare(String(b.startedAt || "")));
  const days = buildDays(sessions);
  const timeline = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    summary: {
      sessions: sessions.length,
      days: days.length,
      workspaces: new Set(sessions.map((session) => session.workspace)).size,
      workflows: countValues(sessions.map((session) => session.workflow)),
      observedTokens: sessions.reduce((sum, session) => sum + session.observedTokens, 0),
    },
    days,
    highlights: buildHighlights(sessions, days),
  };
  return { ...timeline, markdown: renderTimelineMarkdown(timeline) };
}

function buildDays(sessions) {
  const byDay = new Map();
  for (const session of sessions) {
    const day = session.day || "unknown";
    const row = byDay.get(day) || {
      day,
      sessions: 0,
      workspaces: {},
      workflows: {},
      turns: 0,
      toolCalls: 0,
      observedTokens: 0,
      entries: [],
    };
    row.sessions += 1;
    row.turns += session.turns;
    row.toolCalls += session.toolCalls;
    row.observedTokens += session.observedTokens;
    row.workspaces[session.workspace] = (row.workspaces[session.workspace] || 0) + 1;
    row.workflows[session.workflow] = (row.workflows[session.workflow] || 0) + 1;
    row.entries.push(session);
    byDay.set(day, row);
  }
  return [...byDay.values()].sort((a, b) => a.day.localeCompare(b.day));
}

function buildHighlights(sessions, days) {
  const longestSession = [...sessions].sort((a, b) => b.durationMinutes - a.durationMinutes)[0] || null;
  const heaviestTokenSession = [...sessions].sort((a, b) => b.observedTokens - a.observedTokens)[0] || null;
  const busiestDay = [...days].sort((a, b) => b.sessions - a.sessions || b.observedTokens - a.observedTokens)[0] || null;
  return {
    busiestDay: busiestDay ? summarizeDay(busiestDay) : null,
    longestSession: longestSession ? summarizeSession(longestSession) : null,
    heaviestTokenSession: heaviestTokenSession ? summarizeSession(heaviestTokenSession) : null,
  };
}

function renderTimelineMarkdown(timeline) {
  return [
    "# Codex OSS Lens Activity Timeline",
    "",
    `Generated: ${timeline.generatedAt}`,
    "",
    "## Summary",
    "",
    `- Sessions: ${timeline.summary.sessions}`,
    `- Days: ${timeline.summary.days}`,
    `- Workspaces: ${timeline.summary.workspaces}`,
    `- Observed tokens: ${timeline.summary.observedTokens}`,
    "",
    "## Daily Activity",
    "",
    ...timeline.days.flatMap((day) => [
      `### ${day.day}`,
      "",
      `- Sessions: ${day.sessions}`,
      `- Turns: ${day.turns}`,
      `- Tool calls: ${day.toolCalls}`,
      `- Observed tokens: ${day.observedTokens}`,
      ...day.entries.map((entry) => {
        return `- ${timeOf(entry.startedAt)} ${entry.workspace} / ${entry.workflow}: ${entry.turns} turns, ${entry.toolCalls} tools, ${entry.observedTokens} tokens`;
      }),
      "",
    ]),
  ].join("\n");
}

function summarizeDay(day) {
  return {
    day: day.day,
    sessions: day.sessions,
    observedTokens: day.observedTokens,
    topWorkflow: topKey(day.workflows),
  };
}

function summarizeSession(session) {
  return {
    id: session.id,
    day: session.day,
    workspace: session.workspace,
    workflow: session.workflow,
    durationMinutes: session.durationMinutes,
    observedTokens: session.observedTokens,
  };
}

function countValues(values) {
  return Object.fromEntries(values.reduce((map, value) => {
    map.set(value, (map.get(value) || 0) + 1);
    return map;
  }, new Map()));
}

function topKey(source) {
  return Object.entries(source || {}).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
}

function dayOf(value) {
  return value ? String(value).slice(0, 10) : null;
}

function timeOf(value) {
  return value ? String(value).slice(11, 16) : "unknown";
}

function safeGit(git) {
  if (!git) return null;
  return {
    branch: git.branch || null,
    commit: git.commit || null,
    repository: git.repository || null,
  };
}
