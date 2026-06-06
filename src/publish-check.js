import { execFile } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export async function runPublishCheck(options = {}) {
  const packagePath = path.resolve(options.packageJson || "package.json");
  const packageJson = JSON.parse(await fs.readFile(packagePath, "utf8"));
  const npmUser = await npmWhoami();
  const registry = await npmView(packageJson.name);
  const report = buildPublishReadiness({
    packageJson,
    npmUser,
    registryVersion: registry.version,
    registryError: registry.error,
    binExists: await binExists(packageJson, path.dirname(packagePath)),
  });
  return { ...report, markdown: renderPublishMarkdown(report) };
}

export function buildPublishReadiness({ packageJson, npmUser, registryVersion, registryError, binExists }) {
  const versionAvailable = registryError === "not published" || (Boolean(registryVersion) && registryVersion !== packageJson.version);
  const checks = [
    check("name", Boolean(packageJson.name), `name=${packageJson.name || "missing"}`),
    check("version", Boolean(packageJson.version), `version=${packageJson.version || "missing"}`),
    check("license", Boolean(packageJson.license), `license=${packageJson.license || "missing"}`),
    check("repository", Boolean(packageJson.repository?.url), `repository=${packageJson.repository?.url || "missing"}`),
    check("bin", Boolean(packageJson.bin && Object.keys(packageJson.bin).length && binExists), "CLI bin path exists."),
    check("npmLogin", Boolean(npmUser), npmUser ? `npm user=${npmUser}` : "npm login required."),
    check("versionAvailable", versionAvailable, registryVersion ? `latest=${registryVersion}` : registryError || "not published"),
  ];
  const blockers = checks.filter((item) => !item.ok).map((item) => `${item.id}: ${item.message}`);
  const status = blockers.length ? "blocked" : "ready";
  return {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    status,
    package: {
      name: packageJson.name,
      version: packageJson.version,
      latestPublishedVersion: registryVersion || null,
      npmUser: npmUser || null,
    },
    checks,
    blockers,
    publishCommands: [
      "npm test",
      "npm run pack:check",
      "npm run pack:smoke",
      "npm publish --access public --otp <6-digit-code>",
      `npx -y ${packageJson.name}@${packageJson.version} demo`,
    ],
    warnings: [
      "If npm 2FA is enabled for writes, publish requires --otp <6-digit-code> or a granular automation token with 2FA bypass.",
    ],
  };
}

async function npmWhoami() {
  try {
    const { stdout } = await execFileAsync("npm", ["whoami"], { maxBuffer: 1024 * 1024 });
    return stdout.trim() || null;
  } catch {
    return null;
  }
}

async function npmView(name) {
  try {
    const { stdout } = await execFileAsync("npm", ["view", name, "version"], { maxBuffer: 1024 * 1024 });
    return { version: stdout.trim() || null, error: null };
  } catch (error) {
    const output = `${error.stderr || ""}${error.stdout || ""}`;
    if (output.includes("E404")) return { version: null, error: "not published" };
    return { version: null, error: "registry lookup failed" };
  }
}

async function binExists(packageJson, root) {
  const bins = Object.values(packageJson.bin || {});
  if (!bins.length) return false;
  const results = await Promise.all(bins.map(async (binPath) => {
    try {
      await fs.access(path.resolve(root, binPath));
      return true;
    } catch {
      return false;
    }
  }));
  return results.every(Boolean);
}

function check(id, ok, message) {
  return { id, ok: Boolean(ok), message };
}

function renderPublishMarkdown(report) {
  return [
    "# Codex OSS Lens Publish Check",
    "",
    `Generated: ${report.generatedAt}`,
    `Status: ${report.status}`,
    `Package: ${report.package.name}@${report.package.version}`,
    `npm user: ${report.package.npmUser || "not logged in"}`,
    "",
    "## Checks",
    "",
    ...report.checks.map((item) => `- ${item.id}: ${item.ok ? "pass" : "fail"} - ${item.message}`),
    "",
    "## Publish Commands",
    "",
    ...report.publishCommands.map((command) => `- \`${command}\``),
    "",
    "## Warnings",
    "",
    ...report.warnings.map((warning) => `- ${warning}`),
    "",
  ].join("\n");
}
