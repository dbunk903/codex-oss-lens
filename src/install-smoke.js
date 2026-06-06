import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export async function runPublishedInstallSmoke(options = {}) {
  const packageName = options.packageName || "codex-oss-lens";
  const version = options.version || "latest";
  const bin = options.bin || "codex-oss-lens";
  const command = ["exec", "--yes", "--package", `${packageName}@${version}`, "--", bin, "demo"];
  const startedAt = new Date().toISOString();
  const registry = await npmViewPackageVersion(packageName, version);
  if (!registry.version) {
    return buildInstallSmokeResult({
      packageName,
      version,
      bin,
      command,
      startedAt,
      ok: false,
      stdout: "",
      stderr: registry.error,
      parsed: null,
      registryVersion: null,
    });
  }

  try {
    const { stdout, stderr } = await execFileAsync("npm", command, { maxBuffer: 1024 * 1024 * 5 });
    const parsed = safeJson(stdout);
    return buildInstallSmokeResult({
      packageName,
      version,
      bin,
      command,
      startedAt,
      ok: true,
      stdout,
      stderr,
      parsed,
      registryVersion: registry.version,
    });
  } catch (error) {
    return buildInstallSmokeResult({
      packageName,
      version,
      bin,
      command,
      startedAt,
      ok: false,
      stdout: error.stdout || "",
      stderr: error.stderr || error.message,
      parsed: null,
      registryVersion: registry.version,
    });
  }
}

export function buildInstallSmokeResult({ packageName, version, bin, command, startedAt, ok, stdout, stderr, parsed, registryVersion = version }) {
  const report = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    startedAt,
    status: ok && parsed ? "pass" : "fail",
    package: { name: packageName, version, bin, resolvedVersion: registryVersion },
    command: ["npm", ...command].join(" "),
    checks: [
      { id: "registryVersion", ok: Boolean(registryVersion), message: registryVersion ? `published=${registryVersion}` : "Package version was not found in the npm registry." },
      { id: "commandExit", ok: Boolean(ok), message: ok ? "npm exec completed." : "npm exec failed." },
      { id: "jsonOutput", ok: Boolean(parsed), message: parsed ? "CLI emitted JSON." : "CLI output was not parseable JSON." },
      { id: "demoSessions", ok: (parsed?.totals?.sessions || 0) > 0, message: `sessions=${parsed?.totals?.sessions ?? "unknown"}` },
    ],
    stdoutPreview: preview(stdout),
    stderrPreview: preview(stderr),
  };
  return { ...report, markdown: renderInstallSmokeMarkdown(report) };
}

async function npmViewPackageVersion(packageName, version) {
  const spec = version === "latest" ? packageName : `${packageName}@${version}`;
  try {
    const { stdout } = await execFileAsync("npm", ["view", spec, "version"], { maxBuffer: 1024 * 1024 });
    return { version: stdout.trim() || null, error: null };
  } catch (error) {
    const output = `${error.stderr || ""}${error.stdout || ""}`.trim();
    return { version: null, error: output || error.message };
  }
}

function safeJson(stdout) {
  try {
    return JSON.parse(stdout);
  } catch {
    return null;
  }
}

function preview(value) {
  return String(value || "")
    .replace(/\/Users\/[^/\s]+/g, "[home]")
    .replace(/\/var\/folders\/[^\s]+/g, "[tmp]")
    .slice(0, 500);
}

function renderInstallSmokeMarkdown(report) {
  return [
    "# Codex OSS Lens Published Install Smoke",
    "",
    `Generated: ${report.generatedAt}`,
    `Status: ${report.status}`,
    `Command: \`${report.command}\``,
    "",
    "## Checks",
    "",
    ...report.checks.map((item) => `- ${item.id}: ${item.ok ? "pass" : "fail"} - ${item.message}`),
    "",
  ].join("\n");
}
