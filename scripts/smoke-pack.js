import { execFile } from "node:child_process";
import { access, mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const root = path.dirname(path.dirname(new URL(import.meta.url).pathname));
const temp = await mkdtemp(path.join(os.tmpdir(), "codex-oss-lens-pack-"));
const PUBLIC_LEAK_PATTERNS = [
  { id: "unix-full-path", pattern: /\/Users\/|\/work\/|\/home\// },
  { id: "windows-full-path", pattern: /[A-Za-z]:\\/ },
  { id: "rollout-filename", pattern: /rollout-\d{4}-\d{2}-\d{2}T/ },
  { id: "raw-log-marker", pattern: /"type"\s*:\s*"session_meta"|"payload"\s*:\s*\{/ },
  { id: "likely-secret", pattern: /sk-[A-Za-z0-9_-]{20,}|gh[opsu]_[A-Za-z0-9_]{20,}/ },
];

try {
  const { stdout } = await execFileAsync("npm", ["pack", "--json"], { cwd: root });
  const [{ filename }] = JSON.parse(stdout);
  const tarball = path.join(root, filename);
  await execFileAsync("npm", ["install", tarball], { cwd: temp });

  const bin = path.join(temp, "node_modules", ".bin", process.platform === "win32" ? "codex-oss-lens.cmd" : "codex-oss-lens");
  const outputPath = path.join(temp, "demo-report.json");
  await execFileAsync(bin, ["demo", "--out", outputPath], { cwd: temp });
  const briefDir = path.join(temp, "brief");
  await execFileAsync(bin, ["brief", "--demo", "--out-dir", briefDir], { cwd: temp });

  const report = JSON.parse(await readFile(outputPath, "utf8"));
  if (report.totals?.sessions !== 4) {
    throw new Error(`Unexpected demo session count: ${report.totals?.sessions}`);
  }
  assertShareSafe("packaged demo report", report);
  const manifest = JSON.parse(await readFile(path.join(briefDir, "manifest.json"), "utf8"));
  if (manifest.summary?.sessions !== 4) {
    throw new Error(`Unexpected brief session count: ${manifest.summary?.sessions}`);
  }
  assertShareSafe("packaged brief manifest", manifest);
  const packageRoot = path.join(temp, "node_modules", "codex-oss-lens");
  await Promise.all([
    access(path.join(packageRoot, "application", "final-copy.md")),
    access(path.join(packageRoot, "application", "form-answers.md")),
    access(path.join(packageRoot, "ROADMAP.md")),
    access(path.join(packageRoot, "SECURITY.md")),
  ]);

  await rm(tarball, { force: true });
  console.log(`Packed CLI smoke test passed in ${temp}`);
} finally {
  await rm(temp, { recursive: true, force: true });
}

function assertShareSafe(label, value) {
  const serialized = JSON.stringify(value);
  for (const rule of PUBLIC_LEAK_PATTERNS) {
    if (rule.pattern.test(serialized)) {
      throw new Error(`${label} failed ${rule.id} privacy check.`);
    }
  }
}
